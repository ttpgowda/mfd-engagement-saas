"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { TrendingUp, PieChart, Coins } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateSip } from "../logic/sip-calculator";

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

import { CalculatorViewProps } from "../types";

import { ToolPageLayout, ToolInputHeader } from "@/features/calculators/components/ToolPageLayout";
import { Button } from "@/components/ui/button";


export default function SipCalculatorView({ defaultValues, isPublicView = false, onInteraction, onConversion }: CalculatorViewProps) {
    const [amount, setAmount] = useState<number>(defaultValues?.amount ?? 5000);
    const [years, setYears] = useState<number>(defaultValues?.years ?? 10);

    const [rate, setRate] = useState<number>(defaultValues?.rate ?? 12);
    const [inflationAdjusted, setInflationAdjusted] = useState<boolean>(defaultValues?.inflationAdjusted ?? false);

    const handleInteraction = () => {
        onInteraction?.();
    };

    const { chartData, summary } = useMemo(() =>
        calculateSip(amount, years, rate, inflationAdjusted),
        [amount, years, rate, inflationAdjusted]);

    return (
        <ToolPageLayout
            toolSlug="sip-calculator"
            config={{ amount, years, rate, inflationAdjusted }}
            title="SIP Investment Plan"
            description={`Plan for ₹${amount.toLocaleString()} monthly investment over ${years} years.`}
            isPublicView={isPublicView}
        >
            <div className="grid gap-6 lg:grid-cols-12">
                {/* Input Section */}
                <Card className="lg:col-span-4 border-border/60 shadow-sm h-fit">
                    <ToolInputHeader
                        title="SIP Configuration"
                        description="Calculate wealth creation via regular investing."
                        isPublicView={isPublicView}
                    />
                    <CardContent className="space-y-8 pt-4">
                        <div className="space-y-4">
                            <div className="flex justify-between"><Label>Monthly Investment (₹)</Label><span className="text-sm font-medium text-primary">₹{amount.toLocaleString()}</span></div>
                            <Input type="range" min="500" max="100000" step="500" value={amount} onChange={(e) => { setAmount(Number(e.target.value)); handleInteraction(); }} className="accent-primary" />
                            <Input type="number" value={amount} onChange={(e) => { setAmount(Number(e.target.value)); handleInteraction(); }} className="mt-2" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between"><Label>Time Period (Years)</Label><span className="text-sm font-medium bg-primary/10 px-2 py-0.5 rounded text-primary">{years} Years</span></div>
                            <Slider value={[years]} onValueChange={(v) => { setYears(v[0]); handleInteraction(); }} max={40} step={1} />
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between"><Label>Expected Return (p.a)</Label><span className="text-sm font-medium">{rate}%</span></div>
                            <Slider value={[rate]} onValueChange={(v) => { setRate(v[0]); handleInteraction(); }} max={30} step={0.5} />
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t">
                            <div className="space-y-0.5"><Label>Inflation Adjusted?</Label><p className="text-xs text-muted-foreground">Adjust for 6% inflation</p></div>
                            <Switch checked={inflationAdjusted} onCheckedChange={(v) => { setInflationAdjusted(v); handleInteraction(); }} />
                        </div>
                    </CardContent>
                </Card>

                {/* Results Section */}
                <div className="lg:col-span-8 grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard title="Invested Amount" value={CurrencyFormatter(summary.invested)} icon={Coins} colorClass="text-blue-600 bg-blue-100" />
                        <StatCard title="Est. Returns" value={CurrencyFormatter(summary.gain)} icon={TrendingUp} colorClass="text-emerald-600 bg-emerald-100" />
                        <StatCard title="Total Value" value={CurrencyFormatter(summary.corpus)} icon={PieChart} colorClass="text-purple-600 bg-purple-100" subtext={inflationAdjusted ? "Purchasing Power" : "Maturity Value"} />
                    </div>

                    <Card className="flex-1 border-border/60 shadow-sm">
                        <CardHeader><CardTitle>Growth Chart</CardTitle></CardHeader>
                        <CardContent className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSip" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="year" hide={years > 15} />
                                    <YAxis tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`} axisLine={false} tickLine={false} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <Tooltip formatter={(value: number) => [CurrencyFormatter(value), '']} />
                                    <Area type="monotone" dataKey="corpus" name="Total Value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSip)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="invested" name="Invested" stroke="#94a3b8" fillOpacity={0} strokeDasharray="5 5" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {isPublicView && (
                        <div className="space-y-6">
                            <Card className="bg-primary/5 border-primary/20">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-lg">Talk to an Investment Expert</h3>
                                        <p className="text-sm text-muted-foreground">Get a personalized investment plan based on your goals.</p>
                                    </div>
                                    <Button size="lg" onClick={() => onConversion?.('consultation')}>Connect Now</Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </ToolPageLayout>
    );
}