'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface Category {
    id: string;
    name: string;
    icon: string;
    gradient: string;
    count?: number;
    trending?: boolean;
}

const categories: Category[] = [
    {
        id: 'food',
        name: 'Food & Snacks',
        icon: '🍕',
        gradient: 'from-orange-500 to-red-500',
        count: 142,
        trending: true
    },
    {
        id: 'tech',
        name: 'Tech & Gadgets',
        icon: '💻',
        gradient: 'from-blue-500 to-purple-500',
        count: 89
    },
    {
        id: 'books',
        name: 'Books & Notes',
        icon: '📚',
        gradient: 'from-green-500 to-teal-500',
        count: 234
    },
    {
        id: 'fashion',
        name: 'Fashion',
        icon: '👕',
        gradient: 'from-pink-500 to-purple-500',
        count: 67
    },
    {
        id: 'services',
        name: 'Services',
        icon: '⚡',
        gradient: 'from-yellow-500 to-orange-500',
        count: 45
    },
    {
        id: 'misc',
        name: 'Everything Else',
        icon: '🎯',
        gradient: 'from-indigo-500 to-blue-500',
        count: 128
    }
];

export default function BentoCategories() {
    return (
        <div className="mb-12">
            {/* Section Header */}
            <div className="mb-6">
                <h2 className="text-3xl font-black text-foreground uppercase tracking-tighter mb-2">
                    Explore Categories
                </h2>
                <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest">
                    Discover what's available on campus
                </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                {categories.map((category, index) => (
                    <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Link
                            href={`/marketplace?category=${category.id}`}
                            className="group block"
                        >
                            <div className="bento-card p-6 h-full flex flex-col items-center justify-center text-center relative">
                                {/* Trending Badge */}
                                {category.trending && (
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-[8px] font-black uppercase tracking-wider rounded-full animate-pulse">
                                        🔥 Hot
                                    </div>
                                )}

                                {/* Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-[var(--bento-radius)]`}></div>

                                {/* Icon */}
                                <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-300 animate-float">
                                    {category.icon}
                                </div>

                                {/* Category Name */}
                                <h3 className="text-sm font-black text-foreground uppercase tracking-tight mb-1 relative z-10">
                                    {category.name}
                                </h3>

                                {/* Item Count */}
                                {category.count !== undefined && (
                                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest relative z-10">
                                        {category.count} Items
                                    </p>
                                )}
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
