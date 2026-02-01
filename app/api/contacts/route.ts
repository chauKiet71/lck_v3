import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fullName, phone, email, note } = body;

        const contact = await prisma.contact.create({
            data: {
                fullName,
                phone,
                email,
                note
            }
        });

        return NextResponse.json(contact);
    } catch (error) {
        console.error("Contact Create Error:", error);
        return NextResponse.json({ error: 'Failed to submit contact' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const contacts = await prisma.contact.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(contacts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
    }
}
