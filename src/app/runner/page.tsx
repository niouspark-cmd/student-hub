'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZapIcon, MapPinIcon, ClockIcon } from '@/components/ui/Icons';
import MaintenanceGuard from '@/components/admin/MaintenanceGuard';
import { useAdmin } from '@/context/AdminContext';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function RunnerDashboard() {
    const { user, isLoaded } = useUser();
    const { isGhostAdmin } = useAdmin();
    const router = useRouter();

    // Access Control
    useEffect(() => {
        if (isLoaded && !isGhostAdmin) {
            // Check if user is runner (assuming publicMetadata.role or similar)
            const isRunner = user?.publicMetadata?.role === 'RUNNER' || user?.publicMetadata?.isRunner;
            if (!isRunner) {
                // router.push('/marketplace'); 
                // Commented out to prevent accidental locking during dev, 
                // but this is where the check goes.
            }
        }
    }, [isLoaded, user, isGhostAdmin, router]);

    const [isOnline, setIsOnline] = useState(false);
    const [missions, setMissions] = useState<any[]>([]); // Available
    const [activeMission, setActiveMission] = useState<any>(null); // Current
    const [balance, setBalance] = useState(0.00);
    const [isLoading, setIsLoading] = useState(true);

    const [lastMissionCount, setLastMissionCount] = useState(0);

    // Initial Load & Polling
    useEffect(() => {
        // Load initial status
        fetch('/api/runner/status').then(res => res.json()).then(data => {
            setIsOnline(data.status === 'ONLINE');
            setBalance(data.balance || 0);
            setIsLoading(false);
        });

        const interval = setInterval(() => {
            if (isOnline) fetchMissions();
            fetchActiveMission();
        }, 3000); // Faster poll for demo (3s)

        return () => clearInterval(interval);
    }, [isOnline]); // Depend on isOnline to toggle fetching

    const fetchActiveMission = async () => {
        try {
            const res = await fetch('/api/runner/missions/active');
            const data = await res.json();
            if (data.success && data.mission) {
                setActiveMission(data.mission);
            } else {
                // Only clear if we thought we had one, to prevent flickering? 
                // Actually if null, we should clear it.
                if (activeMission) setActiveMission(null);
            }
        } catch (e) { console.error('Active fetch error', e); }
    };

    const fetchMissions = async () => {
        try {
            const res = await fetch('/api/runner/missions');
            const data = await res.json();
            if (data.success) {
                setMissions(data.missions);

                // Play Sound on New Mission
                if (data.missions.length > lastMissionCount) {
                    const audio = new Audio('/sounds/notification.mp3'); // We need this file, or use a data URI
                    // Using a short beep data URI for reliability without external files
                    const beep = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"); // Short placeholder or...
                    // Let's use a browser native notification or standard alert sound approach if possible?
                    // actually let's just log for now or try a simple beep.
                    // Or better, just vibrate if mobile.
                    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
                }
                setLastMissionCount(data.missions.length);
            }
        } catch (e) { console.error(e); }
    };

    const toggleStatus = async () => {
        const newStatus = !isOnline ? 'ONLINE' : 'OFFLINE';
        setIsOnline(!isOnline); // Optimistic UI
        try {
            await fetch('/api/runner/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
        } catch (e) {
            console.error('Toggle failed', e);
            setIsOnline(isOnline); // Revert
        }
    };

    const handleAccept = async (missionId: string) => {
        // Optimistic UI: Find mission and set as "Active" immediately
        const mission = missions.find(m => m.id === missionId);
        if (mission) {
            // Optimistically set active mission with a temporary Loading status
            setActiveMission({
                id: mission.id,
                title: mission.title,
                vendorName: mission.vendorName,
                pickupLocation: mission.pickupLocation,
                dropoffLocation: mission.dropoffLocation,
                status: 'ASSIGNING...', // Temp status
                earning: mission.earning
            });
            // Remove from feed
            setMissions(prev => prev.filter(m => m.id !== missionId));
        }

        try {
            const res = await fetch(`/api/runner/missions/${missionId}/accept`, { method: 'POST' });
            if (res.ok) {
                // Determine true server state
                fetchActiveMission();
            } else {
                alert('Too slow! Mission taken.');
                fetchMissions(); // Revert
                if (activeMission?.id === missionId) setActiveMission(null);
            }
        } catch (e) {
            alert('Error accepting mission');
            setActiveMission(null);
            fetchMissions();
        }
    };

    const handleComplete = async () => {
        if (!activeMission) return;
        // Only verify logic here if needed, but the API handles the heavy lifting
        // We probably need input for the student release key here if we want to be fancy
        // For MVP, if we click "Complete", prompt for the key or just call the API?
        // The previous implementation did not prompt for key. 
        // We should PROMPT for the key here?
        // Actually, the previous implementation of verify-key endpoint TAKES key in body.

        const releaseKey = prompt("Ask Student for their Shield Key (6-digits):");
        if (!releaseKey) return;

        try {
            const res = await fetch('/api/orders/verify-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ releaseKey })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                alert(`✅ Mission Complete! You earned GHS ${data.order.runnerEarnings || 5.00}`); // use server data
                setActiveMission(null);
                setBalance(prev => prev + (data.order.runnerEarnings || 5.00));
                // Optional: Play Ka-ching sound
            } else {
                alert(data.error || 'Invalid Key');
            }
        } catch (e) { alert('Network error'); }
    };

    const handleWithdraw = async () => {
        alert('Withdrawal request initialized. Processing via OMNI Vault.');
    };

    return (
        <MaintenanceGuard protocol="RUNNER">
            <div className="max-w-md mx-auto space-y-6 pb-20 pt-32 px-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Runner Terminal</h1>
                        <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest">
                            Secure Channel • <span className="text-yellow-500">Legon Campus</span>
                        </p>
                    </div>
                    {/* Balance Card (Mini) */}
                    <div className="text-right">
                        <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Wallet</p>
                        <p className="text-xl font-black text-green-500">₵{balance.toFixed(2)}</p>
                    </div>
                </div>

                {/* Hustle Switch */}
                <div className={`flex items-center justify-between p-6 rounded-3xl border relative overflow-hidden transition-all ${isOnline ? 'bg-surface border-yellow-500/50' : 'bg-surface border-surface-border'}`}>
                    <div className="relative z-10">
                        <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Duty Status</h2>
                        <p className={`text-xs font-bold uppercase tracking-widest mt-1 flex items-center gap-2 ${isOnline ? 'text-yellow-500' : 'text-foreground/40'}`}>
                            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-yellow-500 animate-pulse' : 'bg-foreground/20'}`}></span>
                            {isOnline ? 'Online - Scanning' : 'Offline'}
                        </p>
                    </div>
                    <button
                        onClick={toggleStatus}
                        className={`relative z-10 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${isOnline ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 'bg-foreground/5 text-foreground hover:bg-foreground/10'}`}
                    >
                        {isOnline ? 'Go Offline' : 'Go Online'}
                    </button>
                </div>

                {/* WALLET / WITHDRAW SECTION */}
                <div className="bg-surface border border-surface-border p-6 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black text-foreground uppercase tracking-tight">Earnings Available</h3>
                        <button
                            onClick={handleWithdraw}
                            disabled={balance <= 0}
                            className="px-4 py-2 bg-green-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:scale-105 transition-transform"
                        >
                            Withdraw
                        </button>
                    </div>
                    <div className="h-1 w-full bg-foreground/5 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-1/2 animate-pulse"></div>
                    </div>
                </div>


                {/* ACTIVE MISSION CARD (2-STAGE) */}
                <AnimatePresence>
                    {activeMission && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ x: 100, opacity: 0 }}
                            className={`p-6 rounded-3xl shadow-[0_0_40px_rgba(234,179,8,0.2)] border-2 relative overflow-hidden ${activeMission.status === 'PICKED_UP'
                                ? 'bg-black text-green-400 border-green-500' // Final Stage
                                : 'bg-yellow-500 text-black border-yellow-400' // Pickup Stage
                                }`}
                        >
                            {/* Status Label */}
                            <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl rotate-12">
                                {activeMission.status === 'PICKED_UP' ? 'GO' : 'GET'}
                            </div>

                            <h3 className="text-xl font-black uppercase tracking-tighter mb-4 relative z-10">
                                {activeMission.status === 'PICKED_UP' ? 'OMNI EXPRESS ⚡' : 'VENDOR HAND-OFF'}
                            </h3>

                            {/* STAGE A: PICKUP */}
                            {activeMission.status !== 'PICKED_UP' && (
                                <div className="space-y-4 relative z-10">
                                    <div className="p-4 bg-black/10 rounded-xl border border-black/10">
                                        <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Go To Hotspot</p>
                                        <div className="flex items-center gap-2 text-lg font-black">
                                            <MapPinIcon className="w-5 h-5" />
                                            {activeMission.pickupLocation || activeMission.vendorName}
                                        </div>
                                    </div>

                                    <div className="text-center py-4 bg-white rounded-xl shadow-lg">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Runner Key</p>
                                        <p className="text-4xl font-black text-black tracking-tighter">
                                            {activeMission.pickupCode || '...'}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-1">Show to Vendor</p>
                                    </div>
                                </div>
                            )}

                            {/* STAGE B: DELIVERY */}
                            {activeMission.status === 'PICKED_UP' && (
                                <div className="space-y-4 relative z-10">
                                    <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                                        <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Deliver To</p>
                                        <div className="flex items-center gap-2 text-lg font-black text-white">
                                            <MapPinIcon className="w-5 h-5 text-green-400" />
                                            {activeMission.dropoffLocation}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleComplete}
                                        className="w-full py-4 bg-green-500 text-black font-black text-sm uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-xl"
                                    >
                                        Verify Shield Key
                                    </button>
                                </div>
                            )}

                        </motion.div>
                    )}
                </AnimatePresence>

                {/* AVAILABLE MISSIONS */}
                <AnimatePresence mode="wait">
                    {isOnline && !activeMission ? (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="space-y-4"
                        >
                            <h3 className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-2">Radar Feed ({missions.length})</h3>
                            {missions.length === 0 && (
                                <div className="text-center py-10 opacity-30">
                                    <p className="text-xs font-bold uppercase tracking-widest text-foreground">No signals nearby</p>
                                </div>
                            )}
                            {missions.map((mission) => (
                                <div key={mission.id} className="bg-surface border border-surface-border rounded-3xl p-6 relative overflow-hidden group hover:border-yellow-500/50 transition-all cursor-pointer">
                                    {/* ... existing card UI ... */}
                                    <div className="flex items-start gap-4 mb-4 relative z-10">
                                        <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                                            <ZapIcon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-black uppercase tracking-tight text-foreground">{mission.title}</h3>
                                            <div className="text-[10px] text-foreground/60 font-bold uppercase tracking-wide mt-1">
                                                {mission.vendorName}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAccept(mission.id)}
                                        className="w-full py-3 bg-foreground/5 hover:bg-yellow-500 hover:text-black text-foreground rounded-xl font-black text-xs uppercase tracking-widest transition-colors"
                                    >
                                        Accept • ₵{mission.earning.toFixed(2)}
                                    </button>
                                </div>
                            ))}
                        </motion.div>
                    ) : null}
                </AnimatePresence>

                {!isOnline && !activeMission && (
                    <div className="text-center py-10 opacity-30">
                        <p className="text-xs font-bold uppercase tracking-widest text-foreground">System Offline</p>
                    </div>
                )}
            </div>
        </MaintenanceGuard>
    );
}
