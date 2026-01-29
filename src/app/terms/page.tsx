export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-12 px-4">
      <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
        <h1 className="font-black uppercase tracking-tighter text-primary">Terms of Service</h1>
        <p className="lead">Effective Date: January 2026</p>

        <h3>1. Acceptance of Terms</h3>
        <p>
          By accessing or using OMNI, you agree to be bound by these Terms of Service and all applicable laws and regulations.
        </p>

        <h3>2. User Accounts</h3>
        <p>
          You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
        </p>

        <h3>3. Vendor & Runner Rules</h3>
        <p>
          Vendors and Runners must adhere to our strict quality and community guidelines. Failure to deliver orders or providing substandard service may result in account suspension.
        </p>

        <h3>4. Prohibited Items</h3>
        <p>
          The sale of illegal, unsafe, or academic-dishonesty related items (e.g., plagiarized papers) is strictly prohibited on OMNI.
        </p>

        <h3>5. Limitation of Liability</h3>
        <p>
          OMNI is a facilitator of transactions. We are not liable for the quality of goods or services provided by third-party vendors, though we facilitate dispute resolution through our escrow system.
        </p>
      </div>
    </div>
  );
}
