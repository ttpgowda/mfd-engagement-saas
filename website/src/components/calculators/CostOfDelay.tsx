"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base";
import { Label, Input } from "@/components/ui/base";
import { Slider } from "@/components/ui/slider";
import { AlertCircle, DollarSign, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateCostOfDelay } from "@/lib/calculators/cost-of-delay";
import { StatCard, CurrencyFormatter } from "./helper";

export default function CostOfDelay() {
    const [amount, setAmount] = useState<number>(10000);
    const [years, setYears] = useState<number>(25);
    const [rate, setRate] = useState<number>(12);
    const [delay, setDelay] = useState<number>(5);

    const data = useMemo(() => calculateCostOfDelay(amount, years, rate, delay), [amount, years, rate, delay]);

    return (
        <div className="grid gap-8 lg:grid-cols-12">
            {/* Inputs */}
            <Card className="lg:col-span-4 h-fit">
                <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                    <p className="text-sm text-gray-500">Adjust variables to see impact.</p>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Monthly SIP (₹)</Label><span className="text-sm font-medium text-indigo-600">₹{amount.toLocaleString()}</span></div>
                        <Slider value={[amount]} onValueChange={(v) => setAmount(v[0])} min={1000} max={100000} step={500} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Duration (Years)</Label><span className="text-sm font-medium bg-indigo-50 px-2 py-0.5 rounded text-indigo-700">{years} Years</span></div>
                        <Slider value={[years]} onValueChange={(v) => setYears(v[0])} max={40} step={1} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Expected Return (%)</Label><span className="text-sm font-medium">{rate}%</span></div>
                        <Slider value={[rate]} onValueChange={(v) => setRate(v[0])} max={25} step={0.5} />
                    </div>
                    <div className="space-y-4 pt-4 border-t border-dashed">
                        <div className="flex justify-between items-center"><Label className="text-red-500 font-semibold">Delay Duration</Label><span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-sm font-medium">{delay} Years</span></div>
                        <Slider value={[delay]} onValueChange={(v) => setDelay(v[0])} max={15} step={1} />
                    </div>
                </CardContent>
            </Card>

            {/* Outputs */}
            <div className="lg:col-span-8 grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Potential Corpus" value={CurrencyFormatter(data.fvNow)} icon={DollarSign} colorClass="text-green-600 bg-green-50 border-green-100" subtext="If you start today" />
                    <StatCard title="Delayed Corpus" value={CurrencyFormatter(data.fvLater)} icon={Clock} colorClass="text-amber-600 bg-amber-50 border-amber-100" subtext={`Starting after ${delay} years`} />
                    <StatCard title="Cost of Delay" value={CurrencyFormatter(data.costOfDelay)} icon={AlertCircle} colorClass="text-red-600 bg-red-50 border-red-100" subtext="Pure loss due to waiting" />
                </div>

                <Card className="flex-1 flex flex-col">
                    <CardHeader><CardTitle>Impact Analysis</CardTitle></CardHeader>
                    <CardContent className="flex-1 min-h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.chartData} barSize={60}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#9ca3af" />
                                <YAxis hide />
                                <Tooltip formatter={(value: any) => CurrencyFormatter(value)} cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '14px' }} />
                                <Bar dataKey="invested" name="Principal" stackId="a" fill="#93c5fd" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="value" name="Interest" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
