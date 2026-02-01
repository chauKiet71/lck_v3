const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// 1. Manually load .env
try {
    const envPath = path.resolve(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        const envFile = fs.readFileSync(envPath, 'utf8');
        envFile.split('\n').forEach(line => {
            const firstEqual = line.indexOf('=');
            if (firstEqual > 0) {
                const key = line.substring(0, firstEqual).trim();
                let value = line.substring(firstEqual + 1).trim();
                if (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'")) {
                    value = value.slice(1, -1);
                }
                process.env[key] = value;
            }
        });
    }
} catch (e) {
    console.warn("Warning: Could not read .env file", e.message);
}

async function main() {
    console.log("--- DATABASE CONNECTION TEST (Adapter Mode) ---");

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("ERROR: DATABASE_URL is not set.");
        return;
    }

    // Masking password for display
    const maskedUrl = connectionString.replace(/(:\/\/)([^:]+):([^@]+)@/, '$1$2:****@');
    console.log(`Target: ${maskedUrl}`);

    try {
        // 2. Initialize Pool and Adapter
        const pool = new Pool({ connectionString });
        const adapter = new PrismaPg(pool);
        const prisma = new PrismaClient({ adapter });

        // 3. Test Connection
        const count = await prisma.insight.count();
        console.log(`\n✅ STATUS: CONNECTED`);
        console.log(`📊 Records Found: ${count}`);

        // 4. Show Data
        if (count > 0) {
            const insights = await prisma.insight.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' }
            });
            console.log("\n--- RECENT RECORDS ---");
            insights.forEach(insight => {
                console.log(`[${insight.id}] ${insight.title}`);
                console.log(`   Category: ${insight.category}`);
                console.log(`   Updated: ${insight.updatedAt}`);
                console.log("-----------------------");
            });
        } else {
            console.log("\nDatabase is currently empty.");
        }

        await prisma.$disconnect();
        await pool.end(); // Close pool

    } catch (e) {
        console.error("\n❌ CONNECTION FAILED");
        console.error(e);
    }
}

main();
