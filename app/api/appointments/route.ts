import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { AppointmentModel } from "@/lib/models/Appointment"
import { PatientModel } from "@/lib/models/Patient"

const JWT_SECRET = process.env.JWT_SECRET!

function getUser(req: NextRequest) {
    try {
        const token = req.cookies.get("clinic_token")?.value
        if (!token) return null
        return jwt.verify(token, JWT_SECRET) as { id: string; role: string }
    } catch { return null }
}

export async function GET(req: NextRequest) {
    const user = getUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    await connectDB()

    let filter: Record<string, string> = {}

    if (user.role === "doctor") {
        filter = { doctorId: user.id }
    } else if (user.role === "patient") {
        const patient = await PatientModel.findOne({ userId: user.id }).lean() as { _id: unknown } | null
        if (!patient) return NextResponse.json({ appointments: [] })
        filter = { patientId: patient._id.toString() }
    }

    const appointments = await AppointmentModel.find(filter).sort({ date: -1 }).lean()
    return NextResponse.json({ appointments })
}

export async function POST(req: NextRequest) {
    const user = getUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    await connectDB()

    const body = await req.json()
    let { patientId } = body

    // For patients, auto-find their patient profile
    if (user.role === "patient") {
        const patient = await PatientModel.findOne({ userId: user.id }).lean() as { _id: unknown } | null
        if (!patient) return NextResponse.json({ error: "Patient profile not found" }, { status: 400 })
        patientId = patient._id.toString()
    }

    const count = await AppointmentModel.countDocuments()
    const num = count + 1

    const appointment = await AppointmentModel.create({
        ...body,
        patientId,
        appointmentId: `APT-${String(num).padStart(3, "0")}`,
        status: "waiting",
    })

    return NextResponse.json({ appointment }, { status: 201 })
}
