
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q');

        if (!q || q.trim().length < 1) {
            return NextResponse.json({ products: [], vendors: [], categories: [] });
        }

        const query = q.trim();

        // Run searches in parallel
        const [products, vendors, categories] = await Promise.all([
            // 1. Search Products
            prisma.product.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                    ],
                    isArchived: false,
                },
                take: 6,
                select: {
                    id: true,
                    title: true,
                    price: true,
                    imageUrl: true,
                    vendor: {
                        select: { shopName: true }
                    }
                }
            }),

            // 2. Search Vendors
            prisma.user.findMany({
                where: {
                    shopName: { contains: query, mode: 'insensitive' },
                    vendorStatus: { not: 'NOT_APPLICABLE' }
                },
                take: 3,
                select: {
                    id: true,
                    shopName: true,
                    vendorStatus: true
                }
            }),

            // 3. Search Categories
            prisma.category.findMany({
                where: {
                    name: { contains: query, mode: 'insensitive' }
                },
                take: 3,
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    icon: true
                }
            })
        ]);

        return NextResponse.json({ products, vendors, categories });

    } catch (error) {
        console.error('Search API Error:', error);
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
}
