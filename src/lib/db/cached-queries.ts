import { unstable_cache } from 'next/cache';
import { prisma } from './prisma';
import { Product, Category, User } from '@prisma/client';

// Define return types that match what the API routes need
export type ProductWithDetails = Product & {
    vendor: {
        id: string;
        name: string | null;
        email: string;
        currentHotspot: string | null;
        lastActive: Date;
        isAcceptingOrders: boolean;
        shopName: string | null;
    };
    category: Category;
};

/**
 * Cache configuration
 */
const REVALIDATE_TIME = 60; // 1 minute cache (can be adjusted)

/**
 * Cached: Get New Releases (Last 3 days)
 */
export const getCachedNewReleases = unstable_cache(
    async () => {
        // Calculate the date 3 days ago
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        return await prisma.product.findMany({
            where: {
                createdAt: {
                    gte: threeDaysAgo
                }
            },
            include: {
                vendor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        currentHotspot: true,
                        lastActive: true,
                        isAcceptingOrders: true,
                        shopName: true,
                    }
                },
                category: true,
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 12
        });
    },
    ['new-releases'], // Cache key
    {
        revalidate: REVALIDATE_TIME,
        tags: ['products']
    }
);

/**
 * Cached: Get All Categories
 */
export const getCachedCategories = unstable_cache(
    async () => {
        return await prisma.category.findMany({
            orderBy: {
                name: 'asc'
            },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
    },
    ['categories'],
    {
        revalidate: 3600, // 1 hour for categories
        tags: ['categories']
    }
);

/**
 * Cached: Get Products based on simple filters (Category only for now)
 * Complex search queries should bypass cache or use a specific search key
 */
export const getCachedProductsByCategory = unstable_cache(
    async (categoryId: string) => {
        return await prisma.product.findMany({
            where: {
                categoryId
            },
            include: {
                vendor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        currentHotspot: true,
                        lastActive: true,
                        isAcceptingOrders: true,
                        shopName: true, // properties needed
                    },
                },
                category: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    },
    ['products-by-category'], // Base key, dynamic args appended automatically
    {
        revalidate: REVALIDATE_TIME,
        tags: ['products']
    }
);
