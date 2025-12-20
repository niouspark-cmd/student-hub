
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ role: 'GUEST' });

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { role: true, vendorStatus: true, onboarded: true, isRunner: true }
        });

        if (!user) {
            return NextResponse.json({ role: 'STUDENT' });
        }

        return NextResponse.json({
            role: user.role,
            vendorStatus: user.vendorStatus,
            onboarded: user.onboarded,
            isRunner: user.isRunner
        });
    } catch (error) {
        return NextResponse.json({ error: 'FAILED_TO_FETCH_PROFILE' }, { status: 500 });
    }
}
