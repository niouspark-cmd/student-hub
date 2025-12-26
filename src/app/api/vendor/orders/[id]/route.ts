
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> } // Correct type for Next.js 15
) {
    try {
        const { userId } = await auth();
        const { id } = await context.params;

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

        // Safety Check: Only allow deleting PENDING (unpaid/malfunctioned) orders
        // If it's PAID or ACTIVE, we shouldn't just delete it without good reason
        // But the user specifically asked for this. Let's restrict it to PENDING for safety as requested.
        if (order.status !== 'PENDING') {
            return NextResponse.json(
                { error: 'Cannot delete active or completed orders. Only pending orders can be removed.' },
                { status: 400 }
            );
        }

        await prisma.order.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Delete order error:', error);
        return NextResponse.json(
            { error: 'Failed to delete order' },
            { status: 500 }
        );
    }
}
