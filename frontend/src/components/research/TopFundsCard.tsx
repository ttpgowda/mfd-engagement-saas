"use client";

import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Trophy, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { researchService, TopFundsResponse } from '@/services/researchService';
import { useRouter } from 'next/navigation';

export default function TopFundsCard() {
    const router = useRouter();
    const [data, setData] = useState<TopFundsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchTop5 = async () => {
            setLoading(true);
            try {
                // Fetch only top 5, Equity by default
                const res = await researchService.getTopPerformingFunds({
                    category: "Equity",
                    page: 0,
                    size: 5,
                    sortBy: 'return_3y',
                    sortDirection: 'DESC'
                });
                if (isMounted) setData(res);
            } catch (err) {
                console.error(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchTop5();
        return () => { isMounted = false; };
    }, []);

    const handleViewAll = () => {
        // Adjust this path to match your dynamic route structure
        router.push('/research/top-performing');
    };

    return (
        <Card className="w-full h-full bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-emerald-500" />
                        Top Performers
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">Equity • Highest 3Y Returns</p>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden pt-2 p-0 px-4">
                {loading ? (
                    <div className="h-40 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                ) : !data?.funds.length ? (
                    <div className="h-40 flex items-center justify-center text-xs text-muted-foreground">
                        No funds data available
                    </div>
                ) : (
                    <div className="space-y-1">
                        {data.funds.map((fund, index) => (
                            <div
                                key={fund.schemeCode}
                                className="group flex items-center justify-between py-2.5 border-b border-dashed border-border/50 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 px-2 rounded-md transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className={`
                                        flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0
                                        ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                        index === 1 ? 'bg-zinc-100 text-zinc-700' :
                                            index === 2 ? 'bg-orange-100 text-orange-700' :
                                                'bg-slate-50 text-slate-500'}
                                    `}>
                                        {index + 1}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate text-zinc-700 dark:text-zinc-200 group-hover:text-emerald-600 transition-colors">
                                            {fund.schemeName}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0 pl-2">
                                    <div className="flex items-center justify-end gap-1 text-emerald-600 dark:text-emerald-400 font-mono text-sm font-bold">
                                        {fund.return3y.toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            <div className="p-4 pt-2 mt-auto">
                <Button
                    variant="ghost"
                    className="w-full text-xs h-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                    onClick={handleViewAll}
                >
                    View Complete Ranking <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
            </div>
        </Card>
    );
}