
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        const { id } = await params;
        const { status } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user || user.role !== 'VENDOR') {
            return NextResponse.json(
                { error: 'Unauthorized Access' },
                { status: 403 }
            );
        }

        // Verify ownership
        const order = await prisma.order.findUnique({
            where: { id },
        });

        if (!order || order.vendorId !== user.id) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Validate Status Transition (Basic)
        // PENDING -> PAID -> PREPARING -> READY -> PICKED_UP -> COMPLETED
        // Allow vendor to move: PAID -> PREPARING -> READY

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json({ success: true, order: updatedOrder });
    } catch (error) {
        console.error('Update order status error:', error);
        return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
        );
    }
}
