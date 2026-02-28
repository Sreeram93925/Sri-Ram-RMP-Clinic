import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"

const JWT_SECRET = process.env.JWT_SECRET!

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("clinic_token")?.value
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        jwt.verify(token, JWT_SECRET)

        await connectDB()
        const doctors = await UserModel.find({ role: "doctor" }).select("-password").lean()

        return NextResponse.json({
            doctors: doctors.map((d) => ({
                id: d._id.toString(),
                name: d.name,
                email: d.email,
                role: d.role,
                specialization: d.specialization,
                mobile: d.mobile,
            })),
        })
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}
