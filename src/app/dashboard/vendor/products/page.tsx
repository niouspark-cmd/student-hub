// src/app/dashboard/vendor/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    category: {
        name: string;
    };
    imageUrl: string | null;
    hotspot: string | null;
    createdAt: string;
}

export default function VendorProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/products?vendorOnly=true');
            const data = await response.json();

            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-foreground mb-2 uppercase tracking-tighter">
                            📦 My Products
                        </h1>
                        <p className="text-foreground/40 text-[10px] font-black uppercase tracking-widest">
                            Manage your marketplace listings
                        </p>
                    </div>
                    <Link
                        href="/products/new"
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-black text-xs uppercase tracking-widest transition-all omni-glow active:scale-95"
                    >
                        ➕ Add Product
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                        <p className="mt-4 text-foreground/40 text-[10px] font-black uppercase tracking-widest">Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-surface border border-surface-border rounded-[2.5rem] p-12 text-center">
                        <div className="text-6xl mb-4"> Deserted 📦 </div>
                        <h2 className="text-2xl font-black text-foreground mb-2 uppercase tracking-tighter">
                            No products yet
                        </h2>
                        <p className="text-foreground/40 text-[10px] font-black uppercase tracking-widest mb-6">
                            Start selling by adding your first product
                        </p>
                        <Link
                            href="/products/new"
                            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest transition-all omni-glow active:scale-95"
                        >
                            Add Your First Product
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-surface border border-surface-border rounded-[2rem] overflow-hidden hover:border-primary/50 transition-all group"
                            >
                                {/* Product Image */}
                                <div className="h-48 bg-primary/5 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <span className="text-6xl group-hover:scale-110 transition-transform duration-500">📦</span>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight">
                                            {product.title}
                                        </h3>
                                        <span className="px-2 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                                            {product.category.name}
                                        </span>
                                    </div>

                                    <p className="text-xs text-foreground/40 mb-5 line-clamp-2 font-medium">
                                        {product.description}
                                    </p>

                                    {product.hotspot && (
                                        <div className="flex items-center gap-2 mb-5 text-[10px] font-black text-primary uppercase tracking-widest">
                                            <span>📍</span>
                                            <span>{product.hotspot}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-black text-foreground tracking-tighter">
                                            ₵{product.price.toFixed(2)}
                                        </span>
                                        <div className="flex gap-2">
                                            <Link href={`/products/edit/${product.id}`} className="px-4 py-2 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                                Edit
                                            </Link>
                                            <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-red-500/20">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
