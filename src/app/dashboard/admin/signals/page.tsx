import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';

export default async function SignalIntelligencePage() {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    // Check admin
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (user?.role !== 'ADMIN' && user?.role !== 'GOD_MODE') {
        redirect('/');
    }

    const signals = await prisma.feedback.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return (
        <div className="min-h-screen bg-black p-8 text-white font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12 border-b border-[#39FF14]/20 pb-8">
                    <div>
                        <h1 className="text-4xl font-black text-[#39FF14] uppercase tracking-tighter mb-2 flex items-center gap-4">
                            <span>📡</span> Signal Intelligence
                        </h1>
                        <p className="text-sm text-gray-400 font-mono">
                            INTERCEPTING TESTER TRANSMISSIONS
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-black text-white">{signals.length}</div>
                        <div className="text-[10px] text-[#39FF14] uppercase tracking-widest">Active Signals</div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {signals.map(signal => (
                        <div key={signal.id} className="bg-[#0a0a0a] border border-[#333] p-6 rounded-3xl hover:border-[#39FF14]/50 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-[#39FF14]/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[#39FF14]/10 transition-colors"></div>

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div>
                                    <h3 className="font-bold text-white text-lg tracking-tight mb-1">{signal.userName}</h3>
                                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                                        ID: {signal.id.slice(-6)} • {new Date(signal.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`text-[9px] uppercase font-black px-2 py-1 rounded border ${signal.status === 'OPEN' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'}`}>
                                    {signal.status}
                                </span>
                            </div>

                            <div className="relative z-10">
                                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-medium bg-[#111] p-4 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                                    {signal.content}
                                </p>
                            </div>

                            <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-[10px] font-bold text-[#39FF14] uppercase tracking-widest hover:underline">
                                    Mark Resolved
                                </button>
                            </div>
                        </div>
                    ))}

                    {signals.length === 0 && (
                        <div className="col-span-full py-32 text-center text-gray-500 border border-dashed border-[#333] rounded-3xl">
                            <div className="text-4xl mb-4 opacity-20">📭</div>
                            <p className="uppercase tracking-widest text-xs font-bold">No signals currently intercepted.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Ensure dynamic rendering to see new feedbacks instantly
export const dynamic = 'force-dynamic';
