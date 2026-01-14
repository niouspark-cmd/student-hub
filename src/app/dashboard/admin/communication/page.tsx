'use client';

import { useState } from 'react';
import { SendIcon, UsersIcon, MessageSquareIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CommunicationPage() {
    const [mode, setMode] = useState<'SINGLE' | 'BULK'>('SINGLE');
    const [recipient, setRecipient] = useState('');
    const [bulkGroup, setBulkGroup] = useState<'ALL' | 'STUDENTS' | 'VENDORS'>('ALL');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setStatus(null);

        try {
            const res = await fetch('/api/admin/communicate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode,
                    recipient: mode === 'SINGLE' ? recipient : undefined,
                    group: mode === 'BULK' ? bulkGroup : undefined,
                    message
                })
            });
            const data = await res.json();

            if (data.success) {
                setStatus({ type: 'success', text: 'Transmission Successful' });
                if (mode === 'SINGLE') { setRecipient(''); setMessage(''); }
                else { setMessage(''); }
            } else {
                setStatus({ type: 'error', text: data.error || 'Transmission Failed' });
            }
        } catch (error) {
            setStatus({ type: 'error', text: 'Network Uplink Failure' });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto pt-20">
                {/* Header */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <Link href="/dashboard/admin" className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-4 block hover:opacity-70 transition-all">← Back to Command Center</Link>
                        <h1 className="text-5xl font-black text-foreground uppercase tracking-tighter">Comms Uplink</h1>
                        <p className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.5em] mt-2">SMS Broadcast Terminal</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar / Mode Select */}
                    <div className="bg-surface border border-surface-border rounded-[2rem] p-6 space-y-4 h-fit">
                        <button
                            onClick={() => setMode('SINGLE')}
                            className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${mode === 'SINGLE' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-foreground/5'}`}
                        >
                            <MessageSquareIcon className="w-5 h-5" />
                            <div className="text-left">
                                <div className="text-xs font-black uppercase tracking-wider">Direct Beam</div>
                                <div className="text-[10px] opacity-70">Single target message</div>
                            </div>
                        </button>
                        <button
                            onClick={() => setMode('BULK')}
                            className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${mode === 'BULK' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-foreground/5'}`}
                        >
                            <UsersIcon className="w-5 h-5" />
                            <div className="text-left">
                                <div className="text-xs font-black uppercase tracking-wider">Mass Broadcast</div>
                                <div className="text-[10px] opacity-70">Multi-target wave</div>
                            </div>
                        </button>
                    </div>

                    {/* Main Interface */}
                    <div className="lg:col-span-2 bg-surface border border-surface-border rounded-[2rem] p-8">
                        <form onSubmit={handleSend} className="space-y-8">

                            {/* Target Selection */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-foreground/40">Target Vector</h3>
                                {mode === 'SINGLE' ? (
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            placeholder="Enter Phone Number (e.g. 054...)"
                                            value={recipient}
                                            onChange={(e) => setRecipient(e.target.value)}
                                            required
                                            className="w-full bg-background border-2 border-surface-border rounded-xl px-4 py-4 font-mono text-lg focus:border-primary outline-none transition-colors"
                                        />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-4">
                                        {['ALL', 'STUDENTS', 'VENDORS'].map((g) => (
                                            <button
                                                key={g}
                                                type="button"
                                                onClick={() => setBulkGroup(g as any)}
                                                className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${bulkGroup === g
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-surface-border hover:border-foreground/20'
                                                    }`}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Message Body */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-foreground/40">Payload Content</h3>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    placeholder="Type your secure message here..."
                                    className="w-full h-40 bg-background border-2 border-surface-border rounded-xl px-4 py-4 text-base focus:border-primary outline-none transition-colors resize-none"
                                />
                                <div className="text-right text-[10px] font-mono text-foreground/40">
                                    {message.length} characters
                                </div>
                            </div>

                            {/* Actions */}
                            <button
                                type="submit"
                                disabled={sending}
                                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${sending ? 'bg-foreground/10 cursor-not-allowed' : 'bg-primary text-primary-foreground hover:scale-[1.02] shadow-xl omni-glow'
                                    }`}
                            >
                                {sending ? (
                                    <><span>TRANSMITTING...</span></>
                                ) : (
                                    <><SendIcon className="w-4 h-4" /> <span>SEND TRANSMISSION</span></>
                                )}
                            </button>

                            {/* Status Feedback */}
                            {status && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
                                        }`}
                                >
                                    {status.type === 'success' ? <CheckCircleIcon className="w-5 h-5" /> : <AlertCircleIcon className="w-5 h-5" />}
                                    <span className="text-xs font-black uppercase tracking-wide">{status.text}</span>
                                </motion.div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
