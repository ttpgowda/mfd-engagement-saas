"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { TrendingUp, PieChart } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateStepUpSip } from "@/features/calculators/logic/step-up-sip";

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

export default function StepUpSipView() {
    const [amount, setAmount] = useState(15000);
    const [years, setYears] = useState(20);
    const [rate, setRate] = useState(12);
    const [increase, setIncrease] = useState(10);
    const [inflationAdjusted, setInflationAdjusted] = useState(false);

    const { chartData, summary } = useMemo(() =>
        calculateStepUpSip(amount, years, rate, increase, inflationAdjusted),
        [amount, years, rate, increase, inflationAdjusted]);

    return (
        <div className="grid gap-6 lg:grid-cols-12">
            <Card className="lg:col-span-4 border-border/60 shadow-sm h-fit">
                <CardHeader><CardTitle>Step-Up Strategy</CardTitle><CardDescription>Small increases create massive wealth.</CardDescription></CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Initial SIP Amount</Label><span className="text-sm font-medium text-primary">₹{amount.toLocaleString()}</span></div>
                        <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Yearly Step-Up (%)</Label><span className="text-sm font-medium bg-primary/10 px-2 py-0.5 rounded text-primary">{increase}%</span></div>
                        <Slider value={[increase]} onValueChange={(v) => setIncrease(v[0])} max={30} step={1} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3"><Label>Return (%)</Label><Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} /></div>
                        <div className="space-y-3"><Label>Years</Label><Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} /></div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="space-y-0.5"><Label>Inflation Adjusted?</Label><p className="text-xs text-muted-foreground">Adjust final value for 6% inflation</p></div>
                        <Switch checked={inflationAdjusted} onCheckedChange={setInflationAdjusted} />
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-8 grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                    <StatCard title="Total Invested" value={CurrencyFormatter(summary.invested)} icon={PieChart} colorClass="text-blue-600 bg-blue-100" />
                    <StatCard title={inflationAdjusted ? "Real Value" : "Future Value"} value={CurrencyFormatter(summary.corpus)} icon={TrendingUp} colorClass="text-emerald-600 bg-emerald-100" subtext={`Wealth Gained: ${CurrencyFormatter(summary.growth)}`} />
                </div>

                <Card className="flex-1 border-border/60 shadow-sm">
                    <CardHeader><CardTitle>Wealth Growth Trajectory</CardTitle></CardHeader>
                    <CardContent className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCorpus" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="year" hide={years > 15} />
                                <YAxis tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`} axisLine={false} tickLine={false} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <Tooltip formatter={(value: number) => [CurrencyFormatter(value), '']} />
                                <Area type="monotone" dataKey="corpus" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorCorpus)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}