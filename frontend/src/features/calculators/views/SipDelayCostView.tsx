"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { AlertTriangle, TrendingDown, Wallet } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateSipDelayCost } from "../logic/sip-delay-cost";

const CurrencyFormatter = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

interface StatCardProps {
    title: string;
    value: string;
    subtext?: string;
    icon: React.ElementType;
    colorClass: string;
}

const StatCard = ({ title, value, subtext, icon: Icon, colorClass }: StatCardProps) => (
    <div className="flex flex-col p-4 bg-muted/30 rounded-lg border border-border/50">
        <div className="flex items-center gap-2 mb-2">
            <div className={`p-2 rounded-full bg-background ${colorClass}`}><Icon className="w-4 h-4" /></div>
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
        </div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
    </div>
);

export default function SipDelayCostView() {
    const [amount, setAmount] = useState(10000);
    const [years, setYears] = useState(20);
    const [rate, setRate] = useState(12);
    const [delayYears, setDelayYears] = useState(3); // Delay in years

    // Convert delay years to months for logic
    const { chartData, summary } = useMemo(() =>
        calculateSipDelayCost(amount, years, rate, delayYears * 12),
        [amount, years, rate, delayYears]);

    return (
        <div className="grid gap-6 lg:grid-cols-12">
            {/* Inputs */}
            <Card className="lg:col-span-4 border-border/60 shadow-sm h-fit">
                <CardHeader><CardTitle>Delay Scenarios</CardTitle><CardDescription>See how a small delay creates a huge gap.</CardDescription></CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Monthly SIP (₹)</Label><span className="text-sm font-medium text-primary">₹{amount.toLocaleString()}</span></div>
                        <Input type="range" min="1000" max="100000" step="500" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="accent-primary" />
                        <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-2" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Delay Period (Years)</Label><span className="text-sm font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded">{delayYears} Years</span></div>
                        <Slider value={[delayYears]} onValueChange={(v) => setDelayYears(v[0])} max={10} step={1} className="py-2" />
                        <p className="text-xs text-muted-foreground">You wait {delayYears} years before starting.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3"><Label>Return (%)</Label><Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} /></div>
                        <div className="space-y-3"><Label>Total Duration</Label><Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} /></div>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="lg:col-span-8 grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Start Now Value" value={CurrencyFormatter(summary.nowCorpus)} icon={Wallet} colorClass="text-green-600 bg-green-100" />
                    <StatCard title="Start Later Value" value={CurrencyFormatter(summary.laterCorpus)} icon={Wallet} colorClass="text-amber-600 bg-amber-100" />
                    <StatCard
                        title="Cost of Waiting"
                        value={CurrencyFormatter(summary.lossAmount)}
                        icon={AlertTriangle}
                        colorClass="text-red-600 bg-red-100"
                        subtext={`Loss due to ${delayYears}yr delay`}
                    />
                </div>

                <Card className="flex-1 border-border/60 shadow-sm">
                    <CardHeader><CardTitle>The Wealth Gap</CardTitle></CardHeader>
                    <CardContent className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorNow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorLater" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="year" hide={years > 15} />
                                <YAxis tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`} axisLine={false} tickLine={false} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <Tooltip formatter={(value: number) => [CurrencyFormatter(value), '']} />
                                <Legend verticalAlign="top" height={36} />

                                <Area type="monotone" dataKey="nowValue" name="Start Now" stroke="#16a34a" fillOpacity={1} fill="url(#colorNow)" strokeWidth={2} />
                                <Area type="monotone" dataKey="laterValue" name={`Start After ${delayYears}y`} stroke="#ea580c" fillOpacity={1} fill="url(#colorLater)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}