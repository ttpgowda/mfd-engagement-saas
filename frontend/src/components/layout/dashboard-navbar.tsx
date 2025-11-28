'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { UserNav } from '@/components/layout/user-nav';

export function DashboardNavbar() {
    return (
        <div className="flex items-center justify-end gap-4 border-b bg-background px-8 py-4">
            <ThemeToggle />
            <UserNav />
        </div>
    );
}
