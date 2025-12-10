import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToolPerformance } from '@/services/adminAnalyticsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ToolPerformanceChartProps {
    data: ToolPerformance[];
}

export function ToolPerformanceChart({ data }: ToolPerformanceChartProps) {
    // Only show top 5 tools
    const chartData = data.slice(0, 5);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Tools by Views</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={chartData}
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted" />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="toolSlug"
                                type="category"
                                width={100}
                                tickFormatter={(val) => val.split('-').join(' ')}
                                fontSize={12}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px' }}
                                cursor={{ fill: 'transparent' }}
                            />
                            <Bar dataKey="views" fill="#8884d8" radius={[0, 4, 4, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8884d8' : '#82ca9d'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
