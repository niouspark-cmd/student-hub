'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface BackButtonProps {
    label?: string;
    href?: string;
    className?: string;
}

export default function BackButton({ label = 'Back', href, className = '' }: BackButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        if (href) {
            router.push(href);
        } else {
            router.back();
        }
    };

    return (
        <motion.button
            onClick={handleClick}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-border border border-surface-border rounded-xl font-bold text-sm uppercase tracking-wider text-foreground/60 hover:text-foreground transition-all group ${className}`}
        >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
            {label}
        </motion.button>
    );
}
