'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, ChefHat, Bike, CheckCircle, Clock } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import BackButton from '@/components/BackButton';

// Dynamically import Map to avoid SSR issues
const TrackingMap = dynamic(() => import('@/components/tracking/TrackingMap'), {
    ssr: false,
    loading: () => <div className="w-full h-[70vh] bg-zinc-100 flex items-center justify-center text-zinc-400 font-mono text-xs">INITIALIZING SATELLITE LINK...</div>
});

// Mock Coordinates for Demo (AAMUSTED Area approx)
const VENDOR_LOC: [number, number] = [6.673175, -1.565423]; // Example Kumasi coords
const STUDENT_LOC: [number, number] = [6.674500, -1.564000];

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
    const { user } = useUser();

    // State
    const [status, setStatus] = useState<'PREPARING' | 'ON_THE_WAY' | 'ARRIVED'>('PREPARING');
    const [runnerPos, setRunnerPos] = useState<[number, number] | null>(null);
    const [runnerHeading, setRunnerHeading] = useState(0);
    const [eta, setEta] = useState(15); // minutes

    // Simulation Logic
    useEffect(() => {
        // Start simulation sequence
        const timers: NodeJS.Timeout[] = [];

        // 1. Preparing (0-5s)
        timers.push(setTimeout(() => {
            setStatus('PREPARING');
            setRunnerPos(VENDOR_LOC);
        }, 100));

        // 2. On the Way (5s - 25s) - Moving
        timers.push(setTimeout(() => {
            setStatus('ON_THE_WAY');
        }, 5000));

        // Movement Loop
        let progress = 0;
        const interval = setInterval(() => {
            if (status === 'ON_THE_WAY' && progress < 1) {
                progress += 0.005; // speed
                const lat = VENDOR_LOC[0] + (STUDENT_LOC[0] - VENDOR_LOC[0]) * progress;
                const lng = VENDOR_LOC[1] + (STUDENT_LOC[1] - VENDOR_LOC[1]) * progress;
                setRunnerPos([lat, lng]);

                // Calculate Heading (Simple approximation)
                const angle = Math.atan2(STUDENT_LOC[1] - VENDOR_LOC[1], STUDENT_LOC[0] - VENDOR_LOC[0]) * 180 / Math.PI;
                setRunnerHeading(angle);

                // ETA decay
                setEta(Math.max(1, Math.ceil(15 * (1 - progress))));

                if (progress >= 0.99) {
                    setStatus('ARRIVED');
                }
            }
        }, 100);

        return () => {
            timers.forEach(clearTimeout);
            clearInterval(interval);
        };
    }, [status]);


    // Bottom Sheet Content variants
    const renderBottomSheet = () => {
        if (status === 'PREPARING') {
            return (
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 animate-pulse">
                        <ChefHat size={32} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black uppercase text-gray-800 tracking-tight">Preparing Order</h2>
                        <p className="text-xs text-gray-500 font-medium">Chef is working on your meal...</p>
                        <div className="mt-2 text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded inline-block">
                            Est. Pickup: 5 mins
                        </div>
                    </div>
                </div>
            );
        }

        if (status === 'ARRIVED') {
            return (
                <div className="bg-green-50 p-6 -m-6 rounded-t-3xl h-full flex flex-col justify-center items-center text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 shadow-lg animate-bounce">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-black uppercase text-green-800 tracking-tighter mb-1">Runner Arrived!</h2>
                    <p className="text-sm text-green-700 font-medium">Meet at <b>Autonomy Hall Gate</b></p>
                    <p className="text-xs text-green-600/60 mt-4 uppercase tracking-widest font-bold">Enjoy your meal</p>
                </div>
            );
        }

        // ON THE WAY (Default)
        return (
            <div className="space-y-6">
                {/* Header Info */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-black uppercase text-gray-800 tracking-tighter">On the Way</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                            Arriving in <span className="text-blue-600 text-lg">{eta} min</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase">
                            <Clock size={12} />
                            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                </div>

                {/* Runner Card */}
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 border border-gray-100">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border-2 border-white shadow-sm">
                        <Bike size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-black text-gray-800">Kofi Frimpong</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Yamaha • GT-22-404</p>
                    </div>
                    {/* Actions */}
                    <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors shadow-sm">
                            <Phone size={18} />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors shadow-sm">
                            <MessageCircle size={18} />
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>Restaurant</span>
                        <span>You</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-500 rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: `${(15 - eta) / 15 * 100}%` }}
                            transition={{ duration: 1 }}
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="relative h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Top 70% Map */}
            <div className="absolute top-0 left-0 w-full h-[75%] bg-zinc-200">
                <TrackingMap
                    orderId={params.id}
                    studentLocation={STUDENT_LOC}
                    vendorLocation={VENDOR_LOC}
                    runnerLocation={runnerPos}
                    runnerHeading={runnerHeading}
                    orderStatus={status}
                />

                {/* Back Button Overlay */}
                <div className="absolute top-6 left-6 z-[400]">
                    <BackButton />
                </div>
            </div>

            {/* Bottom 30% Action Card (Sticky Bottom Sheet) */}
            <motion.div
                className="absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[500] overflow-hidden"
                initial={{ y: 200 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", damping: 20 }}
                style={{ height: '35%' }} // Fixed height for 70/30 split approx
            >
                {/* Drag Handle */}
                <div className="w-full flex justify-center pt-3 pb-1">
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
                </div>

                <div className="p-6 h-full pb-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={status}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            {renderBottomSheet()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
