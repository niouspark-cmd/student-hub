'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface FeedProduct {
    id: string;
    title: string;
    price: number;
    imageUrl: string | null;
    vendor: {
        id: string;
        name: string | null;
        shopName: string | null;
    };
    category: {
        name: string;
    }
}

interface DiscoveryFeedData {
    newArrivals: FeedProduct[];
    trending: FeedProduct[];
    recommended: FeedProduct[];
}

export default function SmartFeed() {
    const [feed, setFeed] = useState<DiscoveryFeedData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const res = await fetch('/api/marketplace/discovery');
                const data = await res.json();
                if (data.success) {
                    setFeed(data.feed);
                }
            } catch (e) {
                console.error("Feed Error", e);
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, []);

    if (loading) return (
        <div className="space-y-8 animate-pulse">
            <div className="h-64 bg-surface/50 rounded-3xl"></div>
            <div className="grid grid-cols-2 gap-4">
                <div className="h-48 bg-surface/50 rounded-2xl"></div>
                <div className="h-48 bg-surface/50 rounded-2xl"></div>
            </div>
        </div>
    );

    if (!feed) return null;

    return (
        <div className="space-y-12 pb-24">

            {/* Section 1: Recommended For You (Horizontal) */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Just For You</h2>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Personalized</span>
                </div>
                <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                    <div className="flex gap-4">
                        {feed.recommended.map((item, i) => (
                            <ProductCard key={item.id} product={item} index={i} compact />
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 2: Trending Now (Horizontal) */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Trending @ Campus</h2>
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest animate-pulse">🔥 Live</span>
                </div>
                <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                    <div className="flex gap-4">
                        {feed.trending.map((item, i) => (
                            <ProductCard key={item.id} product={item} index={i} compact />
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3: New Arrivals (Vertical Infinite Feed) */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">Fresh Drops</h2>
                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Realtime</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {feed.newArrivals.map((item, i) => (
                        <ProductCard key={item.id} product={item} index={i} />
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest">End of Feed</p>
                </div>
            </section>
        </div>
    );
}

function ProductCard({ product, index, compact = false }: { product: FeedProduct, index: number, compact?: boolean }) {
    return (
        <Link href={`/products/${product.id}`} className={`block group ${compact ? 'min-w-[160px] w-[160px]' : 'w-full'}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-surface border border-surface-border rounded-2xl overflow-hidden group-hover:border-primary/50 transition-all shadow-sm"
            >
                <div className={`${compact ? 'h-32' : 'h-40 md:h-56'} bg-background relative overflow-hidden`}>
                    {product.imageUrl ? (
                        <img src={product.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                    )}
                    {/* Price Tag */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-md rounded-lg text-xs font-black text-foreground">
                        ₵{product.price.toFixed(2)}
                    </div>
                </div>
                <div className="p-3">
                    <h3 className="text-xs font-black uppercase truncate text-foreground mb-1">{product.title}</h3>
                    <p className="text-[10px] text-foreground/50 font-bold uppercase truncate">{product.vendor.shopName || product.vendor.name}</p>
                </div>
            </motion.div>
        </Link>
    );
}
