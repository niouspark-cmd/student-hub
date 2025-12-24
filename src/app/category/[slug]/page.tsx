
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string | null;
    hotspot: string | null;
    details: any;
    vendor: {
        id: string;
        name: string | null;
        isActive: boolean;
        currentHotspot: string | null;
    };
}

interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    description: string | null;
    products: Product[];
}

export default function CategoryHubPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategory();
    }, [slug]);

    const fetchCategory = async () => {
        try {
            const res = await fetch(`/api/categories/${slug}`);
            const data = await res.json();
            if (data.success) {
                setCategory(data.category);
            }
        } catch (error) {
            console.error('Failed to fetch category hub:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <h1 className="text-4xl font-black text-foreground mb-4">404</h1>
                <p className="text-foreground/40 text-xs font-black uppercase tracking-widest">Hub Not Found</p>
                <Link href="/marketplace" className="mt-8 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-black text-xs uppercase tracking-widest omni-glow">
                    Return to HQ
                </Link>
            </div>
        );
    }

    // THEME & VIBE LOGIC
    const getHeaderGradient = () => {
        switch (slug) {
            case 'food-and-snacks': return 'from-orange-500/20 to-red-500/20 text-orange-500';
            case 'tech-and-gadgets': return 'from-blue-500/20 to-cyan-500/20 text-cyan-500';
            case 'fashion': return 'from-pink-500/20 to-purple-500/20 text-pink-500';
            case 'books-and-notes': return 'from-amber-500/20 to-yellow-500/20 text-amber-500';
            default: return 'from-primary/20 to-primary/5 text-primary';
        }
    };

    const gradientClass = getHeaderGradient();

    return (
        <div className="min-h-screen bg-background transition-colors duration-300 pb-24">
            {/* HUB HEADER */}
            <div className={`relative pt-32 pb-16 px-4 overflow-hidden border-b border-surface-border bg-gradient-to-b ${gradientClass.split(' ')[0]}`}>
                <div className="max-w-7xl mx-auto relative z-10">
                    <Link href="/marketplace" className="inline-flex items-center gap-2 text-foreground/40 hover:text-foreground mb-8 transition-colors font-black text-[10px] uppercase tracking-[0.2em]">
                        <span>←</span> Back to All Categories
                    </Link>

                    <div className="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-12">
                        <div className="w-32 h-32 bg-surface backdrop-blur-xl rounded-[2rem] flex items-center justify-center text-6xl shadow-2xl border border-white/10 animate-in zoom-in duration-500">
                            {category.icon}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-4 uppercase tracking-tighter leading-none">
                                {category.name}
                            </h1>
                            <p className="text-lg md:text-xl font-bold opacity-60 max-w-2xl leading-relaxed uppercase tracking-wide">
                                {category.description}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-black text-foreground leading-none">{category.products.length}</div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Active Listings</div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            </div>

            {/* PRODUCT GRID - DYNAMIC UI */}
            <div className="max-w-7xl mx-auto px-4 py-12">

                {/* Specific features based on category */}
                {slug === 'food-and-snacks' && (
                    <div className="mb-12 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        <div className="flex-none px-6 py-3 bg-red-500 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-red-500/20">
                            <span>🔥</span> Hot Right Now
                        </div>
                        <div className="flex-none px-6 py-3 bg-surface border border-surface-border text-foreground rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
                            <span>⚡</span> Ready in 15 mins
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {category.products.map((product) => (
                        <Link href={`/products/${product.id}`} key={product.id} className="group">
                            <div className="bg-surface border border-surface-border rounded-[2.5rem] overflow-hidden hover:border-primary/50 transition-all h-full flex flex-col shadow-lg hover:shadow-2xl hover:-translate-y-1 duration-300">
                                {/* Image Area */}
                                <div className="h-64 relative bg-black/5">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={product.title} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl">{category.icon}</div>
                                    )}

                                    {/* Overlay Tags */}
                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                        {product.hotspot && (
                                            <div className="px-3 py-1.5 bg-background/80 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10">
                                                📍 {product.hotspot}
                                            </div>
                                        )}
                                        {slug === 'tech-and-gadgets' && (
                                            <div className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                                                🛡️ Escrow Verified
                                            </div>
                                        )}
                                        {slug === 'food-and-snacks' && product.details?.spicyLevel === 'Fire' && (
                                            <div className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                🌶️ SPICY
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-xl font-black text-foreground mb-2 uppercase tracking-tight line-clamp-1">{product.title}</h3>
                                    <p className="text-foreground/40 text-xs font-bold mb-6 line-clamp-2 uppercase tracking-wide">{product.description}</p>

                                    {/* Dynamic Specifications */}
                                    <div className="mt-auto space-y-4">
                                        {slug === 'tech-and-gadgets' && product.details?.condition && (
                                            <div className="flex justify-between items-center py-2 border-t border-surface-border">
                                                <span className="text-[10px] uppercase font-bold text-foreground/40">Condition</span>
                                                <span className="text-xs font-black uppercase">{product.details.condition}</span>
                                            </div>
                                        )}

                                        {slug === 'food-and-snacks' && product.details?.prepTime && (
                                            <div className="flex justify-between items-center py-2 border-t border-surface-border">
                                                <span className="text-[10px] uppercase font-bold text-foreground/40">Prep Time</span>
                                                <span className="text-xs font-black uppercase text-orange-500">{product.details.prepTime}</span>
                                            </div>
                                        )}

                                        {slug === 'books-and-notes' && product.details?.courseCode && (
                                            <div className="flex justify-between items-center py-2 border-t border-surface-border">
                                                <span className="text-[10px] uppercase font-bold text-foreground/40">Course</span>
                                                <span className="text-xs font-black uppercase bg-foreground/5 px-2 py-1 rounded">{product.details.courseCode}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-4 border-t border-surface-border">
                                            <div className="text-2xl font-black text-foreground">₵{product.price.toFixed(2)}</div>
                                            <div className="px-4 py-2 bg-foreground text-background rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                Buy Now
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {category.products.length === 0 && (
                    <div className="text-center py-24 opacity-40">
                        <div className="text-6xl mb-4">🕸️</div>
                        <p className="font-black uppercase tracking-widest text-sm">No inventory in this sector yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
