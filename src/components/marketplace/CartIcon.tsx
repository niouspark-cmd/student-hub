'use client';

import { useCartStore } from '@/lib/store/cart';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CartIcon() {
    const router = useRouter();
    const itemCount = useCartStore((state) => state.getItemCount());
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch for persisted store
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="relative p-2 hover:bg-white/10 rounded-full transition-colors">
                <ShoppingCart className="w-6 h-6" />
            </button>
        )
    }

    return (
        <button
            onClick={() => router.push('/cart')}
            className="relative p-2 hover:bg-white/10 rounded-full transition-colors group"
        >
            <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-in zoom-in">
                    {itemCount}
                </span>
            )}
        </button>
    );
}
