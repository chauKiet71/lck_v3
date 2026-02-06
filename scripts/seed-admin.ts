import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'admin@lck.com';
  const password = 'admin'; // Default password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.admin.upsert({
    where: { email },
    update: {
      password: hashedPassword
    },
    create: {
      email,
      password: hashedPassword,
      name: 'LCK Admin',
    },
  });

  console.log(`Admin user seeded successfully.`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
