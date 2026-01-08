
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRecentOrders() {
    console.log('Checking recent orders...');
    const orders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            student: {
                select: { id: true, email: true, name: true, clerkId: true }
            }
        }
    });

    console.log(`Found ${orders.length} orders.`);
    orders.forEach(o => {
        console.log(`Order: ${o.id.slice(0, 8)} | Status: ${o.status}/${o.escrowStatus} | Student: ${o.student?.email} (${o.student?.id}) | Created: ${o.createdAt}`);
    });
}

checkRecentOrders()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
