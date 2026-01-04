"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base";
import { Label, Input } from "@/components/ui/base";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { TrendingUp, PieChart } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateStepUpSip } from "@/lib/calculators/step-up-sip";
import { StatCard, CurrencyFormatter } from "./helper";

export default function StepUpSip() {
    const [amount, setAmount] = useState<number>(15000);
    const [years, setYears] = useState<number>(20);
    const [rate, setRate] = useState<number>(12);
    const [increase, setIncrease] = useState<number>(10);
    const [inflationAdjusted, setInflationAdjusted] = useState<boolean>(false);

    const { chartData, summary } = useMemo(() =>
        calculateStepUpSip(amount, years, rate, increase, inflationAdjusted),
        [amount, years, rate, increase, inflationAdjusted]);

    return (
        <div className="grid gap-8 lg:grid-cols-12">
            <Card className="lg:col-span-4 h-fit">
                <CardHeader>
                    <CardTitle>Step-Up Strategy</CardTitle>
                    <p className="text-sm text-gray-500">Small increases create massive wealth.</p>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Initial SIP Amount</Label><span className="text-sm font-medium text-indigo-600">₹{amount.toLocaleString()}</span></div>
                        <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Yearly Step-Up (%)</Label><span className="text-sm font-medium bg-indigo-50 px-2 py-0.5 rounded text-indigo-700">{increase}%</span></div>
                        <Slider value={[increase]} onValueChange={(v) => setIncrease(v[0])} max={30} step={1} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3"><Label>Return (%)</Label><Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} /></div>
                        <div className="space-y-3"><Label>Years</Label><Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} /></div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="space-y-0.5"><Label>Inflation Adjusted?</Label><p className="text-xs text-gray-500">Adjust final value for 6% inflation</p></div>
                        <Switch checked={inflationAdjusted} onCheckedChange={setInflationAdjusted} />
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-8 grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                    <StatCard title="Total Invested" value={CurrencyFormatter(summary.invested)} icon={PieChart} colorClass="text-blue-600 bg-blue-50 border-blue-100" />
                    <StatCard title={inflationAdjusted ? "Real Value" : "Future Value"} value={CurrencyFormatter(summary.corpus)} icon={TrendingUp} colorClass="text-emerald-600 bg-emerald-50 border-emerald-100" subtext={`Wealth Gained: ${CurrencyFormatter(summary.growth)}`} />
                </div>

                <Card className="flex-1">
                    <CardHeader><CardTitle>Wealth Growth Trajectory</CardTitle></CardHeader>
                    <CardContent className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCorpus" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="year" hide={years > 15} tickLine={false} axisLine={false} fontSize={12} stroke="#9ca3af" />
                                <YAxis tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`} axisLine={false} tickLine={false} fontSize={12} stroke="#9ca3af" />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <Tooltip formatter={(value: any) => [CurrencyFormatter(value), '']} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                                <Area type="monotone" dataKey="corpus" stroke="#4f46e5" fillOpacity={1} fill="url(#colorCorpus)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
