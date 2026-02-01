import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { insights: true }
                }
            }
        });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, slug } = body;

        if (!name || !slug) {
            return NextResponse.json({ error: 'Name and Slug are required' }, { status: 400 });
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error("Create Category Error:", error);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
