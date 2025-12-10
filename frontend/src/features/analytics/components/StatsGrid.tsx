import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GlobalStats } from '@/services/adminAnalyticsService';
import { Presentation, Users, MousePointerClick, Clock } from 'lucide-react';

interface StatsGridProps {
    stats: GlobalStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
    const items = [
        {
            title: 'Total Views',
            value: stats.totalViews.toLocaleString(),
            icon: Presentation,
            desc: 'Unique sessions',
            color: 'text-blue-500'
        },
        {
            title: 'Total Leads',
            value: stats.totalLeads.toLocaleString(),
            icon: Users,
            desc: 'Captured contacts',
            color: 'text-green-500'
        },
        {
            title: 'Conversion Rate',
            value: `${stats.conversionRate.toFixed(2)}%`,
            icon: MousePointerClick,
            desc: 'Leads per View',
            color: 'text-purple-500'
        },
        {
            title: 'Avg. Engagement',
            value: `${Math.round(stats.avgEngagementTimeSeconds)}s`,
            icon: Clock,
            desc: 'Time spent per link',
            color: 'text-orange-500'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {item.title}
                        </CardTitle>
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{item.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {item.desc}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
