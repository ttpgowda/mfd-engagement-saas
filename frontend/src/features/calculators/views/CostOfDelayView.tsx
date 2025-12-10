"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, DollarSign, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateCostOfDelay } from "@/features/calculators/logic/cost-of-delay";

// Helper component for Stat Card
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
            <div className={`p-2 rounded-full bg-background ${colorClass}`}>
                <Icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
        </div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
    </div>
);

const CurrencyFormatter = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

import { CalculatorViewProps } from "../types";
import { ShareDialog } from "@/features/share/components/ShareDialog";
import { PublicShareButton } from "@/features/share/components/PublicShareButton";

export default function CostOfDelayView({ defaultValues, isPublicView = false }: CalculatorViewProps) {
    const [amount, setAmount] = useState<number>(defaultValues?.amount ?? 10000);
    const [years, setYears] = useState<number>(defaultValues?.years ?? 25);
    const [rate, setRate] = useState<number>(defaultValues?.rate ?? 12);
    const [delay, setDelay] = useState<number>(defaultValues?.delay ?? 5);

    const data = useMemo(() => calculateCostOfDelay(amount, years, rate, delay), [amount, years, rate, delay]);

    return (
        <div className="grid gap-6 lg:grid-cols-12">
            {/* Inputs */}
            <Card className="lg:col-span-4 border-border/60 shadow-sm h-fit">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <CardTitle>Configuration</CardTitle>
                        <CardDescription>Adjust variables to see impact</CardDescription>
                    </div>
                    {isPublicView ? (
                        <PublicShareButton />
                    ) : (
                        <ShareDialog
                            toolSlug="cost-of-delay"
                            config={{ amount, years, rate, delay }}
                            defaultTitle="Cost of Delay"
                            defaultDescription={`See how a ${delay} year delay affects your ₹${amount.toLocaleString()} SIP.`}
                        />
                    )}
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Monthly SIP (₹)</Label><span className="text-sm font-medium text-primary">₹{amount.toLocaleString()}</span></div>
                        <Input type="range" min="1000" max="100000" step="500" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="accent-primary" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Duration (Years)</Label><span className="text-sm font-medium bg-primary/10 px-2 py-0.5 rounded text-primary">{years} Years</span></div>
                        <Slider value={[years]} onValueChange={(v) => setYears(v[0])} max={40} step={1} className="py-2" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Expected Return (%)</Label><span className="text-sm font-medium">{rate}%</span></div>
                        <Slider value={[rate]} onValueChange={(v) => setRate(v[0])} max={25} step={0.5} className="py-2" />
                    </div>
                    <div className="space-y-4 pt-4 border-t border-dashed">
                        <div className="flex justify-between items-center"><Label className="text-destructive font-semibold">Delay Duration</Label><Badge variant="destructive" className="text-sm">{delay} Years</Badge></div>
                        <Slider value={[delay]} onValueChange={(v) => setDelay(v[0])} max={15} step={1} className="py-2" />
                    </div>
                </CardContent>
            </Card>

            {/* Outputs */}
            <div className="lg:col-span-8 grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Potential Corpus" value={CurrencyFormatter(data.fvNow)} icon={DollarSign} colorClass="text-green-600 bg-green-100" subtext="If you start today" />
                    <StatCard title="Delayed Corpus" value={CurrencyFormatter(data.fvLater)} icon={Clock} colorClass="text-amber-600 bg-amber-100" subtext={`Starting after ${delay} years`} />
                    <StatCard title="Cost of Delay" value={CurrencyFormatter(data.costOfDelay)} icon={AlertCircle} colorClass="text-red-600 bg-red-100" subtext="Pure loss due to waiting" />
                </div>

                <Card className="flex-1 flex flex-col border-border/60 shadow-sm">
                    <CardHeader><CardTitle>Impact Analysis</CardTitle></CardHeader>
                    <CardContent className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.chartData} barSize={60}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip formatter={(value: number) => CurrencyFormatter(value)} cursor={{ fill: 'transparent' }} />
                                <Legend verticalAlign="top" height={36} />
                                <Bar dataKey="invested" name="Principal" stackId="a" fill="hsl(var(--primary) / 0.3)" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="value" name="Interest" stackId="a" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}