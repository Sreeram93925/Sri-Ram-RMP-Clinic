import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"

export async function GET(req: NextRequest) {
    try {
        await connectDB()
        const { searchParams } = new URL(req.url)
        const token = searchParams.get("token")

        if (!token) {
            return NextResponse.json({ error: "Verification token is required" }, { status: 400 })
        }

        // Find user with this token and ensure it's not expired
        const user = await UserModel.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: new Date() },
        })

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 })
        }

        // Update user status
        user.isEmailVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpires = undefined
        await user.save()

        // Redirect to a frontend success page
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        return NextResponse.redirect(`${baseUrl}/auth/verify?status=success`)
    } catch (err) {
        console.error("Verification error:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
