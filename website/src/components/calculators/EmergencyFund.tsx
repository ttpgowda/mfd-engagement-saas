"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base";
import { Label, Input } from "@/components/ui/base";
import { Slider } from "@/components/ui/slider";
import { ShieldAlert, Wallet, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { calculateEmergencyFund } from "@/lib/calculators/emergency-fund";
import { StatCard, CurrencyFormatter } from "./helper";

export default function EmergencyFund() {
    const [monthlyExpenses, setMonthlyExpenses] = useState<number>(50000);
    const [monthsOfCoverage, setMonthsOfCoverage] = useState<number>(6);

    const { summary, chartData } = useMemo(() =>
        calculateEmergencyFund(
            monthlyExpenses,
            monthsOfCoverage
        ),
        [monthlyExpenses, monthsOfCoverage]
    );

    return (
        <div className="grid gap-8 lg:grid-cols-12">
            {/* Configuration */}
            <Card className="lg:col-span-4 h-fit">
                <CardHeader>
                    <CardTitle>Emergency Fund</CardTitle>
                    <p className="text-sm text-gray-500">Calculate how much you need for a rainy day.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Monthly Expenses</Label><span className="text-sm font-medium text-indigo-600">₹{monthlyExpenses.toLocaleString()}</span></div>
                        <Input type="number" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(Number(e.target.value))} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Coverage (Months)</Label><span className="text-sm font-medium">{monthsOfCoverage} Months</span></div>
                        <Slider value={[monthsOfCoverage]} onValueChange={(v) => setMonthsOfCoverage(v[0])} min={1} max={24} step={1} />
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="lg:col-span-8 grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Required Fund" value={CurrencyFormatter(summary.requiredFund)} icon={ShieldAlert} colorClass="text-green-600 bg-green-50 border-green-100" subtext={`For ${monthsOfCoverage} months`} />
                    <StatCard title="Monthly Expenses" value={CurrencyFormatter(summary.monthlyExpenses)} icon={Wallet} colorClass="text-blue-600 bg-blue-50 border-blue-100" subtext="Base amount" />
                    <StatCard title="Coverage Period" value={`${summary.monthsOfCoverage} Months`} icon={Calendar} colorClass="text-purple-600 bg-purple-50 border-purple-100" subtext="Safety net duration" />
                </div>

                <Card className="flex-1">
                    <CardHeader><CardTitle>Fund vs Expenses</CardTitle></CardHeader>
                    <CardContent className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} stroke="#9ca3af" />
                                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} fontSize={12} stroke="#9ca3af" />
                                <Tooltip formatter={(value: any) => [CurrencyFormatter(value), '']} cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
