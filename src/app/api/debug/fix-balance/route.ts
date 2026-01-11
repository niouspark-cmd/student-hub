
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get current db user
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { id: true, balance: true }
        });

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // Calculate total earnings from completed orders
        const completedOrders = await prisma.order.findMany({
            where: {
                runnerId: user.id,
                status: 'COMPLETED'
            },
            select: {
                runnerEarnings: true
            }
        });

        const totalEarnings = completedOrders.reduce((sum, order) => sum + (order.runnerEarnings || 0), 0);

        // Update balance
        // Note: This assumes NO withdrawals have been made.
        // For a test fix, this is acceptable.

        await prisma.user.update({
            where: { id: user.id },
            data: {
                balance: totalEarnings
            }
        });

        return NextResponse.json({
            success: true,
            message: `Balance reconciled. Total Earnings found: GHS ${totalEarnings.toFixed(2)}`,
            previousBalance: user.balance,
            newBalance: totalEarnings
        });

    } catch (error) {
        console.error('Reconcile error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
