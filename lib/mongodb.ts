import mongoose from "mongoose"

const MONGO_URI = process.env.MONGO_URI!

if (!MONGO_URI) {
    throw new Error("Please define MONGO_URI environment variable")
}

// Use global to preserve connection across hot-reloads in development
interface Cached {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: Cached
}

const cached: Cached = global.mongoose ?? { conn: null, promise: null }
global.mongoose = cached

export async function connectDB() {
    if (cached.conn) return cached.conn

    if (!cached.promise) {
        const opts = {
            dbName: "sri_ram_clinic",
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout
        }
        console.log("Starting MongoDB connection...")
        cached.promise = mongoose.connect(MONGO_URI, opts).then((m) => {
            console.log("MongoDB connected successfully to:", m.connection.host)
            return m
        }).catch((err: any) => {
            console.error("MongoDB connection error in promise:", err.message)
            cached.promise = null // Reset so we can try again
            throw err
        })
    }

    try {
        cached.conn = await cached.promise
    } catch (err: any) {
        console.error("Failed to await MongoDB connection:", err.message)
        throw err
    }
    return cached.conn
}
