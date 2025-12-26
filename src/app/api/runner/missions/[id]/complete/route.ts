
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        const { id } = await context.params;

        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const runner = await prisma.user.findUnique({ where: { clerkId: userId } });
        if (!runner) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // Verify Order/Mission
        const mission = await prisma.order.findUnique({
            where: { id: id },
            include: { vendor: true }
        });

        if (!mission) return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
        if (mission.runnerId !== runner.id) {
            return NextResponse.json({ error: 'Not your mission' }, { status: 403 });
        }

        // Transaction: Mark Delivered + Credit Runner + Release Funds to Vendor (Conceptual)
        await prisma.$transaction(async (tx) => {
            // 1. Update Order
            await tx.order.update({
                where: { id: id },
                data: {
                    status: 'DELIVERED',
                    escrowStatus: 'RELEASED' // Funds released
                }
            });

            // 2. Credit Runner (Standard fee: GHS 5.00)
            const deliveryFee = 5.00;
            await tx.user.update({
                where: { id: runner.id },
                data: {
                    balance: { increment: deliveryFee },
                    xp: { increment: 50 }, // Runner XP
                    missions: {
                        create: {
                            status: 'DELIVERED',
                            orderId: id
                            // We create a Mission record to track history if it wasn't created at start. 
                            // For MVP, we might simply accept the Order update. 
                            // But our schema has a `Mission` model. Let's try to upsert it or just focus on Order for now to avoid complexity if Mission wasn't created earlier.
                            // Actually, let's just update the User balance for now.
                        }
                    }
                    // Note: If Mission model dictates relation, we should ensure it exists.
                    // For this MVP step, I will stick to updating the User Balance + Order Status.
                    // The 'missions' field in User is a relation.
                }
            });

            // 3. Credit Vendor (Item Price)
            // Note: In a real system, we'd deduct platform fee here.
            await tx.user.update({
                where: { id: mission.vendorId },
                data: {
                    balance: { increment: mission.amount - deliveryFee } // Pay vendor the rest
                }
            });
        });

        return NextResponse.json({ success: true, earned: 5.00 });

    } catch (error) {
        console.error('Complete mission error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
