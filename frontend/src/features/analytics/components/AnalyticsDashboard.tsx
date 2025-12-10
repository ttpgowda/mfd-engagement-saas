import React, { useEffect, useState } from 'react';
import { adminAnalyticsService, AnalyticsDashboardDTO } from '@/services/adminAnalyticsService';
import { StatsGrid } from './StatsGrid';
import { TrafficChart } from './TrafficChart';
import { ToolPerformanceChart } from './ToolPerformanceChart';
import { LinksTable } from './LinksTable';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function AnalyticsDashboard() {
    const [data, setData] = useState<AnalyticsDashboardDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const result = await adminAnalyticsService.getDashboard();
                setData(result);
            } catch (err: unknown) {
                console.error(err);
                setError('Failed to load analytics data.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex h-96 items-center justify-center text-red-500">
                {error || 'No data available'}
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                <p className="text-muted-foreground">
                    Monitor engagement, traffic, and lead conversion across all your shared calculators.
                </p>
                <Separator className="my-4" />
            </div>

            {/* 1. Global KPIs */}
            <StatsGrid stats={data.summary} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 2. Traffic Trends */}
                <TrafficChart data={data.trafficTrend} />

                {/* 3. Top Tools */}
                <ToolPerformanceChart data={data.topTools} />
            </div>

            {/* 4. Detailed Links Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <LinksTable data={data.topLinks} />
            </div>
        </div>
    );
}
