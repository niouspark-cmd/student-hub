
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
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
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // 1. Conflict of Interest Check
        // If they are a Vendor, they CANNOT be a Runner
        if (user.role === 'VENDOR') {
            return NextResponse.json(
                { error: 'Conflict of Interest: Vendors cannot be Runners. Please use a separate account.' },
                { status: 403 }
            );
        }

        // 2. Activate Runner Mode
        await prisma.user.update({
            where: { clerkId: userId },
            data: {
                isRunner: true,
                runnerStatus: 'OFFLINE',
                runnerLevel: 1,
                xp: 0
            }
        });

        return NextResponse.json({ success: true, message: 'Welcome to the Fleet' });

    } catch (error) {
        console.error('Runner join error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
