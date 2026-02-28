const mongoose = require('mongoose');
require('dotenv').config();

async function testMongoose() {
    const uri = process.env.MONGO_URI;
    console.log("Testing connection to:", uri ? "URI found" : "URI MISSING");

    try {
        console.log("Connecting via Mongoose...");
        await mongoose.connect(uri, { dbName: "sri_ram_clinic", serverSelectionTimeoutMS: 5000 });
        console.log("Mongoose connected successfully!");
        console.log("ReadyState:", mongoose.connection.readyState);
    } catch (err) {
        console.error("Mongoose connection failed:", err.message);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
}

testMongoose();
