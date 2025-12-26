
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        const { id } = await context.params; // Order/Mission ID

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const runner = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!runner || !runner.isRunner) {
            return NextResponse.json({ error: 'Only verified Runners can accept missions.' }, { status: 403 });
        }

        // --- THE RACE CONDITION LOCK ---
        // We use a transaction or specific update clause to ensure ATOMICITY
        // "Update the order globally setting runnerId = ME, ONLY IF runnerId is currently NULL"

        // Generate 6-digit Pickup Code (Runner Key)
        const pickupCode = Math.floor(100000 + Math.random() * 900000).toString();

        const result = await prisma.order.updateMany({
            where: {
                id: id,
                runnerId: null, // CRITICAL: This ensures it hasn't been taken yet
                fulfillmentType: 'DELIVERY'
            },
            data: {
                runnerId: runner.id,
                pickupCode: pickupCode,
                // Status remains 'READY' (or whatever it was) until Vendor verifies pickup
                // But effectively it is now "ASSIGNED" because runnerId is set
            }
        });

        if (result.count === 0) {
            // If count is 0, it means the WHERE clause failed.
            // Either the order doesn't exist OR (more likely) runnerId was NOT null.
            return NextResponse.json(
                { error: 'Mission already taken by another runner! Too slow!' },
                { status: 409 } // 409 Conflict
            );
        }

        return NextResponse.json({ success: true, message: 'Mission Secured! Go go go!' });

    } catch (error) {
        console.error('Accept mission error:', error);
        return NextResponse.json(
            { error: 'System Malfunction' },
            { status: 500 }
        );
    }
}
