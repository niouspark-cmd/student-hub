import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
    try {
        const settings = await prisma.systemSettings.findUnique({
            where: { id: 'GLOBAL_CONFIG' }
        });

        return NextResponse.json({
            success: true,
            content: settings?.contentOverride || {}
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch content' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        // Basic check, middleware handles strict security
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { id, content } = body;

        if (!id || content === undefined) {
            return NextResponse.json({ error: 'Missing id or content' }, { status: 400 });
        }

        // 1. Fetch existing settings to get current JSON
        const settings = await prisma.systemSettings.findUnique({
            where: { id: 'GLOBAL_CONFIG' }
        });

        // 2. Merge content
        // Helper to safely parse JSON if needed, though prisma returns object usually
        let currentContent = (settings?.contentOverride as Record<string, any>) || {};

        // Update specific key
        currentContent[id] = content;

        // 3. Save
        await prisma.systemSettings.upsert({
            where: { id: 'GLOBAL_CONFIG' },
            update: { contentOverride: currentContent },
            create: {
                id: 'GLOBAL_CONFIG',
                activeFeatures: ['MARKET', 'PULSE', 'RUNNER', 'VENDOR'], // Defaults
                contentOverride: currentContent
            }
        });

        return NextResponse.json({ success: true, content: currentContent });

    } catch (error) {
        console.error('Content update error:', error);
        return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
    }
}
