
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
    try {
        // Find orders that are:
        // 1. PAID (ready for assignment) OR READY (prepared by vendor)
        // 2. Delivery is requested (fulfillmentType = DELIVERY)
        // 3. Not yet assigned to a runner (runnerId is null)
        const missions = await prisma.order.findMany({
            where: {
                fulfillmentType: 'DELIVERY',
                runnerId: null,
                status: 'READY' // Runners only see orders when vendor marks them READY
            },
            include: {
                vendor: {
                    select: { shopName: true, currentHotspot: true, shopLandmark: true }
                },
                student: {
                    select: { currentHotspot: true } // Assuming student location is stored here for MVP, or we'd need a delivery address field
                },
                product: {
                    select: { title: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Format for the frontend
        const formattedMissions = missions.map(mission => ({
            id: mission.id,
            title: mission.product.title,
            vendorName: mission.vendor.shopName,
            pickupLocation: mission.vendor.shopLandmark || mission.vendor.currentHotspot || 'Campus Hub',
            dropoffLocation: mission.student.currentHotspot || 'Student Location (Nav)', // Needs refinement in V2
            earning: 5.00, // Hardcoded global fee for now
            status: mission.status
        }));

        return NextResponse.json({ success: true, missions: formattedMissions });

    } catch (error) {
        console.error('Fetch missions error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch missions' },
            { status: 500 }
        );
    }
}
