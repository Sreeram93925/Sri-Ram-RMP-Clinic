import { Schema, models, model } from "mongoose"

const UploadedFileSchema = new Schema({
    name: String,
    size: Number,
    type: String,
    dataUrl: String,
}, { _id: false })

const AppointmentSchema = new Schema(
    {
        appointmentId: { type: String, required: true, unique: true },
        patientId: { type: String, required: true }, // Patient._id
        doctorId: { type: String, required: true },  // User._id
        date: { type: String, required: true },
        timeSlot: { type: String, required: true },
        status: {
            type: String,
            enum: ["waiting", "confirmed", "in-progress", "completed", "cancelled"],
            default: "waiting",
        },
        uploadedFiles: [UploadedFileSchema],
        optionalRecordData: { type: String },
    },
    { timestamps: true }
)

export const AppointmentModel = models.Appointment || model("Appointment", AppointmentSchema)
