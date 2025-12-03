'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { DashboardNavbar } from '@/components/layout/dashboard-navbar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-background">
            {/* Navbar at the top */}
            <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />

            {/* Content area with sidebar */}
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
