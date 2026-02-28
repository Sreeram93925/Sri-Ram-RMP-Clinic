const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = "mongodb+srv://sreeram93925:Srir%40m93925@hospital.k1ximx7.mongodb.net/?appName=hospital";

const defaultStaff = [
    { name: "Dr. Sree Ram (Admin)", email: "admin@clinic.com", password: "admin123", role: "admin" },
    { name: "Dr. Sree Ram", email: "doctor@clinic.com", password: "doctor123", role: "doctor", specialization: "General Medicine" },
    { name: "Priya Sharma", email: "reception@clinic.com", password: "reception123", role: "receptionist", mobile: "9876543210" },
    { name: "Amit Patel", email: "patient@clinic.com", password: "patient123", role: "patient", mobile: "9123456780" },
];

async function seed() {
    console.log("Connecting to MongoDB...");
    try {
        await mongoose.connect(MONGO_URI, {
            dbName: "sri_ram_clinic",
        });
        console.log("Connected!");

        const UserSchema = new mongoose.Schema({
            name: String,
            email: { type: String, unique: true, lowercase: true },
            password: String,
            role: String,
            mobile: String,
            specialization: String,
        }, { timestamps: true });

        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        for (const staff of defaultStaff) {
            const existing = await User.findOne({ email: staff.email.toLowerCase() });
            if (existing) {
                console.log(`User ${staff.email} already exists. Skipping.`);
                continue;
            }

            const hashed = await bcrypt.hash(staff.password, 12);
            await User.create({
                ...staff,
                password: hashed
            });
            console.log(`Created ${staff.role}: ${staff.email}`);
        }

        console.log("Seeding complete!");
    } catch (err) {
        console.error("Seed failed:", err.message);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
