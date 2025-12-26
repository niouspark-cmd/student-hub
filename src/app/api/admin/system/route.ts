import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';
import { cookies } from 'next/headers';

async function checkAuth() {
    const { sessionClaims } = await auth();
    // Allow GOD_MODE users
    if (sessionClaims?.metadata?.role === 'GOD_MODE') return true;

    // Check for BOSS TOKEN (middleware already validated it, so just trust it)
    const cookieStore = await cookies();
    const bossToken = cookieStore.get('OMNI_BOSS_TOKEN');
    return bossToken?.value === 'AUTHORIZED_ADMIN';
}

export async function GET(request: NextRequest) {
    try {
        if (!await checkAuth()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        let settings = await prisma.systemSettings.findFirst();

        if (!settings) {
            settings = await prisma.systemSettings.create({
                data: {
                    maintenanceMode: false,
                    activeFeatures: ["MARKET", "PULSE", "RUNNER", "ESCROW"],
                    globalNotice: null
                }
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('System settings fetch error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        // Check Admin Authorization
        if (!await checkAuth()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const { maintenanceMode, activeFeatures, globalNotice } = body;

        const settings = await prisma.systemSettings.upsert({
            where: { id: 'GLOBAL_CONFIG' },
            create: {
                id: 'GLOBAL_CONFIG',
                maintenanceMode: maintenanceMode || false,
                activeFeatures: activeFeatures || ["MARKET", "PULSE", "RUNNER", "ESCROW"],
                globalNotice
            },
            update: {
                maintenanceMode,
                activeFeatures,
                globalNotice
            }
        });

        // Log action (Optional but good for God Mode history)
        await prisma.adminLog.create({
            data: {
                adminId: userId || 'GHOST_ADMIN',
                action: 'UPDATE_SYSTEM_SETTINGS',
                details: JSON.stringify(body)
            }
        });

        return NextResponse.json(settings);

    } catch (error) {
        console.error('System settings update error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
