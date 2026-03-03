import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"
import { sendPasswordResetEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        const user = await UserModel.findOne({ email: email.toLowerCase() })

        // For security reasons, don't reveal if the user exists or not
        if (!user) {
            return NextResponse.json({ message: "If an account with that email exists, we have sent a password reset link." })
        }

        // Generate reset token
        const resetPasswordToken = crypto.randomBytes(32).toString("hex")
        const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

        user.resetPasswordToken = resetPasswordToken
        user.resetPasswordExpires = resetPasswordExpires
        await user.save()

        // Send reset email
        try {
            await sendPasswordResetEmail(user.email, resetPasswordToken)
        } catch (emailErr) {
            console.error("Failed to send password reset email:", emailErr)
            return NextResponse.json({ error: "Failed to send reset email. Please try again later." }, { status: 500 })
        }

        return NextResponse.json({ message: "If an account with that email exists, we have sent a password reset link." })
    } catch (err) {
        console.error("Forgot password error:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
