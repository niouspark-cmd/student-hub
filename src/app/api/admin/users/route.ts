import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';

async function checkAuth() {
    const { sessionClaims } = await auth();
    if (sessionClaims?.metadata?.role === 'GOD_MODE') return true;

    const cookieStore = await cookies();
    const bossToken = cookieStore.get('OMNI_BOSS_TOKEN');
    return bossToken?.value === 'AUTHORIZED_ADMIN';
}

export async function GET(req: Request) {
    try {
        if (!await checkAuth()) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const users = await prisma.user.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                balance: true,
                vendorStatus: true,
                isRunner: true,
                lastActive: true,
                university: true
            }
        });

        return NextResponse.json({ success: true, users });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        if (!await checkAuth()) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const { targetUserId, action, value } = body;

        let updateData = {};

        if (action === 'FREEZE_WALLET') {
            updateData = { balance: 0 }; // Draconian Freeze
        } else if (action === 'SET_ROLE') {
            updateData = { role: value }; // value: 'ADMIN', 'VENDOR', 'STUDENT'
        } else if (action === 'SET_RUNNER') {
            updateData = { isRunner: value };
        }

        if (Object.keys(updateData).length > 0) {
            await prisma.user.update({
                where: { id: targetUserId },
                data: updateData
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Action failed' }, { status: 500 });
    }
}
