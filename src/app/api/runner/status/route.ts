
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        const body = await request.json();
        const { status } = body; // 'ONLINE' or 'OFFLINE'

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.user.update({
            where: { clerkId: userId },
            data: {
                runnerStatus: status
            }
        });

        return NextResponse.json({ success: true, status });

    } catch (error) {
        console.error('Status update error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { runnerStatus: true, balance: true }
        });

        return NextResponse.json({
            status: user?.runnerStatus || 'OFFLINE',
            balance: user?.balance || 0.00
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
