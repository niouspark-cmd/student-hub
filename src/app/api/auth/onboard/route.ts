// export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            console.log('Auth failed: userId or user is missing', { userId, userPresent: !!user });
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { role, isRunner, shopName, shopLandmark } = body;

        console.log('Onboarding User:', {
            id: user.id,
            emailAddresses: user.emailAddresses,
            primaryEmailId: user.primaryEmailAddressId,
            role,
            shopName,
            shopLandmark
        });

        const email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress
            || user.emailAddresses[0]?.emailAddress
            || `${user.id}@omni-placeholder.com`; // Fallback used if user signed up with Phone Number only

        console.log('Final email to use:', email);

        if (!email) {
            console.error('No email found for user:', user.id);
            return NextResponse.json({ error: 'No email found' }, { status: 400 });
        }

        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous Student';

        // Additional data for VENDOR
        const vendorData = role === 'VENDOR' ? {
            shopName: shopName || 'New Shop',
            shopLandmark: shopLandmark || 'Campus'
        } : {
            shopName: null,
            shopLandmark: null
        };

        // Upsert user in database (Update if exists, Create if not)
        await prisma.user.upsert({
            where: { clerkId: userId },
            update: {
                role: role,
                isRunner: !!isRunner,
                onboarded: true,
                vendorStatus: role === 'VENDOR' ? 'PENDING' : 'NOT_APPLICABLE',
                ...vendorData
            },
            create: {
                clerkId: userId,
                email: email,
                name: name,
                role: role,
                isRunner: !!isRunner,
                onboarded: true,
                vendorStatus: role === 'VENDOR' ? 'PENDING' : 'NOT_APPLICABLE',
                university: 'KNUST', // Default
                ...vendorData
            }
        });

        // Create response and set the Identity Cookie
        const response = NextResponse.json({ success: true });
        response.cookies.set('OMNI_IDENTITY_VERIFIED', 'TRUE', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Onboarding API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

