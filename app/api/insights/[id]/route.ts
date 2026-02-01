import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { title, category, description, content, imageUrl, localized } = body;

        const insight = await prisma.insight.update({
            where: { id: params.id },
            data: {
                title,
                category,
                description,
                content,
                imageUrl,
                localized: JSON.stringify(localized)
            }
        });

        return NextResponse.json({
            ...insight,
            localized: JSON.parse(insight.localized)
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update insight' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.insight.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ message: 'Insight deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete insight' }, { status: 500 });
    }
}
