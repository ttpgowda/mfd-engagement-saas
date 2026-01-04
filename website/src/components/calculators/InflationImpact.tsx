"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base";
import { Label, Input } from "@/components/ui/base";
import { Slider } from "@/components/ui/slider";
import { ArrowUpRight, TrendingUp, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateInflationImpact } from "@/lib/calculators/inflation-impact";
import { StatCard, CurrencyFormatter } from "./helper";

export default function InflationImpact() {
    const [currentCost, setCurrentCost] = useState<number>(100000);
    const [inflationRate, setInflationRate] = useState<number>(6);
    const [timePeriodYears, setTimePeriodYears] = useState<number>(10);

    const { summary, chartData } = useMemo(() =>
        calculateInflationImpact(
            currentCost,
            inflationRate,
            timePeriodYears
        ),
        [currentCost, inflationRate, timePeriodYears]
    );

    return (
        <div className="grid gap-8 lg:grid-cols-12">
            {/* Configuration */}
            <Card className="lg:col-span-4 h-fit">
                <CardHeader>
                    <CardTitle>Inflation Impact</CardTitle>
                    <p className="text-sm text-gray-500">See how inflation erodes purchasing power.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Current Cost</Label><span className="text-sm font-medium text-indigo-600">₹{currentCost.toLocaleString()}</span></div>
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
                    <StatCard title="Future Cost" value={CurrencyFormatter(summary.futureCost)} icon={TrendingUp} colorClass="text-red-600 bg-red-50 border-red-100" subtext={`In ${timePeriodYears} years`} />
                    <StatCard title="Cost Increase" value={CurrencyFormatter(summary.costIncrease)} icon={ArrowUpRight} colorClass="text-orange-600 bg-orange-50 border-orange-100" subtext="Additional amount needed" />
                    <StatCard title="Multiplier" value={`${summary.multiplier}x`} icon={AlertTriangle} colorClass="text-yellow-600 bg-yellow-50 border-yellow-100" subtext="Cost multiplication factor" />
                </div>

                <Card className="flex-1">
                    <CardHeader><CardTitle>Cost Projection</CardTitle></CardHeader>
                    <CardContent className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={12} stroke="#9ca3af" />
                                <YAxis tickFormatter={(value) => `${(value / 100000).toFixed(1)}L`} axisLine={false} tickLine={false} fontSize={12} stroke="#9ca3af" />
                                <Tooltip formatter={(value: any) => [CurrencyFormatter(value), '']} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                                <Area type="monotone" dataKey="cost" stroke="#ef4444" fillOpacity={1} fill="url(#colorCost)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
