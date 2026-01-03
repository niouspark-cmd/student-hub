import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';



export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        const { id: storyId } = await params;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if already favorited
        const existingFavorite = await prisma.storyFavorite.findUnique({
            where: {
                storyId_userId: {
                    storyId,
                    userId: user.id,
                },
            },
        });

        let favorited: boolean;

        if (existingFavorite) {
            // Unfavorite
            await prisma.storyFavorite.delete({
                where: { id: existingFavorite.id },
            });
            favorited = false;
        } else {
            // Favorite
            await prisma.storyFavorite.create({
                data: {
                    storyId,
                    userId: user.id,
                },
            });
            favorited = true;
        }

        return NextResponse.json({
            success: true,
            favorited,
        });
    } catch (error) {
        console.error('Favorite story error:', error);
        return NextResponse.json({ error: 'Failed to favorite story' }, { status: 500 });
    }
}

// GET endpoint to check if user has favorited a story
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        const { id: storyId } = await params;

        if (!userId) {
            return NextResponse.json({ favorited: false });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json({ favorited: false });
        }

        const existingFavorite = await prisma.storyFavorite.findUnique({
            where: {
                storyId_userId: {
                    storyId,
                    userId: user.id,
                },
            },
        });

        return NextResponse.json({ favorited: !!existingFavorite });
    } catch (error) {
        console.error('Check favorite error:', error);
        return NextResponse.json({ favorited: false });
    }
}
