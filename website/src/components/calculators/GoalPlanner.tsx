"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base";
import { Label, Input } from "@/components/ui/base";
import { Slider } from "@/components/ui/slider";
import { Target, Coins, PiggyBank } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateGoalPlanner } from "@/lib/calculators/goal-planner";
import { StatCard, CurrencyFormatter } from "./helper";

export default function GoalPlanner() {
    const [currentCost, setCurrentCost] = useState<number>(500000);
    const [yearsToGoal, setYearsToGoal] = useState<number>(5);
    const [currentSavings, setCurrentSavings] = useState<number>(50000);
    const [inflationRate, setInflationRate] = useState<number>(6);
    const [returnRate, setReturnRate] = useState<number>(12);

    const { summary, chartData } = useMemo(() =>
        calculateGoalPlanner(
            currentCost,
            yearsToGoal,
            inflationRate,
            returnRate,
            currentSavings
        ),
        [currentCost, yearsToGoal, inflationRate, returnRate, currentSavings]
    );

    return (
        <div className="grid gap-8 lg:grid-cols-12">
            {/* Configuration */}
            <Card className="lg:col-span-4 h-fit">
                <CardHeader>
                    <CardTitle>Goal Planner</CardTitle>
                    <p className="text-sm text-gray-500">Plan for your financial goals.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Current Cost of Goal</Label><span className="text-sm font-medium text-indigo-600">₹{currentCost.toLocaleString()}</span></div>
                        <Input type="number" value={currentCost} onChange={(e) => setCurrentCost(Number(e.target.value))} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Years to Goal</Label><span className="text-sm font-medium">{yearsToGoal} Years</span></div>
                        <Slider value={[yearsToGoal]} onValueChange={(v) => setYearsToGoal(v[0])} min={1} max={30} step={1} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Current Savings</Label><span className="text-sm font-medium text-indigo-600">₹{currentSavings.toLocaleString()}</span></div>
                        <Input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} />
                    </div>

                    <div className="pt-4 border-t space-y-4">
                        <h4 className="font-medium text-sm text-gray-500">Assumptions</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs">Inflation (%)</Label>
                                <Input type="number" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} className="h-8 text-xs" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">Exp. Return (%)</Label>
                                <Input type="number" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} className="h-8 text-xs" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="lg:col-span-8 grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Future Cost" value={CurrencyFormatter(summary.futureCost)} icon={Target} colorClass="text-purple-600 bg-purple-50 border-purple-100" subtext={`In ${yearsToGoal} years`} />
                    <StatCard title="Monthly SIP Needed" value={CurrencyFormatter(summary.monthlySipRequired)} icon={Coins} colorClass="text-blue-600 bg-blue-50 border-blue-100" subtext="To reach the goal" />
                    <StatCard title="Lumpsum Needed" value={CurrencyFormatter(summary.lumpsumRequired)} icon={PiggyBank} colorClass="text-amber-600 bg-amber-50 border-amber-100" subtext="One-time investment alternative" />
                </div>

                <Card className="flex-1">
                    <CardHeader><CardTitle>Goal Projection</CardTitle></CardHeader>
                    <CardContent className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={12} stroke="#9ca3af" />
                                <YAxis tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`} axisLine={false} tickLine={false} fontSize={12} stroke="#9ca3af" />
                                <Tooltip formatter={(value: any) => [CurrencyFormatter(value), '']} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                                <Legend />
                                <Line type="monotone" dataKey="cost" name="Projected Cost" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                <Line type="monotone" dataKey="savings" name="Projected Savings" stroke="#22c55e" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
