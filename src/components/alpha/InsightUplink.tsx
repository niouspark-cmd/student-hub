'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';

export default function InsightUplink() {
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState('');
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        setSending(true);

        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    userName: user ? `${user.fullName || user.firstName} (${user.primaryEmailAddress?.emailAddress || 'No Email'})` : 'Anonymous Tester',
                })
            });
            const data = await res.json();

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    setIsOpen(false);
                    setContent('');
                }, 2000);
            }
        } catch (e) {
            console.error('Feedback failed', e);
            alert('Signal Lost: Check internet connection.');
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            {/* FAB - Floating Action Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-[49] w-14 h-14 bg-black border border-[#39FF14] rounded-full flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:scale-110 active:scale-90 transition-transform group"
            >
                <span className="group-hover:rotate-12 transition-transform">📡</span>
                <div className="absolute inset-0 rounded-full border border-[#39FF14] animate-ping opacity-20"></div>
            </motion.button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            className="bg-[#0a0a0a] border border-[#39FF14]/50 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors text-xl font-bold p-2"
                            >
                                ✕
                            </button>

                            {success ? (
                                <div className="py-12 flex flex-col items-center justify-center text-center">
                                    <div className="text-5xl mb-4">✅</div>
                                    <h3 className="text-xl font-black text-[#39FF14] uppercase tracking-tight">Signal Received</h3>
                                    <p className="text-xs text-white/60 mt-2">KCS HQ thanks you.</p>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-xl font-black text-[#39FF14] uppercase tracking-tighter mb-1 flex items-center gap-2">
                                        <span>📡</span> Insight Uplink
                                    </h3>
                                    <p className="text-[10px] uppercase font-bold text-white/40 mb-6">
                                        Transmit intel to Kingenious HQ
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <textarea
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                placeholder="Describe the bug, feature request, or observation..."
                                                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 text-sm font-medium focus:outline-none focus:border-[#39FF14] resize-none transition-colors"
                                                autoFocus
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={sending || !content.trim()}
                                            className="w-full py-4 bg-[#39FF14] text-black font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#32e612] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#39FF14]/10"
                                        >
                                            {sending ? 'Transmitting...' : 'Send Signal'}
                                        </button>
                                        <p className="text-[9px] text-center text-white/20 uppercase tracking-widest font-bold">
                                            Alpha Test Channel v0.9
                                        </p>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
