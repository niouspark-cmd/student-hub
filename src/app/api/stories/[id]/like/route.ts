export const runtime = 'edge';

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
                likes: { increment: 1 },
            },
        });

        return NextResponse.json({ success: true, likes: story.likes });
    } catch (error) {
        console.error('Like story error:', error);
        return NextResponse.json({ error: 'Failed to like story' }, { status: 500 });
    }
}
