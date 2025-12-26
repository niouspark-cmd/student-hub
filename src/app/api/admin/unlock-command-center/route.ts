import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // Verify the God Mode password
        if (password !== 'omniadmin.com') {
            return NextResponse.json({ error: 'Invalid password' }, { status: 403 });
        }

        console.log('[UNLOCK API] Password verified, setting cookie...');

        // Create response with cookie in header manually
        const response = new NextResponse(
            JSON.stringify({ success: true }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Set-Cookie': `OMNI_BOSS_TOKEN=AUTHORIZED_ADMIN; Path=/; Max-Age=604800; HttpOnly; SameSite=Lax`
                }
            }
        );

        console.log('[UNLOCK API] Response created with Set-Cookie header');

        return response;
    } catch (error) {
        console.error('[UNLOCK API] Error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

// Disable middleware processing for this route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
