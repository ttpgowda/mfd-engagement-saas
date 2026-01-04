"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base";
import { Label, Input } from "@/components/ui/base";
import { Slider } from "@/components/ui/slider";
import { ArrowDownCircle, TrendingUp, Wallet } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateSwp } from "@/lib/calculators/swp-calculator";
import { StatCard, CurrencyFormatter } from "./helper";

export default function SwpCalculator() {
    const [totalInvestment, setTotalInvestment] = useState<number>(1000000);
    const [withdrawalAmount, setWithdrawalAmount] = useState<number>(6000);
    const [expectedReturnRate, setExpectedReturnRate] = useState<number>(8);
    const [durationYears, setDurationYears] = useState<number>(10);

    const { summary, chartData } = useMemo(() =>
        calculateSwp(
            totalInvestment,
            withdrawalAmount,
            expectedReturnRate,
            durationYears
        ),
        [totalInvestment, withdrawalAmount, expectedReturnRate, durationYears]
    );

    return (
        <div className="grid gap-8 lg:grid-cols-12">
            {/* Configuration */}
            <Card className="lg:col-span-4 h-fit">
                <CardHeader>
                    <CardTitle>SWP Calculator</CardTitle>
                    <p className="text-sm text-gray-500">Systematic Withdrawal Plan</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Total Investment</Label><span className="text-sm font-medium text-indigo-600">₹{totalInvestment.toLocaleString()}</span></div>
                        <Input type="number" value={totalInvestment} onChange={(e) => setTotalInvestment(Number(e.target.value))} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Monthly Withdrawal</Label><span className="text-sm font-medium text-indigo-600">₹{withdrawalAmount.toLocaleString()}</span></div>
                        <Input type="number" value={withdrawalAmount} onChange={(e) => setWithdrawalAmount(Number(e.target.value))} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Duration</Label><span className="text-sm font-medium">{durationYears} Years</span></div>
                        <Slider value={[durationYears]} onValueChange={(v) => setDurationYears(v[0])} min={1} max={30} step={1} />
                    </div>

                    <div className="pt-4 border-t space-y-4">
                        <h4 className="font-medium text-sm text-gray-500">Assumptions</h4>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs">Exp. Return (%)</Label>
                                <Input type="number" value={expectedReturnRate} onChange={(e) => setExpectedReturnRate(Number(e.target.value))} className="h-8 text-xs" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="lg:col-span-8 grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Total Withdrawn" value={CurrencyFormatter(summary.totalWithdrawn)} icon={ArrowDownCircle} colorClass="text-blue-600 bg-blue-50 border-blue-100" subtext="Over the duration" />
                    <StatCard title="Final Balance" value={CurrencyFormatter(summary.finalBalance)} icon={Wallet} colorClass="text-purple-600 bg-purple-50 border-purple-100" subtext="Remaining value" />
                    <StatCard title="Total Interest" value={CurrencyFormatter(summary.totalInterestEarned)} icon={TrendingUp} colorClass="text-emerald-600 bg-emerald-50 border-emerald-100" subtext="Earned on balance" />
                </div>

                <Card className="flex-1">
                    <CardHeader><CardTitle>Balance Projection</CardTitle></CardHeader>
                    <CardContent className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={12} stroke="#9ca3af" />
                                <YAxis tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`} axisLine={false} tickLine={false} fontSize={12} stroke="#9ca3af" />
                                <Tooltip formatter={(value: any) => [CurrencyFormatter(value), '']} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                                <Legend />
                                <Line type="monotone" dataKey="balance" name="Balance" stroke="#22c55e" strokeWidth={3} dot={false} />
                                <Line type="monotone" dataKey="withdrawn" name="Cumulative Withdrawn" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
