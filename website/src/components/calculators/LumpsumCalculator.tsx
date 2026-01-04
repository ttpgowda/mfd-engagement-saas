"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base";
import { Label, Input } from "@/components/ui/base";
import { Slider } from "@/components/ui/slider";
import { Coins, TrendingUp, Wallet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateLumpsum } from "@/lib/calculators/lumpsum-calculator";
import { StatCard, CurrencyFormatter } from "./helper";

export default function LumpsumCalculator() {
    const [investmentAmount, setInvestmentAmount] = useState<number>(100000);
    const [expectedReturnRate, setExpectedReturnRate] = useState<number>(12);
    const [durationYears, setDurationYears] = useState<number>(10);

    const { summary, chartData } = useMemo(() =>
        calculateLumpsum(
            investmentAmount,
            expectedReturnRate,
            durationYears
        ),
        [investmentAmount, expectedReturnRate, durationYears]
    );

    return (
        <div className="grid gap-8 lg:grid-cols-12">
            {/* Configuration */}
            <Card className="lg:col-span-4 h-fit">
                <CardHeader>
                    <CardTitle>Lumpsum Calculator</CardTitle>
                    <p className="text-sm text-gray-500">Calculate future value of one-time investment.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Investment Amount</Label><span className="text-sm font-medium text-indigo-600">₹{investmentAmount.toLocaleString()}</span></div>
                        <Input type="number" value={investmentAmount} onChange={(e) => setInvestmentAmount(Number(e.target.value))} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Expected Return (%)</Label><span className="text-sm font-medium">{expectedReturnRate}%</span></div>
                        <Slider value={[expectedReturnRate]} onValueChange={(v) => setExpectedReturnRate(v[0])} min={1} max={30} step={0.5} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Duration</Label><span className="text-sm font-medium">{durationYears} Years</span></div>
                        <Slider value={[durationYears]} onValueChange={(v) => setDurationYears(v[0])} min={1} max={30} step={1} />
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="lg:col-span-8 grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Future Value" value={CurrencyFormatter(summary.futureValue)} icon={Wallet} colorClass="text-purple-600 bg-purple-50 border-purple-100" subtext={`After ${durationYears} years`} />
                    <StatCard title="Total Interest" value={CurrencyFormatter(summary.totalInterest)} icon={TrendingUp} colorClass="text-emerald-600 bg-emerald-50 border-emerald-100" subtext="Wealth gained" />
                    <StatCard title="Invested Amount" value={CurrencyFormatter(summary.investmentAmount)} icon={Coins} colorClass="text-blue-600 bg-blue-50 border-blue-100" subtext="Principal" />
                </div>

                <Card className="flex-1">
                    <CardHeader><CardTitle>Wealth Growth</CardTitle></CardHeader>
                    <CardContent className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={12} stroke="#9ca3af" />
                                <YAxis tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`} axisLine={false} tickLine={false} fontSize={12} stroke="#9ca3af" />
                                <Tooltip formatter={(value: any) => [CurrencyFormatter(value), '']} cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                                <Legend />
                                <Bar dataKey="investment" name="Invested" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="interest" name="Interest" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
