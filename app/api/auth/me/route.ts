import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"

const JWT_SECRET = process.env.JWT_SECRET!

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("clinic_token")?.value
        if (!token) {
            return NextResponse.json({ user: null }, { status: 200 })
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
        await connectDB()
        const user = await UserModel.findById(decoded.id).select("-password")

        if (!user) {
            return NextResponse.json({ user: null })
        }

        return NextResponse.json({
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                mobile: user.mobile,
                specialization: user.specialization,
            },
        })
    } catch {
        return NextResponse.json({ user: null })
    }
}
