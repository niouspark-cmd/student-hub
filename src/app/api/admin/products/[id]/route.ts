import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@clerk/nextjs/server';

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> } // Correct type for Next.js 15
) {
    try {
        const { id } = await context.params;

        // 1. Dual-Layer Auth Check (God Key OR God Mode Role)
        const adminKey = req.headers.get('x-admin-key');
        const { sessionClaims } = await auth();
        const userRole = (sessionClaims?.metadata as any)?.role;

        const isAuthorized =
            adminKey === 'omniadmin.com' ||
            userRole === 'GOD_MODE';

        if (!isAuthorized) {
            return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
        }

        // 2. Perform Deletion
        await prisma.product.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: 'ASSET TERMINATED' });

    } catch (error) {
        console.error('Admin Delete Error:', error);
        return NextResponse.json({ success: false, error: 'DELETION FAILED' }, { status: 500 });
    }
}
