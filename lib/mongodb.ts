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
        cached.promise = mongoose.connect(MONGO_URI, { dbName: "sri_ram_clinic" }).then((m) => m)
    }

    cached.conn = await cached.promise
    return cached.conn
}
