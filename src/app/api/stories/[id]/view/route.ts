

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const story = await prisma.story.update({
            where: { id },
            data: {
                views: { increment: 1 },
            },
        });

        return NextResponse.json({ success: true, views: story.views });
    } catch (error) {
        console.error('View story error:', error);
        return NextResponse.json({ error: 'Failed to record view' }, { status: 500 });
    }
}
