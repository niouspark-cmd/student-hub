import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { unstable_cache } from 'next/cache';

// Cache the discovery feed for 60 seconds to reduce DB load
const getDiscoveryFeed = unstable_cache(
    async () => {
        // 1. New Arrivals (Latest 10)
        const newArrivals = await prisma.product.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                vendor: {
                    select: {
                        id: true,
                        name: true,
                        currentHotspot: true,
                        shopName: true
                    }
                },
                category: true
            }
        });

        // 2. Trending (For now, just random items from the last 50)
        // In future: Sort by order count
        const trendingPool = await prisma.product.findMany({
            take: 20,
            orderBy: { updatedAt: 'desc' }, // Recently active
            include: {
                vendor: {
                    select: {
                        id: true,
                        name: true,
                        currentHotspot: true,
                        shopName: true
                    }
                },
                category: true
            }
        });

        // Shuffle trending pool
        const trending = trendingPool.sort(() => 0.5 - Math.random()).slice(0, 10);

        // 3. Just For You (Random selection for now)
        // In future: Based on user history
        // FIX: Removed 'skip' to ensure products appear even if DB has few items
        const recommendedPool = await prisma.product.findMany({
            take: 20,
            include: {
                vendor: {
                    select: {
                        id: true,
                        name: true,
                        currentHotspot: true,
                        shopName: true
                    }
                },
                category: true
            }
        });

        const recommended = recommendedPool.sort(() => 0.5 - Math.random()).slice(0, 10);

        return {
            newArrivals,
            trending,
            recommended
        };
    },
    ['marketplace-discovery-feed-v1'],
    { revalidate: 60, tags: ['products'] }
);

export async function GET() {
    try {
        const feed = await getDiscoveryFeed();

        return NextResponse.json({
            success: true,
            feed
        });
    } catch (error) {
        console.error('Discovery API Error:', error);
        return NextResponse.json({ error: 'Failed to load feed' }, { status: 500 });
    }
}
