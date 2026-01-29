export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-12 px-4">
      <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
        <h1 className="font-black uppercase tracking-tighter text-primary">Privacy Protocol</h1>
        <p className="lead">Last Updated: January 2026</p>

        <h3>1. Data Collection</h3>
        <p>
          We collect information you provide directly to us, such as when you create an account, update your profile, make a purchase, or communicate with us.
        </p>

        <h3>2. Location Data</h3>
        <p>
          OMNI uses "Hotspot" technology rather than continuous GPS tracking to protect your privacy. We only record your location when you explicitly select a delivery point or check in at a campus hub.
        </p>

        <h3>3. Payment Security</h3>
        <p>
          All financial transactions are processed through Paystack. We do not store your credit card or mobile money PINs on our servers.
        </p>

        <h3>4. Data Usage</h3>
        <p>
          We use your data to:
        </p>
        <ul>
          <li>Facilitate orders and deliveries.</li>
          <li>Improve our platform and services.</li>
          <li>Detect and prevent fraud.</li>
        </ul>

        <h3>5. Contact Us</h3>
        <p>
          If you have questions about this privacy policy, please contact us at privacy@omni-hub.com.
        </p>
      </div>
    </div>
  );
}
