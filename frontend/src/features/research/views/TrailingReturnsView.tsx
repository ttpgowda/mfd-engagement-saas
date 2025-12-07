"use client";

import React, { useEffect, useState, useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, ReferenceLine, Cell, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Loader2, TrendingUp,
    Activity, Target, Award, ArrowUpRight
} from 'lucide-react';
import { researchService, TrailingReturnsResponse, SchemeDropdownDto } from '@/services/researchService';

import { cn } from "@/lib/utils";

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";

import {
    Command,
    CommandInput,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command";

import { Check, ChevronDown } from "lucide-react";
import {ErrorAlert} from "@/components/ui/ErrorAlert";

// --- Types & Interfaces ---
type ViewMode = 'bar' | 'radar' | 'alpha';

export default function TrailingReturnsView() {
    // --- State Management ---
    const [categories, setCategories] = useState<string[]>([]);
    const [schemes, setSchemes] = useState<SchemeDropdownDto[]>([]);

    // Selections
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedSchemeCode, setSelectedSchemeCode] = useState<string>('');

    // Data & UI State
    const [data, setData] = useState<TrailingReturnsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('bar');
    const [error, setError] = useState<string | null>(null);
    // --- Data Fetching Logic ---

    // 1. Load Categories on Mount
    useEffect(() => {
        const init = async () => {
            try {
                const cats = await researchService.getCategories();
                setCategories(cats);
                if (cats.length > 0) setSelectedCategory(cats[0]);
            } catch (err) {
                console.error("Failed to init", err);
                const msg = err.response?.data?.message || "An unexpected error occurred. Please verify dates and try again.";
                setError(msg);
            } finally {
                setInitialLoading(false);
            }
        };
        init();
    }, []);

    // 2. Load Schemes when Category changes
    useEffect(() => {
        if (!selectedCategory) return;
        const fetchSchemes = async () => {
            try {
                setLoading(true);
                const list = await researchService.getSchemesByCategory(selectedCategory);
                setSchemes(list);
                if (list.length > 0) {
                    setSelectedSchemeCode(list[0].schemeCode.toString());
                } else {
                    setSelectedSchemeCode('');
                    setData(null);
                }
            } catch (err) {
                console.error("Failed to fetch schemes", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSchemes();
    }, [selectedCategory]);

    // 3. Load Main Data when Scheme changes
    useEffect(() => {
        if (!selectedSchemeCode) return;
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await researchService.getTrailingReturns(Number(selectedSchemeCode));
                setData(result);
            } catch (err) {
                console.error("Failed to fetch trailing returns", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedSchemeCode]);

    // --- Advanced Insights Engine ---
    const insights = useMemo(() => {
        if (!data) return null;
        const periods = data.periods;

        // 1. Consistency (Win Rate)
        const wins = periods.filter(p => (p.alpha || 0) > 0).length;
        const winRate = Math.round((wins / periods.length) * 100);

        // 2. Max Outperformance
        const bestPeriod = [...periods].sort((a, b) => (b.alpha || 0) - (a.alpha || 0))[0];

        // 3. Average Alpha
        const totalAlpha = periods.reduce((sum, p) => sum + (p.alpha || 0), 0);
        const avgAlpha = (totalAlpha / periods.length).toFixed(2);

        // 4. Stability Score (Variance of returns vs benchmark)
        // Simple proxy: Lower variance in Alpha means more predictable outperformance
        const alphas = periods.map(p => p.alpha || 0);
        const meanAlpha = totalAlpha / periods.length;
        const variance = alphas.reduce((sum, val) => sum + Math.pow(val - meanAlpha, 2), 0) / periods.length;
        const stabilityScore = Math.max(0, 100 - (variance * 2)); // Arbitrary scaling for UI

        return {
            winRate,
            bestPeriodName: bestPeriod?.period,
            bestPeriodAlpha: bestPeriod?.alpha?.toFixed(2),
            avgAlpha,
            stabilityScore: Math.round(stabilityScore)
        };
    }, [data]);

    const [schemeOpen, setSchemeOpen] = useState(false);

    const selectedScheme = schemes.find(
        s => s.schemeCode.toString() === selectedSchemeCode
    );

    if (initialLoading) {
        return (
            <div className="h-[60vh] w-full flex flex-col items-center justify-center text-muted-foreground gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
                <p className="text-lg font-medium">Initializing Research Engine...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700 pb-10">
            {/* --- 1. Pro Header & Filter Bar --- */}
            {/*<div className="sticky top-0 z-30 -mx-4 px-4 py-4 bg-background/80 backdrop-blur-xl border-b border-border/40 space-y-4 md:static md:bg-transparent md:border-none md:p-0 md:mx-0">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                            Trailing Returns
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Analyze fund performance across multiple time horizons vs {data?.benchmarkName || 'Benchmark'}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="space-y-1.5 w-full sm:w-[200px]">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Category</label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="h-10 bg-card border-input/60 shadow-sm">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5 w-full sm:w-[260px]">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Scheme</label>
                            <Select
                                value={selectedSchemeCode}
                                onValueChange={setSelectedSchemeCode}
                                disabled={!selectedCategory}
                            >
                                <SelectTrigger className="h-10 bg-card border-input/60 shadow-sm truncate">
                                    <SelectValue placeholder="Select Scheme" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {schemes.map(s => (
                                        <SelectItem key={s.schemeCode} value={s.schemeCode.toString()}>
                                            <span className="truncate block max-w-[220px]">{s.schemeName}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>*/}

            {/* --- 1. Pro Header & Filter Bar --- */}
            <div className="sticky top-0 z-30 -mx-4 px-4 py-4 bg-background/80 backdrop-blur-xl border-b border-border/40 space-y-4 md:static md:bg-transparent md:border-none md:p-0 md:mx-0">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    {/* Left: Title + subtext (unchanged) */}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                            Trailing Returns
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Analyze fund performance across multiple time horizons vs{" "}
                            {data?.benchmarkName || "Benchmark"}
                        </p>
                    </div>

                    {/* Right: Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto sm:items-end">

                        {/* Category Selector */}
                        {/* Added min-w-0 to allow shrinking on mobile */}
                        <div className="space-y-1.5 w-full sm:w-[220px] min-w-0">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
                                Category
                            </label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="h-10 bg-card border-input/60 shadow-sm w-full">
                                    {/* TRUNCATION FIX: Wraps text to prevent layout breaking */}
                                    <span className="truncate text-left block w-full pr-2">
                            <SelectValue placeholder="Category" />
                        </span>
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Scheme Selector (Searchable) */}
                        {/* Added min-w-0 to allow flex item to shrink */}
                        <div className="space-y-1.5 w-full sm:flex-1 min-w-0">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
                                Scheme
                            </label>

                            <Popover open={schemeOpen} onOpenChange={setSchemeOpen}>
                                <PopoverTrigger asChild>
                                    <button
                                        type="button"
                                        disabled={!selectedCategory}
                                        className={cn(
                                            "flex h-10 w-full items-center justify-between rounded-md border border-input/60 bg-card px-3 py-2 text-sm shadow-sm",
                                            !selectedScheme && "text-muted-foreground",
                                            !selectedCategory && "cursor-not-allowed opacity-60"
                                        )}
                                        aria-expanded={schemeOpen}
                                    >
                                        {/* TRUNCATION FIX: Removed fixed max-width, used w-full + truncate */}
                                        <span className="truncate w-full text-left mr-2">
                                {selectedScheme ? selectedScheme.schemeName : "Select Scheme"}
                            </span>
                                        <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
                                    </button>
                                </PopoverTrigger>

                                <PopoverContent
                                    className="w-[var(--radix-popover-trigger-width)] min-w-[260px] p-0"
                                    align="end"
                                >
                                    <Command>
                                        <CommandInput placeholder="Search schemes..." />
                                        <CommandEmpty>No schemes found.</CommandEmpty>
                                        <CommandGroup className="max-h-[260px] overflow-auto">
                                            {schemes.map((s) => (
                                                <CommandItem
                                                    key={s.schemeCode}
                                                    value={s.schemeName}
                                                    onSelect={(value) => {
                                                        const selected = schemes.find(
                                                            (x) => x.schemeName === value
                                                        );
                                                        if (selected) {
                                                            setSelectedSchemeCode(selected.schemeCode.toString());
                                                        }
                                                        setSchemeOpen(false);
                                                    }}
                                                >
                                        <span className="truncate w-full">
                                          {s.schemeName}
                                        </span>
                                                    {selectedSchemeCode === s.schemeCode.toString() && (
                                                        <Check className="ml-auto h-4 w-4 shrink-0" />
                                                    )}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
            </div>

            <ErrorAlert message={error} />
            {/* --- 2. Main Visualization Area --- */}
            <Card className="border-border/50 shadow-xl bg-gradient-to-br from-card to-background overflow-hidden relative">
                {loading && (
                    <div className="absolute inset-0 z-20 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                    </div>
                )}

                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-border/40 gap-4">
                    <div className="space-y-1">
                        <CardTitle className="text-lg md:text-xl font-bold text-emerald-600 dark:text-emerald-400">
                            {data?.schemeName || 'Select a Fund'}
                        </CardTitle>
                        <CardDescription className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                            Vs {data?.benchmarkName}
                        </CardDescription>
                    </div>

                    <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="w-full sm:w-auto">
                        <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1">
                            <TabsTrigger value="bar" className="text-xs">Bar</TabsTrigger>
                            <TabsTrigger value="radar" className="text-xs">Radar</TabsTrigger>
                            <TabsTrigger value="alpha" className="text-xs">Alpha</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </CardHeader>

                <CardContent className="pt-6 min-h-[400px]">
                    {!data && !loading ? (
                        <div className="h-[350px] flex flex-col items-center justify-center text-muted-foreground opacity-50">
                            <Activity className="w-16 h-16 mb-4 stroke-1" />
                            <p>Select a category and scheme to begin analysis</p>
                        </div>
                    ) : (
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                {viewMode === 'radar' && data ? (
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.periods}>
                                        <PolarGrid strokeOpacity={0.2} />
                                        <PolarAngleAxis dataKey="period" tick={{ fill: 'currentColor', fontSize: 12 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} strokeOpacity={0.2} />
                                        <Radar
                                            name="Fund"
                                            dataKey="fundReturn"
                                            stroke="#10b981"
                                            strokeWidth={3}
                                            fill="#10b981"
                                            fillOpacity={0.3}
                                        />
                                        <Radar
                                            name="Benchmark"
                                            dataKey="benchmarkReturn"
                                            stroke="#94a3b8"
                                            strokeWidth={2}
                                            fill="#94a3b8"
                                            fillOpacity={0.1}
                                        />
                                        <Legend />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                            itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                                        />
                                    </RadarChart>
                                ) : viewMode === 'alpha' && data ? (
                                    <BarChart data={data.periods} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                        <ReferenceLine y={0} stroke="#e4e4e7" strokeWidth={2} />
                                        <XAxis dataKey="period" axisLine={false} tickLine={false} dy={10} fontSize={12} />
                                        <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} fontSize={12} />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            content={({ active, payload, label }) => {
                                                if (!active || !payload?.[0]) return null;
                                                const val = Number(payload[0].value);
                                                return (
                                                    <div className="bg-popover/95 backdrop-blur border border-border p-3 rounded-xl shadow-xl">
                                                        <p className="text-xs font-bold text-muted-foreground mb-1 uppercase">{label} Alpha</p>
                                                        <div className={`text-xl font-black font-mono ${val >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                            {val > 0 ? '+' : ''}{val.toFixed(2)}%
                                                        </div>
                                                    </div>
                                                );
                                            }}
                                        />
                                        <Bar dataKey="alpha" radius={[4, 4, 4, 4]}>
                                            {data.periods.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={Number(entry.alpha) >= 0 ? '#10b981' : '#ef4444'}
                                                    fillOpacity={0.9}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                ) : (
                                    // Default Bar Chart
                                    <BarChart data={data?.periods} margin={{ top: 20, right: 10, left: -20, bottom: 0 }} barGap={2}>
                                        <defs>
                                            <linearGradient id="fundGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                                                <stop offset="100%" stopColor="#059669" stopOpacity={0.8}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                        <XAxis dataKey="period" axisLine={false} tickLine={false} dy={10} fontSize={12} fontWeight={500} />
                                        <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} fontSize={12} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(0,0,0,0.03)', radius: 8 }}
                                            content={({ active, payload, label }) => {
                                                if (!active || !payload) return null;
                                                return (
                                                    <div className="bg-popover/95 backdrop-blur border border-border p-4 rounded-xl shadow-xl min-w-[150px]">
                                                        <p className="font-bold mb-3 border-b border-border/50 pb-2">{label}</p>
                                                        {payload.map((entry: any) => (
                                                            <div key={entry.name} className="flex items-center justify-between gap-4 text-sm mb-2 last:mb-0">
                                                                <span className="text-muted-foreground flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full" style={{ background: entry.fill }} />
                                                                    {entry.name}
                                                                </span>
                                                                <span className="font-mono font-bold">{Number(entry.value).toFixed(2)}%</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            }}
                                        />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                                        <Bar
                                            dataKey="fundReturn"
                                            name="Fund"
                                            fill="url(#fundGradient)"
                                            radius={[6, 6, 0, 0]}
                                            maxBarSize={60}
                                        />
                                        <Bar
                                            dataKey="benchmarkReturn"
                                            name="Benchmark"
                                            fill="#94a3b8"
                                            radius={[6, 6, 0, 0]}
                                            maxBarSize={60}
                                            fillOpacity={0.5}
                                        />
                                    </BarChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* --- 3. Advanced Insights Grid --- */}
            {data && insights && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-card/50 border-border/50">
                        <CardContent className="p-5 flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Win Rate</p>
                                <div className="text-2xl font-bold text-foreground">{insights.winRate}%</div>
                                <p className="text-xs text-emerald-500 font-medium mt-1 flex items-center">
                                    <TrendingUp className="w-3 h-3 mr-1" /> Beats Benchmark
                                </p>
                            </div>
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                <Target className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 border-border/50">
                        <CardContent className="p-5 flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Avg Alpha</p>
                                <div className={`text-2xl font-bold ${Number(insights.avgAlpha) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {Number(insights.avgAlpha) > 0 ? '+' : ''}{insights.avgAlpha}%
                                </div>
                                <p className="text-xs text-muted-foreground font-medium mt-1">
                                    Excess Return
                                </p>
                            </div>
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                <Award className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 border-border/50">
                        <CardContent className="p-5 flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Best Era</p>
                                <div className="text-xl font-bold text-foreground truncate">{insights.bestPeriodName}</div>
                                <div className="text-xs text-emerald-500 font-medium mt-1 inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    +{insights.bestPeriodAlpha}% Alpha
                                </div>
                            </div>
                            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 border-border/50">
                        <CardContent className="p-5 flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Stability</p>
                                <div className="text-2xl font-bold text-foreground">{insights.stabilityScore}/100</div>
                                <p className="text-xs text-muted-foreground font-medium mt-1">
                                    Return Consistency
                                </p>
                            </div>
                            <div className="p-2 bg-violet-500/10 rounded-lg text-violet-500">
                                <Activity className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}