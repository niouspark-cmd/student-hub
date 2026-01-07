'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

const categoryConfig = [
    { id: 'food', slug: 'food-and-snacks', name: 'Food', icon: '🍕', bg: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
    { id: 'tech', slug: 'tech-and-gadgets', name: 'Tech', icon: '💻', bg: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    { id: 'books', slug: 'books-and-notes', name: 'Books', icon: '📚', bg: 'bg-green-500/10 text-green-500 border-green-500/20' },
    { id: 'fashion', slug: 'fashion', name: 'Fashion', icon: '👕', bg: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
    { id: 'services', slug: 'services', name: 'Services', icon: '⚡', bg: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
    { id: 'misc', slug: 'everything-else', name: 'Misc', icon: '🎯', bg: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' }
];

export default function HorizontalHubs() {
    return (
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-y border-surface-border py-4 mb-8 -mx-4 px-4">
            <div
                className="flex gap-3 overflow-x-auto pb-1 snap-x scrollbar-hide"
                style={{ WebkitOverflowScrolling: 'touch' }}
            >
                {categoryConfig.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className={`flex-shrink-0 snap-start flex items-center gap-2 px-4 py-2.5 rounded-xl border ${cat.bg} hover:brightness-110 active:scale-95 transition-all`}
                    >
                        <span className="text-lg">{cat.icon}</span>
                        <span className="text-xs font-black uppercase tracking-wider">{cat.name}</span>
                    </Link>
                ))}
            </div>
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
