
// src/app/api/payments/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

/**
 * Verify a Paystack payment and generate the Secure Release Key for escrow release
 * This endpoint should be called after the student completes payment
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { reference } = body;

        if (!reference) {
            return NextResponse.json(
                { error: 'Reference is required' },
                { status: 400 }
            );
        }

        // Verify payment with Paystack
        const { verifyTransaction } = await import('@/lib/payments/paystack');
        const verification = await verifyTransaction(reference);

        if (!verification.status || verification.data.status !== 'success') {
            return NextResponse.json(
                { error: 'Payment verification failed or not successful' },
                { status: 400 }
            );
        }

        // Find the order by ID (since we used orderId as reference)
        const order = await prisma.order.findUnique({
            where: { id: reference },
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Check if already processed
        if (order.escrowStatus === 'HELD') {
            return NextResponse.json({
                success: true,
                message: 'Payment already verified',
                order: {
                    id: order.id,
                    status: order.status,
                    escrowStatus: order.escrowStatus,
                    releaseKey: order.releaseKey,
                },
            });
        }

        // Generate OMNI Secure-Key (6 digits)
        const releaseKey = Math.floor(100000 + Math.random() * 900000).toString();

        // Update order: mark as PAID and escrow as HELD
        const updatedOrder = await prisma.order.update({
            where: { id: order.id },
            data: {
                status: 'PAID',
                escrowStatus: 'HELD',
                releaseKey,
                paystackRef: reference,
                paidAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Payment verified successfully. Secure-Key generated.',
            order: {
                id: updatedOrder.id,
                status: updatedOrder.status,
                releaseKey: updatedOrder.releaseKey,
            }
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            { error: 'Verification failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
