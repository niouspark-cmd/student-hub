import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Get the Runner's internal DB ID first
        const runner = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { id: true }
        });

        if (!runner) {
            return NextResponse.json({ success: true, mission: null });
        }

        // 2. Find the one active mission using the internal ID
        // Active means: Assigned to me, AND status is NOT COMPLETED/CANCELLED
        const activeMission = await prisma.order.findFirst({
            where: {
                runnerId: runner.id,
                status: {
                    in: ['READY', 'PICKED_UP']
                }
            },
            include: {
                vendor: { select: { shopName: true, shopLandmark: true, currentHotspot: true } },
                student: { select: { currentHotspot: true } },
                product: { select: { title: true } }
            }
        });

        if (!activeMission) {
            return NextResponse.json({ success: true, mission: null });
        }

        return NextResponse.json({
            success: true,
            mission: {
                id: activeMission.id,
                title: activeMission.product.title,
                vendorName: activeMission.vendor.shopName,
                pickupLocation: activeMission.vendor.shopLandmark || activeMission.vendor.currentHotspot || 'Campus Hub',
                dropoffLocation: activeMission.student.currentHotspot || 'Unknown Loc',
                status: activeMission.status,
                pickupCode: activeMission.pickupCode,
                earning: 5.00 // Sync with mission list logic
            }
        });

    } catch (error) {
        console.error('Fetch active mission error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
