'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackageIcon, ZapIcon, CheckCircleIcon, ClockIcon } from '@/components/ui/Icons';

interface Order {
    id: string;
    studentName: string;
    productTitle: string;
    amount: number;
    status: string;
    createdAt: string;
    imageUrl: string | null;
    items: number;
}

export default function VendorOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/vendor/orders');
            const data = await res.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/vendor/orders/${orderId}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                fetchOrders(); // Refresh
            }
        } catch (error) {
            console.error('Update failed', error);
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'ALL') return true;
        if (filter === 'PENDING') return order.status === 'PENDING' || order.status === 'PAID';
        if (filter === 'ACTIVE') return ['PREPARING', 'READY'].includes(order.status);
        if (filter === 'COMPLETED') return ['PICKED_UP', 'COMPLETED'].includes(order.status);
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Mission Control</h1>
                    <p className="text-[#39FF14] text-xs font-bold uppercase tracking-widest">Live Order Stream</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-surface p-1 rounded-xl border border-surface-border w-full md:w-auto">
                    {['ALL', 'PENDING', 'ACTIVE', 'COMPLETED'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === tab
                                ? 'bg-[#39FF14] text-black shadow-[0_0_15px_rgba(57,255,20,0.3)]'
                                : 'text-foreground/40 hover:text-foreground hover:bg-foreground/5'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Feed */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-foreground/20">
                    <div className="w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin mb-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Establishing Uplink...</span>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="bg-surface border border-surface-border rounded-3xl p-16 text-center">
                    <div className="text-6xl mb-6 opacity-20">📡</div>
                    <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-2">No Active Missions</h2>
                    <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest">System standing by for new orders.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence>
                        {filteredOrders.map((order) => (
                            <motion.div
                                key={order.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-surface border border-surface-border rounded-2xl p-6 relative group overflow-hidden hover:border-[#39FF14]/30 transition-colors shadow-sm"
                            >
                                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                    {/* Status Indicator */}
                                    <div className={`
                                        w-1 h-full absolute left-0 top-0 bottom-0
                                        ${['PAID', 'PENDING'].includes(order.status) ? 'bg-yellow-500' : ''}
                                        ${['PREPARING'].includes(order.status) ? 'bg-blue-500' : ''}
                                        ${['READY'].includes(order.status) ? 'bg-[#39FF14]' : ''}
                                        ${['COMPLETED', 'PICKED_UP'].includes(order.status) ? 'bg-foreground/20' : ''}
                                    `} />

                                    {/* Product Info */}
                                    <div className="flex-1 pl-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[#39FF14] font-mono text-xs">#{order.id.slice(0, 8)}</span>
                                            <span className="px-2 py-0.5 bg-foreground/5 rounded text-[10px] font-black uppercase text-foreground/60">
                                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight">{order.productTitle}</h3>
                                        <p className="text-foreground/60 text-xs font-bold uppercase tracking-wide">
                                            Buyer: {order.studentName || 'Anonymous'} • ₵{order.amount.toFixed(2)}
                                        </p>
                                    </div>

                                    {/* Action Command Center */}
                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        {/* PENDING / MALFUNCTIONED ORDERS */}
                                        {order.status === 'PENDING' && (
                                            <button
                                                onClick={async () => {
                                                    if (confirm('⚠️ DANGER: Are you surely you want to delete this pending order? This action works for cleaning up malfunctioned orders and cannot be undone.')) {
                                                        try {
                                                            const res = await fetch(`/api/vendor/orders/${order.id}`, { method: 'DELETE' });
                                                            if (res.ok) fetchOrders();
                                                        } catch (e) { console.error(e); }
                                                    }
                                                }}
                                                className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                                            >
                                                Delete Signal
                                            </button>
                                        )}

                                        {order.status === 'PAID' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'PREPARING')}
                                                className="flex-1 md:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                                            >
                                                Start Preparing
                                            </button>
                                        )}
                                        {order.status === 'PREPARING' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'READY')}
                                                className="flex-1 md:flex-none px-6 py-3 bg-[#39FF14] hover:bg-[#32e012] text-black rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)]"
                                            >
                                                Mark Ready
                                            </button>
                                        )}
                                        {order.status === 'READY' && (
                                            <div className="px-6 py-3 bg-foreground/5 rounded-xl border border-foreground/10 text-foreground/40 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
                                                {order.fulfillmentType === 'PICKUP' ? 'Ready for Pickup (Customer)' : 'Waiting for Runner'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
