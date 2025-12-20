// src/app/products/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CAMPUS_HOTSPOTS } from '@/lib/geo/distance';
import ImageUpload from '@/components/products/ImageUpload';

const categories = ['FOOD', 'BOOK', 'LESSON', 'SERVICE'];

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'FOOD',
        hotspot: '',
        imageUrl: '',
    });

    const hotspots = Object.values(CAMPUS_HOTSPOTS);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                alert('Product created successfully! 🎉');
                router.push('/dashboard/vendor');
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Failed to create product:', error);
            alert('Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-8 transition-colors duration-300">
            <div className="max-w-2xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-foreground mb-2 uppercase tracking-tighter">
                        ➕ Add New Product
                    </h1>
                    <p className="text-foreground/40 text-[10px] font-black uppercase tracking-widest">
                        List your product on the marketplace
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-surface border border-surface-border rounded-[2.5rem] p-8 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">
                            Product Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Indomie Noodles"
                            className="w-full px-4 py-3 bg-background border border-surface-border rounded-xl text-foreground placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">
                            Description *
                        </label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe your product..."
                            rows={4}
                            className="w-full px-4 py-3 bg-background border border-surface-border rounded-xl text-foreground placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">
                            Price (₵) *
                        </label>
                        <input
                            type="number"
                            required
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="5.00"
                            className="w-full px-4 py-3 bg-background border border-surface-border rounded-xl text-foreground placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-black text-xl"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">
                            Category *
                        </label>
                        <select
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-3 bg-background border border-surface-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-black uppercase tracking-widest text-xs"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat} className="bg-background text-foreground">
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Hotspot */}
                    <div>
                        <label className="block text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">
                            Location (Hotspot)
                        </label>
                        <select
                            value={formData.hotspot}
                            onChange={(e) => setFormData({ ...formData, hotspot: e.target.value })}
                            className="w-full px-4 py-3 bg-background border border-surface-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-black uppercase tracking-widest text-xs"
                        >
                            <option value="" className="bg-background text-foreground">Select location...</option>
                            {hotspots.map((hotspot) => (
                                <option key={hotspot} value={hotspot} className="bg-background text-foreground">
                                    📍 {hotspot}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Product Image */}
                    <div>
                        <label className="block text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">
                            Product Image
                        </label>
                        <ImageUpload
                            value={formData.imageUrl}
                            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 px-6 py-4 bg-foreground/5 border border-surface-border hover:bg-foreground/10 text-foreground rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 omni-glow active:scale-95"
                        >
                            {loading ? 'Creating...' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
