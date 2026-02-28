import { Schema, models, model } from "mongoose"

const ConsultationSchema = new Schema(
    {
        appointmentId: { type: String, required: true },
        patientId: { type: String, required: true },
        doctorId: { type: String, required: true },
        symptoms: { type: String, required: true },
        diagnosis: { type: String, required: true },
        prescription: { type: String, required: true },
        followUpDate: { type: String },
        notes: { type: String },
    },
    { timestamps: true }
)

export const ConsultationModel = models.Consultation || model("Consultation", ConsultationSchema)
