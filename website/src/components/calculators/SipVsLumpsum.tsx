"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base";
import { Label, Input } from "@/components/ui/base";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Briefcase, Coins, Trophy } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateSipVsLumpsum } from "@/lib/calculators/sip-vs-lumpsum";
import { StatCard, CurrencyFormatter } from "./helper";

export default function SipVsLumpsum() {
    const [amount, setAmount] = useState<number>(500000);
    const [years, setYears] = useState<number>(10);
    const [rate, setRate] = useState<number>(12);
    const [inflationAdjusted, setInflationAdjusted] = useState<boolean>(false);

    const { chartData, summary } = useMemo(() =>
        calculateSipVsLumpsum(amount, years, rate, inflationAdjusted),
        [amount, years, rate, inflationAdjusted]);

    return (
        <div className="grid gap-8 lg:grid-cols-12">
            {/* Configuration */}
            <Card className="lg:col-span-4 h-fit">
                <CardHeader>
                    <CardTitle>Comparison Setup</CardTitle>
                    <p className="text-sm text-gray-500">Compare investing all at once vs. spreading it out.</p>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Total Capital (₹)</Label><span className="text-indigo-600 font-medium">₹{amount.toLocaleString()}</span></div>
                        <Slider value={[amount]} onValueChange={(v) => setAmount(v[0])} min={10000} max={5000000} step={5000} />
                        <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-2" />
                        <p className="text-xs text-gray-500">
                            In SIP mode, this is spread as ₹{summary.monthlySipAmount.toLocaleString()}/mo
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Time Horizon (Years)</Label><span className="text-sm font-medium bg-indigo-50 px-2 py-0.5 rounded text-indigo-700">{years} Years</span></div>
                        <Slider value={[years]} onValueChange={(v) => setYears(v[0])} max={30} step={1} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between"><Label>Expected Return (%)</Label><span className="text-sm font-medium">{rate}%</span></div>
                        <Slider value={[rate]} onValueChange={(v) => setRate(v[0])} max={30} step={0.5} />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="space-y-0.5"><Label>Inflation Adjusted?</Label><p className="text-xs text-gray-500">Adjust final value for 6% inflation</p></div>
                        <Switch checked={inflationAdjusted} onCheckedChange={setInflationAdjusted} />
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="lg:col-span-8 grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Lumpsum Result" value={CurrencyFormatter(summary.lumpsumValue)} icon={Briefcase} colorClass="text-purple-600 bg-purple-50 border-purple-100" />
                    <StatCard title="SIP Result" value={CurrencyFormatter(summary.sipValue)} icon={Coins} colorClass="text-blue-600 bg-blue-50 border-blue-100" />
                    <StatCard title="Winning Strategy" value={summary.winningStrategy} icon={Trophy} colorClass="text-amber-600 bg-amber-50 border-amber-100" subtext={`By ${CurrencyFormatter(Math.abs(summary.difference))}`} />
                </div>

                <Card className="flex-1">
                    <CardHeader><CardTitle>Growth Comparison</CardTitle></CardHeader>
                    <CardContent className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={12} stroke="#9ca3af" />
                                <YAxis tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`} axisLine={false} tickLine={false} fontSize={12} stroke="#9ca3af" />
                                <Tooltip formatter={(value: any) => [CurrencyFormatter(value), '']} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                                <Legend />
                                <Line type="monotone" dataKey="lumpsumValue" name="Lumpsum Growth" stroke="#9333ea" strokeWidth={3} dot={false} />
                                <Line type="monotone" dataKey="sipValue" name="SIP Growth" stroke="#2563eb" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
