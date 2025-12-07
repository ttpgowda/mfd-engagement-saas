"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Coins, TrendingUp, Target } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateRetirementPlanning } from "../logic/retirement-planning";

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

export default function RetirementPlanningView() {
    const [currentAge, setCurrentAge] = useState(30);
    const [retirementAge, setRetirementAge] = useState(60);
    const [lifeExpectancy, setLifeExpectancy] = useState(85);
    const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
    const [currentCorpus, setCurrentCorpus] = useState(1000000);
    const [inflationRate, setInflationRate] = useState(6);
    const [preRetirementReturn, setPreRetirementReturn] = useState(12);
    const [postRetirementReturn, setPostRetirementReturn] = useState(8);

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
        <div className="grid gap-6 lg:grid-cols-12">
            {/* Configuration */}
            <Card className="lg:col-span-4 border-border/60 shadow-sm h-fit">
                <CardHeader><CardTitle>Plan Your Retirement</CardTitle><CardDescription>Estimate corpus and SIP needed.</CardDescription></CardHeader>
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
                        <div className="flex justify-between"><Label>Monthly Expenses (Today)</Label><span className="text-sm font-medium text-primary">₹{monthlyExpenses.toLocaleString()}</span></div>
                        <Input type="number" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(Number(e.target.value))} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Current Savings (Corpus)</Label><span className="text-sm font-medium text-primary">₹{currentCorpus.toLocaleString()}</span></div>
                        <Input type="number" value={currentCorpus} onChange={(e) => setCurrentCorpus(Number(e.target.value))} />
                    </div>

                    <div className="pt-4 border-t space-y-4">
                        <h4 className="font-medium text-sm text-muted-foreground">Assumptions</h4>
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
                    <StatCard title="Required Corpus" value={CurrencyFormatter(summary.requiredCorpus)} icon={Target} colorClass="text-purple-600 bg-purple-100" subtext={`To sustain ₹${CurrencyFormatter(summary.monthlyExpensesAtRetirement)}/mo expenses`} />
                    <StatCard title="Monthly SIP Needed" value={CurrencyFormatter(summary.monthlySipRequired)} icon={Coins} colorClass="text-blue-600 bg-blue-100" subtext="To bridge the gap" />
                    <StatCard
                        title="Corpus Gap"
                        value={CurrencyFormatter(summary.gap)}
                        icon={TrendingUp}
                        colorClass="text-amber-600 bg-amber-100"
                        subtext={`Existing savings grow to ${CurrencyFormatter(summary.fvCurrentCorpus)}`}
                    />
                </div>

                <Card className="flex-1 border-border/60 shadow-sm">
                    <CardHeader><CardTitle>Wealth Accumulation Path</CardTitle></CardHeader>
                    <CardContent className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="year" />
                                <YAxis tickFormatter={(value) => `${(value / 10000000).toFixed(1)}Cr`} axisLine={false} tickLine={false} />
                                <Tooltip formatter={(value: number) => [CurrencyFormatter(value), '']} />
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
