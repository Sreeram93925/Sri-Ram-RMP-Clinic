import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"
import { sendVerificationEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        const user = await UserModel.findOne({ email: email.toLowerCase() })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        if (user.isEmailVerified) {
            return NextResponse.json({ error: "Email is already verified" }, { status: 400 })
        }

        // Generate new token
        const verificationToken = crypto.randomBytes(32).toString("hex")
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

        user.verificationToken = verificationToken
        user.verificationTokenExpires = verificationTokenExpires
        await user.save()

        await sendVerificationEmail(user.email, verificationToken)

        return NextResponse.json({ message: "Verification email resent successfully" })
    } catch (err) {
        console.error("Resend error:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
