'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { ZapIcon, ShoppingCartIcon } from "@/components/ui/Icons";
import ThemeToggle from '@/components/navigation/ThemeToggle';

export default function RunnerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-yellow-500 selection:text-black font-sans">
            {/* Runner Nav */}
            <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-white/10 h-16">
                <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                    <Link href="/runner" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                            <ZapIcon className="w-5 h-5 text-black" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-lg tracking-tight leading-none text-white">OMNI</span>
                            <span className="text-[10px] font-bold text-yellow-500 tracking-widest uppercase leading-none">Runner Ops</span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        <Link
                            href="/marketplace"
                            className="hidden md:flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white transition-colors"
                        >
                            <ShoppingCartIcon className="w-4 h-4" />
                            <span>Marketplace</span>
                        </Link>

                        <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>

                        <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 ring-2 ring-yellow-500/50" } }} />
                    </div>
                </div>
            </nav>
            <main className="pt-20 px-4 pb-20 max-w-7xl mx-auto">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Bar for Runners */}
            <div className="md:hidden fixed bottom-0 w-full bg-black/90 backdrop-blur-xl border-t border-white/10 pb-safe z-50">
                <div className="flex justify-around items-center h-16">
                    <Link href="/runner" className="flex flex-col items-center justify-center gap-1 text-yellow-500">
                        <ZapIcon className="w-5 h-5" />
                        <span className="text-[9px] font-black uppercase tracking-wider">Missions</span>
                    </Link>
                    <Link href="/marketplace" className="flex flex-col items-center justify-center gap-1 text-white/40">
                        <ShoppingCartIcon className="w-5 h-5" />
                        <span className="text-[9px] font-black uppercase tracking-wider">Shop</span>
                    </Link>
                </div>
            </div>

        </div>
    )
}
