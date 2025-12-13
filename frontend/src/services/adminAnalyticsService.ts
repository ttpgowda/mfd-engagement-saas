import axiosInstance from '@/lib/axios';

export interface GlobalStats {
    totalViews: number;
    totalLeads: number;
    conversionRate: number;
    avgEngagementTimeSeconds: number;
}

export interface DailyTrend {
    date: string;
    views: number;
    leads: number;
}

export interface ToolPerformance {
    toolSlug: string;
    views: number;
    leads: number;
    conversionRate: number;
    avgDurationSeconds: number;
}

export interface LinkPerformance {
    linkId: number;
    title: string;
    toolSlug: string;
    shortCode: string;
    views: number;
    leads: number;
    conversionRate: number;
    lastActive: string;
}

export interface AnalyticsDashboardDTO {
    summary: GlobalStats;
    trafficTrend: DailyTrend[];
    topTools: ToolPerformance[];
    topLinks: LinkPerformance[];
}

export const adminAnalyticsService = {
    async getDashboard(): Promise<AnalyticsDashboardDTO> {
        const response = await axiosInstance.get('/admin/analytics/dashboard');
        return response.data;
    },

    async getFunnel(): Promise<{ stage: string; count: number; dropoffPercentage: number; }[]> {
        const res = await axiosInstance.get('/public/analytics/funnel');
        return res.data;
    },

    async getHeatmap(): Promise<{ dayOfWeek: number; hourOfDay: number; intensity: number; }[]> {
        const res = await axiosInstance.get('/public/analytics/heatmap');
        return res.data;
    },

    async getPatterns(): Promise<{ sourceTool: string; targetTool: string; count: number; }[]> {
        const res = await axiosInstance.get('/public/analytics/patterns');
        return res.data;
    }
};
