'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface Story {
    id: string;
    videoUrl: string;
    title?: string;
    views: number;
    likes: number;
    createdAt: string;
}

export default function MyPulsePage() {
    const { user } = useUser();
    const [myStories, setMyStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalViews: 0,
        totalLikes: 0,
        totalStories: 0,
    });
    const [visibleCount, setVisibleCount] = useState(8);

    useEffect(() => {
        fetchMyStories();
    }, []);

    const fetchMyStories = async () => {
        try {
            const res = await fetch('/api/stories/my-stories');
            if (res.ok) {
                const data = await res.json();
                setMyStories(data.stories || []);

                // Calculate stats
                const totalViews = data.stories.reduce((sum: number, s: Story) => sum + s.views, 0);
                const totalLikes = data.stories.reduce((sum: number, s: Story) => sum + s.likes, 0);
                setStats({
                    totalViews,
                    totalLikes,
                    totalStories: data.stories.length,
                });
            }
        } catch (error) {
            console.error('Failed to fetch stories:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="h-12 w-12 border-4 border-[#39FF14]/20 border-t-[#39FF14] rounded-full animate-spin omni-glow"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background transition-colors duration-300 pt-32 pb-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-5xl font-black text-foreground uppercase tracking-tighter mb-2">
                        My Pulse
                    </h1>
                    <p className="text-foreground/40 text-sm font-bold uppercase tracking-widest">
                        Your Campus Stories & Analytics
                    </p>
                </div>

                {/* Create Story CTA */}
                <Link
                    href="/stories/new"
                    className="block mb-12 p-8 bg-gradient-to-r from-[#39FF14] to-[#2ecc71] rounded-[2rem] hover:scale-[1.02] active:scale-95 transition-all omni-glow-strong group"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-black text-black uppercase tracking-tight mb-2">
                                Create New Story
                            </h2>
                            <p className="text-black/70 font-bold text-sm">
                                Share what's happening on campus right now
                            </p>
                        </div>
                        <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center text-4xl group-hover:rotate-90 transition-transform">
                            ➕
                        </div>
                    </div>
                </Link>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass-strong rounded-[2rem] p-6 border-2 border-surface-border/50">
                        <div className="text-foreground/40 text-[10px] font-black uppercase tracking-widest mb-2">
                            Total Stories
                        </div>
                        <div className="text-4xl font-black text-foreground">
                            {stats.totalStories}
                        </div>
                    </div>

                    <div className="glass-strong rounded-[2rem] p-6 border-2 border-surface-border/50">
                        <div className="text-foreground/40 text-[10px] font-black uppercase tracking-widest mb-2">
                            Total Views
                        </div>
                        <div className="text-4xl font-black text-[#39FF14]">
                            {stats.totalViews}
                        </div>
                    </div>

                    <div className="glass-strong rounded-[2rem] p-6 border-2 border-surface-border/50">
                        <div className="text-foreground/40 text-[10px] font-black uppercase tracking-widest mb-2">
                            Total Likes
                        </div>
                        <div className="text-4xl font-black text-pink-500">
                            {stats.totalLikes}
                        </div>
                    </div>
                </div>

                {/* My Stories Grid */}
                <div>
                    <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-6">
                        My Stories
                    </h2>

                    {myStories.length === 0 ? (
                        <div className="glass-strong rounded-[3rem] p-16 text-center border-2 border-dashed border-surface-border">
                            <div className="text-6xl mb-4 animate-float">📹</div>
                            <h3 className="text-2xl font-black text-foreground/50 uppercase tracking-tight mb-4">
                                No Stories Yet
                            </h3>
                            <p className="text-foreground/30 font-medium mb-8">
                                Create your first Campus Pulse story and start building your audience!
                            </p>
                            <Link
                                href="/stories/new"
                                className="inline-block px-8 py-4 bg-gradient-to-r from-[#39FF14] to-[#2ecc71] text-black font-black rounded-2xl uppercase tracking-wider hover:scale-105 active:scale-95 transition-all omni-glow-strong"
                            >
                                Create First Story
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {myStories.slice(0, visibleCount).map((story) => (
                                    <Link
                                        key={story.id}
                                        href={`/stories?id=${story.id}`}
                                        className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-black hover:scale-105 transition-all"
                                    >
                                        {/* Video Thumbnail */}
                                        <video
                                            src={story.videoUrl}
                                            className="w-full h-full object-cover"
                                            muted
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                                {story.title && (
                                                    <p className="text-white text-sm font-bold mb-2 line-clamp-2">
                                                        {story.title}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-4 text-white/80 text-xs font-bold">
                                                    <span>👁️ {story.views}</span>
                                                    <span>❤️ {story.likes}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Play Icon */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white text-2xl">▶️</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {myStories.length > visibleCount && (
                                <div className="mt-12 flex justify-center">
                                    <button
                                        onClick={() => setVisibleCount(prev => prev + 12)}
                                        className="px-8 py-4 bg-surface border border-surface-border rounded-2xl font-black text-xs uppercase tracking-widest hover:border-[#39FF14] hover:text-[#39FF14] transition-all omni-glow active:scale-95"
                                    >
                                        Load More Stories
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
