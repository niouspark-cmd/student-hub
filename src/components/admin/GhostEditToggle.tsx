'use client';

import { useAdmin } from '@/context/AdminContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function GhostEditToggle() {
    const { superAccess, ghostEditMode, toggleGhostEdit } = useAdmin();

    if (!superAccess) return null;

    return (
        <div className="fixed bottom-4 right-20 z-[9999]">
            <button
                onClick={toggleGhostEdit}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border transition-all shadow-2xl backdrop-blur-md
                    ${ghostEditMode
                        ? 'bg-[#39FF14]/20 border-[#39FF14] text-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.3)]'
                        : 'bg-black/80 border-white/10 text-white/40 hover:text-white hover:border-white/30'}
                `}
            >
                <div className={`w-2 h-2 rounded-full ${ghostEditMode ? 'bg-[#39FF14] animate-pulse' : 'bg-white/20'}`} />
                {ghostEditMode ? 'GHOST EDIT ACTIVE' : 'GHOST EDIT'}
            </button>
        </div>
    );
}
