
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Story {
    id: string;
    videoUrl: string;
    thumbnail: string | null;
    vendor: {
        shopName: string | null;
        name: string | null;
    };
}

export default function StoriesFeed() {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const res = await fetch('/api/stories');
            const data = await res.json();
            if (data.success) {
                setStories(data.stories);
            }
        } catch (error) {
            console.error('Failed to fetch stories:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || stories.length === 0) return null;

    return (
        <div className="mb-12 overflow-hidden">
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-6 pl-4 border-l-2 border-primary/30">
                Campus Pulse • Live Stories
            </h2>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
                {stories.map((story) => (
                    <motion.div
                        key={story.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-shrink-0 w-32 h-56 rounded-[1.5rem] bg-surface border border-surface-border relative overflow-hidden group cursor-pointer"
                    >
                        {story.thumbnail ? (
                            <img src={story.thumbnail} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-surface flex items-center justify-center text-2xl">
                                🎬
                            </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>

                        <div className="absolute bottom-3 left-3 right-3">
                            <p className="text-[8px] font-black text-white uppercase tracking-tight leading-none mb-1 line-clamp-1">
                                {story.vendor.shopName || story.vendor.name || 'Vendor'}
                            </p>
                            <div className="w-4 h-1 bg-primary rounded-full"></div>
                        </div>

                        {/* TikTok-style indicator */}
                        <div className="absolute top-3 right-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
