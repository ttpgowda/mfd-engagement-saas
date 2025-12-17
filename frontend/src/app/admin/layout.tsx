import { AdminNavbar } from "@/components/layout/admin-navbar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <AdminNavbar />
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Breadcrumbs />
                {children}
            </div>
        </div>
    );
}
