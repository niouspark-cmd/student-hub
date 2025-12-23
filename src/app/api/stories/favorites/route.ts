import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Fetch user's favorited stories
        const favorites = await prisma.storyFavorite.findMany({
            where: {
                userId: user.id,
            },
            include: {
                story: {
                    include: {
                        vendor: {
                            select: {
                                name: true,
                                clerkId: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const stories = favorites.map(f => f.story);

        return NextResponse.json({ stories });
    } catch (error) {
        console.error('Fetch favorites error:', error);
        return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
    }
}
