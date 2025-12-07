"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SipCalculatorProps {
    onSimulate: (amount: number, years: number) => Promise<any>;
}

export function SipCalculator({ onSimulate }: SipCalculatorProps) {
    const [amount, setAmount] = useState(5000);
    const [years, setYears] = useState(5);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSimulate = async () => {
        setLoading(true);
        try {
            const data = await onSimulate(amount, years);
            setResult(data);
        } catch (error) {
            console.error("Simulation failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce simulation or run on button click
        // For now, let's run on mount with defaults and when user clicks "Calculate"
        // Or maybe auto-calculate with debounce?
        // Let's stick to a button for clarity or auto-calc if performance allows.
        // Given it's an API call, button is safer.
        handleSimulate();
    }, []); // Run once on mount

    return (
        <Card className="w-full backdrop-blur-md bg-white/80 dark:bg-black/80">
            <CardHeader>
                <CardTitle>SIP Wealth Creator</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label>Monthly Investment (₹)</Label>
                            <div className="flex items-center gap-4">
                                <Slider
                                    value={[amount]}
                                    onValueChange={(vals) => setAmount(vals[0])}
                                    min={500}
                                    max={100000}
                                    step={500}
                                    className="flex-1"
                                />
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className="w-24"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Time Period (Years)</Label>
                            <div className="flex items-center gap-4">
                                <Slider
                                    value={[years]}
                                    onValueChange={(vals) => setYears(vals[0])}
                                    min={1}
                                    max={30}
                                    step={1}
                                    className="flex-1"
                                />
                                <span className="w-24 text-right font-medium">{years} Years</span>
                            </div>
                        </div>

                        <Button onClick={handleSimulate} disabled={loading} className="w-full">
                            {loading ? 'Calculating...' : 'Calculate Returns'}
                        </Button>

                        {result && (
                            <div className="space-y-2 pt-4 border-t">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Invested Amount</span>
                                    <span className="font-semibold">₹{result.totalInvested.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Current Value</span>
                                    <span className="font-bold text-green-600">₹{result.currentValue.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Absolute Profit</span>
                                    <span className="font-medium text-green-600">+₹{result.profit.toLocaleString()}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2 h-[300px]">
                        {result && result.chartData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={result.chartData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                    <XAxis dataKey="date" tickFormatter={(date) => new Date(date).getFullYear().toString()} />
                                    <YAxis tickFormatter={(val) => `₹${val / 1000}k`} />
                                    <Tooltip
                                        formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="currentValue"
                                        stroke="#10B981"
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                        name="Current Value"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="investedAmount"
                                        stroke="#94a3b8"
                                        fill="#94a3b8"
                                        fillOpacity={0.1}
                                        name="Invested Amount"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground">
                                Chart will appear here
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
