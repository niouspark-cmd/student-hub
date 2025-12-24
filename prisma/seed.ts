
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Categories...');

    const categories = [
        {
            name: 'Food & Snacks',
            slug: 'food-and-snacks',
            icon: '🍕',
            description: 'Satisfy your cravings with the best campus eats.',
        },
        {
            name: 'Tech & Gadgets',
            slug: 'tech-and-gadgets',
            icon: '💻',
            description: 'Laptops, phones, and chargers at student prices.',
        },
        {
            name: 'Books & Notes',
            slug: 'books-and-notes',
            icon: '📚',
            description: 'Course materials, past questions, and novels.',
        },
        {
            name: 'Fashion',
            slug: 'fashion',
            icon: '👕',
            description: 'Look sharp on campus with the latest trends.',
        },
        {
            name: 'Services',
            slug: 'services',
            icon: '⚡',
            description: 'Haircuts, repairs, and tutoring services.',
        },
        {
            name: 'Everything Else',
            slug: 'everything-else',
            icon: '🎯',
            description: 'Miscellaneous items for your hostel.',
        },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: cat,
            create: cat,
        });
    }

    console.log('✅ Categories seeded!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
