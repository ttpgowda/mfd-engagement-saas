import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ArrowDown } from 'lucide-react';

interface FunnelData {
    stage: string;
    count: number;
    dropoffPercentage: number;
}

interface ConversionFunnelProps {
    data?: FunnelData[];
}

export function ConversionFunnel({ data }: ConversionFunnelProps) {
    if (!data || data.length === 0) return null;

    const colors = ['#3b82f6', '#8b5cf6', '#10b981']; // Blue -> Purple -> Green

    return (
        <Card>
            <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>User journey from view to conversion</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ left: 40, right: 40 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="stage" type="category" width={100} axisLine={false} tickLine={false} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const d = payload[0].payload;
                                        return (
                                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                                                <p className="font-medium">{d.stage}</p>
                                                <p className="text-2xl font-bold">{d.count}</p>
                                                {d.dropoffPercentage > 0 && (
                                                    <p className="text-sm text-red-500 flex items-center mt-1">
                                                        <ArrowDown className="w-3 h-3 mr-1" />
                                                        {d.dropoffPercentage.toFixed(1)}% drop-off
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={40}>
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
