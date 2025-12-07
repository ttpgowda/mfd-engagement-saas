"use client";

import React, { useEffect, useState } from 'react';
import {
    Scale, Landmark, TrendingUp, Search, Check
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
import { researchService, FdVsDebtResponse, SchemeDropdownDto } from '@/services/researchService';
import { cn } from "@/lib/utils";
import { Loader2 } from 'lucide-react';

import { ErrorAlert } from '@/components/ui/ErrorAlert';

export default function FdVsDebtView() {
    // --- State ---
    const [categories, setCategories] = useState<string[]>([]);
    const [category, setCategory] = useState("");
    const [schemes, setSchemes] = useState<SchemeDropdownDto[]>([]);

    // Inputs
    const [amount, setAmount] = useState(100000);
    const [fdRate, setFdRate] = useState(7.0);
    const [taxRate, setTaxRate] = useState(30);
    const [startDate, setStartDate] = useState("2023-01-01");
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedScheme, setSelectedScheme] = useState<SchemeDropdownDto | null>(null);

    // Data
    const [data, setData] = useState<FdVsDebtResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [comboOpen, setComboOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial Load
    useEffect(() => {
        researchService.getCategories().then(cats => {
            setCategories(cats);
            // Default to a Debt category if available
            const debtCat = cats.find(c => c.toLowerCase().includes("debt")) || cats[0];
            if (debtCat) setCategory(debtCat);
        });
    }, []);

    // Load Schemes
    useEffect(() => {
        if (!category) return;
        researchService.getSchemesByCategory(category).then(setSchemes);
    }, [category]);

    const handleCalculate = async () => {
        if (!selectedScheme) return;
        setLoading(true);
        setError(null); // Reset error
        try {
            const res = await researchService.compareFdVsDebt({
                investmentAmount: amount,
                fdInterestRate: fdRate,
                debtSchemeCode: selectedScheme.schemeCode,
                startDate,
                endDate,
                taxRate
            });
            setData(res);
        } catch (err: unknown) {
            console.error(err);
            const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || "An unexpected error occurred. Please verify dates and try again.";
            setError(msg);
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
                    <Scale className="w-6 h-6 text-emerald-500" />
                    Debt Funds vs Fixed Deposit
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Compare post-tax returns of Debt Mutual Funds against traditional Fixed Deposits.
                </p>
            </div>

            {/* Input Card */}
            <Card className="border-border/50 shadow-md bg-card">
                <CardHeader className="bg-muted/10 pb-4 border-b border-border/50">
                    <CardTitle className="text-base text-blue-600 dark:text-blue-400">Comparison Parameters</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">

                    {/* Top Row: FD vs Debt Config */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* 1. FD Configuration */}
                        <div className="space-y-4 p-4 rounded-xl bg-orange-50/50 dark:bg-orange-950/10 border border-orange-100 dark:border-orange-900/30">
                            <div className="flex items-center gap-2 mb-2">
                                <Landmark className="w-4 h-4 text-orange-600" />
                                <h3 className="text-sm font-bold text-orange-700 dark:text-orange-400">Fixed Deposit</h3>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Deposit Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                                    <Input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        className="pl-7 bg-background"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Interest Rate (%)</label>
                                <Input
                                    type="number"
                                    value={fdRate}
                                    onChange={(e) => setFdRate(Number(e.target.value))}
                                    className="bg-background"
                                />
                            </div>
                        </div>

                        {/* 2. Debt Fund Configuration */}
                        <div className="space-y-4 p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                                <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Debt Mutual Fund</h3>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Category</label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="bg-background h-10 w-full">
                                        {/* TRUNCATION FIX: Wraps text to prevent layout breaking */}
                                        <span className="truncate text-left block w-full pr-2">
                                            <SelectValue />
                                        </span>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Scheme</label>
                                <Popover open={comboOpen} onOpenChange={setComboOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" className="w-full justify-between bg-background text-muted-foreground font-normal h-10 px-3">
                                            <span className="truncate">{selectedScheme ? selectedScheme.schemeName : "Select Fund..."}</span>
                                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search debt fund..." />
                                            <CommandEmpty>No fund found.</CommandEmpty>
                                            <CommandGroup className="max-h-[250px] overflow-auto">
                                                {schemes.map((s) => (
                                                    <CommandItem
                                                        key={s.schemeCode}
                                                        value={s.schemeName}
                                                        onSelect={() => {
                                                            setSelectedScheme(s);
                                                            setComboOpen(false);
                                                        }}
                                                    >
                                                        <Check className={cn("mr-2 h-4 w-4", selectedScheme?.schemeCode === s.schemeCode ? "opacity-100" : "opacity-0")} />
                                                        <span className="truncate">{s.schemeName}</span>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>

                    {/* Common Params: Dates & Tax */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Start Date</label>
                            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">End Date</label>
                            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Tax Slab (%)</label>
                            <Select value={taxRate.toString()} onValueChange={(v) => setTaxRate(Number(v))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">0% (No Tax)</SelectItem>
                                    <SelectItem value="10">10%</SelectItem>
                                    <SelectItem value="20">20%</SelectItem>
                                    <SelectItem value="30">30%</SelectItem>
                                    <SelectItem value="39">39% (Highest)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button onClick={handleCalculate} disabled={loading || !selectedScheme} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Compare Returns"}
                    </Button>

                </CardContent>
            </Card>

            <ErrorAlert message={error} />

            {/* Results */}
            {data && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Comparison Summary */}
                    <Card className="lg:col-span-3 border-border/50 shadow-sm bg-gradient-to-br from-background to-muted/20">
                        <CardHeader className="text-center pb-2">
                            <CardTitle className="text-xl">Analysis Summary</CardTitle>
                            <CardDescription>
                                {data.debtWins
                                    ? <span className="text-emerald-600 font-bold flex items-center justify-center gap-1"><TrendingUp className="w-4 h-4" /> Debt Fund Wins by {fmt(data.wealthDifference)}</span>
                                    : <span className="text-orange-600 font-bold flex items-center justify-center gap-1"><Landmark className="w-4 h-4" /> Fixed Deposit Wins by {fmt(Math.abs(data.wealthDifference))}</span>}
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Left: FD Result */}
                    <ResultCard
                        title="Fixed Deposit"
                        icon={Landmark}
                        colorClass="text-orange-600"
                        bgClass="bg-orange-50 dark:bg-orange-950/10"
                        data={{
                            maturity: data.fdMaturityValue,
                            profit: data.fdPreTaxProfit,
                            tax: data.fdTaxLiability,
                            postTax: data.fdPostTaxValue,
                            xirr: data.fdPostTaxReturnPercent
                        }}
                    />

                    {/* Right: Debt Result */}
                    <ResultCard
                        title="Debt Mutual Fund"
                        subTitle={data.schemeName}
                        icon={TrendingUp}
                        colorClass="text-emerald-600"
                        bgClass="bg-emerald-50 dark:bg-emerald-950/10"
                        isWinner={data.debtWins}
                        data={{
                            maturity: data.debtMaturityValue,
                            profit: data.debtPreTaxProfit,
                            tax: data.debtTaxLiability,
                            postTax: data.debtPostTaxValue,
                            xirr: data.debtPostTaxReturnPercent
                        }}
                    />

                    {/* Tax Impact Breakdown Table (Full Width) */}
                    <Card className="lg:col-span-3 border-border/50">
                        <CardHeader className="bg-muted/10 py-3 border-b border-border/50">
                            <CardTitle className="text-sm font-bold uppercase">Taxation Impact Breakdown</CardTitle>
                        </CardHeader>
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/30 text-muted-foreground font-medium">
                                    <tr>
                                        <th className="px-6 py-3">Metric</th>
                                        <th className="px-6 py-3 text-right">Fixed Deposit</th>
                                        <th className="px-6 py-3 text-right text-emerald-700 dark:text-emerald-400">Debt Fund</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    <tr className="hover:bg-muted/10">
                                        <td className="px-6 py-3 font-medium text-muted-foreground">Pre-Tax Profit</td>
                                        <td className="px-6 py-3 text-right font-mono">{fmt(data.fdPreTaxProfit)}</td>
                                        <td className="px-6 py-3 text-right font-mono font-bold">{fmt(data.debtPreTaxProfit)}</td>
                                    </tr>
                                    <tr className="hover:bg-muted/10">
                                        <td className="px-6 py-3 font-medium text-muted-foreground">Tax Payable ({taxRate}%)</td>
                                        <td className="px-6 py-3 text-right text-red-500 font-mono">-{fmt(data.fdTaxLiability)}</td>
                                        <td className="px-6 py-3 text-right text-red-500 font-mono">-{fmt(data.debtTaxLiability)}</td>
                                    </tr>
                                    <tr className="bg-muted/5 font-bold">
                                        <td className="px-6 py-3 text-foreground">Net Post-Tax Profit</td>
                                        <td className="px-6 py-3 text-right text-orange-600">{fmt(data.fdPostTaxValue - amount)}</td>
                                        <td className="px-6 py-3 text-right text-emerald-600">{fmt(data.debtPostTaxValue - amount)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

// Helper Component for Result Cards
interface ResultCardProps {
    title: string;
    subTitle?: string;
    icon: React.ElementType;
    colorClass: string;
    bgClass: string;
    data: {
        maturity: number;
        profit?: number;
        tax?: number;
        postTax: number;
        xirr: number;
    };
    isWinner?: boolean;
}

function ResultCard({ title, subTitle, icon: Icon, colorClass, bgClass, data, isWinner }: ResultCardProps) {
    const fmt = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    return (
        <Card className={`lg:col-span-1.5 border-border/50 shadow-sm relative overflow-hidden ${isWinner ? 'ring-2 ring-emerald-500/50' : ''}`}>
            {isWinner && <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold uppercase">Winner</div>}
            <CardHeader className={`${bgClass} border-b border-border/10 pb-4`}>
                <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-white/80 dark:bg-black/20 ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div>
                        <CardTitle className={`text-base ${colorClass}`}>{title}</CardTitle>
                        {subTitle && <CardDescription className="line-clamp-1 text-xs mt-0.5" title={subTitle}>{subTitle}</CardDescription>}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-border/40 pb-3">
                    <span className="text-sm text-muted-foreground">Maturity Value</span>
                    <span className="text-lg font-bold text-foreground">{fmt(data.maturity)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs uppercase font-semibold text-muted-foreground">Net Post-Tax Return</span>
                    <Badge variant="outline" className={`${colorClass} bg-transparent border-current`}>
                        {data.xirr.toFixed(2)}%
                    </Badge>
                </div>
                <div className="pt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Post-Tax Value</span>
                    </div>
                    <div className={`text-2xl font-black ${colorClass}`}>
                        {fmt(data.postTax)}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}