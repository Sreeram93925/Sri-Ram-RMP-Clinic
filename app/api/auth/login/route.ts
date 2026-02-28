import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
        }

        const user = await UserModel.findOne({ email: email.toLowerCase() })
        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
        }

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
                specialization: user.specialization,
            },
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
        console.error("Login error:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
