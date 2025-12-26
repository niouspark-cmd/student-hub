
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// Default categories configuration
const DEFAULT_CATEGORIES = [
    { slug: 'food-and-snacks', name: 'Food & Snacks', icon: '🍕' },
    { slug: 'tech-and-gadgets', name: 'Tech & Gadgets', icon: '💻' },
    { slug: 'books-and-notes', name: 'Books & Notes', icon: '📚' },
    { slug: 'fashion', name: 'Fashion', icon: '👕' },
    { slug: 'services', name: 'Services', icon: '⚡' },
    { slug: 'everything-else', name: 'Everything Else', icon: '🎯' }
];

export async function GET() {
    try {
        let categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            },
            orderBy: { name: 'asc' }
        });

        // Auto-Seed if empty
        if (categories.length === 0) {
            console.log('Seeding default categories...');
            for (const cat of DEFAULT_CATEGORIES) {
                await prisma.category.create({
                    data: {
                        name: cat.name,
                        slug: cat.slug,
                        icon: cat.icon
                    }
                });
            }
            // Re-fetch after seeding
            categories = await prisma.category.findMany({
                include: {
                    _count: {
                        select: { products: true }
                    }
                },
                orderBy: { name: 'asc' }
            });
        }

        return NextResponse.json({ success: true, categories });
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
