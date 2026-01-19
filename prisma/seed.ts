
import { PrismaClient } from '@prisma/client';
import { clerkClient } from '@clerk/nextjs/server';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting Seed Process...');

    // 1. Seed Categories
    console.log('📦 Seeding Categories...');
    const categories = [
        { name: 'Food & Snacks', slug: 'food-and-snacks', icon: '🍕', description: 'Satisfy your cravings with the best campus eats.' },
        { name: 'Tech & Gadgets', slug: 'tech-and-gadgets', icon: '💻', description: 'Laptops, phones, and chargers at student prices.' },
        { name: 'Books & Notes', slug: 'books-and-notes', icon: '📚', description: 'Course materials, past questions, and novels.' },
        { name: 'Fashion', slug: 'fashion', icon: '👕', description: 'Look sharp on campus with the latest trends.' },
        { name: 'Services', slug: 'services', icon: '⚡', description: 'Haircuts, repairs, and tutoring services.' },
        { name: 'Everything Else', slug: 'everything-else', icon: '🎯', description: 'Miscellaneous items for your hostel.' },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: cat,
            create: cat,
        });
    }
    console.log('✅ Categories seeded!');

    // 2. Sync Users and Restore Admin
    console.log('🔄 Syncing Users from Clerk...');
    try {
        const client = await clerkClient();
        const userList = await client.users.getUserList({ limit: 50 });

        console.log(`Found ${userList.data.length} users in Clerk.`);

        for (const clerkUser of userList.data) {
            const primaryEmail = clerkUser.emailAddresses.find(e => e.id === clerkUser.primaryEmailAddressId)?.emailAddress
                || clerkUser.emailAddresses[0]?.emailAddress;

            if (!primaryEmail) {
                console.warn(`User ${clerkUser.id} has no email. Skipping.`);
                continue;
            }

            // DETERMINE ROLE
            // We look for 'elliot' or specific admin indicators
            let role: 'STUDENT' | 'ADMIN' | 'VENDOR' = 'STUDENT';

            // Check for Admin (modify this condition to match the developer's email)
            // Using 'elliot' based on previous config
            if (primaryEmail.toLowerCase().includes('elliot') || primaryEmail.toLowerCase().includes('king') || primaryEmail.toLowerCase().includes('admin')) {
                console.log(`👑 Found Admin User: ${primaryEmail}`);
                role = 'ADMIN';
            }

            const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Anonymous';

            await prisma.user.upsert({
                where: { clerkId: clerkUser.id },
                update: {
                    email: primaryEmail,
                    role: role, // Ensure admin role is enforced if matched
                },
                create: {
                    clerkId: clerkUser.id,
                    email: primaryEmail,
                    name: name,
                    role: role,
                    university: 'KNUST', // Default
                    onboarded: true,     // Auto-onboard existing users
                }
            });
            console.log(`  - Synced: ${name} (${role})`);
        }
        console.log('✅ User sync complete!');

    } catch (error) {
        console.error('❌ Failed to sync Clerk users:', error);
        console.log('Make sure CLERK_SECRET_KEY is set in .env');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
