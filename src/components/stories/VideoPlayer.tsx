'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface VideoPlayerProps {
    storyId: string;
    src: string;
    isActive: boolean;
    likes?: number;
    username?: string;
    caption?: string;
    vendorClerkId?: string;
}

export default function VideoPlayer({
    storyId,
    src,
    isActive,
    likes = 0,
    username = 'Vendor',
    caption = '',
    vendorClerkId,
}: VideoPlayerProps) {
    const { user } = useUser();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [localLikes, setLocalLikes] = useState(likes);
    const [hasLiked, setHasLiked] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    // Update local likes when prop changes
    useEffect(() => {
        setLocalLikes(likes);
    }, [likes]);

    // Fetch initial like and favorite state
    useEffect(() => {
        const fetchInitialState = async () => {
            try {
                // Check if user has liked this story
                const likeRes = await fetch(`/api/stories/${storyId}/like`);
                if (likeRes.ok) {
                    const likeData = await likeRes.json();
                    setHasLiked(likeData.liked);
                }

                // Check if user has favorited this story
                const favRes = await fetch(`/api/stories/${storyId}/favorite`);
                if (favRes.ok) {
                    const favData = await favRes.json();
                    setIsFavorited(favData.favorited);
                }
            } catch (error) {
                console.error('Failed to fetch initial state:', error);
            }
        };

        fetchInitialState();
    }, [storyId]);

    useEffect(() => {
        if (isActive) {
            videoRef.current?.play().catch(e => console.log('Autoplay blocked:', e));
            setIsPlaying(true);
            // Record view
            fetch(`/api/stories/${storyId}/view`, { method: 'POST' }).catch(console.error);
        } else {
            videoRef.current?.pause();
            setIsPlaying(false);
            if (videoRef.current) {
                videoRef.current.currentTime = 0;
            }
        }
    }, [isActive, storyId]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            setIsMuted(!isMuted);
            videoRef.current.muted = !isMuted;
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const percentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(percentage);
        }
    };

    const handleLike = async () => {
        // Optimistic update
        const newLikedState = !hasLiked;
        const newLikeCount = hasLiked ? localLikes - 1 : localLikes + 1;

        setHasLiked(newLikedState);
        setLocalLikes(newLikeCount);

        try {
            const res = await fetch(`/api/stories/${storyId}/like`, {
                method: 'POST',
            });

            if (res.ok) {
                const data = await res.json();
                setHasLiked(data.liked);
                setLocalLikes(data.likes);
            } else {
                // Revert on error
                setHasLiked(!newLikedState);
                setLocalLikes(hasLiked ? localLikes : localLikes - 1);
            }
        } catch (error) {
            console.error('Failed to like story:', error);
            // Revert on error
            setHasLiked(!newLikedState);
            setLocalLikes(hasLiked ? localLikes : localLikes - 1);
        }
    };

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/stories?id=${storyId}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Story by @${username}`,
                    text: caption || 'Check out this story on Campus Pulse!',
                    url: shareUrl,
                });
            } catch (error) {
                console.log('Share cancelled');
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareUrl);
                alert('Link copied to clipboard! 🔗');
            } catch (error) {
                console.error('Failed to copy link:', error);
            }
        }
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(src);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `campus-pulse-${storyId.slice(0, 8)}.mp4`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            window.open(src, '_blank');
        }
    };

    const toggleFavorite = async () => {
        // Optimistic update
        const newFavoritedState = !isFavorited;
        setIsFavorited(newFavoritedState);

        try {
            const res = await fetch(`/api/stories/${storyId}/favorite`, {
                method: 'POST',
            });

            if (res.ok) {
                const data = await res.json();
                setIsFavorited(data.favorited);
            } else {
                // Revert on error
                setIsFavorited(!newFavoritedState);
            }
        } catch (error) {
            console.error('Failed to favorite story:', error);
            // Revert on error
            setIsFavorited(!newFavoritedState);
        }
    };

    return (
        <div className="relative w-full h-full bg-black overflow-hidden">
            {/* Video Element */}
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-cover"
                loop
                playsInline
                onClick={() => {
                    togglePlay();
                    if (isMuted) toggleMute(); // Auto-unmute on first tap
                }}
                onTimeUpdate={handleTimeUpdate}
                muted={isMuted}
            />

            {/* Electric Green Progress Bar (Top) */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-black/30 z-50">
                <div
                    className="h-full bg-gradient-to-r from-[#39FF14] to-[#2ecc71] transition-all duration-100 ease-linear shadow-[0_0_10px_#39FF14]"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Play/Pause Overlay */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none animate-in fade-in duration-200">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/40">
                        <div className="text-5xl text-white drop-shadow-lg">▶</div>
                    </div>
                </div>
            )}

            {/* Top Gradient Overlay */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none z-10" />

            {/* Bottom Gradient Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-10" />

            {/* Mute Indicator (shows when muted) */}
            {isMuted && (
                <div className="absolute top-6 right-4 z-50 px-3 py-2 rounded-full glass-strong border border-white/20 flex items-center gap-2 animate-pulse">
                    <span className="text-sm">🔇</span>
                    <span className="text-white text-xs font-bold">Tap to unmute</span>
                </div>
            )}


            {/* User Info & Caption (Bottom Left) */}
            <div className="absolute bottom-20 left-4 right-20 text-white z-20 space-y-2">
                {/* Username */}
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#39FF14] to-[#2ecc71] flex items-center justify-center font-black text-black text-lg shadow-lg">
                        {username[0]?.toUpperCase()}
                    </div>
                    <div>
                        <div className="font-black text-base drop-shadow-lg">@{username}</div>
                        <div className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Campus Vendor</div>
                    </div>
                </div>

                {/* Caption */}
                {caption && (
                    <p className="text-sm font-medium drop-shadow-lg line-clamp-3 leading-relaxed">
                        {caption}
                    </p>
                )}
            </div>

            {/* Action Buttons Sidebar (Right) */}
            <div className="absolute bottom-20 right-2 flex flex-col items-center gap-3 z-30 pb-4">
                {/* User Avatar - Acts as Follow Button */}
                <div className="relative mb-2 group">
                    <div className="w-12 h-12 rounded-full border-2 border-white p-0.5 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-[#39FF14] to-[#2ecc71] flex items-center justify-center font-black text-black text-lg">
                            {username[0]?.toUpperCase()}
                        </div>
                    </div>
                    {/* Plus Icon Badge */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center border border-white">
                        <span className="text-white text-xs font-bold">+</span>
                    </div>
                </div>

                {/* Like Button */}
                <button
                    onClick={handleLike}
                    className="flex flex-col items-center gap-1 group"
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${hasLiked
                        ? 'text-red-500 scale-110 animate-pulse-glow'
                        : 'text-white hover:scale-110'
                        } active:scale-95`}>
                        <span className="text-4xl drop-shadow-md">{hasLiked ? '❤️' : '🤍'}</span>
                    </div>
                    <span className="text-white text-[10px] font-bold drop-shadow-lg tracking-wide">
                        {localLikes > 999 ? `${(localLikes / 1000).toFixed(1)}K` : localLikes}
                    </span>
                </button>

                {/* Comment Button */}
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex flex-col items-center gap-1 group mt-1"
                >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                        <span className="text-3xl text-white drop-shadow-md">💬</span>
                    </div>
                    <span className="text-white text-[10px] font-bold drop-shadow-lg tracking-wide">
                        Comment
                    </span>
                </button>

                {/* Favorite Button */}
                <button
                    onClick={toggleFavorite}
                    className="flex flex-col items-center gap-1 group mt-1"
                >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                        <span className="text-3xl text-white drop-shadow-md">{isFavorited ? '⭐' : '☆'}</span>
                    </div>
                    <span className="text-white text-[10px] font-bold drop-shadow-lg tracking-wide">
                        Favorite
                    </span>
                </button>

                {/* Share Button */}
                <button
                    onClick={handleShare}
                    className="flex flex-col items-center gap-1 group mt-1"
                >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                        <span className="text-3xl text-white drop-shadow-md">↪️</span>
                    </div>
                    <span className="text-white text-[10px] font-bold drop-shadow-lg tracking-wide">
                        Share
                    </span>
                </button>

                {/* Download Button */}
                <button
                    onClick={handleDownload}
                    className="flex flex-col items-center gap-1 group mt-1"
                >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                        <span className="text-3xl text-white drop-shadow-md">⬇️</span>
                    </div>
                    <span className="text-white text-[10px] font-bold drop-shadow-lg tracking-wide">
                        Save
                    </span>
                </button>

                {/* Delete Button (Owner Only) - Styled as a utility */}
                {user?.id === vendorClerkId && (
                    <button
                        onClick={async () => {
                            if (confirm('Delete this story? This action cannot be undone.')) {
                                const res = await fetch(`/api/stories/${storyId}`, { method: 'DELETE' });
                                if (res.ok) window.location.reload();
                            }
                        }}
                        className="flex flex-col items-center gap-1 group mt-4 opacity-60 hover:opacity-100"
                    >
                        <div className="w-8 h-8 rounded-full bg-black/40 border border-white/20 flex items-center justify-center hover:bg-red-900/40 hover:border-red-500/50">
                            <span className="text-sm">🗑️</span>
                        </div>
                        <span className="text-white text-[8px] font-medium">Delete</span>
                    </button>
                )}
            </div>

            {/* Comments Overlay (Slide Up) */}
            {showComments && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-lg z-40 animate-in slide-in-from-bottom duration-300">
                    <div className="h-full flex flex-col">
                        {/* Header with prominent close button */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <h3 className="text-white font-black text-lg">Comments</h3>
                            <button
                                onClick={() => setShowComments(false)}
                                className="w-12 h-12 rounded-full bg-[#39FF14]/20 border-2 border-[#39FF14] flex items-center justify-center hover:bg-[#39FF14]/30 hover:scale-110 active:scale-95 transition-all omni-glow"
                                aria-label="Close comments"
                            >
                                <span className="text-[#39FF14] text-2xl font-black">✕</span>
                            </button>
                        </div>

                        {/* Swipe hint */}
                        <div className="flex justify-center py-2">
                            <div className="w-12 h-1 bg-white/20 rounded-full"></div>
                        </div>

                        {/* Comments List */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="text-center text-white/40 py-12">
                                <div className="text-4xl mb-2">💬</div>
                                <p className="text-sm font-bold">Comments coming soon!</p>
                                <p className="text-xs mt-1">Be the first to share your thoughts</p>
                            </div>
                        </div>

                        {/* Comment Input */}
                        <div className="p-4 border-t border-white/10">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-[#39FF14] transition-colors"
                                />
                                <button className="px-6 py-3 bg-[#39FF14] text-black font-black rounded-full hover:brightness-110 active:scale-95 transition-all">
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
