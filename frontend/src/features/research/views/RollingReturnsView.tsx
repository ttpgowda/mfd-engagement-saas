"use client";

import React, { useEffect, useState } from 'react';
import {
    Waves, X, Search, Check, Loader2
} from 'lucide-react';
import {
    Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
    Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command, CommandInput, CommandEmpty, CommandGroup, CommandItem,
} from "@/components/ui/command";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import { researchService, RollingReturnsResponse, SchemeDropdownDto } from '@/services/researchService';
import { cn } from "@/lib/utils";

export default function RollingReturnsView() {
    const [categories, setCategories] = useState<string[]>([]);
    const [category, setCategory] = useState("");
    const [schemes, setSchemes] = useState<SchemeDropdownDto[]>([]);

    // Config
    const [selectedFunds, setSelectedFunds] = useState<SchemeDropdownDto[]>([]);
    const [period, setPeriod] = useState("3Y");
    const [startDate] = useState("2015-01-01"); // Default lookback start

    // Data
    const [data, setData] = useState<RollingReturnsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [comboOpen, setComboOpen] = useState(false);

    // Initial Load
    useEffect(() => {
        researchService.getCategories().then(cats => {
            setCategories(cats);
            if (cats.length > 0) setCategory(cats.includes("Equity") ? "Equity" : cats[0]);
        });
    }, []);

    useEffect(() => {
        if (!category) return;
        researchService.getSchemesByCategory(category).then(setSchemes);
    }, [category]);

    const calculate = async () => {
        if (selectedFunds.length === 0) return;
        setLoading(true);
        try {
            const res = await researchService.calculateRollingReturns({
                schemeCodes: selectedFunds.map(f => f.schemeCode),
                period,
                startDate // Optional: send to filter backend graph data
            });
            setData(res);
        } finally {
            setLoading(false);
        }
    };

    // Chart Data Preparation
    const chartData = React.useMemo(() => {
        if (!data || !data.funds.length) return [];
        // Align data based on the first fund
        const base = data.funds[0].dataPoints;
        return base.map((p) => {
            // Define a type for the dynamic point
            interface ChartPoint {
                date: string;
                [key: string]: string | number;
            }

            const point: ChartPoint = { date: p.date };
            data.funds.forEach(fund => {
                const match = fund.dataPoints.find(dp => dp.date === p.date);
                if (match) point[`fund_${fund.schemeCode}`] = match.returnVal;
            });
            return point;
        });
    }, [data]);

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

    return (
        <div className="space-y-6 animate-in fade-in duration-700 pb-20">
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Waves className="w-6 h-6 text-emerald-500" />
                    Rolling Returns Analysis
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Evaluate fund consistency over every {period} period. The &#34;Gold Standard&#34; of performance analysis.
                </p>
            </div>

            {/* Config Card */}
            <Card className="border-border/50 shadow-md">
                <CardHeader className="bg-muted/10 pb-4 border-b border-border/50">
                    <CardTitle className="text-base">Analysis Configuration</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">

                        {/* 1. Category Selector */}
                        {/* Added min-w-0 to prevent flex item overflow */}
                        <div className="space-y-2 lg:col-span-1 min-w-0">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Category</label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="w-full h-10 bg-background border-input/60 shadow-sm">
                                    {/* TRUNCATE FIX: Ensures long category names don't break layout */}
                                    <span className="truncate text-left block w-full pr-2">
                                        <SelectValue placeholder="Select Category" />
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* 2. Fund Search (Max 3) */}
                        {/* Added min-w-0 and adjusted col-span */}
                        <div className="space-y-2 lg:col-span-2 min-w-0">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Add Funds (Max 3)</label>
                            <Popover open={comboOpen} onOpenChange={setComboOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between font-normal text-muted-foreground h-10 bg-background border-input/60 shadow-sm px-3"
                                    >
                                        {/* TRUNCATE FIX: Prevents button from expanding beyond grid column */}
                                        <span className="truncate">Select Fund...</span>
                                        <Search className="ml-2 h-4 w-4 opacity-50 shrink-0" />
                                    </Button>
                                </PopoverTrigger>

                                {/* WIDTH FIX: Matches the trigger button width exactly using CSS var */}
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[300px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search funds..." />
                                        <CommandEmpty>No fund found.</CommandEmpty>
                                        <CommandGroup className="max-h-[250px] overflow-auto">
                                            {schemes.map(s => (
                                                <CommandItem key={s.schemeCode} value={s.schemeName} onSelect={() => {
                                                    if (selectedFunds.length < 3 && !selectedFunds.find(f => f.schemeCode === s.schemeCode)) {
                                                        setSelectedFunds([...selectedFunds, s]);
                                                    }
                                                    setComboOpen(false);
                                                }}>
                                                    <Check className={cn("mr-2 h-4 w-4", selectedFunds.find(f => f.schemeCode === s.schemeCode) ? "opacity-100" : "opacity-0")} />
                                                    <span className="truncate">{s.schemeName}</span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2 lg:col-span-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Rolling Period</label>
                            <Select value={period} onValueChange={setPeriod}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1Y">1 Year</SelectItem>
                                    <SelectItem value="3Y">3 Years</SelectItem>
                                    <SelectItem value="5Y">5 Years</SelectItem>
                                    <SelectItem value="7Y">7 Years</SelectItem>
                                    <SelectItem value="10Y">10 Years</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {selectedFunds.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {selectedFunds.map((f, i) => (
                                <Badge
                                    key={f.schemeCode}
                                    variant="secondary"
                                    className="pl-2 pr-1 py-1 h-auto min-h-[28px] border border-border bg-background hover:bg-muted flex items-center max-w-full" >
                                    <div className="w-2 h-2 rounded-full mr-2 shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="truncate text-xs max-w-[180px] sm:max-w-[300px]" title={f.schemeName}>
                                        {f.schemeName}
                                    </span>
                                    <button
                                        onClick={() => setSelectedFunds(selectedFunds.filter(x => x.schemeCode !== f.schemeCode))}
                                        className="ml-2 hover:text-red-500 shrink-0 p-0.5 rounded-full hover:bg-red-50 transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}

                    <Button onClick={calculate} disabled={loading || selectedFunds.length === 0} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Waves className="w-4 h-4 mr-2" />}
                        Run Analysis
                    </Button>
                </CardContent>
            </Card>

            {/* Results */}
            {data && (
                <div className="grid grid-cols-1 gap-6">
                    {/* Graph */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium uppercase tracking-wide">
                                Rolling Returns History ({period} Period)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[450px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={50} tickFormatter={(val) => new Date(val).getFullYear().toString()} />
                                    <YAxis tickFormatter={(val) => `${val}%`} domain={['auto', 'auto']} />
                                    <Tooltip labelFormatter={(v) => new Date(v).toLocaleDateString()} formatter={(val: number) => `${val.toFixed(2)}%`} />
                                    <Legend />
                                    <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
                                    {data.funds.map((f, i) => (
                                        <Line key={f.schemeCode} type="monotone" dataKey={`fund_${f.schemeCode}`} name={f.schemeName} stroke={COLORS[i]} strokeWidth={2} dot={false} />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Stats Table */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.funds.map((f, i) => (
                            <Card key={f.schemeCode} className="border-t-4" style={{ borderColor: COLORS[i] }}>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold truncate" title={f.schemeName}>{f.schemeName}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase">Average</p>
                                            <p className="text-xl font-bold">{f.stats.average.toFixed(2)}%</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase">Max (Best)</p>
                                            <p className="text-xl font-bold text-emerald-600">{f.stats.max.toFixed(2)}%</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase">Min (Worst)</p>
                                            <p className="text-xl font-bold text-red-500">{f.stats.min.toFixed(2)}%</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase">Negative Periods</p>
                                            <p className="text-xl font-bold text-orange-500">{f.stats.negativePercent.toFixed(1)}%</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}