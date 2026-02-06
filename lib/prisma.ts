import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    // Check for DATABASE_URL for easier debugging
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("❌ CRITICAL ERROR: DATABASE_URL is missing in environment variables.");
        if (process.env.NODE_ENV === 'production') {
            // throw new Error("DATABASE_URL must be defined");
        }
    }

    // Use standard Prisma Client without the adapter for better compatibility in this environment
    return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
