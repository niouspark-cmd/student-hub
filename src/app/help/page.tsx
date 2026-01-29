import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-8 text-primary">Help & Support</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <details className="group bg-surface border border-surface-border rounded-xl p-4 cursor-pointer">
                  <summary className="font-bold flex justify-between items-center">
                    How do payments work?
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-sm text-foreground/70">
                    We use a secure escrow system. When you pay, funds are held safely. They are only released to the vendor when you scan the QR code upon delivery.
                  </p>
                </details>
                <details className="group bg-surface border border-surface-border rounded-xl p-4 cursor-pointer">
                  <summary className="font-bold flex justify-between items-center">
                    How do I become a runner?
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-sm text-foreground/70">
                    Go to the Runner Dashboard from the menu and toggle your status to "Online". You'll start receiving delivery missions nearby.
                  </p>
                </details>
                <details className="group bg-surface border border-surface-border rounded-xl p-4 cursor-pointer">
                  <summary className="font-bold flex justify-between items-center">
                    Is OMNI available on all campuses?
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-sm text-foreground/70">
                    Currently, we are in Alpha phase at select campuses. Check the location picker to see if your area is supported.
                  </p>
                </details>
              </div>
            </section>
          </div>

          <div className="bg-surface border border-surface-border rounded-2xl p-8 h-fit">
            <h2 className="text-xl font-black uppercase tracking-tight mb-4">Contact Support</h2>
            <p className="text-sm text-foreground/60 mb-6">
              Need assistance with an order or account issue? Our support team is here to help.
            </p>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-2">Subject</label>
                <select className="w-full bg-background border border-surface-border rounded-lg p-3 text-sm">
                  <option>Order Issue</option>
                  <option>Payment Problem</option>
                  <option>Vendor Inquiry</option>
                  <option>Report a Bug</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-2">Message</label>
                <textarea className="w-full bg-background border border-surface-border rounded-lg p-3 text-sm h-32" placeholder="Describe your issue..."></textarea>
              </div>
              <button className="w-full bg-primary text-primary-foreground font-black uppercase tracking-widest py-3 rounded-lg hover:opacity-90 transition-opacity">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
