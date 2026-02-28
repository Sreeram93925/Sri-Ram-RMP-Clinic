const mongoose = require('mongoose');

async function test() {
    // Correctly encoded URI
    const uri = "mongodb+srv://sreeram93925:Srir%40m93925@hospital.k1ximx7.mongodb.net/?appName=hospital";
    console.log("Testing connection with: " + uri);

    try {
        await mongoose.connect(uri, {
            dbName: "sri_ram_clinic",
            serverSelectionTimeoutMS: 10000
        });
        console.log("SUCCESS: Connected to MongoDB!");

        // Check if users exist
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections found:", collections.map(c => c.name));

        if (collections.some(c => c.name === 'users')) {
            const userCount = await mongoose.connection.db.collection('users').countDocuments();
            console.log("User count:", userCount);
        }
    } catch (err) {
        console.error("CONNECTION FAILED:", err.message);
    } finally {
        await mongoose.disconnect();
    }
}

test();
