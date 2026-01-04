"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base";
import { Label, Input } from "@/components/ui/base";
import { Slider } from "@/components/ui/slider";
import { Coins, TrendingUp, Target } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateRetirementPlanning } from "@/lib/calculators/retirement-planning";
import { StatCard, CurrencyFormatter } from "./helper";

export default function RetirementPlanning() {
    const [currentAge, setCurrentAge] = useState<number>(30);
    const [retirementAge, setRetirementAge] = useState<number>(60);
    const [lifeExpectancy, setLifeExpectancy] = useState<number>(85);
    const [monthlyExpenses, setMonthlyExpenses] = useState<number>(50000);
    const [currentCorpus, setCurrentCorpus] = useState<number>(1000000);
    const [inflationRate, setInflationRate] = useState<number>(6);
    const [preRetirementReturn, setPreRetirementReturn] = useState<number>(12);
    const [postRetirementReturn, setPostRetirementReturn] = useState<number>(8);

    const { summary, chartData } = useMemo(() =>
        calculateRetirementPlanning(
            currentAge,
            retirementAge,
            lifeExpectancy,
            monthlyExpenses,
            inflationRate,
            preRetirementReturn,
            postRetirementReturn,
            currentCorpus
        ),
        [currentAge, retirementAge, lifeExpectancy, monthlyExpenses, inflationRate, preRetirementReturn, postRetirementReturn, currentCorpus]
    );

    return (
        <div className="grid gap-8 lg:grid-cols-12">
            {/* Configuration */}
            <Card className="lg:col-span-4 h-fit">
                <CardHeader>
                    <CardTitle>Plan Your Retirement</CardTitle>
                    <p className="text-sm text-gray-500">Estimate corpus and SIP needed.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Current Age</Label><span className="text-sm font-medium">{currentAge} Years</span></div>
                        <Slider value={[currentAge]} onValueChange={(v) => setCurrentAge(v[0])} min={18} max={retirementAge - 1} step={1} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Retirement Age</Label><span className="text-sm font-medium">{retirementAge} Years</span></div>
                        <Slider value={[retirementAge]} onValueChange={(v) => setRetirementAge(v[0])} min={currentAge + 1} max={80} step={1} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Life Expectancy</Label><span className="text-sm font-medium">{lifeExpectancy} Years</span></div>
                        <Slider value={[lifeExpectancy]} onValueChange={(v) => setLifeExpectancy(v[0])} min={retirementAge + 1} max={100} step={1} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Monthly Expenses (Today)</Label><span className="text-sm font-medium text-indigo-600">₹{monthlyExpenses.toLocaleString()}</span></div>
                        <Input type="number" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(Number(e.target.value))} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Current Savings (Corpus)</Label><span className="text-sm font-medium text-indigo-600">₹{currentCorpus.toLocaleString()}</span></div>
                        <Input type="number" value={currentCorpus} onChange={(e) => setCurrentCorpus(Number(e.target.value))} />
                    </div>

                    <div className="pt-4 border-t space-y-4">
                        <h4 className="font-medium text-sm text-gray-500">Assumptions</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs">Inflation (%)</Label>
                                <Input type="number" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} className="h-8 text-xs" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">Pre-Ret. Return (%)</Label>
                                <Input type="number" value={preRetirementReturn} onChange={(e) => setPreRetirementReturn(Number(e.target.value))} className="h-8 text-xs" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">Post-Ret. Return (%)</Label>
                                <Input type="number" value={postRetirementReturn} onChange={(e) => setPostRetirementReturn(Number(e.target.value))} className="h-8 text-xs" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="lg:col-span-8 grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Required Corpus" value={CurrencyFormatter(summary.requiredCorpus)} icon={Target} colorClass="text-purple-600 bg-purple-50 border-purple-100" subtext={`To sustain ₹${CurrencyFormatter(summary.monthlyExpensesAtRetirement)}/mo`} />
                    <StatCard title="Monthly SIP Needed" value={CurrencyFormatter(summary.monthlySipRequired)} icon={Coins} colorClass="text-blue-600 bg-blue-50 border-blue-100" subtext="To bridge the gap" />
                    <StatCard title="Corpus Gap" value={CurrencyFormatter(summary.gap)} icon={TrendingUp} colorClass="text-amber-600 bg-amber-50 border-amber-100" subtext={`Savings grow to ${CurrencyFormatter(summary.fvCurrentCorpus)}`} />
                </div>

                <Card className="flex-1">
                    <CardHeader><CardTitle>Wealth Accumulation Path</CardTitle></CardHeader>
                    <CardContent className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={12} stroke="#9ca3af" />
                                <YAxis tickFormatter={(value) => `${(value / 10000000).toFixed(1)}Cr`} axisLine={false} tickLine={false} fontSize={12} stroke="#9ca3af" />
                                <Tooltip formatter={(value: any) => [CurrencyFormatter(value), '']} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                                <Legend />
                                <Line type="monotone" dataKey="corpus" name="Projected Corpus" stroke="#2563eb" strokeWidth={3} dot={false} />
                                <Line type="monotone" dataKey="required" name="Target Corpus" stroke="#9333ea" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
