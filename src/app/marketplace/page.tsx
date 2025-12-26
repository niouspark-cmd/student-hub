'use client';

import { useState, useEffect, Suspense } from 'react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import StoriesFeed from '@/components/marketplace/StoriesFeed';
import NewReleases from '@/components/marketplace/NewReleases';
import BentoCategories from '@/components/marketplace/BentoCategories';
import MaintenanceGuard from '@/components/admin/MaintenanceGuard';
import { motion } from 'framer-motion';
import Link from 'next/link';
import EditableContent from '@/components/admin/EditableContent';

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string | null;
    hotspot: string | null;
    vendor: {
        id: string;
        name: string | null;
        isActive: boolean;
        currentHotspot: string | null;
    };
}

export default function MarketplacePage() {
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [isGhostAdmin, setIsGhostAdmin] = useState(false);

    useEffect(() => {
        checkSystemStatus();
        const ghost = localStorage.getItem('OMNI_GOD_MODE_UNLOCKED') === 'true';
        if (ghost) setIsGhostAdmin(true);
    }, []);

    const checkSystemStatus = async () => {
        try {
            const res = await fetch('/api/system/config');
            const data = await res.json();
            if (data.success && data.maintenanceMode) {
                setMaintenanceMode(true);
            }
        } catch (error) {
            console.error('System status check failed');
        }
    };

    return (
        <MaintenanceGuard protocol="MARKET">
            <div className="min-h-screen bg-background transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 pt-40 pb-8">
                    {/* Subtle Breadcrumb Navigation */}
                    <div className="mb-8">
                        <h1 className="text-sm font-bold tracking-widest text-foreground/30 uppercase mb-8">
                            OMNI ECOSYSTEM <span className="text-primary">/</span> MARKET
                        </h1>
                    </div>

                    {maintenanceMode ? (
                        <div className="bg-red-500/10 border-2 border-red-500/20 rounded-[3rem] p-24 text-center relative overflow-hidden animate-in fade-in zoom-in duration-500">
                            <div className="relative z-10">
                                <h2 className="text-5xl font-black text-red-500 uppercase tracking-tighter mb-6">SYSTEM LOCKDOWN ACTIVE</h2>
                                <p className="text-xl font-bold text-red-400 mb-8 max-w-2xl mx-auto">
                                    THE MARKETPLACE IS CURRENTLY OFFLINE FOR SCHEDULED MAINTENANCE AND UPGRADES.
                                    ALL TRADING HAS BEEN HALTED.
                                </p>
                                <div className="inline-block px-6 py-2 bg-red-500 text-white font-black rounded-lg animate-pulse">
                                    STATUS: CRITICAL UPDATES IN PROGRESS
                                </div>
                            </div>
                            {/* Background decoration */}
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500 via-transparent to-transparent"></div>
                        </div>
                    ) : (
                        <>
                            <SignedOut>
                                {!isGhostAdmin && (
                                    <div className="bg-surface border border-surface-border rounded-[2.5rem] p-12 text-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                                        <h2 className="text-3xl font-black text-foreground mb-6 uppercase tracking-tight relative z-10">
                                            Authentication Required for Marketplace Access
                                        </h2>
                                        <p className="text-foreground/60 mb-8 max-w-md mx-auto relative z-10">
                                            Please sign in with your student credentials to view the full marketplace, access live drops, and start trading.
                                        </p>
                                        <div className="relative z-10">
                                            <SignInButton mode="modal">
                                                <button className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-black uppercase tracking-wider hover:scale-105 transition-transform shadow-[0_0_20px_rgba(57,255,20,0.3)]">
                                                    Access Student Hub
                                                </button>
                                            </SignInButton>
                                        </div>
                                    </div>
                                )}
                            </SignedOut>

                            <SignedIn>
                                {/* Stories Feed Section - Now at the top */}
                                <div className="mb-20">
                                    <StoriesFeed />
                                </div>

                                {/* Main Hero Section - New Releases */}
                                <div className="mb-24">
                                    <div className="flex items-end justify-between mb-8">
                                        <div>
                                            <h2 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tighter mb-2">
                                                New Releases
                                            </h2>
                                            <p className="text-foreground/40 font-bold tracking-widest uppercase text-sm">
                                                Fresh Drops From Campus Vendors
                                            </p>
                                        </div>
                                    </div>
                                    <Suspense fallback={<div className="h-96 bg-surface/50 rounded-3xl animate-pulse" />}>
                                        <NewReleases />
                                    </Suspense>
                                </div>

                                {/* Categories Grid */}
                                <div className="mb-12">
                                    <div className="flex items-end justify-between mb-8">
                                        <div>
                                            <h2 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tighter mb-2">
                                                Explore
                                            </h2>
                                            <p className="text-foreground/40 font-bold tracking-widest uppercase text-sm">
                                                Browse by Category
                                            </p>
                                        </div>
                                    </div>
                                    <BentoCategories />
                                </div>
                            </SignedIn>

                            {/* Allow Ghost Admin to see content even when signed out */}
                            <SignedOut>
                                {isGhostAdmin && (
                                    <>
                                        <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-xl text-yellow-500 font-bold text-center">
                                            👻 GHOST ADMIN MODE ACTIVE - VIEWING AS AUTHENTICATED USER
                                        </div>
                                        {/* Stories Feed Section */}
                                        <div className="mb-20">
                                            <StoriesFeed />
                                        </div>

                                        {/* Main Hero Section - New Releases */}
                                        <div className="mb-24">
                                            <div className="flex items-end justify-between mb-8">
                                                <div>
                                                    <EditableContent
                                                        id="market_hero_title"
                                                        initialContent="New Releases"
                                                        tag="h2"
                                                        className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tighter mb-2"
                                                    />
                                                    <EditableContent
                                                        id="market_hero_subtitle"
                                                        initialContent="Fresh Drops From Campus Vendors"
                                                        tag="p"
                                                        className="text-foreground/40 font-bold tracking-widest uppercase text-sm"
                                                    />
                                                </div>
                                                <Link
                                                    href="/search?q=&categoryId=all"
                                                    className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors flex items-center gap-2 mb-2"
                                                >
                                                    View All Drops <span className="text-sm">→</span>
                                                </Link>
                                            </div>
                                            <Suspense fallback={<div className="h-96 bg-surface/50 rounded-3xl animate-pulse" />}>
                                                <NewReleases />
                                            </Suspense>
                                        </div>

                                        {/* Categories Grid */}
                                        <div className="mb-12">
                                            <div className="flex items-end justify-between mb-8">
                                                <div>
                                                    <h2 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tighter mb-2">
                                                        Explore
                                                    </h2>
                                                    <p className="text-foreground/40 font-bold tracking-widest uppercase text-sm">
                                                        Browse by Category
                                                    </p>
                                                </div>
                                            </div>
                                            <BentoCategories />
                                        </div>
                                    </>
                                )}
                            </SignedOut>
                        </>
                    )}
                </div>
            </div>
        </MaintenanceGuard>
    );
}
