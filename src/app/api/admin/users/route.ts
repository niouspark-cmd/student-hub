
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

const ADMIN_KEY = 'omniadmin.com';

function isAuthorized(request: NextRequest, sessionClaims: any) {
    const headerKey = request.headers.get('x-admin-key');
    if (headerKey === ADMIN_KEY) return true;
    if (sessionClaims?.metadata?.role === 'GOD_MODE') return true;
    return false;
}

export async function GET(request: NextRequest) {
    try {
        const { sessionClaims } = await auth();
        // Security Check
        if (!isAuthorized(request, sessionClaims)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        const search = request.nextUrl.searchParams.get('q');

        const users = await prisma.user.findMany({
            where: search ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { shopName: { contains: search, mode: 'insensitive' } }
                ]
            } : undefined,
            take: 50,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                vendorStatus: true,
                isRunner: true,
                shopName: true,
                balance: true,
                createdAt: true
            }
        });

        return NextResponse.json(users);
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const { sessionClaims, userId: adminId } = await auth();
        if (!isAuthorized(request, sessionClaims)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        const body = await request.json();
        const { userId, action, value } = body;
        // Actions: 'SET_ROLE', 'SET_VENDOR_STATUS', 'TOGGLE_RUNNER'

        let updateData = {};
        if (action === 'promote_vendor') {
            updateData = { role: 'VENDOR', vendorStatus: 'ACTIVE' };
        } else if (action === 'ban') {
            // We don't have a specific ban column yet, assume suspending vendor or just role manipulation?
            // Let's toggle vendor status to SUSPENDED for now.
            updateData = { vendorStatus: 'SUSPENDED' };
        } else if (action === 'verify_runner') {
            updateData = { isRunner: true };
        }

        await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        await prisma.adminLog.create({
            data: {
                adminId: adminId!,
                action: `USER_MOD_${action}`,
                details: `Modified User ${userId}`
            }
        });

        return NextResponse.json({ success: true });

    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
