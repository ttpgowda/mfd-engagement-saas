"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base";
import { Label, Input } from "@/components/ui/base";
import { Slider } from "@/components/ui/slider";
import { AlertTriangle, Wallet } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateSipDelayCost } from "@/lib/calculators/sip-delay-cost";
import { StatCard, CurrencyFormatter } from "./helper";

export default function SipDelayCost() {
    const [amount, setAmount] = useState<number>(10000);
    const [years, setYears] = useState<number>(20);
    const [rate, setRate] = useState<number>(12);
    const [delayYears, setDelayYears] = useState<number>(3); // Delay in years

    // Convert delay years to months for logic
    const { chartData, summary } = useMemo(() =>
        calculateSipDelayCost(amount, years, rate, delayYears * 12),
        [amount, years, rate, delayYears]);

    return (
        <div className="grid gap-8 lg:grid-cols-12">
            {/* Inputs */}
            <Card className="lg:col-span-4 h-fit">
                <CardHeader>
                    <CardTitle>Delay Scenarios</CardTitle>
                    <p className="text-sm text-gray-500">See how a small delay creates a huge gap.</p>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Monthly SIP (₹)</Label><span className="text-sm font-medium text-indigo-600">₹{amount.toLocaleString()}</span></div>
                        <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Delay Period (Years)</Label><span className="text-sm font-medium bg-red-50 text-red-700 px-2 py-0.5 rounded">{delayYears} Years</span></div>
                        <Slider value={[delayYears]} onValueChange={(v) => setDelayYears(v[0])} max={10} step={1} />
                        <p className="text-xs text-gray-500">You wait {delayYears} years before starting.</p>
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
                    <StatCard title="Start Now Value" value={CurrencyFormatter(summary.nowCorpus)} icon={Wallet} colorClass="text-green-600 bg-green-50 border-green-100" />
                    <StatCard title="Start Later Value" value={CurrencyFormatter(summary.laterCorpus)} icon={Wallet} colorClass="text-amber-600 bg-amber-50 border-amber-100" />
                    <StatCard title="Cost of Waiting" value={CurrencyFormatter(summary.lossAmount)} icon={AlertTriangle} colorClass="text-red-600 bg-red-50 border-red-100" subtext={`Loss due to ${delayYears}yr delay`} />
                </div>

                <Card className="flex-1">
                    <CardHeader><CardTitle>The Wealth Gap</CardTitle></CardHeader>
                    <CardContent className="h-[400px] w-full">
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
                                <XAxis dataKey="year" hide={years > 15} tickLine={false} axisLine={false} fontSize={12} stroke="#9ca3af" />
                                <YAxis tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`} axisLine={false} tickLine={false} fontSize={12} stroke="#9ca3af" />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <Tooltip formatter={(value: any) => [CurrencyFormatter(value), '']} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                                <Legend verticalAlign="top" height={36} wrapperStyle={{ color: "#374151" }} />
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
