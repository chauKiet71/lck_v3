const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const envPath = path.resolve(__dirname, '.env');

if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        // Trim line to handle leading whitespace
        const trimmedLine = line.trim();
        // Skip comments and empty lines
        if (!trimmedLine || trimmedLine.startsWith('#')) return;

        const match = trimmedLine.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            process.env[key] = value;
        }
    });
}

const connectionString = process.env.DATABASE_URL;

async function main() {
    if (!connectionString) {
        console.error("DATABASE_URL is missing!");
        process.exit(1);
    }

    // Log masked connection string for debugging
    console.log(`Using DB URL: ${connectionString.replace(/:[^:@]+@/, ':***@')}`);

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        console.log('Fetching admin accounts...');
        const admins = await prisma.admin.findMany();
        console.log('Found admins:', admins.length);
        admins.forEach(admin => {
            console.log(`- Email: ${admin.email}, Name: ${admin.name || 'N/A'}`);
        });
    } catch (error) {
        console.error('Error fetching admins:', error);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
