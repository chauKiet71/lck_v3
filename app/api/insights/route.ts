import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Define helper types to infer models from the Prisma Client instance
type InsightModel = NonNullable<Awaited<ReturnType<typeof prisma.insight.findFirst>>>;
type CategoryModel = NonNullable<Awaited<ReturnType<typeof prisma.category.findFirst>>>;

export async function GET() {
    try {
        const insights = await prisma.insight.findMany({
            orderBy: { createdAt: 'desc' },
            include: { categoryRel: true }
        });

        // Parse the 'localized' JSON string back to object
        const parsedInsights = insights.map((insight: InsightModel & { categoryRel: CategoryModel | null }) => {
            let parsedLoc = {};
            try {
                parsedLoc = JSON.parse(insight.localized);
            } catch (e) {
                // Fallback or empty if parse fails
            }
            return {
                ...insight,
                localized: parsedLoc
            };
        });

        return NextResponse.json(parsedInsights);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, title, category, description, content, imageUrl, localized, categoryId } = body;

        const insight = await prisma.insight.create({
            data: {
                id,
                title,
                category,
                description,
                content,
                imageUrl,
                localized: JSON.stringify(localized), // Store as JSON string
                categoryId: categoryId || null
            }
        });

        return NextResponse.json({
            ...insight,
            localized: JSON.parse(insight.localized)
        });
    } catch (error) {
        console.error("Create Error:", error);
        return NextResponse.json({ error: 'Failed to create insight' }, { status: 500 });
    }
}
