import React, { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
    TooltipProps
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpRight, ArrowDownRight, Table as TableIcon, BarChart3 } from 'lucide-react';

interface PeriodReturn {
    period: string;
    fundReturn: number;
    benchmarkReturn: number | null;
    alpha: number | null;
}

interface TrailingReturnsCardProps {
    data: {
        schemeName: string;
        benchmarkName: string;
        periods: PeriodReturn[];
    };
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        const fund = payload[0].value;
        const benchmark = payload.length > 1 ? payload[1].value : null;
        const alpha = benchmark !== null && fund !== undefined ? (fund - (benchmark as number)).toFixed(2) : null;

        return (
            <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-xl ring-1 ring-black/5">
                <p className="font-bold mb-3 text-lg border-b pb-2 border-zinc-100 dark:border-zinc-800">{label} Returns</p>
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-8">
                        <span className="text-sm text-zinc-500 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            Fund
                        </span>
                        <span className="font-mono font-semibold text-emerald-600">{fund?.toFixed(2)}%</span>
                    </div>
                    {benchmark !== null && (
                        <div className="flex items-center justify-between gap-8">
                            <span className="text-sm text-zinc-500 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                Benchmark
                            </span>
                            <span className="font-mono font-semibold text-slate-600">{(benchmark as number).toFixed(2)}%</span>
                        </div>
                    )}
                    {alpha !== null && (
                        <div className={`mt-3 pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-between ${Number(alpha) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            <span className="text-xs font-bold uppercase tracking-wider">Alpha</span>
                            <div className="flex items-center gap-1 font-bold">
                                {Number(alpha) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                {alpha}%
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    return null;
};

export function TrailingReturnsCard({ data }: TrailingReturnsCardProps) {
    const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

    return (
        <Card className="w-full overflow-hidden bg-white/50 dark:bg-black/40 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
                        Performance Analysis
                    </CardTitle>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Vs {data.benchmarkName || 'Benchmark'}
                    </p>
                </div>
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'chart' | 'table')} className="w-auto">
                    <TabsList className="grid w-[100px] grid-cols-2 h-8">
                        <TabsTrigger value="chart" className="px-2"><BarChart3 className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="table" className="px-2"><TableIcon className="w-4 h-4" /></TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardHeader>
            <CardContent>
                <AnimatePresence mode="wait">
                    {viewMode === 'chart' ? (
                        <motion.div
                            key="chart"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="h-[400px] w-full pt-4"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={data.periods}
                                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                                    barGap={4}
                                >
                                    <defs>
                                        <linearGradient id="fundGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10B981" stopOpacity={0.9} />
                                            <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
                                        </linearGradient>
                                        <linearGradient id="benchGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.8} />
                                            <stop offset="100%" stopColor="#64748b" stopOpacity={0.5} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                    <XAxis
                                        dataKey="period"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#71717a', fontSize: 12 }}
                                        tickFormatter={(value) => `${value}%`}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                    <Legend
                                        verticalAlign="top"
                                        height={36}
                                        iconType="circle"
                                        formatter={(value) => <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 ml-1">{value}</span>}
                                    />
                                    <ReferenceLine y={0} stroke="#e4e4e7" />
                                    <Bar
                                        dataKey="fundReturn"
                                        name="Fund Return"
                                        fill="url(#fundGradient)"
                                        radius={[6, 6, 0, 0]}
                                        animationDuration={1500}
                                    />
                                    <Bar
                                        dataKey="benchmarkReturn"
                                        name="Benchmark"
                                        fill="url(#benchGradient)"
                                        radius={[6, 6, 0, 0]}
                                        animationDuration={1500}
                                        animationBegin={300}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="table"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="h-[400px] w-full pt-2"
                        >
                            <div className="rounded-lg border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-500 font-medium">
                                        <tr>
                                            <th className="px-4 py-3">Period</th>
                                            <th className="px-4 py-3 text-right">Fund Return</th>
                                            <th className="px-4 py-3 text-right">Benchmark</th>
                                            <th className="px-4 py-3 text-right">Alpha (±)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                        {data.periods.map((row) => (
                                            <tr key={row.period} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                                                <td className="px-4 py-3 font-semibold">{row.period}</td>
                                                <td className="px-4 py-3 text-right font-mono text-emerald-600 font-medium">
                                                    {row.fundReturn?.toFixed(2)}%
                                                </td>
                                                <td className="px-4 py-3 text-right font-mono text-zinc-500">
                                                    {row.benchmarkReturn ? `${row.benchmarkReturn.toFixed(2)}%` : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {row.alpha !== null ? (
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${row.alpha >= 0
                                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                            }`}>
                                                            {row.alpha > 0 ? '+' : ''}{row.alpha.toFixed(2)}%
                                                        </span>
                                                    ) : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}