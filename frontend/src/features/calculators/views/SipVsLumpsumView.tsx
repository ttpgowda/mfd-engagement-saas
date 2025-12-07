"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Briefcase, Coins, Trophy } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateSipVsLumpsum } from "../logic/sip-vs-lumpsum";

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

export default function SipVsLumpsumView() {
    const [amount, setAmount] = useState(500000); // 5 Lakhs
    const [years, setYears] = useState(10);
    const [rate, setRate] = useState(12);
    const [inflationAdjusted, setInflationAdjusted] = useState(false);

    const { chartData, summary } = useMemo(() =>
        calculateSipVsLumpsum(amount, years, rate, inflationAdjusted),
        [amount, years, rate, inflationAdjusted]);

    return (
        <div className="grid gap-6 lg:grid-cols-12">
            {/* Configuration */}
            <Card className="lg:col-span-4 border-border/60 shadow-sm h-fit">
                <CardHeader><CardTitle>Comparison Setup</CardTitle><CardDescription>Compare investing all at once vs. spreading it out.</CardDescription></CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Total Capital to Invest (₹)</Label>{amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}</div>
                        <Input type="range" min="10000" max="5000000" step="5000" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="accent-primary" />
                        <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-2" />
                        <p className="text-xs text-muted-foreground">
                            In SIP mode, this is spread as ₹{summary.monthlySipAmount.toLocaleString()}/mo
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Time Horizon (Years)</Label><span className="text-sm font-medium bg-primary/10 px-2 py-0.5 rounded text-primary">{years} Years</span></div>
                        <Slider value={[years]} onValueChange={(v) => setYears(v[0])} max={30} step={1} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Expected Return (%)</Label><span className="text-sm font-medium">{rate}%</span></div>
                        <Slider value={[rate]} onValueChange={(v) => setRate(v[0])} max={30} step={0.5} />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="space-y-0.5"><Label>Inflation Adjusted?</Label><p className="text-xs text-muted-foreground">Adjust final value for 6% inflation</p></div>
                        <Switch checked={inflationAdjusted} onCheckedChange={setInflationAdjusted} />
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="lg:col-span-8 grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Lumpsum Result" value={CurrencyFormatter(summary.lumpsumValue)} icon={Briefcase} colorClass="text-purple-600 bg-purple-100" />
                    <StatCard title="SIP Result" value={CurrencyFormatter(summary.sipValue)} icon={Coins} colorClass="text-blue-600 bg-blue-100" />
                    <StatCard
                        title="Winning Strategy"
                        value={summary.winningStrategy}
                        icon={Trophy}
                        colorClass="text-amber-600 bg-amber-100"
                        subtext={`By ${CurrencyFormatter(Math.abs(summary.difference))}`}
                    />
                </div>

                <Card className="flex-1 border-border/60 shadow-sm">
                    <CardHeader><CardTitle>Growth Comparison</CardTitle></CardHeader>
                    <CardContent className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="year" />
                                <YAxis tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`} axisLine={false} tickLine={false} />
                                <Tooltip formatter={(value: number) => [CurrencyFormatter(value), '']} />
                                <Legend />
                                <Line type="monotone" dataKey="lumpsumValue" name="Lumpsum Growth" stroke="#9333ea" strokeWidth={3} dot={false} />
                                <Line type="monotone" dataKey="sipValue" name="SIP Growth" stroke="#2563eb" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}