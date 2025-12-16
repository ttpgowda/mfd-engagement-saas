import { getTenantConfig } from "@/lib/tenant";
import { DashboardShell } from './DashboardShell';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const tenant = await getTenantConfig();

    return (
        <DashboardShell tenant={tenant}>
            {children}
        </DashboardShell>
    );
}
