const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// Load .env manually since dotenv is not installed
const envPath = path.resolve(__dirname, '.env');
// Also check for mismatch of env var name
// The .env has DATABASE_URL="..." (quoted)
// My regex handles this.

if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            // Remove surrounding quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            process.env[key] = value;
        }
    });
}

const connectionString = process.env.DATABASE_URL;

async function main() {
    console.log('Using connection string:', connectionString ? 'Defined' : 'Undefined');

    if (!connectionString) {
        console.error("DATABASE_URL is missing!");
        process.exit(1);
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        console.log('Connecting to database...');
        const insights = await prisma.insight.findMany({
            orderBy: { createdAt: 'desc' },
            include: { categoryRel: true }
        });
        console.log('Successfully fetched insights:', insights.length);
        if (insights.length > 0) {
            console.log('Sample insight:', JSON.stringify(insights[0], null, 2));
        }
    } catch (error) {
        console.error('Error fetching insights:', error);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
