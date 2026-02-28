import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { PatientModel } from "@/lib/models/Patient"

const JWT_SECRET = process.env.JWT_SECRET!

function getUser(req: NextRequest) {
    try {
        const token = req.cookies.get("clinic_token")?.value
        if (!token) return null
        return jwt.verify(token, JWT_SECRET) as { id: string; role: string; name: string; email: string }
    } catch { return null }
}

export async function GET(req: NextRequest) {
    const user = getUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()

    if (user.role === "patient") {
        // Return only this patient's own profile
        const patient = await PatientModel.findOne({ userId: user.id }).lean()
        return NextResponse.json({ patients: patient ? [patient] : [] })
    }

    // Admin / Doctor / Receptionist see all patients
    const patients = await PatientModel.find({}).lean()
    return NextResponse.json({ patients })
}

export async function POST(req: NextRequest) {
    const user = getUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const canManage = ["admin", "doctor", "receptionist"].includes(user.role)
    if (!canManage) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    await connectDB()
    const body = await req.json()

    const count = await PatientModel.countDocuments()
    const num = count + 1

    const patient = await PatientModel.create({
        ...body,
        patientId: `PAT-${String(num).padStart(3, "0")}`,
        registrationDate: new Date().toISOString().split("T")[0],
    })

    return NextResponse.json({ patient }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
    const user = getUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id, ...data } = await req.json()
    await connectDB()
    const patient = await PatientModel.findByIdAndUpdate(id, data, { new: true }).lean()
    return NextResponse.json({ patient })
}
