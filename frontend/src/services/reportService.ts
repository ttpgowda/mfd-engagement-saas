import api from '@/lib/axios';

export interface LinkReportItem {
    linkId: number;
    title: string;
    toolSlug: string;
    shortCode: string;
    createdAt: string;
    views: number;
    leads: number;
    conversionRate: number;
    avgEngagementTime: number;
    lastActive: string;
}

export interface TrafficLog {
    sessionId: string;
    timestamp: string;
    toolSlug: string;
    linkTitle: string;
    durationSeconds: number;
    ipAddress: string;
    deviceType: string;
    city: string;
}

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
}

export const ReportService = {
    getDetailedLinksReport: async (
        startDate: string,
        endDate: string,
        page = 0,
        size = 20,
        sort?: string
    ) => {
        const response = await api.get<Page<LinkReportItem>>('/admin/reports/links', {
            params: { startDate, endDate, page, size, sort },
        });
        return response.data;
    },

    getTrafficLogs: async (
        startDate: string,
        endDate: string,
        page = 0,
        size = 20,
        sort?: string
    ) => {
        const response = await api.get<Page<TrafficLog>>('/admin/reports/logs', {
            params: { startDate, endDate, page, size, sort },
        });
        return response.data;
    },
};
