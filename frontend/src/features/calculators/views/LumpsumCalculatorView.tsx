"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Coins, TrendingUp, Wallet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateLumpsum } from "../logic/lumpsum-calculator";

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

export default function LumpsumCalculatorView({ defaultValues, isPublicView = false }: CalculatorViewProps) {
    const [investmentAmount, setInvestmentAmount] = useState<number>(defaultValues?.investmentAmount ?? 100000); // 1 Lakh
    const [expectedReturnRate, setExpectedReturnRate] = useState<number>(defaultValues?.expectedReturnRate ?? 12);
    const [durationYears, setDurationYears] = useState<number>(defaultValues?.durationYears ?? 10);

    const { summary, chartData } = useMemo(() =>
        calculateLumpsum(
            investmentAmount,
            expectedReturnRate,
            durationYears
        ),
        [investmentAmount, expectedReturnRate, durationYears]
    );

    return (
        <div className="grid gap-6 lg:grid-cols-12">
            {/* Configuration */}
            <Card className="lg:col-span-4 border-border/60 shadow-sm h-fit">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <CardTitle>Lumpsum Calculator</CardTitle>
                        <CardDescription>Calculate future value of one-time investment.</CardDescription>
                    </div>
                    {isPublicView ? (
                        <PublicShareButton />
                    ) : (
                        <ShareDialog
                            toolSlug="lumpsum-calculator"
                            config={{ investmentAmount, expectedReturnRate, durationYears }}
                            defaultTitle="Lumpsum Investment"
                            defaultDescription={`Growth of ₹${investmentAmount.toLocaleString()} over ${durationYears} years.`}
                        />
                    )}
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Investment Amount</Label><span className="text-sm font-medium text-primary">₹{investmentAmount.toLocaleString()}</span></div>
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
                    <StatCard title="Future Value" value={CurrencyFormatter(summary.futureValue)} icon={Wallet} colorClass="text-purple-600 bg-purple-100" subtext={`After ${durationYears} years`} />
                    <StatCard title="Total Interest" value={CurrencyFormatter(summary.totalInterest)} icon={TrendingUp} colorClass="text-green-600 bg-green-100" subtext="Wealth gained" />
                    <StatCard
                        title="Invested Amount"
                        value={CurrencyFormatter(summary.investmentAmount)}
                        icon={Coins}
                        colorClass="text-blue-600 bg-blue-100"
                        subtext="Principal"
                    />
                </div>

                <Card className="flex-1 border-border/60 shadow-sm">
                    <CardHeader><CardTitle>Wealth Growth</CardTitle></CardHeader>
                    <CardContent className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="year" />
                                <YAxis tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`} axisLine={false} tickLine={false} />
                                <Tooltip formatter={(value: number) => [CurrencyFormatter(value), '']} />
                                <Legend />
                                <Bar dataKey="investment" name="Invested" stackId="a" fill="#3b82f6" />
                                <Bar dataKey="interest" name="Interest" stackId="a" fill="#22c55e" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
