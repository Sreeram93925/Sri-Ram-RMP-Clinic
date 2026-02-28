const mongoose = require('mongoose');

async function verify() {
    // Provided URI: mongodb+srv://sreeram93925:Srir@m93925@hospital.k1ximx7.mongodb.net/?appName=hospital
    // Attempting with the raw password first.
    const uri = "mongodb+srv://sreeram93925:Srir@m93925@hospital.k1ximx7.mongodb.net/?appName=hospital";
    console.log("Attempting connection with new URI...");

    try {
        await mongoose.connect(uri, {
            dbName: "sri_ram_clinic",
            serverSelectionTimeoutMS: 10000
        });
        console.log("SUCCESS: Connected to the new MongoDB cluster!");
    } catch (err) {
        console.error("FAILURE: Connection details:", err.message);
        if (err.message.includes("bad auth") || err.message.includes("URI malformed")) {
            console.log("HINT: The '@' in the password might need encoding.");
            // Try again with encoded password
            try {
                const encodedUri = "mongodb+srv://sreeram93925:Srir%40m93925@hospital.k1ximx7.mongodb.net/?appName=hospital";
                console.log("Attempting connection with ENCODED password...");
                await mongoose.connect(encodedUri, {
                    dbName: "sri_ram_clinic",
                    serverSelectionTimeoutMS: 10000
                });
                console.log("SUCCESS: Connected with ENCODED password!");
                console.log("FINAL_WORKING_URI=" + encodedUri);
            } catch (innerErr) {
                console.error("ENCODED FAILURE:", innerErr.message);
            }
        }
    } finally {
        await mongoose.disconnect();
    }
}

verify();
