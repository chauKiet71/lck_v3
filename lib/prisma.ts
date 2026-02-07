import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    // Ensure we handle the case where env might be undefined in build time slightly gracefully or just fail hard if needed
    // But typically usually defined.
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("❌ CRITICAL ERROR: DATABASE_URL is missing in environment variables.");
        if (process.env.NODE_ENV === 'production') {
            throw new Error("DATABASE_URL must be defined");
        }
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
