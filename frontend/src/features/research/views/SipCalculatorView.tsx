"use client";

import React, { useEffect, useState } from 'react';
import {
    Calculator, X, Search, TrendingUp, Check, Loader2
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
import { Checkbox } from "@/components/ui/checkbox";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { researchService, HistoricalSipResponse, SchemeDropdownDto } from '@/services/researchService';
import { cn } from "@/lib/utils";
import { ErrorAlert } from '@/components/ui/ErrorAlert';

import { CalculatorViewProps } from '@/features/calculators/types';
import { ShareDialog } from '@/features/share/components/ShareDialog';
import { publicResearchService } from '@/services/publicResearchService';
import { PublicShareButton } from '@/features/share/components/PublicShareButton';

export default function SipCalculatorView({ defaultValues, isPublicView = false }: CalculatorViewProps) {
    // --- State ---
    const [categories, setCategories] = useState<string[]>([]);
    const [category, setCategory] = useState("");
    const [schemes, setSchemes] = useState<SchemeDropdownDto[]>([]);

    // Form State
    const [selectedFunds, setSelectedFunds] = useState<SchemeDropdownDto[]>([]);
    const [amount, setAmount] = useState(5000);
    const [frequency, setFrequency] = useState("Monthly");
    const [startDate, setStartDate] = useState("2020-01-01");
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [isStepUp, setIsStepUp] = useState(false);
    const [stepUpPercent, setStepUpPercent] = useState(10);

    const [error, setError] = useState<string | null>(null);

    // Results
    const [result, setResult] = useState<HistoricalSipResponse | null>(null);
    const [loading, setLoading] = useState(false);

    // 1. Initial Load of Defaults
    useEffect(() => {
        if (defaultValues?.amount) setAmount(defaultValues.amount);
        if (defaultValues?.frequency) setFrequency(defaultValues.frequency);
        if (defaultValues?.startDate) setStartDate(defaultValues.startDate);
        if (defaultValues?.endDate) setEndDate(defaultValues.endDate);
        if (defaultValues?.isStepUp !== undefined) setIsStepUp(defaultValues.isStepUp);
        if (defaultValues?.stepUpPercent) setStepUpPercent(defaultValues.stepUpPercent);
        if (defaultValues?.category) setCategory(defaultValues.category);
    }, [defaultValues]);

    // 2. Initial Load of Categories
    useEffect(() => {
        const service = isPublicView ? publicResearchService : researchService;
        service.getCategories().then(cats => {
            setCategories(cats);
            if (cats.length > 0 && !defaultValues?.category) setCategory(cats.includes("Equity") ? "Equity" : cats[0]);
        });
    }, [isPublicView, defaultValues]);

    // 3. Load Schemes on Category Change AND Restore Funds
    useEffect(() => {
        if (!category) return;
        const service = isPublicView ? publicResearchService : researchService;

        service.getSchemesByCategory(category).then((list) => {
            setSchemes(list);

            // Restore Selected Funds logic
            if (defaultValues?.schemeCodes && Array.isArray(defaultValues.schemeCodes)) {
                const fundsToRestore = list.filter(s => defaultValues.schemeCodes.includes(s.schemeCode));
                // Only set if we found matches to avoid overwriting user selection with empty if no match
                if (fundsToRestore.length > 0) {
                    setSelectedFunds(fundsToRestore);
                }
            }
        });
    }, [category, isPublicView, defaultValues]);

    // Auto-Run for Public Views
    useEffect(() => {
        if (isPublicView && defaultValues && selectedFunds.length > 0 && !result && !loading) {
            calculate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPublicView, defaultValues, selectedFunds]);

    // Handlers
    const addFund = (fund: SchemeDropdownDto) => {
        if (selectedFunds.length >= 3) return;
        if (!selectedFunds.find(f => f.schemeCode === fund.schemeCode)) {
            setSelectedFunds([...selectedFunds, fund]);
        }
    };

    const removeFund = (code: number) => {
        setSelectedFunds(selectedFunds.filter(f => f.schemeCode !== code));
    };

    const calculate = async () => {
        if (selectedFunds.length === 0) return;
        setLoading(true);
        try {
            const service = isPublicView ? publicResearchService : researchService;
            const res = await service.calculateHistoricalSip({
                schemeCodes: selectedFunds.map(f => f.schemeCode),
                amount,
                frequency,
                startDate,
                endDate,
                stepUpPercentage: isStepUp ? stepUpPercent : 0
            });
            setResult(res);
        } catch (err) {
            console.error(err);
            const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || "An unexpected error occurred. Please verify dates and try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    // Helper for Combobox
    const [openCombo, setOpenCombo] = useState(false);

    interface ChartPoint {
        date: string;
        invested: number;
        [key: string]: string | number;
    }

    // Chart Data Preparation (Merge multiple lines)
    const chartData = React.useMemo(() => {
        if (!result || !result.results.length) return [];

        // Use the first fund's dates as the x-axis basis
        const baseData = result.results[0].chartData;

        return baseData.map((point, idx) => {
            const row: ChartPoint = { date: point.date, invested: point.invested };
            // Add value for each fund
            result.results.forEach((res, i) => {
                // Safety check for index
                if (res.chartData[idx]) {
                    row[`fund_${res.schemeCode}`] = res.chartData[idx].value;
                    row[`name_${res.schemeCode}`] = res.schemeName;
                }
            });
            return row;
        });
    }, [result]);

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-emerald-500" />
                            Mutual Fund SIP Calculator
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Backtest your SIP returns with actual historical data.
                        </p>
                    </div>
                    {isPublicView ? (
                        <PublicShareButton />
                    ) : (
                        <ShareDialog
                            toolSlug="research-sip"
                            config={{
                                category,
                                schemeCodes: selectedFunds.map(f => f.schemeCode),
                                amount,
                                frequency,
                                startDate,
                                endDate,
                                isStepUp,
                                stepUpPercent
                            }}
                            defaultTitle="SIP Returns Analysis"
                            defaultDescription={`Historical SIP analysis for ${selectedFunds.map(f => f.schemeName).join(', ')}.`}
                        />
                    )}
                </div>
            </div>

            {/* Input Card */}
            <Card className="border-border/50 shadow-md bg-card">
                <CardHeader className="bg-muted/10 pb-4 border-b border-border/50">
                    <CardTitle className="text-base text-blue-600 dark:text-blue-400">Configuration</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">

                    {/* Fund Selection Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Select Category</label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Add Funds (Max 3)</label>
                            <Popover open={openCombo} onOpenChange={setOpenCombo}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" aria-expanded={openCombo} className="w-full justify-between bg-background text-muted-foreground font-normal">
                                        Select Fund to Add...
                                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search fund name..." />
                                        <CommandEmpty>No fund found.</CommandEmpty>
                                        <CommandGroup className="max-h-[250px] overflow-auto">
                                            {schemes.map((s) => (
                                                <CommandItem
                                                    key={s.schemeCode}
                                                    value={s.schemeName}
                                                    onSelect={() => {
                                                        addFund(s);
                                                        setOpenCombo(false);
                                                    }}
                                                >
                                                    <Check className={cn("mr-2 h-4 w-4", selectedFunds.find(f => f.schemeCode === s.schemeCode) ? "opacity-100" : "opacity-0")} />
                                                    {s.schemeName}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Selected Funds List */}
                    {selectedFunds.length > 0 && (
                        <div className="flex flex-col gap-2 bg-muted/20 p-3 rounded-lg border border-border/50">
                            {selectedFunds.map((fund, idx) => (
                                <div key={fund.schemeCode} className="flex items-center justify-between bg-background p-2 rounded border border-border shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-xs font-bold text-muted-foreground">{idx + 1}</span>
                                        <span className="text-sm font-medium truncate max-w-[250px] sm:max-w-md">{fund.schemeName}</span>
                                    </div>
                                    <button onClick={() => removeFund(fund.schemeCode)} className="text-muted-foreground hover:text-red-500">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Params Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Installment Amount</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                                <Input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="pl-7" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Frequency</label>
                            <Select value={frequency} onValueChange={setFrequency}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end pb-2 gap-2">
                            <div className="flex items-center space-x-2 border p-2 rounded-md bg-muted/10 w-full h-10">
                                <Checkbox id="stepUp" checked={isStepUp} onCheckedChange={(c) => setIsStepUp(!!c)} />
                                <label htmlFor="stepUp" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Yearly Step-Up?
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Params Row 2 - Dates & StepUp */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Start Date</label>
                            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">End Date</label>
                            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                        </div>

                        {isStepUp && (
                            <div className="space-y-2 animate-in fade-in">
                                <label className="text-xs font-semibold text-blue-600 uppercase">Step-Up %</label>
                                <div className="relative">
                                    <Input type="number" value={stepUpPercent} onChange={e => setStepUpPercent(Number(e.target.value))} className="border-blue-200 focus:border-blue-500" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                                </div>
                            </div>
                        )}

                        {!isStepUp && <div className="hidden md:block"></div>}
                    </div>

                    <Button onClick={calculate} disabled={loading || selectedFunds.length === 0} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Calculator className="w-4 h-4 mr-2" />}
                        Calculate Returns
                    </Button>

                </CardContent>
            </Card>

            <ErrorAlert message={error} />
            {/* Results Section */}
            {result && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Summary Table */}
                    <Card className="lg:col-span-3 border-border/50 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-border/50 bg-muted/10">
                            <h3 className="font-semibold text-foreground">Summary Snapshot</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/30 text-muted-foreground font-medium border-b border-border/50">
                                    <tr>
                                        <th className="px-6 py-4">Fund Name</th>
                                        <th className="px-6 py-4 text-right">Total Invested</th>
                                        <th className="px-6 py-4 text-right">Current Value</th>
                                        <th className="px-6 py-4 text-right">Profit</th>
                                        {/* <th className="px-6 py-4 text-right">XIRR</th> */}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {result.results.map((row) => (
                                        <tr key={row.schemeCode} className="hover:bg-muted/10">
                                            <td className="px-6 py-4 font-medium">{row.schemeName}</td>
                                            <td className="px-6 py-4 text-right text-muted-foreground">
                                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(row.totalInvested))}
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-foreground">
                                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(row.currentValue))}
                                            </td>
                                            <td className={`px-6 py-4 text-right font-bold ${Number(row.absoluteReturn) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(row.absoluteReturn))}
                                            </td>
                                            {/* <td className="px-6 py-4 text-right font-mono">{row.xirr}%</td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Comparison Chart */}
                    <Card className="lg:col-span-3 border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium uppercase tracking-wide">Growth Comparison</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(val) => new Date(val).getFullYear().toString()}
                                        minTickGap={50}
                                        tick={{ fontSize: 12, fill: '#888' }}
                                    />
                                    <YAxis
                                        tickFormatter={(val) => `₹${val / 1000}k`}
                                        tick={{ fontSize: 12, fill: '#888' }}
                                        width={60}
                                    />
                                    <Tooltip
                                        labelFormatter={(val) => new Date(val).toLocaleDateString()}
                                        formatter={(val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend />

                                    {/* Invested Line (Grey Dashed) */}
                                    <Line type="monotone" dataKey="invested" name="Total Invested" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />

                                    {/* Dynamic Lines for Each Fund */}
                                    {result.results.map((res, i) => (
                                        <Line
                                            key={res.schemeCode}
                                            type="monotone"
                                            dataKey={`fund_${res.schemeCode}`}
                                            name={res.schemeName}
                                            stroke={COLORS[i % COLORS.length]}
                                            strokeWidth={3}
                                            dot={false}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}