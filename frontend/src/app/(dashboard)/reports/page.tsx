import { ReportsView } from '@/features/reports/ReportsView';
import { ClientPageTitle } from '@/components/utils/ClientPageTitle';

export default function ReportsPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <ClientPageTitle title="Detailed Reports" />
            <ReportsView />
        </div>
    );
}
