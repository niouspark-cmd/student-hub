
// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';
import { ensureUserExists } from '@/lib/auth/sync';

// GET - List all products or vendor's products

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const vendorOnly = searchParams.get('vendorOnly') === 'true';
        const query = searchParams.get('q');
        const categoryId = searchParams.get('categoryId');

        const { userId } = await auth();

        let where: any = {};

        if (vendorOnly && userId) {
            const user = await prisma.user.findUnique({
                where: { clerkId: userId },
            });

            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            where.vendorId = user.id;
        }

        if (query) {
            where.OR = [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ];
        }

        if (categoryId) {
            where.categoryId = categoryId;
        }

        const products = await prisma.product.findMany({
            where,
            include: {
                vendor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        currentHotspot: true,
                        lastActive: true,
                    },
                },
                category: true, // Include category info
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ success: true, products });
    } catch (error) {
        console.error('Get products error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await ensureUserExists();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized or User not found' }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, price, categoryId, imageUrl, hotspot, details } = body;

        // Validation
        if (!title || !description || !price || !categoryId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const product = await prisma.product.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                categoryId,
                imageUrl,
                hotspot,
                details,
                vendorId: user.id,
            },
            include: {
                vendor: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error('Create product error:', error);
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        );
    }
}
