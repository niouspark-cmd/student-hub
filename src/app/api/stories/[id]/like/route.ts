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

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if user already liked this story
        const existingLike = await prisma.storyLike.findUnique({
            where: {
                storyId_userId: {
                    storyId,
                    userId: user.id,
                },
            },
        });

        let liked: boolean;
        let newLikeCount: number;

        if (existingLike) {
            // Unlike: Remove the like and decrement counter
            await prisma.storyLike.delete({
                where: { id: existingLike.id },
            });

            const story = await prisma.story.update({
                where: { id: storyId },
                data: {
                    likes: { decrement: 1 },
                },
            });

            liked = false;
            newLikeCount = story.likes;
        } else {
            // Like: Create like record and increment counter
            await prisma.storyLike.create({
                data: {
                    storyId,
                    userId: user.id,
                },
            });

            const story = await prisma.story.update({
                where: { id: storyId },
                data: {
                    likes: { increment: 1 },
                },
            });

            liked = true;
            newLikeCount = story.likes;
        }

        return NextResponse.json({
            success: true,
            liked,
            likes: newLikeCount,
        });
    } catch (error) {
        console.error('Like story error:', error);
        return NextResponse.json({ error: 'Failed to like story' }, { status: 500 });
    }
}

// GET endpoint to check if user has liked a story
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        const { id: storyId } = await params;

        if (!userId) {
            return NextResponse.json({ liked: false });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json({ liked: false });
        }

        const existingLike = await prisma.storyLike.findUnique({
            where: {
                storyId_userId: {
                    storyId,
                    userId: user.id,
                },
            },
        });

        return NextResponse.json({ liked: !!existingLike });
    } catch (error) {
        console.error('Check like error:', error);
        return NextResponse.json({ liked: false });
    }
}
