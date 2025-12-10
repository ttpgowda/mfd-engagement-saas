"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ArrowDownCircle, TrendingUp, Wallet } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateSwp } from "../logic/swp-calculator";

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

export default function SwpCalculatorView({ defaultValues, isPublicView = false }: CalculatorViewProps) {
    const [totalInvestment, setTotalInvestment] = useState<number>(defaultValues?.totalInvestment ?? 1000000); // 10 Lakhs
    const [withdrawalAmount, setWithdrawalAmount] = useState<number>(defaultValues?.withdrawalAmount ?? 6000);
    const [expectedReturnRate, setExpectedReturnRate] = useState<number>(defaultValues?.expectedReturnRate ?? 8);
    const [durationYears, setDurationYears] = useState<number>(defaultValues?.durationYears ?? 10);

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
        <div className="grid gap-6 lg:grid-cols-12">
            {/* Configuration */}
            <Card className="lg:col-span-4 border-border/60 shadow-sm h-fit">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <CardTitle>SWP Calculator</CardTitle>
                        <CardDescription>Systematic Withdrawal Plan</CardDescription>
                    </div>
                    {isPublicView ? (
                        <PublicShareButton />
                    ) : (
                        <ShareDialog
                            toolSlug="swp-calculator"
                            config={{ totalInvestment, withdrawalAmount, expectedReturnRate, durationYears }}
                            defaultTitle="SWP Income Plan"
                            defaultDescription={`Plan for ₹${withdrawalAmount.toLocaleString()} monthly withdrawal from ₹${totalInvestment.toLocaleString()} investment.`}
                        />
                    )}
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Total Investment</Label><span className="text-sm font-medium text-primary">₹{totalInvestment.toLocaleString()}</span></div>
                        <Input type="number" value={totalInvestment} onChange={(e) => setTotalInvestment(Number(e.target.value))} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Monthly Withdrawal</Label><span className="text-sm font-medium text-primary">₹{withdrawalAmount.toLocaleString()}</span></div>
                        <Input type="number" value={withdrawalAmount} onChange={(e) => setWithdrawalAmount(Number(e.target.value))} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Duration</Label><span className="text-sm font-medium">{durationYears} Years</span></div>
                        <Slider value={[durationYears]} onValueChange={(v) => setDurationYears(v[0])} min={1} max={30} step={1} />
                    </div>

                    <div className="pt-4 border-t space-y-4">
                        <h4 className="font-medium text-sm text-muted-foreground">Assumptions</h4>
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
                    <StatCard title="Total Withdrawn" value={CurrencyFormatter(summary.totalWithdrawn)} icon={ArrowDownCircle} colorClass="text-blue-600 bg-blue-100" subtext="Over the duration" />
                    <StatCard title="Final Balance" value={CurrencyFormatter(summary.finalBalance)} icon={Wallet} colorClass="text-purple-600 bg-purple-100" subtext="Remaining value" />
                    <StatCard
                        title="Total Interest"
                        value={CurrencyFormatter(summary.totalInterestEarned)}
                        icon={TrendingUp}
                        colorClass="text-green-600 bg-green-100"
                        subtext="Earned on balance"
                    />
                </div>

                <Card className="flex-1 border-border/60 shadow-sm">
                    <CardHeader><CardTitle>Balance Projection</CardTitle></CardHeader>
                    <CardContent className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="year" />
                                <YAxis tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`} axisLine={false} tickLine={false} />
                                <Tooltip formatter={(value: number) => [CurrencyFormatter(value), '']} />
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
