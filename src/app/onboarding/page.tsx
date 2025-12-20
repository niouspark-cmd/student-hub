
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<'STUDENT' | 'VENDOR' | null>(null);
    const [isRunner, setIsRunner] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        checkExistingStatus();
    }, []);

    const checkExistingStatus = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/users/me');
            const data = await res.json();
            if (data.onboarded) {
                // Already onboarded in DB, just need to set the cookie via local refresh or API
                await handleComplete(data.role, data.isRunner);
            }
        } catch (error) {
            console.error('Status check failed');
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (selectedRole: 'STUDENT' | 'VENDOR', selectedIsRunner: boolean) => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/onboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: selectedRole, isRunner: selectedIsRunner }),
            });

            if (res.ok) {
                if (selectedRole === 'VENDOR') {
                    window.location.href = '/dashboard/vendor';
                } else {
                    window.location.href = '/marketplace';
                }
            }
        } catch (error) {
            console.error('Onboarding failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 transition-colors duration-500">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,var(--primary)/0.03,transparent_50%)] pointer-events-none"></div>

            <div className="max-w-2xl w-full relative z-10">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12 text-center"
                        >
                            <div>
                                <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">Select Identity</h1>
                                <p className="text-foreground/40 font-black uppercase tracking-widest text-xs">How do you intend to interact with the OMNI Network?</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <button
                                    onClick={() => { setRole('STUDENT'); setStep(2); }}
                                    className="p-10 bg-surface border-2 border-surface-border rounded-[3rem] text-left group hover:border-primary transition-all"
                                >
                                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">🎓</div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Student</h3>
                                    <p className="text-foreground/40 text-[10px] font-black uppercase tracking-widest">I want to discover and acquire assets on campus.</p>
                                </button>

                                <button
                                    onClick={() => handleComplete('VENDOR', false)}
                                    className="p-10 bg-surface border-2 border-surface-border rounded-[3rem] text-left group hover:border-primary transition-all"
                                >
                                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">🏪</div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Vendor</h3>
                                    <p className="text-foreground/40 text-[10px] font-black uppercase tracking-widest">I want to supply assets and manage a terminal.</p>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12 text-center"
                        >
                            <div className="max-w-md mx-auto">
                                <div className="text-6xl mb-8">🏃</div>
                                <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Shadow Runner Mode</h2>
                                <p className="text-foreground/40 font-black uppercase tracking-widest text-[10px] leading-loose mb-10">
                                    Become an OMNI logistics entity. Collect items from vendors and deliver them to peers to earn small amounts of cash (₵).
                                </p>

                                <div className="space-y-6">
                                    <button
                                        onClick={() => handleComplete('STUDENT', true)}
                                        className="w-full py-6 bg-primary text-primary-foreground rounded-3xl font-black text-xs uppercase tracking-[0.3em] omni-glow hover:scale-105 active:scale-95 transition-all"
                                    >
                                        Activate Runner Mode
                                    </button>
                                    <button
                                        onClick={() => handleComplete('STUDENT', false)}
                                        className="w-full py-6 bg-surface border border-surface-border text-foreground rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:bg-surface/80 transition-all"
                                    >
                                        Default Access Only
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-[3rem] backdrop-blur-sm">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                            <p className="text-primary font-black uppercase tracking-widest text-[10px]">Syncing Identity...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
