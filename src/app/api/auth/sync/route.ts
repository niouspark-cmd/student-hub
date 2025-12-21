import { NextRequest, NextResponse } from 'next/server';
import { ensureUserExists } from '@/lib/auth/sync';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
    try {
        const user = await ensureUserExists();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('Auth sync error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
