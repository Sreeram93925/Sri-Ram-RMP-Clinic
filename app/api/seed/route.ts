import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"
import { PatientModel } from "@/lib/models/Patient"

const defaultStaff = [
    { name: "Dr. Sree Ram (Admin)", email: "admin@clinic.com", password: "admin123", role: "admin" },
    { name: "Dr. Sree Ram", email: "doctor@clinic.com", password: "doctor123", role: "doctor", specialization: "General Medicine" },
    { name: "Priya Sharma", email: "reception@clinic.com", password: "reception123", role: "receptionist", mobile: "9876543210" },
    { name: "Amit Patel", email: "patient@clinic.com", password: "patient123", role: "patient", mobile: "9123456780" },
]

const defaultPatient = {
    patientId: "PAT-001",
    name: "Amit Patel",
    age: 35,
    gender: "male" as const,
    mobile: "9123456780",
    address: "12 MG Road, Mumbai",
    registrationDate: "2025-12-01",
}

export async function POST() {
    try {
        await connectDB()

        const results: string[] = []

        for (const staff of defaultStaff) {
            const existing = await UserModel.findOne({ email: staff.email })
            if (existing) {
                results.push(`Skipped ${staff.email} - already exists`)
                continue
            }
            const hashed = await bcrypt.hash(staff.password, 12)
            const user = await UserModel.create({ ...staff, password: hashed })

            // Create patient profile for the demo patient
            if (staff.role === "patient") {
                const existingPatient = await PatientModel.findOne({ patientId: defaultPatient.patientId })
                if (!existingPatient) {
                    await PatientModel.create({ ...defaultPatient, userId: user._id.toString() })
                    results.push(`Created demo patient: ${staff.email}`)
                }
            }

            results.push(`Created ${staff.role}: ${staff.email}`)
        }

        return NextResponse.json({ success: true, results })
    } catch (err) {
        console.error("Seed error:", err)
        return NextResponse.json({ error: "Seed failed" }, { status: 500 })
    }
}
