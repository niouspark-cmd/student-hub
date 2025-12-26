'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface EnhancedProductCardProps {
    product: {
        id: string;
        title: string;
        description: string;
        price: number;
        imageUrl: string | null;
        hotspot: string | null;
        vendor: {
            id: string;
            name: string | null;
            isAcceptingOrders: boolean;
        };
        // New fields (mock for now)
        rating?: number;
        reviewCount?: number;
        salesCount?: number;
        stockStatus?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
        isBestseller?: boolean;
        isTrending?: boolean;
        isNew?: boolean;
    };
    categorySlug: string;
    categoryIcon?: string;
    onQuickAdd?: (product: any) => void;
    onWishlist?: (product: any) => void;
    isGhostAdmin?: boolean;
}

export default function EnhancedProductCard({
    product,
    categorySlug,
    categoryIcon = '📦',
    onQuickAdd,
    onWishlist,
    isGhostAdmin = false
}: EnhancedProductCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);

    // Category theme
    const getCategoryColor = () => {
        switch (categorySlug) {
            case 'food-and-snacks': return '#FF4D00';
            case 'tech-and-gadgets': return '#0070FF';
            case 'fashion': return '#A333FF';
            case 'services': return '#FFD700';
            case 'books-and-notes': return '#2ECC71';
            default: return '#39FF14';
        }
    };

    const categoryColor = getCategoryColor();

    // Mock rating if not provided
    const rating = product.rating || (3.5 + Math.random() * 1.5);
    const reviewCount = product.reviewCount || Math.floor(Math.random() * 50);
    const salesCount = product.salesCount || Math.floor(Math.random() * 100);

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
        onWishlist?.(product);
    };

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isGhostAdmin) {
            alert('🛡️ ADMIN MODE ACTIVE\n\nBuying is disabled in Ghost Admin mode.');
            return;
        }
        onQuickAdd?.(product);
    };

    return (
        <Link
            href={`/products/${product.id}`}
            className="group relative bg-surface border border-surface-border/60 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
        >
            {/* Badges Container */}
            <div className="absolute top-2 left-2 right-2 z-20 flex items-start justify-between gap-2">
                {/* Left badges */}
                <div className="flex flex-col gap-1">
                    {product.isBestseller && (
                        <span className="px-2 py-1 bg-yellow-500 text-black text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                            ⭐ Bestseller
                        </span>
                    )}
                    {product.isTrending && (
                        <span className="px-2 py-1 bg-red-500 text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                            🔥 Trending
                        </span>
                    )}
                    {product.isNew && (
                        <span className="px-2 py-1 bg-green-500 text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                            ✨ New
                        </span>
                    )}
                </div>

                {/* Wishlist button */}
                <button
                    onClick={handleWishlist}
                    className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                    <span className={`text-lg ${isWishlisted ? 'text-red-500' : 'text-foreground/40'}`}>
                        {isWishlisted ? '❤️' : '🤍'}
                    </span>
                </button>
            </div>

            {/* Stock Status Badge */}
            {product.stockStatus === 'LOW_STOCK' && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
                    <span className="px-3 py-1 bg-orange-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        Low Stock
                    </span>
                </div>
            )}
            {product.stockStatus === 'OUT_OF_STOCK' && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
                    <span className="px-3 py-1 bg-red-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        Out of Stock
                    </span>
                </div>
            )}

            {/* Image Container */}
            <div className="aspect-square relative bg-background/50 overflow-hidden">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl md:text-5xl opacity-20">
                        {categoryIcon}
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Quick Add Button */}
                <button
                    onClick={handleQuickAdd}
                    className="absolute bottom-2 right-2 w-9 h-9 md:w-11 md:h-11 bg-[#39FF14] text-black rounded-full flex items-center justify-center shadow-lg hover:shadow-xl active:scale-90 transition-all md:translate-y-12 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 duration-300 z-30"
                    title="Quick Add to Cart"
                >
                    <span className="text-xl md:text-2xl font-black leading-none pb-0.5">+</span>
                </button>
            </div>

            {/* Content */}
            <div className="p-3 md:p-4 flex flex-col flex-1 gap-2 relative z-10">
                {/* Rating & Reviews */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`text-xs ${star <= Math.round(rating) ? 'text-yellow-500' : 'text-foreground/20'}`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <span className="text-[10px] font-bold text-foreground/60">
                        {rating.toFixed(1)} ({reviewCount})
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-sm md:text-base font-black text-foreground leading-tight line-clamp-2 min-h-[2.5em] uppercase tracking-tight">
                    {product.title}
                </h3>

                {/* Vendor Badge */}
                <div className="flex items-center gap-2">
                    <div className="text-[9px] md:text-[10px] text-foreground/40 font-bold uppercase tracking-wider truncate flex items-center gap-1">
                        <span className="text-green-500">✓</span>
                        {product.vendor.name || 'Verified Vendor'}
                    </div>
                    {product.vendor.isAcceptingOrders && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Online Now" />
                    )}
                </div>

                {/* Sales Count */}
                {salesCount > 10 && (
                    <div className="text-[9px] text-foreground/40 font-bold">
                        🔥 {salesCount} sold
                    </div>
                )}

                {/* Price Section */}
                <div className="mt-auto pt-3 flex items-end justify-between border-t border-surface-border">
                    <div className="flex items-end gap-2">
                        <div>
                            <div className="text-[9px] font-black uppercase tracking-wider mb-0.5" style={{ color: categoryColor }}>
                                Price
                            </div>
                            <div className="text-xl md:text-2xl font-black text-foreground leading-none tracking-tighter">
                                ₵{product.price.toFixed(2)}
                            </div>
                        </div>
                        {/* Shield Badge */}
                        <div className="text-2xl md:text-3xl relative mb-0.5" title="Shield Escrow Protected">
                            <span className="filter drop-shadow-[0_2px_4px_rgba(57,255,20,0.3)]">🛡️</span>
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#39FF14] rounded-full animate-pulse shadow-[0_0_8px_rgba(57,255,20,0.6)]" />
                        </div>
                    </div>
                </div>

                {/* Delivery Info */}
                {product.hotspot && (
                    <div className="mt-1 pt-2 border-t border-surface-border text-[9px] font-bold text-foreground/40 uppercase tracking-wider flex items-center gap-1">
                        <span>⚡ 15m to</span>
                        <span className="truncate max-w-[80px]">{product.hotspot}</span>
                    </div>
                )}
            </div>
        </Link>
    );
}
