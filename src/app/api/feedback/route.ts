import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userName, content, rating } = body;

        const { userId } = await auth();

        if (!content) {
            return NextResponse.json({ error: 'Message required' }, { status: 400 });
        }

        const feedback = await prisma.feedback.create({
            data: {
                userName: userName || 'Anonymous Tester',
                userId: userId || null,
                content: content,
                rating: rating ? parseInt(rating) : undefined,
                status: 'OPEN'
            }
        });

        return NextResponse.json({ success: true, feedback });
    } catch (error) {
        console.error('Feedback Error:', error);
        return NextResponse.json({ error: 'Failed to transmit' }, { status: 500 });
    }
}
