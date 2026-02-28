import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { AppointmentModel } from "@/lib/models/Appointment"

const JWT_SECRET = process.env.JWT_SECRET!

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = req.cookies.get("clinic_token")?.value
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        jwt.verify(token, JWT_SECRET)
        await connectDB()

        const { id } = await params
        const { status } = await req.json()

        const appt = await AppointmentModel.findByIdAndUpdate(id, { status }, { new: true }).lean()

        if (!appt) return NextResponse.json({ error: "Appointment not found" }, { status: 404 })

        return NextResponse.json({ appointment: appt })
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}
