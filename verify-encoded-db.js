const mongoose = require('mongoose');

async function verify() {
    const uri = "mongodb+srv://sreeram93925:Srir%40m93925@hospital.k1ximx7.mongodb.net/?appName=hospital";
    console.log("Attempting connection with ENCODED password...");

    try {
        await mongoose.connect(uri, {
            dbName: "sri_ram_clinic",
            serverSelectionTimeoutMS: 10000
        });
        console.log("SUCCESS: Connected to the new MongoDB cluster!");
    } catch (err) {
        console.error("FAILURE:", err.message);
    } finally {
        await mongoose.disconnect();
    }
}

verify();
