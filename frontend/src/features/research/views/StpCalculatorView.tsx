"use client";

import React, { useEffect, useState } from 'react';
import {
    ArrowRightLeft, TrendingUp, Search, Calendar, Check, ArrowDownCircle, ArrowUpCircle
} from 'lucide-react';
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { researchService, StpResponse, SchemeDropdownDto } from '@/services/researchService';
import { cn } from "@/lib/utils";
import { Loader2 } from 'lucide-react';

export default function StpCalculatorView() {
    // Data Loading State
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<StpResponse | null>(null);

    // Form State
    const [initialAmount, setInitialAmount] = useState(1000000);
    const [transferAmount, setTransferAmount] = useState(25000);
    const [frequency, setFrequency] = useState("Monthly");
    const [investDate, setInvestDate] = useState("2022-01-01");
    const [stpDate, setStpDate] = useState("2022-02-01");
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    // Source Fund Selector
    const [sourceCat, setSourceCat] = useState("Debt: Liquid");
    const [sourceFund, setSourceFund] = useState<SchemeDropdownDto | null>(null);

    // Target Fund Selector
    const [targetCat, setTargetCat] = useState("Equity: Large Cap");
    const [targetFund, setTargetFund] = useState<SchemeDropdownDto | null>(null);

    // Initial Load
    useEffect(() => {
        researchService.getCategories().then(setCategories);
    }, []);

    const calculate = async () => {
        if (!sourceFund || !targetFund) return;
        setLoading(true);
        try {
            const res = await researchService.calculateStp({
                initialInvestmentAmount: initialAmount,
                transferAmount,
                sourceSchemeCode: sourceFund.schemeCode,
                targetSchemeCode: targetFund.schemeCode,
                startDate: investDate,
                stpStartDate: stpDate,
                endDate,
                frequency
            });
            setResult(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fmt = (val: number) => new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(val);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <ArrowRightLeft className="w-6 h-6 text-emerald-500" />
                    STP Calculator
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Systematic Transfer Plan: Simulate transferring wealth from Debt to Equity.
                </p>
            </div>

            {/* Config Card */}
            <Card className="border-border/50 shadow-md">
                <CardHeader className="bg-muted/10 pb-4 border-b border-border/50">
                    <CardTitle className="text-base text-blue-600">Transfer Configuration</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-8">

                    {/* Fund Selection Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                        {/* Source Box */}
                        <div className="space-y-4 p-4 border border-orange-200 bg-orange-50/50 dark:bg-orange-950/10 rounded-xl relative">
                            <Badge className="absolute -top-3 left-4 bg-orange-500 hover:bg-orange-600 shadow-sm">Source (From)</Badge>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground">Category</label>
                                <Select value={sourceCat} onValueChange={setSourceCat}>
                                    <SelectTrigger className="bg-background w-full h-9 text-xs"><span className="truncate text-left block w-full pr-2"><SelectValue /></span></SelectTrigger>
                                    <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground">Fund</label>
                                <FundCombobox category={sourceCat} selected={sourceFund} onSelect={setSourceFund} placeholder="Select Liquid Fund..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground">Lumpsum Investment</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                                    <Input type="number" value={initialAmount} onChange={e => setInitialAmount(Number(e.target.value))} className="pl-7 bg-background h-9" />
                                </div>
                            </div>
                        </div>

                        {/* Arrow Icon */}
                        <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
                            <div className="bg-background p-2 rounded-full border shadow-sm z-10">
                                <ArrowRightLeft className="w-5 h-5 text-muted-foreground" />
                            </div>
                        </div>

                        {/* Target Box */}
                        <div className="space-y-4 p-4 border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-xl relative">
                            <Badge className="absolute -top-3 left-4 bg-emerald-600 hover:bg-emerald-700 shadow-sm">Target (To)</Badge>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground">Category</label>
                                <Select value={targetCat} onValueChange={setTargetCat}>
                                    <SelectTrigger className="bg-background w-full h-9 text-xs"><span className="truncate text-left block w-full pr-2"><SelectValue /></span></SelectTrigger>
                                    <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground">Fund</label>
                                <FundCombobox category={targetCat} selected={targetFund} onSelect={setTargetFund} placeholder="Select Equity Fund..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground">Transfer Amount (STP)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                                    <Input type="number" value={transferAmount} onChange={e => setTransferAmount(Number(e.target.value))} className="pl-7 bg-background h-9" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">Initial Invest Date</label>
                            <Input type="date" value={investDate} onChange={e => setInvestDate(e.target.value)} className="h-9" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">STP Start Date</label>
                            <Input type="date" value={stpDate} onChange={e => setStpDate(e.target.value)} className="h-9" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">End Date</label>
                            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="h-9" />
                        </div>
                        <div className="flex items-end">
                            <Button onClick={calculate} disabled={loading || !sourceFund || !targetFund} className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Run Simulation"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {result && (
                <div className="space-y-8">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SummaryCard label="Total Invested" value={result.totalValue - result.totalProfit} subLabel="Initial Capital" />
                        <SummaryCard label="Transferred Amount" value={result.totalTransferred} subLabel="Moved to Target" color="text-blue-600" />
                        <SummaryCard label="Current Value" value={result.totalValue} subLabel="Combined Portfolio" color="text-emerald-600" bold />
                        <SummaryCard label="Net Profit" value={result.totalProfit} subLabel={`${((result.totalProfit / initialAmount) * 100).toFixed(2)}% Return`} color={result.totalProfit >= 0 ? "text-emerald-600" : "text-red-500"} />
                    </div>

                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="py-4 border-b border-border/50 bg-muted/10">
                            <CardTitle className="text-sm font-medium uppercase tracking-wide">Portfolio Value Over Time</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[350px] pt-6 pr-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={result.ledger} margin={{ top: 10, right: 0, left: 20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorSource" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" tickFormatter={(val) => new Date(val).getFullYear().toString()} minTickGap={50} tick={{fontSize: 12, fill: '#888'}} />
                                    <YAxis tickFormatter={(val) => `₹${val/1000}k`} tick={{fontSize: 12, fill: '#888'}} />
                                    <Tooltip
                                        labelFormatter={(v) => new Date(v).toLocaleDateString()}
                                        formatter={(val: number) => fmt(val)}
                                        contentStyle={{borderRadius: '8px', border:'1px solid #e2e8f0'}}
                                    />
                                    <Legend />
                                    <Area type="monotone" dataKey="targetMarketValue" name="Target Fund (Equity)" stackId="1" stroke="#10b981" fill="url(#colorTarget)" />
                                    <Area type="monotone" dataKey="sourceMarketValue" name="Source Fund (Debt)" stackId="1" stroke="#f97316" fill="url(#colorSource)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-border/50 bg-muted/10 flex justify-between items-center">
                            <h3 className="font-bold text-foreground flex items-center gap-2">
                                <Search className="w-4 h-4 text-muted-foreground" />
                                Transaction Ledger
                            </h3>
                            <Badge variant="outline" className="font-mono text-xs">
                                {result.ledger.length} Transactions
                            </Badge>
                        </div>
                        <div className="overflow-x-auto max-h-[500px]">
                            <table className="w-full text-sm text-left relative">
                                <thead className="bg-muted/50 text-muted-foreground font-medium text-xs uppercase sticky top-0 z-10 backdrop-blur-md">
                                <tr>
                                    <th className="px-4 py-3 min-w-[100px]">Date</th>
                                    <th className="px-4 py-3 text-center border-l border-border/50 bg-orange-50/50 dark:bg-orange-900/10 text-orange-700 dark:text-orange-400">
                                        Source Fund (Sell)
                                    </th>
                                    <th className="px-4 py-3 text-center border-l border-border/50 bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400">
                                        Target Fund (Buy)
                                    </th>
                                    <th className="px-4 py-3 text-right border-l border-border/50">Total Value</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                {result.ledger.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-4 py-3 font-medium whitespace-nowrap text-muted-foreground">
                                            {new Date(row.date).toLocaleDateString()}
                                            <div className="text-[10px] uppercase mt-0.5 opacity-60">{row.type.replace('_', ' ')}</div>
                                        </td>
                                        <td className="px-4 py-3 border-l border-border/50">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-muted-foreground">
                                                    {/* SAFE CHECK: Handle potential nulls in NAV */}
                                                    NAV: {row.sourceNav ? row.sourceNav.toFixed(2) : '-'}
                                                </span>
                                                <span className="text-orange-600 font-mono">
                                                    {row.unitsSold && row.unitsSold > 0 ? `-${row.unitsSold.toFixed(2)} Units` : '-'}
                                                </span>
                                            </div>
                                            <div className="text-right font-mono text-xs font-medium text-orange-700 dark:text-orange-400">
                                                {fmt(row.sourceMarketValue)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border-l border-border/50">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-muted-foreground">
                                                    {/* FIX: Ensure targetNav is not null before toFixed() */}
                                                    NAV: {row.targetNav ? row.targetNav.toFixed(2) : '-'}
                                                </span>
                                                <span className="text-emerald-600 font-mono">
                                                    {row.unitsBought && row.unitsBought > 0 ? `+${row.unitsBought.toFixed(2)} Units` : '-'}
                                                </span>
                                            </div>
                                            <div className="text-right font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                                {fmt(row.targetMarketValue)}
                                            </div>
                                        </td>

                                        {/* Total */}
                                        <td className="px-4 py-3 text-right border-l border-border/50 font-mono font-bold text-foreground">
                                            {fmt(row.totalPortfolioValue)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

// --- Helper Components ---

function SummaryCard({ label, value, subLabel, color = "text-foreground", bold }: any) {
    const fmt = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    return (
        <Card className="bg-card border-border/50 shadow-sm">
            <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                <p className={`text-lg ${bold ? 'font-black' : 'font-bold'} ${color} tracking-tight`}>{fmt(value)}</p>
                {subLabel && <p className="text-[10px] text-muted-foreground mt-1">{subLabel}</p>}
            </CardContent>
        </Card>
    );
}

function FundCombobox({ category, selected, onSelect, placeholder }: any) {
    const [open, setOpen] = useState(false);
    const [list, setList] = useState<SchemeDropdownDto[]>([]);

    useEffect(() => {
        if(open && category) {
            researchService.getSchemesByCategory(category).then(setList);
        }
    }, [open, category]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between bg-background font-normal text-muted-foreground h-9 px-3 text-xs border-input/60 shadow-sm">
                    <span className="truncate text-left block w-full pr-2">{selected ? selected.schemeName : placeholder}</span>
                    <Search className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[280px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search fund..." className="h-8 text-xs" />
                    <CommandEmpty>No fund found.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-auto">
                        {list.map((s) => (
                            <CommandItem
                                key={s.schemeCode}
                                value={s.schemeName}
                                onSelect={() => {
                                    onSelect(s);
                                    setOpen(false);
                                }}
                                className="text-xs py-1.5"
                            >
                                <Check className={cn("mr-2 h-3 w-3", selected?.schemeCode === s.schemeCode ? "opacity-100" : "opacity-0")} />
                                <span className="truncate">{s.schemeName}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}