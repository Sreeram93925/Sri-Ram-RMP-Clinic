import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"
import { PatientModel } from "@/lib/models/Patient"

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { mobile } = await req.json()

        if (!mobile) {
            return NextResponse.json({ error: "Mobile number is required" }, { status: 400 })
        }

        // Search in Patients first (since mobile is more common there)
        const patient = await PatientModel.findOne({ mobile: mobile.trim() })

        if (patient) {
            const user = await UserModel.findById(patient.userId)
            if (user) {
                return NextResponse.json({ email: user.email, name: user.name })
            }
        }

        // If not found in Patients, check Users directly (e.g. for doctors/admins)
        const user = await UserModel.findOne({ mobile: mobile.trim() })
        if (user) {
            return NextResponse.json({ email: user.email, name: user.name })
        }

        return NextResponse.json({ error: "No account found with this mobile number" }, { status: 404 })
    } catch (err) {
        console.error("Retrieve account error:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
