"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RiskGaugeProps {
    score: number; // 0 to 100
    category: string; // "Conservative", "Moderate", "Aggressive"
    animated?: boolean;
}

export function RiskGauge({ score, category, animated = true }: RiskGaugeProps) {
    const [displayScore, setDisplayScore] = useState(0);

    useEffect(() => {
        if (animated) {
            const timeout = setTimeout(() => {
                setDisplayScore(score);
            }, 300);
            return () => clearTimeout(timeout);
        } else {
            setDisplayScore(score);
        }
    }, [score, animated]);

    // Calculate rotation: 0 score = -90deg, 100 score = 90deg
    const rotation = (displayScore / 100) * 180 - 90;

    const getColor = (s: number) => {
        if (s < 40) return "text-emerald-500";
        if (s < 70) return "text-amber-500";
        return "text-rose-500";
    };

    const getBgColor = (s: number) => {
        if (s < 40) return "bg-emerald-500";
        if (s < 70) return "bg-amber-500";
        return "bg-rose-500";
    };

    return (
        <div className="relative flex flex-col items-center justify-center py-8">
            <div className="relative w-64 h-32 overflow-hidden mb-4">
                {/* Gauge Background Arc */}
                <div className="absolute top-0 left-0 w-64 h-64 rounded-full border-[20px] border-slate-200 dark:border-slate-800 box-border"></div>

                {/* Colored Sections Overlay (Optional styling, simple gradient for now) */}
                <div className="absolute top-0 left-0 w-64 h-64 rounded-full border-[20px] border-transparent border-t-emerald-400 -rotate-45" style={{ clipPath: "polygon(50% 50%, 0 0, 100% 0)" }}></div>
                {/* This approach is complex in CSS only. Let's stick to a clean needle design. */}

                <div className="absolute bottom-0 left-1/2 w-full h-full -translate-x-1/2 origin-bottom flex items-end justify-center">
                    <div className="w-60 h-60 rounded-full border-[24px] border-slate-100 dark:border-slate-800"
                        style={{
                            background: `conic-gradient(from 180deg at 50% 100%, #10b981 0deg 60deg, #f59e0b 60deg 120deg, #f43f5e 120deg 180deg, transparent 180deg)`
                        }}
                    ></div>
                </div>

                {/* Needle */}
                <div
                    className="absolute bottom-0 left-1/2 w-1 h-28 bg-slate-800 dark:bg-white origin-bottom rounded-full transition-transform duration-1000 ease-out z-10"
                    style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
                >
                    <div className="absolute -top-1 -left-1.5 w-4 h-4 bg-slate-800 dark:bg-white rounded-full"></div>
                </div>

                {/* Center Hub */}
                <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-slate-900 dark:bg-slate-100 rounded-full -translate-x-1/2 translate-y-2 z-20"></div>
            </div>

            <div className="text-center space-y-1 z-10 mt-2">
                <div className={cn("text-4xl font-black transition-colors duration-500", getColor(displayScore))}>
                    {displayScore.toFixed(0)}
                </div>
                <div className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
                    Risk Score
                </div>
                <div className={cn("inline-block px-4 py-1 rounded-full text-white font-bold text-sm mt-2 shadow-lg", getBgColor(displayScore))}>
                    {category}
                </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-8 left-0 text-xs font-bold text-emerald-600">Conservative</div>
            <div className="absolute bottom-8 right-0 text-xs font-bold text-rose-600">Aggressive</div>
        </div>
    );
}
