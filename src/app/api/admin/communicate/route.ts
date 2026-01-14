import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { isAuthorizedAdmin } from '@/lib/auth/admin';
import { sendSMS, sendBulkSMS } from '@/lib/sms/wigal';

export async function POST(req: NextRequest) {
    // Security Check
    if (!await isAuthorizedAdmin()) {
        return NextResponse.json({ error: 'Uplink Forbidden' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { mode, recipient, group, message } = body;

        if (!message) {
            return NextResponse.json({ error: 'Message content missing' }, { status: 400 });
        }

        if (mode === 'SINGLE') {
            if (!recipient) return NextResponse.json({ error: 'Recipient required' }, { status: 400 });

            const result = await sendSMS(recipient, message);
            return NextResponse.json(result);
        }
        else if (mode === 'BULK') {
            let whereClause: any = { phoneNumber: { not: null } };

            if (group === 'VENDORS') {
                whereClause.role = 'VENDOR';
            } else if (group === 'STUDENTS') {
                whereClause.role = 'STUDENT';
            }
            // else 'ALL' -> no extra filter

            const users = await prisma.user.findMany({
                where: whereClause,
                select: { phoneNumber: true }
            });

            const recipients = users.map(u => u.phoneNumber!).filter(p => p && p.length > 5);

            if (recipients.length === 0) {
                return NextResponse.json({ success: false, error: 'No valid phone numbers found in selected group' });
            }

            const result = await sendBulkSMS(recipients, message);
            return NextResponse.json(result);
        }

        return NextResponse.json({ error: 'Invalid Mode' }, { status: 400 });

    } catch (error) {
        console.error('Communicate API Error:', error);
        return NextResponse.json({ error: 'Transmission Failed' }, { status: 500 });
    }
}
