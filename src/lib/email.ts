import { prisma } from './db/prisma';

interface EmailPayload {
    to: string;
    subject: string;
    htmlContent: string;
}

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const API_KEY = process.env.BREVO_API_KEY;
const SENDER = { name: 'OMNI', email: 'noreply@omni.upsa.edu.gh' };

async function sendEmail(payload: EmailPayload) {
    if (!API_KEY) {
        console.warn('⚠️ Brevo API Key missing. Skipping email.');
        return;
    }

    try {
        const res = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: SENDER,
                to: [{ email: payload.to }],
                subject: payload.subject,
                htmlContent: payload.htmlContent
            })
        });

        if (!res.ok) {
            const err = await res.json();
            console.error('❌ Brevo Error:', err);
        } else {
            console.log(`📧 Email sent to ${payload.to}`);
        }
    } catch (error) {
        console.error('Email Fetch Error:', error);
    }
}

export async function sendOrderConfirmation(studentEmail: string, orderGroupCount: number, totalAmount: number) {
    const html = `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4F46E5;">Order Confirmed! 🚀</h1>
            <p>Thanks for shopping on OMNI.</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold;">Total Paid: ₵${totalAmount.toFixed(2)}</p>
                <p style="margin: 5px 0 0 0; font-size: 0.9em;">Includes ${orderGroupCount} separate shipments.</p>
            </div>
            <p>Your orders have been sent to the respective vendors. You will receive notifications when they are ready.</p>
            <a href="https://omni-student.com/orders" style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Orders</a>
        </div>
    `;

    await sendEmail({
        to: studentEmail,
        subject: 'OMNI Receipt: Your order is confirmed',
        htmlContent: html
    });
}

export async function sendVendorNewOrderAlert(vendorEmail: string, orderId: string, itemCount: number) {
    const html = `
        <div style="font-family: sans-serif; padding: 20px;">
            <h2 style="color: #10B981;">New Order Received! 🔔</h2>
            <p>You have a new order (#${orderId.slice(0, 8)}) with ${itemCount} items.</p>
            <p>Please log in to your dashboard to accept and process it.</p>
            <a href="https://omni-student.com/dashboard/vendor" style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Open Dashboard</a>
        </div>
    `;

    await sendEmail({
        to: vendorEmail,
        subject: '🔔 New OMNI Order Alert',
        htmlContent: html
    });
}
