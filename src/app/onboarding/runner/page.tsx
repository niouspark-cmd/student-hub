'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ZapIcon, MapPinIcon, ClockIcon } from '@/components/ui/Icons';
import { useUser } from '@clerk/nextjs';
import { useModal } from '@/context/ModalContext';

export default function RunnerOnboardingPage() {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const modal = useModal();
    const [loading, setLoading] = useState(false);

    if (isLoaded && user?.publicMetadata?.role === 'VENDOR') {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                    🚫
                </div>
                <h1 className="text-2xl font-black uppercase tracking-tighter mb-4">Vendor Access Restricted</h1>
                <p className="text-white/60 mb-8 max-w-md">
                    Vendors play a crucial role in managing shops and cannot simultaneously be Runners in the fleet to avoid operational conflicts.
                </p>
                <button
                    onClick={() => router.push('/dashboard/vendor')}
                    className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all"
                >
                    Return to Vendor Dashboard
                </button>
            </div>
        );
    }

    const handleJoin = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/runner/join', { method: 'POST' });
            const data = await res.json();

            if (res.ok) {
                // Success: Redirect to Runner Terminal
                // We force a refresh so the Navbar updates its state
                window.location.href = '/runner';
            } else {
                modal.alert(data.error || 'The fleet registration failed.', 'Activation Error', 'error');
                setLoading(false);
            }
        } catch (error) {
            console.error('Join error', error);
            modal.alert('Communication link with fleet command lost.', 'Link Error', 'error');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/20 via-black to-black animate-pulse-slow"></div>
            </div>

            <div className="relative z-10 max-w-md w-full text-center space-y-8">
                <div className="w-24 h-24 bg-yellow-500 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(234,179,8,0.3)] rotate-3 hover:rotate-6 transition-transform">
                    <ZapIcon className="w-12 h-12 text-black" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Join the Fleet</h1>
                    <p className="text-white/60 text-sm font-bold uppercase tracking-widest leading-relaxed">
                        Become an OMNI Runner. <br />
                        Earn money on every delivery.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 text-left">
                    <FeatureCard
                        icon={<ZapIcon className="w-5 h-5 text-yellow-500" />}
                        title="Instant Missions"
                        desc="Get delivery requests based on your location."
                    />
                    <FeatureCard
                        icon={<MapPinIcon className="w-5 h-5 text-blue-500" />}
                        title="Campus Zones"
                        desc="Operate within your hostel or hall."
                    />
                    <FeatureCard
                        icon={<ClockIcon className="w-5 h-5 text-green-500" />}
                        title="Flexible Hours"
                        desc="Go online whenever you want to earn."
                    />
                </div>

                <button
                    onClick={handleJoin}
                    disabled={loading}
                    className="w-full py-5 bg-yellow-500 hover:bg-yellow-400 text-black rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            Activate Runner Mode
                            <ZapIcon className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: any) {
    return (
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-start gap-4 hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <h3 className="font-black text-white uppercase tracking-tight text-sm">{title}</h3>
                <p className="text-xs text-white/40 font-bold uppercase tracking-wide mt-1">{desc}</p>
            </div>
        </div>
    )
}
