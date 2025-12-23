'use client';

import { useEffect, useRef } from 'react';

interface RevenueChartProps {
    data: { name: string; total: number }[];
}

export default function GlowingRevenueChart({ data }: RevenueChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || data.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;
        const padding = 40;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Find max value
        const maxValue = Math.max(...data.map(d => d.total), 1);

        // Calculate points
        const points = data.map((d, i) => ({
            x: padding + (i * (width - padding * 2)) / (data.length - 1),
            y: height - padding - ((d.total / maxValue) * (height - padding * 2)),
            value: d.total,
            label: d.name
        }));

        // Draw gradient fill
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(57, 255, 20, 0.3)');
        gradient.addColorStop(1, 'rgba(57, 255, 20, 0)');

        ctx.beginPath();
        ctx.moveTo(points[0].x, height - padding);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(points[points.length - 1].x, height - padding);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw glowing line
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#39FF14';
        ctx.strokeStyle = '#39FF14';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.stroke();

        // Draw data points with pulse effect
        ctx.shadowBlur = 20;
        points.forEach(p => {
            // Outer glow
            ctx.beginPath();
            ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(57, 255, 20, 0.3)';
            ctx.fill();

            // Inner circle
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#39FF14';
            ctx.fill();
        });

        // Draw labels
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        points.forEach(p => {
            ctx.fillText(p.label, p.x, height - 10);
        });

        // Draw values on hover (simplified - always show)
        ctx.fillStyle = '#39FF14';
        ctx.font = 'bold 12px Inter, sans-serif';
        points.forEach(p => {
            if (p.value > 0) {
                ctx.fillText(`₵${p.value.toFixed(0)}`, p.x, p.y - 15);
            }
        });

    }, [data]);

    const totalRevenue = data.reduce((sum, d) => sum + d.total, 0);

    return (
        <div className="bg-surface border border-surface-border rounded-[2rem] p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-foreground/40 text-[10px] font-black uppercase tracking-widest mb-2">
                        Revenue Trend (Last 7 Days)
                    </h3>
                    <div className="text-4xl font-black text-foreground flex items-baseline gap-2">
                        ₵{totalRevenue.toFixed(2)}
                        <span className="text-sm text-[#39FF14] font-black uppercase tracking-wider">Total</span>
                    </div>
                </div>
                <div className="w-12 h-12 bg-[#39FF14]/10 rounded-2xl flex items-center justify-center text-2xl border border-[#39FF14]/20">
                    📈
                </div>
            </div>

            <div className="relative">
                <canvas
                    ref={canvasRef}
                    className="w-full h-64"
                    style={{ width: '100%', height: '256px' }}
                />
                {data.every(d => d.total === 0) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-4xl mb-2 opacity-20">📊</div>
                            <p className="text-foreground/20 text-xs font-bold uppercase tracking-widest">
                                No sales data yet
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
