const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        const insights = await prisma.insight.findMany({
            orderBy: { createdAt: 'desc' },
            include: { categoryRel: true }
        });
        console.log('Successfully fetched insights:', insights.length);
        if (insights.length > 0) {
            console.log('Sample insight:', JSON.stringify(insights[0], null, 2));
        } else {
            console.log('No insights found.');
        }
    } catch (error) {
        console.error('Error fetching insights:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
