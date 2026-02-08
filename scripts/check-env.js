
const fs = require('fs');
const path = require('path');

try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
        require('dotenv').config({ path: envPath });

        console.log("Checking Environment Variables:");
        console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL || 'MISSING');
        console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? 'SET (Length: ' + process.env.NEXTAUTH_SECRET.length + ')' : 'MISSING');
        console.log("DATABASE_URL:", process.env.DATABASE_URL ? 'SET' : 'MISSING');
        console.log("NODE_ENV:", process.env.NODE_ENV || 'MISSING');
    } else {
        console.log("❌ .env file not found at " + envPath);
    }
} catch (e) {
    console.error("Error checking env:", e);
}
