
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth();
        const { id } = await params;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Find story and check ownership
        const story = await prisma.story.findUnique({
            where: { id },
            include: { vendor: true }
        });

        if (!story) {
            return NextResponse.json({ error: 'Story not found' }, { status: 404 });
        }

        if (story.vendor.clerkId !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.story.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: 'Story deleted' });
    } catch (error) {
        console.error('Delete story error:', error);
        return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 });
    }
}
