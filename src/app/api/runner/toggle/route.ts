
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';
import { ensureUserExists } from '@/lib/auth/sync';

// export const runtime = 'edge';

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

        const newStatus = !user.isRunner;

        const updatedUser = await prisma.user.update({
            where: { clerkId: userId },
            data: {
                isRunner: newStatus,
                runnerStatus: newStatus ? 'IDLE' : null,
            },
        });

        return NextResponse.json({
            success: true,
            isRunner: updatedUser.isRunner,
            runnerStatus: updatedUser.runnerStatus,
        });

    } catch (error) {
        console.error('Runner toggle error:', error);
        return NextResponse.json(
            { error: 'Failed to toggle runner mode' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: {
                isRunner: true,
                runnerStatus: true,
                xp: true,
                runnerLevel: true,
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            isRunner: user.isRunner,
            runnerStatus: user.runnerStatus,
            stats: {
                xp: user.xp,
                level: user.runnerLevel,
            }
        });

    } catch (error) {
        console.error('Fetch runner status error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch status' },
            { status: 500 }
        );
    }
}

