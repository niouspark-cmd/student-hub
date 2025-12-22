import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const runtime = 'edge';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,var(--primary)/0.03,transparent_50%)] pointer-events-none"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <main className="max-w-6xl mx-auto px-6 py-16 text-center relative z-10">
        {/* Logo and Tagline */}
        <div className="mb-20">
          <div className="flex justify-center mb-12">
            <div className="relative group">
              <div className="absolute -inset-1 bg-primary/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              <img src="/OMNI-LOGO.ico" alt="OMNI" className="relative w-32 h-32 object-contain invert-on-light" />
            </div>
          </div>
          <h1 className="text-8xl md:text-9xl font-black mb-6 uppercase tracking-[-0.05em] leading-[0.8] animate-in fade-in slide-in-from-bottom duration-700">
            THE<br /><span className="text-primary omni-glow">FUTURE</span>
          </h1>
          <div className="flex flex-col items-center gap-4">
            <p className="text-[12px] font-black text-foreground/60 uppercase tracking-[0.8em] mb-4">
              University Commerce Redefined
            </p>
            <div className="h-[2px] w-24 bg-primary/30"></div>
          </div>
        </div>

        {/* Features Matrix */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 max-w-5xl mx-auto">
          {[
            {
              icon: "⚡",
              title: "Flash-Match",
              desc: "Hyper-local detection. Find assets in your immediate proximity."
            },
            {
              icon: "🛡️",
              title: "Shield Escrow",
              desc: "Immutable transaction security. Funds released only upon key validation."
            },
            {
              icon: "🏃",
              title: "Shadow Runner",
              desc: "Deploy as a high-speed logistics entity. Earn GH₵ on every transit."
            }
          ].map((f, i) => (
            <div key={i} className="bg-surface/50 backdrop-blur-3xl border border-surface-border rounded-[2.5rem] p-10 hover:bg-surface hover:border-primary/30 transition-all group group-hover:-translate-y-2">
              <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500">{f.icon}</div>
              <h3 className="text-xl font-black text-foreground mb-4 uppercase tracking-tighter">{f.title}</h3>
              <p className="text-foreground/60 text-xs font-bold uppercase tracking-widest leading-loose">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Action Center */}
        <div className="flex flex-col items-center gap-12">
          <SignedIn>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                href="/marketplace"
                className="px-12 py-6 bg-primary text-primary-foreground rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] transition-all omni-glow hover:scale-105 active:scale-95"
              >
                Initialize Acquisition
              </Link>
              <Link
                href="/dashboard/vendor"
                className="px-12 py-6 bg-surface border border-surface-border text-foreground rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] transition-all hover:bg-surface/80 active:scale-95"
              >
                Supply Terminal
              </Link>
            </div>
          </SignedIn>

          <SignedOut>
            <div className="p-8 bg-surface/50 border border-surface-border rounded-[2rem]">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Awaiting Uplink Initialization</p>
            </div>
          </SignedOut>

          {/* Network Stats */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-3 gap-12 border-t border-surface-border w-full max-w-4xl">
            <div>
              <div className="text-4xl font-black text-foreground tracking-tighter">~5M</div>
              <div className="text-[8px] font-black text-foreground/40 uppercase tracking-[0.4em] mt-1">Operational Speed</div>
            </div>
            <div>
              <div className="text-4xl font-black text-foreground tracking-tighter">100%</div>
              <div className="text-[8px] font-black text-foreground/40 uppercase tracking-[0.4em] mt-1">Escrow Efficiency</div>
            </div>
            <div className="hidden md:block">
              <div className="text-4xl font-black text-foreground tracking-tighter">24/7</div>
              <div className="text-[8px] font-black text-foreground/40 uppercase tracking-[0.4em] mt-1">Sector Coverage</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
