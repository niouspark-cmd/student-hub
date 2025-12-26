'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface MaintenanceLockdownProps {
    title?: string;
    message?: string;
    feature?: string;
}

export default function MaintenanceLockdown({
    title = "System Maintenance",
    message = "We're currently upgrading our systems to serve you better.",
    feature
}: MaintenanceLockdownProps) {
    const [countdown, setCountdown] = useState(5);
    const router = useRouter();

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Redirect when countdown reaches 0
    useEffect(() => {
        if (countdown === 0) {
            router.push('/');
        }
    }, [countdown, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(57,255,20,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,20,0.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20 animate-pulse" />

            {/* Glowing Orb */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#39FF14] rounded-full opacity-5 blur-3xl animate-pulse" />

            {/* Content */}
            <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-[#39FF14]/10 border-4 border-[#39FF14]/30 flex items-center justify-center animate-pulse">
                            <div className="text-6xl">🔧</div>
                        </div>
                        {/* Rotating Ring */}
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#39FF14] animate-spin" />
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-3">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
                        {title}
                    </h1>
                    {feature && (
                        <p className="text-[#39FF14] text-sm font-bold uppercase tracking-[0.3em]">
                            {feature} is currently offline
                        </p>
                    )}
                </div>

                {/* Message */}
                <p className="text-gray-400 text-lg font-mono max-w-md mx-auto">
                    {message}
                </p>

                {/* Status Indicator */}
                <div className="flex items-center justify-center gap-3 py-6">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#39FF14] animate-pulse" />
                        <div className="w-3 h-3 rounded-full bg-[#39FF14] animate-pulse delay-150" style={{ animationDelay: '0.15s' }} />
                        <div className="w-3 h-3 rounded-full bg-[#39FF14] animate-pulse delay-300" style={{ animationDelay: '0.3s' }} />
                    </div>
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                        Leveling Up Systems
                    </span>
                </div>

                {/* Redirect Notice */}
                <div className="pt-8 border-t border-white/10">
                    <p className="text-sm text-gray-500 font-mono">
                        Redirecting to homepage in <span className="text-[#39FF14] font-black text-lg">{countdown}</span> seconds
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-4 px-6 py-3 bg-[#39FF14] text-black font-black text-sm uppercase tracking-widest rounded-lg hover:bg-[#39FF14]/90 transition-all hover:scale-105 active:scale-95"
                    >
                        Return Home Now
                    </button>
                </div>

                {/* Footer */}
                <div className="pt-8">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">
                        OMNI Ecosystem • Alpha Sector 01
                    </p>
                </div>
            </div>
        </div>
    );
}
