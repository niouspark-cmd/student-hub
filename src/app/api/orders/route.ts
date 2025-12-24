
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

// export const runtime = 'edge';

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const orders = await prisma.order.findMany({
            where: {
                studentId: user.id,
            },
            select: {
                id: true,
                status: true,
                escrowStatus: true,
                amount: true,
                fulfillmentType: true,
                releaseKey: true,
                createdAt: true,
                product: {
                    select: {
                        title: true,
                        imageUrl: true,
                    },
                },
                vendor: {
                    select: {
                        name: true,
                        currentHotspot: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ success: true, orders });
    } catch (error) {
        console.error('Fetch orders error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

