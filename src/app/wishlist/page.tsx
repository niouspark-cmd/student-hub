import Link from 'next/link';

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-6xl mb-6">✨</div>
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Your Acquisition List</h1>
        <p className="text-xl text-foreground/60 mb-8">
          Save items for later. This feature is coming soon to the OMNI ecosystem.
        </p>
        
        <div className="bg-surface border border-surface-border rounded-2xl p-12 max-w-md mx-auto mb-12">
            <p className="font-bold mb-4">Empty Vault</p>
            <p className="text-sm text-foreground/50">You haven't added any items yet.</p>
        </div>

        <Link href="/" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:opacity-90 transition-opacity">
          Start Browsing
        </Link>
      </div>
    </div>
  );
}
