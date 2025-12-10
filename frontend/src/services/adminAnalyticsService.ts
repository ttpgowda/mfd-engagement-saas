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
    getDashboard: async (): Promise<AnalyticsDashboardDTO> => {
        const response = await axiosInstance.get('/admin/analytics/dashboard');
        return response.data;
    }
};
