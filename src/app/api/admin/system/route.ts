
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
        if (!isAuthorized(request, sessionClaims)) {
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
        const { userId, sessionClaims } = await auth();

        // Check Admin Role OR API Key
        if (!isAuthorized(request, sessionClaims)) {
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
