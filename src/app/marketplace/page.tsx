'use client';

import { useState, useEffect, Suspense } from 'react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import StoriesFeed from '@/components/marketplace/StoriesFeed';
import { motion } from 'framer-motion';

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
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [visibleCount, setVisibleCount] = useState(6);
    const [hasMore, setHasMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedHotspot, setSelectedHotspot] = useState('');

    useEffect(() => {
        checkSystemStatus();
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

    const hotspots = [
        'Balme Library',
        'Night Market',
        'Pent Hostel',
        'Bush Canteen',
        'Great Hall',
        'Casford',
        'Lecture Hall',
        'Cafeteria',
    ];

    useEffect(() => {
        fetchProducts();
    }, [searchQuery, selectedHotspot]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('q', searchQuery);
            if (selectedHotspot) params.append('hotspot', selectedHotspot);
            params.append('take', '100');

            const response = await fetch(`/api/search/flash-match?${params}`);
            const data = await response.json();

            if (data.success) {
                setProducts(data.results);
                setHasMore(data.results.length > visibleCount);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOrder = (productId: string) => {
        window.location.href = `/checkout/${productId}`;
    };

    return (
        <div className="min-h-screen bg-background transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-12 relative">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

                    <h1 className="text-6xl font-black text-foreground mb-2 uppercase tracking-tighter">
                        OMNI MARKET
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="h-[2px] w-12 bg-primary"></div>
                        <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                            Operational Protocol: Flash-Match Ready
                        </p>
                    </div>
                </div>

                {maintenanceMode ? (
                    <div className="bg-red-500/10 border-2 border-red-500/20 rounded-[3rem] p-24 text-center relative overflow-hidden animate-in fade-in zoom-in duration-500">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>
                        <div className="text-8xl mb-8">🚧</div>
                        <h2 className="text-5xl font-black text-red-500 uppercase tracking-tighter mb-4">SECTOR LOCKDOWN</h2>
                        <p className="text-foreground/40 font-black uppercase tracking-widest text-xs max-w-lg mx-auto leading-loose">
                            Global variables are being manipulated. All marketplace activities are suspended for system-wide maintenance. Please await uplink restoration.
                        </p>
                    </div>
                ) : (
                    <>
                        <SignedOut>
                            <div className="bg-surface border border-surface-border rounded-[2.5rem] p-12 text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                                <h2 className="text-3xl font-black text-foreground mb-6 uppercase tracking-tight relative z-10">
                                    Authentication Required for Marketplace Access
                                </h2>
                                <SignInButton mode="modal">
                                    <button className="relative z-10 px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all omni-glow active:scale-95">
                                        Initialize Session
                                    </button>
                                </SignInButton>
                            </div>
                        </SignedOut>

                        <SignedIn>
                            {/* Campus Pulse Stories */}
                            <StoriesFeed />
                            {/* ... existing code ... */}

                            {/* Search & Filters */}
                            <div className="mb-12 space-y-4">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative group">
                                        <input
                                            type="text"
                                            placeholder="SEARCH OMNI ECOSYSTEM..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-12 pr-6 py-5 bg-surface border-2 border-surface-border rounded-2xl text-foreground placeholder-foreground/20 font-bold text-sm tracking-wider focus:border-primary outline-none transition-all"
                                        />
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-20 group-focus-within:opacity-100 transition-opacity">🔍</span>
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={selectedHotspot}
                                            onChange={(e) => setSelectedHotspot(e.target.value)}
                                            className="appearance-none w-full md:w-64 pl-12 pr-10 py-5 bg-surface border-2 border-surface-border rounded-2xl text-foreground font-bold text-sm tracking-wider focus:border-primary outline-none transition-all cursor-pointer"
                                        >
                                            <option value="">ALL HOTSPOTS</option>
                                            {hotspots.map((hotspot) => (
                                                <option key={hotspot} value={hotspot}>
                                                    {hotspot.toUpperCase()}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-20">📍</span>
                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] opacity-20">▼</span>
                                    </div>
                                </div>
                            </div>

                            {/* Products Grid */}
                            {loading ? (
                                <div className="text-center py-24">
                                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent omni-glow"></div>
                                    <p className="mt-6 text-primary font-black uppercase tracking-[0.4em] text-[10px]">Syncing Feed...</p>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-24 bg-surface rounded-[3rem] border border-dashed border-surface-border">
                                    <div className="text-6xl mb-6 opacity-20">📡</div>
                                    <p className="text-foreground/20 font-black uppercase tracking-widest">
                                        No mission-critical items detected in this sector
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-16 pb-24">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {products.slice(0, visibleCount).map((product, index) => (
                                            <motion.div
                                                key={product.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="bg-surface border border-surface-border rounded-[2.5rem] overflow-hidden hover:border-primary/30 transition-all group relative"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                                {/* Product Image */}
                                                <div className="h-64 bg-background/50 relative overflow-hidden">
                                                    {product.imageUrl ? (
                                                        <img
                                                            src={product.imageUrl}
                                                            alt={product.title}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-surface to-background flex items-center justify-center text-6xl">📦</div>
                                                    )}

                                                    {/* Flash Match Badge */}
                                                    <div className="absolute top-4 right-4 px-3 py-1 bg-background/80 backdrop-blur-md rounded-full border border-primary/20 flex items-center gap-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${product.vendor.isActive ? 'bg-primary animate-pulse' : 'bg-foreground/20'}`}></div>
                                                        <span className="text-[8px] font-black text-foreground uppercase tracking-widest">{product.vendor.isActive ? 'Active' : 'Offline'}</span>
                                                    </div>
                                                </div>

                                                {/* Product Info */}
                                                <div className="p-8 relative">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter leading-none">
                                                            {product.title}
                                                        </h3>
                                                    </div>

                                                    <p className="text-foreground/40 text-xs font-bold mb-6 line-clamp-2 uppercase tracking-wide">
                                                        {product.description}
                                                    </p>

                                                    <div className="flex items-center gap-3 mb-8">
                                                        <div className="px-3 py-1 bg-foreground/5 rounded-full text-[8px] font-black text-primary uppercase tracking-widest border border-primary/10">
                                                            📍 {product.hotspot || 'HQ'}
                                                        </div>
                                                        <div className="px-3 py-1 bg-foreground/5 rounded-full text-[8px] font-black text-foreground/40 uppercase tracking-widest border border-foreground/10">
                                                            👤 {product.vendor.name || 'ANON'}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-6 border-t border-surface-border">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Price</span>
                                                            <span className="text-3xl font-black text-foreground tracking-tighter leading-none">
                                                                ₵{product.price.toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleOrder(product.id)}
                                                            className="px-8 py-4 bg-foreground text-background hover:bg-primary hover:text-primary-foreground rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl hover:shadow-primary/20"
                                                        >
                                                            Acquire
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {products.length > visibleCount && (
                                        <div className="text-center">
                                            <button
                                                onClick={() => setVisibleCount(prev => prev + 6)}
                                                className="px-12 py-5 bg-surface border border-surface-border rounded-[2rem] text-foreground/40 font-black text-xs uppercase tracking-[0.4em] hover:bg-surface/80 hover:text-foreground transition-all active:scale-95 omni-glow-hover"
                                            >
                                                Load More Ops
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </SignedIn>
                    </>
                )}
            </div>
        </div>
    );
}
