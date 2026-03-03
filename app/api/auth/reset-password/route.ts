import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { token, password } = await req.json()

        if (!token || !password) {
            return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
        }

        if (password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
        }

        // Find user with valid token
        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() },
        })

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Update user
        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()

        return NextResponse.json({ message: "Password has been reset successfully. You can now log in with your new password." })
    } catch (err) {
        console.error("Reset password error:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
