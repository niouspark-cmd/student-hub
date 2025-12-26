'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface CategoryHeroProps {
    categoryName: string;
    categorySlug: string;
    categoryIcon: string;
    description?: string;
    stats?: {
        productCount: number;
        vendorCount: number;
        avgDeliveryTime?: string;
    };
    quickFilters?: string[];
    onQuickFilterClick?: (filter: string) => void;
}

export default function CategoryHero({
    categoryName,
    categorySlug,
    categoryIcon,
    description,
    stats,
    quickFilters = [],
    onQuickFilterClick
}: CategoryHeroProps) {

    // Category-specific themes
    const getCategoryTheme = () => {
        switch (categorySlug) {
            case 'food-and-snacks':
                return {
                    gradient: 'from-orange-500/20 via-red-500/10 to-background',
                    accentColor: '#FF4D00',
                    textColor: 'text-orange-500',
                    borderColor: 'border-orange-500/30',
                    bgColor: 'bg-orange-500/10',
                    headline: 'Satisfy Your Cravings',
                    subheadline: 'Fresh food delivered to your doorstep in 15 minutes. From breakfast to late-night snacks.'
                };
            case 'tech-and-gadgets':
                return {
                    gradient: 'from-blue-500/20 via-cyan-500/10 to-background',
                    accentColor: '#0070FF',
                    textColor: 'text-blue-500',
                    borderColor: 'border-blue-500/30',
                    bgColor: 'bg-blue-500/10',
                    headline: 'Tech Essentials',
                    subheadline: 'Quality gadgets at student-friendly prices. New, used, and certified pre-owned.'
                };
            case 'fashion':
                return {
                    gradient: 'from-purple-500/20 via-pink-500/10 to-background',
                    accentColor: '#A333FF',
                    textColor: 'text-purple-500',
                    borderColor: 'border-purple-500/30',
                    bgColor: 'bg-purple-500/10',
                    headline: 'Express Your Style',
                    subheadline: 'Trending fashion from student vendors. Unique styles, affordable prices.'
                };
            case 'services':
                return {
                    gradient: 'from-yellow-500/20 via-orange-500/10 to-background',
                    accentColor: '#FFD700',
                    textColor: 'text-yellow-500',
                    borderColor: 'border-yellow-500/30',
                    bgColor: 'bg-yellow-500/10',
                    headline: 'Get Things Done',
                    subheadline: 'Trusted student services on demand. Cleaning, tutoring, delivery, and more.'
                };
            case 'books-and-notes':
                return {
                    gradient: 'from-green-500/20 via-emerald-500/10 to-background',
                    accentColor: '#2ECC71',
                    textColor: 'text-green-500',
                    borderColor: 'border-green-500/30',
                    bgColor: 'bg-green-500/10',
                    headline: 'Academic Excellence',
                    subheadline: 'Textbooks, notes, and study materials from fellow students.'
                };
            default:
                return {
                    gradient: 'from-primary/20 via-primary/10 to-background',
                    accentColor: '#39FF14',
                    textColor: 'text-primary',
                    borderColor: 'border-primary/30',
                    bgColor: 'bg-primary/10',
                    headline: 'Discover More',
                    subheadline: 'Everything you need for campus life, all in one place.'
                };
        }
    };

    const theme = getCategoryTheme();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`relative overflow-hidden rounded-[2.5rem] mb-8 bg-gradient-to-br ${theme.gradient} border border-surface-border`}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, ${theme.accentColor} 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="relative z-10 p-6 md:p-10">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-6 text-xs font-bold uppercase tracking-widest">
                    <Link href="/marketplace" className="text-foreground/40 hover:text-primary transition-colors">
                        Market
                    </Link>
                    <span className="text-foreground/20">/</span>
                    <span className={theme.textColor}>{categoryName}</span>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Left: Content */}
                    <div>
                        {/* Category Icon */}
                        <div className="text-6xl md:text-7xl mb-4 filter drop-shadow-lg">
                            {categoryIcon}
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-3 leading-none">
                            {theme.headline}
                        </h1>

                        {/* Subheadline */}
                        <p className="text-sm md:text-base font-bold text-foreground/60 mb-6 max-w-md">
                            {theme.subheadline}
                        </p>

                        {/* Quick Filter Pills */}
                        {quickFilters.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {quickFilters.map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => onQuickFilterClick?.(filter)}
                                        className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border-2 ${theme.borderColor} ${theme.bgColor} hover:bg-opacity-20 transition-all hover:scale-105 active:scale-95`}
                                        style={{ borderColor: theme.accentColor + '50' }}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Stats */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {/* Product Count */}
                            <div className={`${theme.bgColor} border ${theme.borderColor} rounded-2xl p-4 text-center`}>
                                <div className="text-3xl md:text-4xl font-black mb-1" style={{ color: theme.accentColor }}>
                                    {stats.productCount}
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
                                    Products
                                </div>
                            </div>

                            {/* Vendor Count */}
                            <div className={`${theme.bgColor} border ${theme.borderColor} rounded-2xl p-4 text-center`}>
                                <div className="text-3xl md:text-4xl font-black mb-1" style={{ color: theme.accentColor }}>
                                    {stats.vendorCount}
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
                                    Vendors
                                </div>
                            </div>

                            {/* Delivery Time */}
                            {stats.avgDeliveryTime && (
                                <div className={`${theme.bgColor} border ${theme.borderColor} rounded-2xl p-4 text-center col-span-2 md:col-span-1`}>
                                    <div className="text-3xl md:text-4xl font-black mb-1" style={{ color: theme.accentColor }}>
                                        {stats.avgDeliveryTime}
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
                                        Avg Delivery
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 pt-6 border-t border-surface-border/50 flex flex-wrap gap-4 text-xs font-bold text-foreground/60">
                    <div className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Shield Escrow Protected
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Verified Student Vendors
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        15-Min Campus Delivery
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
