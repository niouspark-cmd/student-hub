
import { NextRequest, NextResponse } from 'next/server';
import { getHybridUser } from '@/lib/auth/hybrid-auth';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await getHybridUser();

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

        const orders = await prisma.order.findMany({
            where: {
                vendorId: user.id,
            },
            select: {
                id: true,
                status: true,
                amount: true,
                createdAt: true,
                product: {
                    select: {
                        title: true,
                        imageUrl: true,
                    }
                },
                student: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Map to match frontend interface
        const formattedOrders = orders.map(order => ({
            id: order.id,
            status: order.status,
            amount: order.amount,
            createdAt: order.createdAt,
            studentName: order.student.name,
            productTitle: order.product.title,
            imageUrl: order.product.imageUrl,
            items: 1 // Single item orders for now, or aggregate if CART logic changes
        }));

        return NextResponse.json({ success: true, orders: formattedOrders });
    } catch (error) {
        console.error('Fetch vendor orders error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
