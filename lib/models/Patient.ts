import { Schema, models, model } from "mongoose"

const PatientSchema = new Schema(
    {
        patientId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, enum: ["male", "female", "other"], required: true },
        mobile: { type: String, required: true },
        address: { type: String, default: "Not provided" },
        registrationDate: { type: String, required: true },
        userId: { type: String }, // link to User._id
    },
    { timestamps: true }
)

export const PatientModel = models.Patient || model("Patient", PatientSchema)
