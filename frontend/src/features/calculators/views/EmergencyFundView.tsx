"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ShieldAlert, Wallet, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { calculateEmergencyFund } from "../logic/emergency-fund";

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

export default function EmergencyFundView({ defaultValues, isPublicView = false }: CalculatorViewProps) {
    const [monthlyExpenses, setMonthlyExpenses] = useState<number>(defaultValues?.monthlyExpenses ?? 50000);
    const [monthsOfCoverage, setMonthsOfCoverage] = useState<number>(defaultValues?.monthsOfCoverage ?? 6);

    const { summary, chartData } = useMemo(() =>
        calculateEmergencyFund(
            monthlyExpenses,
            monthsOfCoverage
        ),
        [monthlyExpenses, monthsOfCoverage]
    );

    return (
        <div className="grid gap-6 lg:grid-cols-12">
            {/* Configuration */}
            <Card className="lg:col-span-4 border-border/60 shadow-sm h-fit">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <CardTitle>Emergency Fund</CardTitle>
                        <CardDescription>Calculate how much you need for a rainy day.</CardDescription>
                    </div>
                    {isPublicView ? (
                        <PublicShareButton />
                    ) : (
                        <ShareDialog
                            toolSlug="emergency-fund"
                            config={{ monthlyExpenses, monthsOfCoverage }}
                            defaultTitle="Emergency Fund Plan"
                            defaultDescription={`Required safety net for ${monthsOfCoverage} months of expenses.`}
                        />
                    )}
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Monthly Expenses</Label><span className="text-sm font-medium text-primary">₹{monthlyExpenses.toLocaleString()}</span></div>
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
                    <StatCard title="Required Fund" value={CurrencyFormatter(summary.requiredFund)} icon={ShieldAlert} colorClass="text-green-600 bg-green-100" subtext={`For ${monthsOfCoverage} months`} />
                    <StatCard title="Monthly Expenses" value={CurrencyFormatter(summary.monthlyExpenses)} icon={Wallet} colorClass="text-blue-600 bg-blue-100" subtext="Base amount" />
                    <StatCard
                        title="Coverage Period"
                        value={`${summary.monthsOfCoverage} Months`}
                        icon={Calendar}
                        colorClass="text-purple-600 bg-purple-100"
                        subtext="Safety net duration"
                    />
                </div>

                <Card className="flex-1 border-border/60 shadow-sm">
                    <CardHeader><CardTitle>Fund vs Expenses</CardTitle></CardHeader>
                    <CardContent className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                                <Tooltip formatter={(value: number) => [CurrencyFormatter(value), '']} />
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
