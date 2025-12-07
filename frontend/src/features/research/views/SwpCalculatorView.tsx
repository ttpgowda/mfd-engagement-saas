"use client";

import React, { useEffect, useState } from 'react';
import {
    ArrowDownCircle, Wallet, Search, Calendar, Check, TrendingDown
} from 'lucide-react';
import {
    Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
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
import { researchService, SwpResponse, SchemeDropdownDto } from '@/services/researchService';
import { cn } from "@/lib/utils";
import { Loader2 } from 'lucide-react';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

export default function SwpCalculatorView() {
    // Data State
    const [categories, setCategories] = useState<string[]>([]);
    const [category, setCategory] = useState("");
    const [schemes, setSchemes] = useState<SchemeDropdownDto[]>([]);

    // Form State
    const [selectedScheme, setSelectedScheme] = useState<SchemeDropdownDto | null>(null);
    const [lumpsum, setLumpsum] = useState(1000000);
    const [withdrawal, setWithdrawal] = useState(6000); // Rule of thumb: 6-8% annual
    const [investDate, setInvestDate] = useState("2018-01-01");
    const [swpStartDate, setSwpStartDate] = useState("2018-02-01");
    const [swpEndDate, setSwpEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [frequency, setFrequency] = useState("Monthly");

    // Result State
    const [result, setResult] = useState<SwpResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [comboOpen, setComboOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial Load
    useEffect(() => {
        researchService.getCategories().then(cats => {
            setCategories(cats);
            const hybridCat = cats.find(c => c.includes("Hybrid") || c.includes("Balanced"));
            if(hybridCat) setCategory(hybridCat);
            else if(cats.length) setCategory(cats[0]);
        });
    }, []);

    // Load Schemes
    useEffect(() => {
        if (!category) return;
        researchService.getSchemesByCategory(category).then(setSchemes);
    }, [category]);

    const calculate = async () => {
        if (!selectedScheme) return;
        setLoading(true);
        try {
            const res = await researchService.calculateSwp({
                schemeCode: selectedScheme.schemeCode,
                initialInvestmentAmount: lumpsum,
                investmentDate: investDate,
                withdrawalAmount: withdrawal,
                swpStartDate,
                swpEndDate,
                frequency
            });
            setResult(res);
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "An unexpected error occurred. Please verify dates and try again.";
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
                    <ArrowDownCircle className="w-6 h-6 text-emerald-500" />
                    SWP Calculator
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Generate regular income from your investments while keeping capital invested.
                </p>
            </div>

            {/* Input Card */}
            <Card className="border-border/50 shadow-md">
                <CardHeader className="bg-muted/10 pb-4 border-b border-border/50">
                    <CardTitle className="text-base text-blue-600">Withdrawal Configuration</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">

                    {/* Fund Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Category</label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="bg-background h-10 w-full">
                                    <span className="truncate text-left block w-full pr-2"><SelectValue /></span>
                                </SelectTrigger>
                                <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Select Scheme</label>
                            <Popover open={comboOpen} onOpenChange={setComboOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" className="w-full justify-between bg-background font-normal text-muted-foreground h-10 px-3">
                                        <span className="truncate">{selectedScheme ? selectedScheme.schemeName : "Select Fund..."}</span>
                                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[300px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search fund..." />
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

                    {/* Amounts */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Initial Lumpsum</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                                <Input type="number" value={lumpsum} onChange={e => setLumpsum(Number(e.target.value))} className="pl-7 h-10" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Monthly Withdrawal</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                                <Input type="number" value={withdrawal} onChange={e => setWithdrawal(Number(e.target.value))} className="pl-7 h-10" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Frequency</label>
                            <Select value={frequency} onValueChange={setFrequency}>
                                <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Investment Date</label>
                            <Input type="date" value={investDate} onChange={e => setInvestDate(e.target.value)} className="h-10" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">SWP Start Date</label>
                            <Input type="date" value={swpStartDate} onChange={e => setSwpStartDate(e.target.value)} className="h-10" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">End Date</label>
                            <Input type="date" value={swpEndDate} onChange={e => setSwpEndDate(e.target.value)} className="h-10" />
                        </div>
                        <div className="flex items-end">
                            <Button onClick={calculate} disabled={loading || !selectedScheme} className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Calculate SWP"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <ErrorAlert message={error} />
            {/* Results */}
            {result && (
                <div className="space-y-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SummaryCard label="Total Invested" value={lumpsum} subLabel="One-time" />
                        <SummaryCard label="Total Withdrawn" value={result.totalWithdrawn} subLabel="Cash back to you" color="text-emerald-600" />
                        <SummaryCard label="Current Value" value={result.finalValue} subLabel="Remaining in Fund" color="text-blue-600" bold />
                        <SummaryCard label="Net Profit" value={result.totalProfit} subLabel="(Withdrawn + Current) - Invested" color={result.totalProfit >= 0 ? "text-emerald-600" : "text-red-500"} />
                    </div>

                    {/* Chart */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="py-4 border-b border-border/50 bg-muted/10">
                            <CardTitle className="text-sm font-medium uppercase tracking-wide">Fund Value vs Withdrawal</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[350px] pt-6 pr-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={result.ledger} margin={{ top: 10, right: 0, left: 20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" tickFormatter={(val) => new Date(val).getFullYear().toString()} minTickGap={50} tick={{fontSize: 12, fill: '#888'}} />
                                    <YAxis tickFormatter={(val) => `₹${val/1000}k`} tick={{fontSize: 12, fill: '#888'}} />
                                    <Tooltip labelFormatter={(v) => new Date(v).toLocaleDateString()} formatter={(val: number) => fmt(val)} contentStyle={{borderRadius:'8px'}}/>
                                    <Legend />
                                    <Area type="monotone" dataKey="currentValue" name="Fund Value" stroke="#2563eb" fill="url(#colorValue)" strokeWidth={2} />
                                    {/* Optional: Add Invested Line */}
                                    <Area type="monotone" dataKey={() => lumpsum} name="Initial Capital" stroke="#94a3b8" fill="none" strokeDasharray="5 5" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Ledger Table */}
                    <Card className="border-border/50 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-border/50 bg-muted/10">
                            <h3 className="font-bold text-foreground">Withdrawal Schedule</h3>
                        </div>
                        <div className="overflow-x-auto max-h-[500px]">
                            <table className="w-full text-sm text-left relative">
                                <thead className="bg-muted/50 text-muted-foreground font-medium text-xs uppercase sticky top-0 z-10 backdrop-blur-md">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3 text-right">NAV</th>
                                    <th className="px-6 py-3 text-right text-emerald-600">Cash Flow</th>
                                    <th className="px-6 py-3 text-right">Units Balance</th>
                                    <th className="px-6 py-3 text-right">Fund Value</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                {result.ledger.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-6 py-3 font-medium whitespace-nowrap">{new Date(row.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-3 text-right text-muted-foreground">{row.nav.toFixed(4)}</td>
                                        <td className={`px-6 py-3 text-right font-mono font-medium ${row.cashFlow > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                                            {row.cashFlow > 0 ? '+' : ''}{fmt(row.cashFlow)}
                                        </td>
                                        <td className="px-6 py-3 text-right text-muted-foreground">{row.balanceUnits.toFixed(3)}</td>
                                        <td className="px-6 py-3 text-right font-bold text-foreground">{fmt(row.currentValue)}</td>
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