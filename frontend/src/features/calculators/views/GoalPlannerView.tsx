"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Target, Coins, PiggyBank } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateGoalPlanner } from "../logic/goal-planner";

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

import { CalculatorViewProps } from "../types";
import { ShareDialog } from "@/features/share/components/ShareDialog";
import { PublicShareButton } from "@/features/share/components/PublicShareButton";

export default function GoalPlannerView({ defaultValues, isPublicView = false }: CalculatorViewProps) {
    const [currentCost, setCurrentCost] = useState<number>(defaultValues?.currentCost ?? 500000); // 5 Lakhs
    const [yearsToGoal, setYearsToGoal] = useState<number>(defaultValues?.yearsToGoal ?? 5);
    const [currentSavings, setCurrentSavings] = useState<number>(defaultValues?.currentSavings ?? 50000);
    const [inflationRate, setInflationRate] = useState<number>(defaultValues?.inflationRate ?? 6);
    const [returnRate, setReturnRate] = useState<number>(defaultValues?.returnRate ?? 12);

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
        <div className="grid gap-6 lg:grid-cols-12">
            {/* Configuration */}
            <Card className="lg:col-span-4 border-border/60 shadow-sm h-fit">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <CardTitle>Goal Planner</CardTitle>
                        <CardDescription>Plan for your financial goals.</CardDescription>
                    </div>
                    {isPublicView ? (
                        <PublicShareButton />
                    ) : (
                        <ShareDialog
                            toolSlug="goal-planner"
                            config={{ currentCost, yearsToGoal, currentSavings, inflationRate, returnRate }}
                            defaultTitle="Financial Goal Plan"
                            defaultDescription={`Plan for ₹${currentCost.toLocaleString()} goal in ${yearsToGoal} years.`}
                        />
                    )}
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Current Cost of Goal</Label><span className="text-sm font-medium text-primary">₹{currentCost.toLocaleString()}</span></div>
                        <Input type="number" value={currentCost} onChange={(e) => setCurrentCost(Number(e.target.value))} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Years to Goal</Label><span className="text-sm font-medium">{yearsToGoal} Years</span></div>
                        <Slider value={[yearsToGoal]} onValueChange={(v) => setYearsToGoal(v[0])} min={1} max={30} step={1} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Current Savings</Label><span className="text-sm font-medium text-primary">₹{currentSavings.toLocaleString()}</span></div>
                        <Input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} />
                    </div>

                    <div className="pt-4 border-t space-y-4">
                        <h4 className="font-medium text-sm text-muted-foreground">Assumptions</h4>
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
                    <StatCard title="Future Cost" value={CurrencyFormatter(summary.futureCost)} icon={Target} colorClass="text-purple-600 bg-purple-100" subtext={`In ${yearsToGoal} years`} />
                    <StatCard title="Monthly SIP Needed" value={CurrencyFormatter(summary.monthlySipRequired)} icon={Coins} colorClass="text-blue-600 bg-blue-100" subtext="To reach the goal" />
                    <StatCard
                        title="Lumpsum Needed"
                        value={CurrencyFormatter(summary.lumpsumRequired)}
                        icon={PiggyBank}
                        colorClass="text-amber-600 bg-amber-100"
                        subtext="One-time investment alternative"
                    />
                </div>

                <Card className="flex-1 border-border/60 shadow-sm">
                    <CardHeader><CardTitle>Goal Projection</CardTitle></CardHeader>
                    <CardContent className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="year" />
                                <YAxis tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`} axisLine={false} tickLine={false} />
                                <Tooltip formatter={(value: number) => [CurrencyFormatter(value), '']} />
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
