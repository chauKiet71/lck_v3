const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// Handle .env loading if not automated
const fs = require('fs');
const path = require('path');
try {
    const envPath = path.resolve(__dirname, '../.env');
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
} catch (e) { console.error("Error loading .env:", e); }

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = 'admin@lechaukiet.com';
    const password = 'password123'; // Default password, change immediately!

    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        const admin = await prisma.admin.upsert({
            where: { email },
            update: {},
            create: {
                email,
                password: hashedPassword,
                name: 'Super Admin'
            }
        });
        console.log(`✅ Admin created: ${admin.email}`);
        console.log(`🔑 Password: ${password}`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
