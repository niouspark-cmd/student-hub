'use client';

import { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';

interface Story {
    id: string;
    videoUrl: string;
    title?: string;
    vendor: {
        name: string;
        clerkId: string;
    };
    likes: number;
}

interface TheaterModeProps {
    stories: Story[];
    initialIndex: number;
    onClose: () => void;
}

export default function TheaterMode({ stories, initialIndex, onClose }: TheaterModeProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isMobile, setIsMobile] = useState(false);

    // Device detection
    useEffect(() => {
        const checkDevice = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkDevice();
        window.addEventListener('resize', checkDevice);
        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft' && currentIndex > 0) setCurrentIndex(currentIndex - 1);
            if (e.key === 'ArrowRight' && currentIndex < stories.length - 1) setCurrentIndex(currentIndex + 1);
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentIndex, stories.length, onClose]);

    const currentStory = stories[currentIndex];

    if (isMobile) {
        // Mobile: Full-screen TikTok style
        return (
            <div className="fixed inset-0 bg-black z-[100]">
                <VideoPlayer
                    storyId={currentStory.id}
                    src={currentStory.videoUrl}
                    isActive={true}
                    username={currentStory.vendor?.name || 'User'}
                    caption={currentStory.title}
                    likes={currentStory.likes}
                    vendorClerkId={currentStory.vendor?.clerkId}
                />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="fixed top-6 left-6 z-[110] w-12 h-12 rounded-full glass-strong border-2 border-white/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                >
                    <span className="text-white text-2xl">✕</span>
                </button>

                {/* Navigation Arrows */}
                {currentIndex > 0 && (
                    <button
                        onClick={() => setCurrentIndex(currentIndex - 1)}
                        className="fixed left-4 top-1/2 -translate-y-1/2 z-[110] w-12 h-12 rounded-full glass-strong border-2 border-white/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                    >
                        <span className="text-white text-xl">←</span>
                    </button>
                )}
                {currentIndex < stories.length - 1 && (
                    <button
                        onClick={() => setCurrentIndex(currentIndex + 1)}
                        className="fixed right-4 top-1/2 -translate-y-1/2 z-[110] w-12 h-12 rounded-full glass-strong border-2 border-white/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                    >
                        <span className="text-white text-xl">→</span>
                    </button>
                )}
            </div>
        );
    }

    // Desktop: Instagram/TikTok style with centered video
    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-8">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-8 right-8 z-[110] w-14 h-14 rounded-full glass-strong border-2 border-[#39FF14]/30 flex items-center justify-center hover:scale-110 hover:border-[#39FF14] active:scale-95 transition-all omni-glow"
            >
                <span className="text-[#39FF14] text-2xl font-black">✕</span>
            </button>

            {/* Main Content */}
            <div className="flex items-center justify-center gap-8 max-w-7xl w-full h-full">
                {/* Left Arrow */}
                {currentIndex > 0 && (
                    <button
                        onClick={() => setCurrentIndex(currentIndex - 1)}
                        className="w-14 h-14 rounded-full glass-strong border-2 border-white/20 flex items-center justify-center hover:scale-110 hover:border-[#39FF14] active:scale-95 transition-all"
                    >
                        <span className="text-white text-2xl">←</span>
                    </button>
                )}

                {/* Video Container */}
                <div className="relative w-full max-w-[500px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl">
                    <VideoPlayer
                        storyId={currentStory.id}
                        src={currentStory.videoUrl}
                        isActive={true}
                        username={currentStory.vendor?.name || 'User'}
                        caption={currentStory.title}
                        likes={currentStory.likes}
                        vendorClerkId={currentStory.vendor?.clerkId}
                    />
                </div>

                {/* Right Arrow */}
                {currentIndex < stories.length - 1 && (
                    <button
                        onClick={() => setCurrentIndex(currentIndex + 1)}
                        className="w-14 h-14 rounded-full glass-strong border-2 border-white/20 flex items-center justify-center hover:scale-110 hover:border-[#39FF14] active:scale-95 transition-all"
                    >
                        <span className="text-white text-2xl">→</span>
                    </button>
                )}
            </div>

            {/* Story Counter */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 glass-strong rounded-full border border-white/10">
                <span className="text-white text-sm font-black">
                    {currentIndex + 1} / {stories.length}
                </span>
            </div>

            {/* Keyboard Hints */}
            <div className="absolute bottom-8 right-8 flex gap-2">
                <div className="px-3 py-2 glass-subtle rounded-lg border border-white/10">
                    <span className="text-white/40 text-xs font-bold">ESC to close</span>
                </div>
                <div className="px-3 py-2 glass-subtle rounded-lg border border-white/10">
                    <span className="text-white/40 text-xs font-bold">← → to navigate</span>
                </div>
            </div>
        </div>
    );
}
