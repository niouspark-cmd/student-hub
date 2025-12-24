
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

// export const runtime = 'edge';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        console.log('[DEBUG] Gatekeeper Verify - UserID found:', userId);

        if (!userId) {
            return NextResponse.json({ error: 'AUTH_REQUIRED', message: 'You must be signed in to verify' }, { status: 401 });
        }

        const { code } = await request.json();
        console.log('[DEBUG] Gatekeeper Verify - Code received:', code ? 'YES' : 'NO');

        // Check against environment variable
        if (code !== process.env.ADMIN_SECRET_CODE) {
            return NextResponse.json({ error: 'Invalid access code' }, { status: 403 });
        }

        // Find user by Clerk ID
        const user = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
        }

        // Grant ADMIN role in DB
        await prisma.user.update({
            where: { id: user.id },
            data: {
                role: 'ADMIN',
                onboarded: true
            }
        });

        // Create response with success
        const response = NextResponse.json({ success: true, message: 'Admin status granted successfully' });

        // Set the BOSS TOKEN cookie
        response.cookies.set('OMNI_BOSS_TOKEN', 'AUTHORIZED_ADMIN', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        // Also set the Identity Cookie (Admins are onboarded)
        response.cookies.set('OMNI_IDENTITY_VERIFIED', 'TRUE', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Gatekeeper verify error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

