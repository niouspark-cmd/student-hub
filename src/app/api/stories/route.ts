
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';
import { ensureUserExists } from '@/lib/auth/sync';

export const runtime = 'edge';

export async function GET() {
    try {
        // Fetch active stories (less than 24h old)
        const stories = await prisma.story.findMany({
            where: {
                expiresAt: {
                    gt: new Date(),
                },
            },
            include: {
                vendor: {
                    select: {
                        name: true,
                        clerkId: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 20, // Pagination limit
        });

        return NextResponse.json({ stories });
    } catch (error) {
        console.error('Fetch stories error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stories' },
            { status: 500 }
        );
    }
}

export const runtime = 'edge';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await ensureUserExists();

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Only vendors can post stories? Or everyone?
        // Assuming vendors for now based on "vendorId" field, but students could too if desired
        // if (user.role !== 'VENDOR') ...

        const body = await request.json();
        const { videoUrl, caption } = body;

        if (!videoUrl) {
            return NextResponse.json(
                { error: 'Video URL is required' },
                { status: 400 }
            );
        }

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // Expires in 24 hours

        const story = await prisma.story.create({
            data: {
                videoUrl,
                title: caption,
                vendorId: user.id, // Using vendorId field but mapping to user.id
                expiresAt,
            },
        });

        return NextResponse.json({ success: true, story });

    } catch (error) {
        console.error('Create story error:', error);
        return NextResponse.json(
            { error: 'Failed to create story' },
            { status: 500 }
        );
    }
}
