'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CalculatorsPage() {
    // --- Cost of Delay State ---
    const [delaySipAmount, setDelaySipAmount] = useState(5000);
    const [delayYears, setDelayYears] = useState(20);
    const [delayRate, setDelayRate] = useState(12);
    const [delayStart, setDelayStart] = useState(1); // Years delayed

    // --- Step-Up SIP State ---
    const [stepSipAmount, setStepSipAmount] = useState(10000);
    const [stepYears, setStepYears] = useState(20);
    const [stepRate, setStepRate] = useState(12);
    const [stepIncrease, setStepIncrease] = useState(10); // % increase

    // --- Calculations ---
    const calculateDelayCost = () => {
        const months = delayYears * 12;
        const rate = delayRate / 12 / 100;

        // Scenario A: Start Now
        const fvNow = delaySipAmount * ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate);

        // Scenario B: Start Later
        const monthsLater = (delayYears - delayStart) * 12;
        const fvLater = delaySipAmount * ((Math.pow(1 + rate, monthsLater) - 1) / rate) * (1 + rate);

        return { fvNow, fvLater, cost: fvNow - fvLater };
    };

    const calculateStepUp = () => {
        let data = [];
        let currentAmount = stepSipAmount;
        let totalValue = 0;
        const rate = stepRate / 100;

        for (let i = 1; i <= stepYears; i++) {
            // Simple yearly approximation for visualization
            const yearlyContribution = currentAmount * 12;
            totalValue = (totalValue + yearlyContribution) * (1 + rate);
            data.push({ year: i, value: Math.round(totalValue), invested: Math.round(yearlyContribution * i) }); // Simplified invested
            currentAmount = currentAmount * (1 + stepIncrease / 100);
        }
        return data;
    };

    const delayResult = calculateDelayCost();
    const stepUpData = calculateStepUp();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Smart Calculators</h2>
            </div>

            <Tabs defaultValue="delay" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="delay">Cost of Delay</TabsTrigger>
                    <TabsTrigger value="stepup">Step-Up SIP</TabsTrigger>
                </TabsList>

                {/* --- Cost of Delay Tab --- */}
                <TabsContent value="delay" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Inputs</CardTitle>
                                <CardDescription>See how much waiting costs you.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Monthly SIP Amount (₹)</Label>
                                    <Input
                                        type="number"
                                        value={delaySipAmount}
                                        onChange={(e) => setDelaySipAmount(Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Investment Duration (Years): {delayYears}</Label>
                                    <Slider
                                        value={[delayYears]}
                                        onValueChange={(v: number[]) => setDelayYears(v[0])}
                                        max={40}
                                        step={1}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Expected Return (%): {delayRate}</Label>
                                    <Slider
                                        value={[delayRate]}
                                        onValueChange={(v: number[]) => setDelayRate(v[0])}
                                        max={30}
                                        step={0.5}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Delay in Starting (Years): {delayStart}</Label>
                                    <Slider
                                        value={[delayStart]}
                                        onValueChange={(v: number[]) => setDelayStart(v[0])}
                                        max={10}
                                        step={1}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>The Cost of Waiting</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center h-[300px] space-y-4">
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">If you start NOW:</p>
                                    <p className="text-2xl font-bold text-green-600">₹{Math.round(delayResult.fvNow).toLocaleString()}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">If you wait {delayStart} years:</p>
                                    <p className="text-2xl font-bold text-yellow-600">₹{Math.round(delayResult.fvLater).toLocaleString()}</p>
                                </div>
                                <div className="text-center p-4 bg-destructive/10 rounded-lg w-full">
                                    <p className="text-sm font-semibold text-destructive">Cost of Delay</p>
                                    <p className="text-3xl font-bold text-destructive">₹{Math.round(delayResult.cost).toLocaleString()}</p>
                                </div>
                                <Button className="w-full">Share this Insight</Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* --- Step-Up SIP Tab --- */}
                <TabsContent value="stepup" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Inputs</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Initial SIP Amount (₹)</Label>
                                    <Input
                                        type="number"
                                        value={stepSipAmount}
                                        onChange={(e) => setStepSipAmount(Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Annual Step-Up (%): {stepIncrease}</Label>
                                    <Slider
                                        value={[stepIncrease]}
                                        onValueChange={(v: number[]) => setStepIncrease(v[0])}
                                        max={50}
                                        step={1}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Duration (Years): {stepYears}</Label>
                                    <Slider
                                        value={[stepYears]}
                                        onValueChange={(v: number[]) => setStepYears(v[0])}
                                        max={40}
                                        step={1}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Wealth Growth</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={stepUpData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="year" />
                                            <YAxis tickFormatter={(value) => `₹${value / 100000}L`} />
                                            <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                                            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-lg font-semibold">
                                        Final Value: <span className="text-primary">₹{stepUpData[stepUpData.length - 1]?.value.toLocaleString()}</span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
