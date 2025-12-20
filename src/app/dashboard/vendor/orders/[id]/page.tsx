
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface OrderDetail {
    id: string;
    status: string;
    escrowStatus: string;
    amount: number;
    createdAt: string;
    product: {
        title: string;
        description: string;
        imageUrl: string | null;
    };
    student: {
        name: string | null;
        email: string;
    };
    runner: {
        name: string | null;
    } | null;
}

export default function VendorOrderDetails() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useUser();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (id) fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${id}`);
            const data = await res.json();
            if (data.success) {
                setOrder(data.order);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Failed to fetch order:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                setOrder(prev => prev ? { ...prev, status: newStatus } : null);
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground">
                <h1 className="text-4xl font-black mb-4">404</h1>
                <p className="text-foreground/40 mb-8 font-bold uppercase tracking-widest text-xs">Order not found or access denied.</p>
                <Link href="/dashboard/vendor" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-black text-xs uppercase tracking-widest omni-glow">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'PREPARING': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'READY': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            case 'SHIPPED': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            case 'COMPLETED': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'CANCELLED': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                {/* Back Link */}
                <Link
                    href="/dashboard/vendor"
                    className="inline-flex items-center text-primary hover:text-foreground mb-8 transition-colors group text-xs font-black uppercase tracking-widest"
                >
                    <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                    Back to Operations
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Order Main Info */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Header Card */}
                        <div className="bg-surface border border-surface-border rounded-[2.5rem] p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>

                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                <div>
                                    <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </div>
                                    <h1 className="text-3xl font-black text-foreground mt-2 uppercase tracking-tight">
                                        Order #{order.id.slice(-6).toUpperCase()}
                                    </h1>
                                    <p className="text-foreground/40 text-[10px] font-black uppercase tracking-widest mt-1">
                                        Placed on {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black text-foreground">
                                        ₵{order.amount.toFixed(2)}
                                    </div>
                                    <div className="text-[10px] font-black text-green-400 uppercase tracking-widest mt-1">
                                        {order.escrowStatus === 'HELD' ? '🛡️ HELD IN ESCROW' : '✅ FUNDS RELEASED'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-6 pt-6 border-t border-surface-border">
                                <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center text-4xl border border-primary/20 overflow-hidden">
                                    {order.product.imageUrl ? (
                                        <img src={order.product.imageUrl} alt="" className="w-full h-full object-cover" />
                                    ) : '📦'}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-foreground mb-1 uppercase tracking-tight">{order.product.title}</h3>
                                    <p className="text-foreground/30 text-xs font-medium leading-relaxed">{order.product.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-surface border border-surface-border rounded-[2.5rem] p-8">
                            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6">Student Information</h2>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-foreground/10 rounded-full flex items-center justify-center text-xl">👤</div>
                                <div>
                                    <div className="text-foreground font-black uppercase tracking-tight">{order.student.name || 'Anonymous Student'}</div>
                                    <div className="text-foreground/40 text-[10px] font-black uppercase tracking-widest">{order.student.email}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Actions & Runner */}
                    <div className="space-y-8">
                        {/* Control Panel */}
                        <div className="bg-surface border border-surface-border rounded-[2.5rem] p-8">
                            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 text-center">Control Panel</h2>
                            <div className="space-y-3">
                                {order.status === 'PAID' && (
                                    <button
                                        onClick={() => updateStatus('PREPARING')}
                                        disabled={updating}
                                        className="w-full py-4 bg-primary hover:bg-primary/80 disabled:opacity-50 text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg omni-glow"
                                    >
                                        Start Preparing
                                    </button>
                                )}
                                {order.status === 'PREPARING' && (
                                    <button
                                        onClick={() => updateStatus('READY')}
                                        disabled={updating}
                                        className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-orange-600/20"
                                    >
                                        Mark Ready
                                    </button>
                                )}
                                {order.status === 'READY' && (
                                    <div className="text-center py-4 bg-background/5 rounded-2xl border border-dashed border-surface-border">
                                        <div className="text-2xl mb-1">📢</div>
                                        <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Awaiting Runner</p>
                                    </div>
                                )}
                                <p className="text-[9px] text-center text-foreground/20 mt-4 leading-relaxed font-black uppercase tracking-tighter">
                                    Updating order status notifies the customer and relevant runners instantly.
                                </p>
                            </div>
                        </div>

                        {/* Runner Info */}
                        <div className="bg-surface border border-surface-border rounded-[2.5rem] p-8">
                            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6">Mission Runner</h2>
                            {order.runner ? (
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-lg">🏃</div>
                                    <div>
                                        <div className="text-foreground font-black text-sm uppercase tracking-tight">{order.runner.name}</div>
                                        <div className="text-green-400/60 text-[10px] font-black uppercase tracking-widest">EN ROUTE</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <div className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em] italic">
                                        Not assigned yet
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
