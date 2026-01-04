"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base";
import { Label, Input } from "@/components/ui/base";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { TrendingUp, PieChart, Coins } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateSip } from "@/lib/calculators/sip-calculator";
import { StatCard, CurrencyFormatter } from "./helper";

export default function SipCalculator() {
    const [amount, setAmount] = useState<number>(5000);
    const [years, setYears] = useState<number>(10);
    const [rate, setRate] = useState<number>(12);
    const [inflationAdjusted, setInflationAdjusted] = useState<boolean>(false);

    const { chartData, summary } = useMemo(() =>
        calculateSip(amount, years, rate, inflationAdjusted),
        [amount, years, rate, inflationAdjusted]);

    return (
        <div className="grid gap-8 lg:grid-cols-12">
            {/* Input Section */}
            <Card className="lg:col-span-4 h-fit">
                <CardHeader>
                    <CardTitle>SIP Configuration</CardTitle>
                    <p className="text-sm text-gray-500">Calculate wealth creation via regular investing.</p>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Monthly Investment (₹)</Label><span className="text-sm font-medium text-indigo-600">₹{amount.toLocaleString()}</span></div>
                        <Slider value={[amount]} onValueChange={(v) => setAmount(v[0])} min={500} max={100000} step={500} />
                        <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-2" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Time Period (Years)</Label><span className="text-sm font-medium bg-indigo-50 px-2 py-0.5 rounded text-indigo-700">{years} Years</span></div>
                        <Slider value={[years]} onValueChange={(v) => setYears(v[0])} max={40} step={1} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Expected Return (p.a)</Label><span className="text-sm font-medium">{rate}%</span></div>
                        <Slider value={[rate]} onValueChange={(v) => setRate(v[0])} max={30} step={0.5} />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="space-y-0.5"><Label>Inflation Adjusted?</Label><p className="text-xs text-gray-500">Adjust for 6% inflation</p></div>
                        <Switch checked={inflationAdjusted} onCheckedChange={setInflationAdjusted} />
                    </div>
                </CardContent>
            </Card>

            {/* Results Section */}
            <div className="lg:col-span-8 grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Invested Amount" value={CurrencyFormatter(summary.invested)} icon={Coins} colorClass="text-blue-600 bg-blue-50 border-blue-100" />
                    <StatCard title="Est. Returns" value={CurrencyFormatter(summary.gain)} icon={TrendingUp} colorClass="text-emerald-600 bg-emerald-50 border-emerald-100" />
                    <StatCard title="Total Value" value={CurrencyFormatter(summary.corpus)} icon={PieChart} colorClass="text-purple-600 bg-purple-50 border-purple-100" subtext={inflationAdjusted ? "Purchasing Power" : "Maturity Value"} />
                </div>

                <Card className="flex-1">
                    <CardHeader><CardTitle>Growth Chart</CardTitle></CardHeader>
                    <CardContent className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSip" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="year" hide={years > 15} tickLine={false} axisLine={false} fontSize={12} stroke="#9ca3af" />
                                <YAxis tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`} axisLine={false} tickLine={false} fontSize={12} stroke="#9ca3af" />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <Tooltip formatter={(value: any) => [CurrencyFormatter(value), '']} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                                <Area type="monotone" dataKey="corpus" name="Total Value" stroke="#4f46e5" fillOpacity={1} fill="url(#colorSip)" strokeWidth={2} />
                                <Area type="monotone" dataKey="invested" name="Invested" stroke="#94a3b8" fillOpacity={0} strokeDasharray="5 5" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
