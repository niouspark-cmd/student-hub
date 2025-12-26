
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

/**
 * Publicly accessible system configuration check.
 * Used to block UI features during maintenance.
 */

// export const runtime = 'edge';

export async function GET() {
    try {
        const config = await prisma.systemSettings.findUnique({
            where: { id: 'GLOBAL_CONFIG' }
        });

        // Default to safe values if not found
        return NextResponse.json({
            success: true,
            maintenanceMode: config?.maintenanceMode ?? false,
            activeFeatures: config?.activeFeatures ?? ['MARKET', 'PULSE', 'RUNNER', 'ESCROW'],
            globalNotice: config?.globalNotice ?? null,
            contentOverride: config?.contentOverride ?? {}
        });
    } catch (error) {
        console.error('System config fetch error:', error);
        return NextResponse.json({
            success: false,
            maintenanceMode: false,
            activeFeatures: ['MARKET', 'PULSE', 'RUNNER', 'ESCROW'],
            globalNotice: null
        });
    }
}

