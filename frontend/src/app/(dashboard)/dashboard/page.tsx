'use client';

import { AnalyticsDashboard } from '@/features/analytics/components/AnalyticsDashboard';
import { ClientPageTitle } from '@/components/utils/ClientPageTitle';

export default function DashboardPage() {
    return (
        <div className="flex-1 space-y-4">
            <ClientPageTitle title="Dashboard" />
            <AnalyticsDashboard />
        </div>
    );
}
