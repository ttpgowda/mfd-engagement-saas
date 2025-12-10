"use client";

import React, { useEffect, useState } from 'react';
import {
    Calendar, TrendingUp, DollarSign, Filter, Search, ArrowRight, Loader2, Coins
} from 'lucide-react';
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import { researchService, LumpsumRequest, LumpsumResponse } from '@/services/researchService';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

// Preset Amounts for "Better UI" approach
const PRESET_AMOUNTS = [
    { label: '₹10k', value: 10000 },
    { label: '₹50k', value: 50000 },
    { label: '₹1L', value: 100000 },
    { label: '₹5L', value: 500000 },
    { label: '₹10L', value: 1000000 },
];

import { CalculatorViewProps } from '@/features/calculators/types';
import { ShareDialog } from '@/features/share/components/ShareDialog';
import { PublicShareButton } from '@/features/share/components/PublicShareButton';
import { publicResearchService } from '@/services/publicResearchService';

export default function TopLumpsumView({ defaultValues, isPublicView = false }: CalculatorViewProps) {
    // --- State ---
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Request State
    const [category, setCategory] = useState<string>("");
    const [amount, setAmount] = useState<number>(100000);
    const [years, setYears] = useState<number>(5);
    const [page, setPage] = useState(0);

    // Data State
    const [data, setData] = useState<LumpsumResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    // 0. Initial Load of Defaults
    useEffect(() => {
        if (defaultValues?.amount) setAmount(defaultValues.amount);
        if (defaultValues?.years) setYears(defaultValues.years);
        if (defaultValues?.category) setCategory(defaultValues.category);
    }, [defaultValues]);

    // 1. Initial Load of Categories
    useEffect(() => {
        const service = isPublicView ? publicResearchService : researchService;
        service.getCategories().then(cats => {
            setCategories(cats);
            if (cats.length > 0 && !defaultValues?.category) setCategory(cats.includes("Equity") ? "Equity" : cats[0]);
        });
    }, [isPublicView, defaultValues]);

    // 2. Fetch Data
    useEffect(() => {
        if (!category) return;

        const fetch = async () => {
            setLoading(true);
            try {
                const service = isPublicView ? publicResearchService : researchService;
                const res = await service.getTopLumpsumFunds({
                    category,
                    years,
                    amount,
                    page,
                    size: 20
                });
                setData(res);
            } catch (err) {
                console.error(err);
                const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || "An unexpected error occurred. Please verify dates and try again.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        // Debounce slightly to prevent rapid firing on slider change
        const timer = setTimeout(fetch, 300);
        return () => clearTimeout(timer);
    }, [category, years, amount, page, isPublicView]);

    // Format Currency Helper
    const fmt = (val: number) => new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(val);

    return (
        <div className="space-y-6 animate-in fade-in duration-700 pb-20">
            {/* --- Header --- */}
            <div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Coins className="w-8 h-8 text-emerald-500" />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                                Top Performing Lumpsum Funds
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Simulate past one-time investments to find wealth creators.
                            </p>
                        </div>
                    </div>
                    {isPublicView ? (
                        <PublicShareButton />
                    ) : (
                        <ShareDialog
                            toolSlug="lumpsum-returns"
                            config={{ category, amount, years }}
                            defaultTitle="Lumpsum Returns Analysis"
                            defaultDescription={`Top funds for ₹${amount.toLocaleString()} investment over ${years} years.`}
                        />
                    )}
                </div>
            </div>

            {/* --- Controls Section (Advanced & Better UI) --- */}
            {/* --- Controls Section --- */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm sticky top-4 z-20 shadow-md">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-start">

                        {/* 1. Category Selector */}
                        <div className="lg:col-span-4 space-y-2 w-full min-w-0">
                            {/* min-w-0 is crucial for flex/grid children to truncate correctly */}
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Category
                            </label>
                            <Select value={category} onValueChange={(v) => { setCategory(v); setPage(0); }}>
                                <SelectTrigger className="h-10 bg-background w-full">
                                    {/* The span + truncate ensures text doesn't overflow on mobile */}
                                    <span className="truncate text-left block w-full pr-2">
                                        <SelectValue placeholder="Select Category" />
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* 2. Amount Input with Quick Chips */}
                        <div className="lg:col-span-4 space-y-3 w-full">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Investment
                                </label>
                                <span className="text-xs text-emerald-600 font-mono font-bold bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">
                                    {fmt(amount)}
                                </span>
                            </div>

                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className="pl-7 h-10 bg-background border-input/80 focus:border-emerald-500 transition-colors"
                                />
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                {PRESET_AMOUNTS.map(preset => (
                                    <button
                                        key={preset.value}
                                        onClick={() => setAmount(preset.value)}
                                        className={`text-[10px] font-medium px-2.5 py-1 rounded-md border transition-all
                                            ${amount === preset.value
                                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                                : 'bg-background text-muted-foreground border-border hover:border-emerald-400 hover:text-emerald-600'}`}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Time Period Slider */}
                        <div className="md:col-span-2 lg:col-span-4 space-y-4 w-full pt-1">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time Period</label>
                                <Badge variant="outline" className="font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 h-6">
                                    {years} Years
                                </Badge>
                            </div>
                            <div className="px-1 py-2">
                                <Slider
                                    value={[years]}
                                    onValueChange={(val) => setYears(val[0])}
                                    min={1} max={25} step={1}
                                    className="cursor-pointer"
                                />
                            </div>
                            <div className="flex justify-between text-[10px] text-muted-foreground px-1 font-medium">
                                <span>1Y</span>
                                <span>5Y</span>
                                <span>10Y</span>
                                <span>15Y</span>
                                <span>20Y</span>
                                <span>25Y</span>
                            </div>
                        </div>

                    </div>
                </CardContent>
            </Card>

            <ErrorAlert message={error} />
            {/* --- Visuals & Data --- */}
            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                    <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                    <p>Simulating {years} years of growth...</p>
                </div>
            ) : !data?.funds.length ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl">
                    No funds found for this criteria. Try changing the category or years.
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Top 5 Growth Chart */}
                    <Card className="lg:col-span-3 border-border/50 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium uppercase tracking-wide">Top 5 Wealth Creators (Current Value)</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.funds.slice(0, 5)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                                    <XAxis dataKey="schemeName" tick={{ fontSize: 10 }} interval={0} tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val} />
                                    <YAxis tickFormatter={(val) => `₹${val / 1000}k`} fontSize={11} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-popover border border-border p-3 rounded shadow-lg text-xs">
                                                        <p className="font-bold mb-1">{label}</p>
                                                        <p>Invested: {fmt(payload[0].payload.investedAmount)}</p>
                                                        <p className="text-emerald-600 font-bold text-sm mt-1">
                                                            Current: {fmt(payload[0].value as number)}
                                                        </p>
                                                        <p className="text-muted-foreground mt-1">CAGR: {payload[0].payload.cagr}%</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <ReferenceLine y={amount} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Invested', position: 'insideTopLeft', fill: '#f59e0b', fontSize: 10 }} />
                                    <Bar dataKey="currentValue" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} maxBarSize={60}>
                                        {data.funds.slice(0, 5).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#34d399'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Data Table */}
                    <Card className="lg:col-span-3 border-border/50 shadow-sm overflow-hidden bg-card">
                        <div className="px-6 py-4 border-b border-border/50 bg-muted/10 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-foreground">Detailed Performance</h3>
                                <p className="text-xs text-muted-foreground">Data as of {data.dataAsOn}</p>
                            </div>
                            <Badge variant="outline" className="bg-background">
                                {data.totalElements} Funds
                            </Badge>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/30 text-muted-foreground font-medium border-b border-border/50">
                                    <tr>
                                        <th className="px-6 py-3 w-[50px]">#</th>
                                        <th className="px-6 py-3">Scheme Name</th>
                                        <th className="px-4 py-3 text-right">CAGR</th>
                                        <th className="px-4 py-3 text-right">Profit</th>
                                        <th className="px-4 py-3 text-right">Current Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {data.funds.map((fund, index) => (
                                        <tr key={fund.schemeCode} className="hover:bg-muted/30 transition-colors group">
                                            <td className="px-6 py-3 text-muted-foreground font-mono text-xs">{(page * 20) + index + 1}</td>
                                            <td className="px-6 py-3">
                                                <div className="font-medium text-foreground group-hover:text-emerald-600 transition-colors">
                                                    {fund.schemeName}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground flex gap-2 mt-0.5">
                                                    <span>NAV Start: ₹{fund.startNav?.toFixed(2)}</span>
                                                    <span>•</span>
                                                    <span>NAV End: ₹{fund.currentNav?.toFixed(2)}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                                                {fund.cagr}%
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="text-emerald-600 text-xs font-bold">+</span>
                                                {fmt(fund.absoluteReturn)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-foreground">
                                                {fmt(fund.currentValue)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-muted/5">
                            <Button
                                variant="outline" size="sm"
                                disabled={page === 0}
                                onClick={() => setPage(p => p - 1)}
                            >
                                Previous
                            </Button>
                            <span className="text-xs text-muted-foreground">Page {page + 1} of {data.totalPages}</span>
                            <Button
                                variant="outline" size="sm"
                                disabled={page >= data.totalPages - 1}
                                onClick={() => setPage(p => p + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}