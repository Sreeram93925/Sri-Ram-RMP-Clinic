import mongoose, { Schema, models, model } from "mongoose"

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true }, // hashed
        role: { type: String, enum: ["admin", "doctor", "receptionist", "patient"], required: true },
        mobile: { type: String },
        specialization: { type: String },
    },
    { timestamps: true }
)

export const UserModel = models.User || model("User", UserSchema)
