
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

// This is a temporary recovery tool to force-promote the current user to GOD_MODE
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Please sign in first' }, { status: 401 });
        }

        // 1. Find the user
        const user = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!user) {
            return NextResponse.json({ error: 'User record not found in database. Please complete onboarding.' }, { status: 404 });
        }

        // 2. FORCE UPDATE the role
        const updatedUser = await prisma.user.update({
            where: { clerkId: userId },
            data: {
                role: 'GOD_MODE'
            }
        });

        return NextResponse.json({
            success: true,
            message: `User ${updatedUser.name} (${updatedUser.email}) is now GOD_MODE.`,
            previousRole: user.role,
            newRole: updatedUser.role
        });

    } catch (error) {
        return NextResponse.json({
            error: 'Failed to promote user',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
