import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { university } = body;

        if (university) {
            await prisma.user.update({
                where: { clerkId: userId },
                data: { university }
            });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
