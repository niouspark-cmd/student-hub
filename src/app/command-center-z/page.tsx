
'use client';

import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Mock types for now
interface SystemSettings {
    maintenanceMode: boolean;
    activeFeatures: string[];
    globalNotice: string | null;
}

export default function CommandCenterPage() {
    // State
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [settings, setSettings] = useState<SystemSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ESCROW' | 'USERS'>('OVERVIEW');
    const [escrows, setEscrows] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Lock Screen State
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [password, setPassword] = useState('');
    const [shake, setShake] = useState(false);

    // --- DEFINITIONS BEFORE USE ---

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/system', {
                headers: { 'x-admin-key': 'omniadmin.com' }
            });
            const data = await res.json();
            if (res.ok) setSettings(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchEscrows = async () => {
        const res = await fetch('/api/admin/escrow', {
            headers: { 'x-admin-key': 'omniadmin.com' }
        });
        if (res.ok) setEscrows(await res.json());
    }

    const fetchUsers = async () => {
        const res = await fetch(`/api/admin/users?q=${searchTerm}`, {
            headers: { 'x-admin-key': 'omniadmin.com' }
        });
        if (res.ok) setUsers(await res.json());
    }

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'omniadmin.com') {
            setIsUnlocked(true);
            localStorage.setItem('OMNI_GOD_MODE_UNLOCKED', 'true');
            fetchSettings(); // Safe to call now
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            setPassword('');
        }
    }

    const handleUserSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers();
    }

    const handleEscrowAction = async (orderId: string, action: 'FORCE_RELEASE' | 'FORCE_REFUND') => {
        if (!confirm(`CONFIRM: ${action} for Order?`)) return;
        await fetch('/api/admin/escrow', {
            method: 'POST',
            headers: { 'x-admin-key': 'omniadmin.com' },
            body: JSON.stringify({ orderId, action })
        });
        fetchEscrows();
    }

    const handleUserAction = async (userId: string, action: string) => {
        if (!confirm(`CONFIRM: ${action} for User?`)) return;
        await fetch('/api/admin/users', {
            method: 'PATCH',
            headers: { 'x-admin-key': 'omniadmin.com' },
            body: JSON.stringify({ userId, action })
        });
        fetchUsers();
    }

    const toggleSystem = async (mode: boolean) => {
        if (!confirm(mode ? 'ACTIVATE MAINTENANCE MODE? (Stops all traffic)' : 'Go Live?')) return;
        setSettings(prev => prev ? { ...prev, maintenanceMode: mode } : null);
        try {
            await fetch('/api/admin/system', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-key': 'omniadmin.com' },
                body: JSON.stringify({
                    maintenanceMode: mode,
                    activeFeatures: settings?.activeFeatures
                })
            });
        } catch (e) {
            alert('Failed to toggle system');
            fetchSettings();
        }
    };

    const toggleFeature = async (feature: string) => {
        if (!settings) return;
        const isActive = settings.activeFeatures.includes(feature);
        const newFeatures = isActive
            ? settings.activeFeatures.filter(f => f !== feature)
            : [...settings.activeFeatures, feature];

        setSettings({ ...settings, activeFeatures: newFeatures });

        try {
            await fetch('/api/admin/system', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-key': 'omniadmin.com' },
                body: JSON.stringify({
                    maintenanceMode: settings.maintenanceMode,
                    activeFeatures: newFeatures
                })
            });
        } catch (e) { fetchSettings(); }
    };

    // --- EFFECTS ---

    useEffect(() => {
        // Check local storage for previous session
        if (localStorage.getItem('OMNI_GOD_MODE_UNLOCKED') === 'true') {
            setIsUnlocked(true);
            fetchSettings(); // Safe to call now
        }
        setLoading(false);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Data Fetching Effects
    useEffect(() => {
        if (isUnlocked) {
            if (activeTab === 'ESCROW') fetchEscrows();
            if (activeTab === 'USERS') fetchUsers();
        }
    }, [activeTab, isUnlocked, searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

    // --- RENDER ---

    // RENDER LOCK SCREEN if not unlocked
    if (!isUnlocked) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-mono text-center">
                <div className="mb-8 opacity-20 hover:opacity-100 transition-opacity duration-1000">
                    <img src="/OMNI-LOGO.ico" className="w-16 h-16 invert" />
                </div>

                <h1 className="text-4xl text-gray-800 font-black mb-2 uppercase tracking-tighter">System Error 404</h1>
                <p className="text-gray-900 text-xs mb-10">Resource not found on this server.</p>

                <form onSubmit={handleUnlock} className={`flex flex-col gap-4 w-full max-w-xs transition-transform ${shake ? 'translate-x-[-10px] text-red-500' : ''} ${shake ? 'animate-pulse' : ''}`}>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="ADMIN KEY"
                        className="bg-transparent border-b border-gray-800 text-center text-white p-2 focus:outline-none focus:border-red-500 transition-colors uppercase placeholder:text-gray-900 font-black tracking-[0.5em]"
                        autoFocus
                    />
                </form>
            </div>
        );
    }

    // Auth Check for God Mode (Secondary Backup) - Optional, but keeping UI clean
    // if (loading || !user) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-mono">AUTHENTICATING GOD_MODE...</div>;


    const isKillSwitchActive = settings?.maintenanceMode;

    return (
        <div className="min-h-screen bg-black text-white pb-20 font-mono">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div>
                    <h1 className="text-xl font-black uppercase tracking-widest text-red-500 flex items-center gap-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                        Command Center
                    </h1>
                    <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] mt-1">SYSTEM CONTROLLER • V1.0</p>
                </div>
                {/* TABS */}
                <div className="flex bg-white/5 rounded-lg p-1">
                    {['OVERVIEW', 'ESCROW', 'USERS'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-gray-400">ADMIN</span>
                    <span className="text-[10px] text-gray-600">{user?.primaryEmailAddress?.emailAddress || 'GHOST ACCESS'}</span>
                </div>
            </div>

            <div className="p-6 space-y-8 max-w-2xl mx-auto">

                {/* OVERVIEW TAB */}
                {activeTab === 'OVERVIEW' && (
                    <>
                        {/* 1. THE KILL SWITCH */}
                        <div className={`p-8 rounded-3xl border-2 transition-all duration-500 ${isKillSwitchActive ? 'bg-red-500/10 border-red-500' : 'bg-green-500/10 border-green-500'}`}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className={`text-2xl font-black uppercase tracking-tighter ${isKillSwitchActive ? 'text-red-500' : 'text-green-500'}`}>
                                    {isKillSwitchActive ? 'SYSTEM OFFLINE' : 'SYSTEM LIVE'}
                                </h2>
                                <div className={`w-4 h-4 rounded-full ${isKillSwitchActive ? 'bg-red-500 animate-ping' : 'bg-green-500 shadow-[0_0_20px_#22c55e]'}`}></div>
                            </div>

                            <p className="text-xs text-gray-400 mb-6 font-bold uppercase tracking-wide">
                                {isKillSwitchActive
                                    ? 'The platform is currently in maintenance mode. Users cannot access the marketplace.'
                                    : 'All systems operational. Traffic is flowing normally.'}
                            </p>

                            <button
                                onClick={() => toggleSystem(!isKillSwitchActive)}
                                className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 shadow-xl ${isKillSwitchActive
                                    ? 'bg-green-500 text-black hover:bg-green-400'
                                    : 'bg-red-500 text-white hover:bg-red-600'
                                    }`}
                            >
                                {isKillSwitchActive ? 'RESTORE SYSTEM' : 'INITIATE KILL SWITCH'}
                            </button>
                        </div>

                        {/* 1.5 VIRTUAL MARKET OVERLOOK */}
                        <div className="mb-8">
                            <a href="/marketplace" target="_blank" className="block w-full text-center p-4 rounded-2xl bg-[#39FF14]/10 border border-[#39FF14]/30 hover:bg-[#39FF14]/20 transition-all group">
                                <span className="text-[#39FF14] font-black uppercase tracking-[0.3em] text-xs group-hover:tracking-[0.5em] transition-all">
                                    👁️ VIRTUAL MARKET OVERLOOK
                                </span>
                            </a>
                        </div>

                        {/* 2. GLOBAL ANNOUNCEMENT */}
                        <div className="mb-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-20"><span className="text-4xl">📢</span></div>
                            <h2 className="text-zinc-500 font-bold mb-4 text-xs tracking-widest uppercase">Global Broadcast Protocol</h2>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="TYPE URGENT MESSAGE TO ALL STUDENTS..."
                                    className="bg-black border border-zinc-700 text-white rounded-xl p-3 w-full font-mono text-sm focus:border-red-500 focus:outline-none placeholder:text-zinc-700"
                                    defaultValue={settings?.globalNotice || ''}
                                    onBlur={(e) => {
                                        const val = e.target.value;
                                        if (val !== settings?.globalNotice) {
                                            setSettings(prev => prev ? { ...prev, globalNotice: val } : null);
                                            fetch('/api/admin/system', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json', 'x-admin-key': 'omniadmin.com' },
                                                body: JSON.stringify({
                                                    maintenanceMode: settings?.maintenanceMode,
                                                    activeFeatures: settings?.activeFeatures,
                                                    globalNotice: val
                                                })
                                            });
                                        }
                                    }}
                                />
                                <button
                                    className="bg-red-600 hover:bg-red-700 text-white font-black px-6 rounded-xl uppercase text-xs tracking-widest transition-colors"
                                    onClick={() => {
                                        const input = document.querySelector('input[placeholder="TYPE URGENT MESSAGE TO ALL STUDENTS..."]') as HTMLInputElement;
                                        if (input) {
                                            const val = input.value;
                                            setSettings(prev => prev ? { ...prev, globalNotice: val } : null);
                                            fetch('/api/admin/system', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json', 'x-admin-key': 'omniadmin.com' },
                                                body: JSON.stringify({
                                                    maintenanceMode: settings?.maintenanceMode,
                                                    activeFeatures: settings?.activeFeatures,
                                                    globalNotice: val
                                                })
                                            });
                                            alert('PROTOCOL BROADCASTED');
                                        }
                                    }}
                                >
                                    SYNC
                                </button>
                            </div>
                        </div>

                        {/* 3. FEATURE FLAGS */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-2">Active Protocols</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {['MARKET', 'PULSE', 'RUNNER', 'ESCROW'].map((feature) => {
                                    const active = settings?.activeFeatures.includes(feature);
                                    return (
                                        <button
                                            key={feature}
                                            onClick={() => toggleFeature(feature)}
                                            className={`p-4 rounded-2xl border transition-all text-left group ${active ? 'bg-white/10 border-white/20' : 'bg-black border-white/5 opacity-50'}`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-gray-500'}`}>{feature}</span>
                                                <div className={`w-2 h-2 rounded-full ${active ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-gray-700'}`}></div>
                                            </div>
                                            <div className={`h-1 w-full rounded-full mt-2 ${active ? 'bg-blue-500/50' : 'bg-gray-800'}`}>
                                                <div className={`h-full bg-blue-500 rounded-full transition-all ${active ? 'w-full' : 'w-0'}`}></div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}

                {/* ESCROW TAB */}
                {activeTab === 'ESCROW' && (
                    <div className="space-y-4">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Active Conflicts</h2>
                        {escrows.length === 0 ? (
                            <div className="text-center py-10 text-gray-600 font-mono text-xs">NO ACTIVE ESCROWS FOUND</div>
                        ) : (
                            escrows.map(order => (
                                <div key={order.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center">
                                    <div>
                                        <p className="text-xs font-bold text-white uppercase">{order.vendor.shopName}</p>
                                        <p className="text-[10px] text-gray-400">GH₵ {order.amount.toFixed(2)} • {order.student.name}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEscrowAction(order.id, 'FORCE_RELEASE')} className="px-3 py-1 bg-green-500/20 text-green-400 text-[9px] font-black uppercase rounded border border-green-500/30">Release</button>
                                        <button onClick={() => handleEscrowAction(order.id, 'FORCE_REFUND')} className="px-3 py-1 bg-red-500/20 text-red-400 text-[9px] font-black uppercase rounded border border-red-500/30">Refund</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* USERS TAB */}
                {activeTab === 'USERS' && (
                    <div className="space-y-4">
                        <form onSubmit={handleUserSearch} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Search email, name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-white/30"
                            />
                            <button type="submit" className="px-4 bg-white text-black rounded-xl font-black text-xs uppercase">Search</button>
                        </form>

                        <div className="space-y-2">
                            {users.map(u => (
                                <div key={u.id} className="bg-white/5 border border-white/10 p-4 rounded-xl">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-sm font-bold text-white">{u.name}</p>
                                            <p className="text-[10px] text-gray-400">{u.email}</p>
                                            <div className="flex gap-2 mt-1">
                                                <span className="text-[9px] px-1.5 py-0.5 bg-gray-800 rounded text-gray-300">{u.role}</span>
                                                {u.isRunner && <span className="text-[9px] px-1.5 py-0.5 bg-blue-900 rounded text-blue-300">RUNNER</span>}
                                            </div>
                                        </div>
                                        <p className="text-xs font-black text-green-500">₵{u.balance.toFixed(2)}</p>
                                    </div>
                                    <div className="flex gap-2 border-t border-white/5 pt-2 mt-2">
                                        {u.role !== 'VENDOR' && (
                                            <button onClick={() => handleUserAction(u.id, 'promote_vendor')} className="flex-1 py-1.5 bg-yellow-500/10 text-yellow-500 text-[9px] font-black uppercase rounded hover:bg-yellow-500/20">
                                                Promote Vendor
                                            </button>
                                        )}
                                        {!u.isRunner && (
                                            <button onClick={() => handleUserAction(u.id, 'verify_runner')} className="flex-1 py-1.5 bg-blue-500/10 text-blue-500 text-[9px] font-black uppercase rounded hover:bg-blue-500/20">
                                                Make Runner
                                            </button>
                                        )}
                                        <button onClick={() => handleUserAction(u.id, 'ban')} className="py-1.5 px-3 bg-red-500/10 text-red-500 text-[9px] font-black uppercase rounded hover:bg-red-500/20">
                                            Ban
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
}
