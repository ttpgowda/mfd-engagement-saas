"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ArrowUpRight, TrendingUp, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateInflationImpact } from "../logic/inflation-impact";

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

export default function InflationImpactView() {
    const [currentCost, setCurrentCost] = useState(100000); // 1 Lakh
    const [inflationRate, setInflationRate] = useState(6);
    const [timePeriodYears, setTimePeriodYears] = useState(10);

    const { summary, chartData } = useMemo(() =>
        calculateInflationImpact(
            currentCost,
            inflationRate,
            timePeriodYears
        ),
        [currentCost, inflationRate, timePeriodYears]
    );

    return (
        <div className="grid gap-6 lg:grid-cols-12">
            {/* Configuration */}
            <Card className="lg:col-span-4 border-border/60 shadow-sm h-fit">
                <CardHeader><CardTitle>Inflation Impact</CardTitle><CardDescription>See how inflation erodes purchasing power.</CardDescription></CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Current Cost</Label><span className="text-sm font-medium text-primary">₹{currentCost.toLocaleString()}</span></div>
                        <Input type="number" value={currentCost} onChange={(e) => setCurrentCost(Number(e.target.value))} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Inflation Rate (%)</Label><span className="text-sm font-medium">{inflationRate}%</span></div>
                        <Slider value={[inflationRate]} onValueChange={(v) => setInflationRate(v[0])} min={1} max={15} step={0.5} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Time Period</Label><span className="text-sm font-medium">{timePeriodYears} Years</span></div>
                        <Slider value={[timePeriodYears]} onValueChange={(v) => setTimePeriodYears(v[0])} min={1} max={50} step={1} />
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="lg:col-span-8 grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Future Cost" value={CurrencyFormatter(summary.futureCost)} icon={TrendingUp} colorClass="text-red-600 bg-red-100" subtext={`In ${timePeriodYears} years`} />
                    <StatCard title="Cost Increase" value={CurrencyFormatter(summary.costIncrease)} icon={ArrowUpRight} colorClass="text-orange-600 bg-orange-100" subtext="Additional amount needed" />
                    <StatCard
                        title="Multiplier"
                        value={`${summary.multiplier}x`}
                        icon={AlertTriangle}
                        colorClass="text-yellow-600 bg-yellow-100"
                        subtext="Cost multiplication factor"
                    />
                </div>

                <Card className="flex-1 border-border/60 shadow-sm">
                    <CardHeader><CardTitle>Cost Projection</CardTitle></CardHeader>
                    <CardContent className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="year" />
                                <YAxis tickFormatter={(value) => `${(value / 100000).toFixed(1)}L`} axisLine={false} tickLine={false} />
                                <Tooltip formatter={(value: number) => [CurrencyFormatter(value), '']} />
                                <Area type="monotone" dataKey="cost" stroke="#ef4444" fillOpacity={1} fill="url(#colorCost)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
