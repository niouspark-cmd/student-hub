'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function MobileBackButton() {
    const router = useRouter();

    return (
        <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="md:hidden mb-4 flex items-center gap-2 group p-2 -ml-2 rounded-lg active:bg-surface/50 transition-colors"
        >
            <div className="w-8 h-8 rounded-full bg-surface border border-surface-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/60 group-hover:text-primary">
                    <path d="M19 12H5" />
                    <path d="M12 19l-7-7 7-7" />
                </svg>
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-foreground/60 group-hover:text-primary">
                Back
            </span>
        </motion.button>
    );
}
