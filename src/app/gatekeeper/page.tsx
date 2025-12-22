
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function GatekeeperPage() {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'CHECKING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('CHECKING');
        setErrorMsg('');

        try {
            const res = await fetch('/api/admin/verify-gatekeeper', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setStatus('SUCCESS');
                setTimeout(() => {
                    // Force navigation to ensure cookies are refreshed
                    window.location.href = '/dashboard/admin';
                }, 1500);
            } else {
                setStatus('ERROR');
                setErrorMsg(data.error || 'Access Denied');
            }
        } catch (error) {
            setStatus('ERROR');
            setErrorMsg('System error');
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-surface border border-surface-border rounded-[2.5rem] p-12 relative overflow-hidden"
            >
                {/* Radial Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2"></div>

                <div className="text-center relative z-10">
                    <div className="text-5xl mb-6">🛡️</div>
                    <h1 className="text-3xl font-black text-foreground mb-2 uppercase tracking-tighter">OMNI Gatekeeper</h1>
                    <p className="text-primary/40 text-xs font-bold uppercase tracking-widest mb-12">Authorized Personnel Only</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative group">
                            <input
                                type="password"
                                placeholder="ENTER SECRET ACCESS CODE"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full bg-background border-2 border-surface-border rounded-2xl py-6 text-center text-sm font-black tracking-[0.2em] text-foreground focus:border-primary outline-none transition-all placeholder:text-foreground/5"
                                autoFocus
                            />
                            {status === 'ERROR' && (
                                <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-widest leading-relaxed">
                                    {errorMsg === 'AUTH_REQUIRED' ? 'SIGN IN REQUIRED TO ACCESS TERMINAL' : 'Access Denied: Invalid Security Hash'}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'CHECKING' || status === 'SUCCESS'}
                            className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 omni-glow"
                        >
                            {status === 'CHECKING' ? 'VERIFYING...' : status === 'SUCCESS' ? 'GRANTED' : 'REQUEST ENTRY'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
