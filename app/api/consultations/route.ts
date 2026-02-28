import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { ConsultationModel } from "@/lib/models/Consultation"

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

    const { searchParams } = new URL(req.url)
    const patientId = searchParams.get("patientId")

    const filter = patientId ? { patientId } : {}
    const consultations = await ConsultationModel.find(filter).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ consultations })
}

export async function POST(req: NextRequest) {
    const user = getUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (user.role !== "doctor") return NextResponse.json({ error: "Only doctors can add consultations" }, { status: 403 })

    await connectDB()
    const body = await req.json()
    const consultation = await ConsultationModel.create({ ...body, doctorId: user.id })
    return NextResponse.json({ consultation }, { status: 201 })
}
