'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface GoBackProps {
    fallback?: string;
    label?: string;
    className?: string;
}

export default function GoBack({ fallback = '/', label = 'Go Back', className = '' }: GoBackProps) {
    const router = useRouter();

    return (
        <motion.button
            whileHover={{ x: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
                if (window.history.length > 1) {
                    router.back();
                } else {
                    router.push(fallback);
                }
            }}
            className={`group flex items-center gap-3 py-2 px-1 text-foreground/40 hover:text-primary transition-all duration-300 ${className}`}
        >
            <div className="w-8 h-8 rounded-full bg-surface-hover/0 group-hover:bg-primary/10 flex items-center justify-center transition-all">
                <ArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{label}</span>
        </motion.button>
    );
}
