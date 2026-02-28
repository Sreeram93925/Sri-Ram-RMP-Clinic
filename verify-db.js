const mongoose = require('mongoose');

async function verify() {
    const uri = "mongodb+srv://sreeram93925:Srir@m93925@hospital.k1ximx7.mongodb.net/?appName=hospital";
    console.log("Attempting connection with provided URI...");

    try {
        await mongoose.connect(uri, {
            dbName: "sri_ram_clinic",
            serverSelectionTimeoutMS: 10000
        });
        console.log("SUCCESS: Connected to MongoDB!");
    } catch (err) {
        console.error("FAILURE: Connection details:", err.message);
        if (err.message.includes("bad auth")) {
            console.log("HINT: The username or password in the URI is incorrect.");
        }
    } finally {
        await mongoose.disconnect();
    }
}

verify();
