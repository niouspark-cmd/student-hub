// src/components/marketplace/ProductCard.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ZapIcon, MapPinIcon } from '@/components/ui/Icons';
import { useCart } from '@/context/CartContext';

interface Product {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    category: { name: string; icon: string | null };
    vendor: { name: string; currentHotspot: string | null };
    hotspot: string | null;
}

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        setIsAdmin(localStorage.getItem('OMNI_GOD_MODE_UNLOCKED') === 'true');
    }, []);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm(`Permanently delete ${product.title}?`)) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/products/${product.id}`, {
                method: 'DELETE',
                headers: { 'x-admin-key': 'omniadmin.com' } // Placeholder key for now
            });
            if (res.ok) {
                // Ideally we'd remove from UI, but since this is a shared card, 
                // we might need a callback. For now, just refresh as a fallback or hide.
                window.location.reload();
            }
        } catch (error) {
            console.error('Delete failed', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-surface border border-surface-border rounded-3xl p-4 md:p-6 relative overflow-hidden group hover:border-primary/50 transition-all ${isDeleting ? 'opacity-50 grayscale' : ''}`}
        >
            {/* Image Section */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-background mb-4 relative">
                {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">
                        {product.category.icon || '📦'}
                    </div>
                )}

                {/* Hotspot Badge */}
                {product.hotspot && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-black text-white uppercase tracking-tighter">{product.hotspot}</span>
                    </div>
                )}

                {/* Admin Overlay */}
                {isAdmin && (
                    <div className="absolute top-3 right-3 flex gap-2">
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert('Inspection Protocol Engaged'); }}
                            className="p-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
                        >
                            <span className="text-[10px] font-bold uppercase">INS</span>
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                            <span className="text-[10px] font-bold uppercase">{isDeleting ? '...' : 'DEL'}</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="text-sm md:text-md font-black uppercase tracking-tight text-foreground line-clamp-1">
                        {product.title}
                    </h3>
                    <span className="text-primary font-black text-sm">₵{product.price.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-foreground/40 font-bold uppercase">
                    <span className="truncate">{product.vendor.name}</span>
                    <span className="w-1 h-1 rounded-full bg-foreground/10"></span>
                    <span>{product.category.name}</span>
                </div>

                {/* Quick Add (Hidden for Admin) */}
                {!isAdmin && (
                    <button
                        onClick={() => addToCart({
                            id: product.id,
                            title: product.title,
                            price: product.price,
                            imageUrl: product.imageUrl,
                            vendorName: product.vendor.name
                        })}
                        className="w-full mt-2 py-3 bg-foreground/5 hover:bg-primary hover:text-primary-foreground text-foreground rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                        <ZapIcon className="w-3 h-3" />
                        Quick Add
                    </button>
                )}
            </div>
        </motion.div>
    );
}
