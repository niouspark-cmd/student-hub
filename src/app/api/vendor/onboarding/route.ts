import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { ensureUserExists } from '@/lib/auth/sync';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
    try {
        const user = await ensureUserExists();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { shopName, shopLandmark } = await request.json();

        if (!shopName || !shopLandmark) {
            return NextResponse.json({ error: 'Shop name and landmark are required' }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                shopName,
                shopLandmark,
                role: 'VENDOR',
                vendorStatus: 'PENDING', // Awaiting Admin approval
            }
        });

        return NextResponse.json({ success: true, message: 'Onboarding completed. Awaiting admin approval.' });
    } catch (error) {
        console.error('Vendor onboarding error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
