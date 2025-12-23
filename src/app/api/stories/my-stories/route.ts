import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Fetch user's stories
        const stories = await prisma.story.findMany({
            where: {
                vendorId: user.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                videoUrl: true,
                title: true,
                views: true,
                likes: true,
                createdAt: true,
                expiresAt: true,
            },
        });

        return NextResponse.json({ stories });
    } catch (error) {
        console.error('Fetch my stories error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stories' },
            { status: 500 }
        );
    }
}
