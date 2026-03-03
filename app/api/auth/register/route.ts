import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"
import { PatientModel } from "@/lib/models/Patient"
import { sendVerificationEmail } from "@/lib/email"
import crypto from "crypto"

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { name, email, password, mobile, age, gender, address } = await req.json()

        if (!name || !email || !password || !mobile || !age || !gender) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 })
        }

        // Check if user already exists
        const existing = await UserModel.findOne({ email: email.toLowerCase() })
        if (existing) {
            return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString("hex")
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

        // Create user
        const user = await UserModel.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "patient",
            mobile,
            verificationToken,
            verificationTokenExpires,
            isEmailVerified: false,
        })

        // Try to send verification email (non-blocking or at least error-handled)
        try {
            await sendVerificationEmail(user.email, verificationToken)
        } catch (emailErr) {
            console.error("Failed to send verification email:", emailErr)
            // We still created the user, they can request a resend later
        }

        // Count existing patients for sequential ID
        const patientCount = await PatientModel.countDocuments()
        const patientNum = patientCount + 1

        // Create linked patient profile
        await PatientModel.create({
            patientId: `PAT-${String(patientNum).padStart(3, "0")}`,
            name,
            age,
            gender,
            mobile,
            address: address || "Not provided",
            registrationDate: new Date().toISOString().split("T")[0],
            userId: user._id.toString(),
        })

        // Sign JWT
        const token = jwt.sign(
            { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
            JWT_SECRET,
            { expiresIn: "7d" }
        )

        const response = NextResponse.json({
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                mobile: user.mobile,
                isEmailVerified: false
            },
            message: "Registration successful. Please check your email to verify your account."
        })

        response.cookies.set("clinic_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        })

        return response
    } catch (err) {
        console.error("Register error:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
