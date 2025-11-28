'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    PenTool,
    Search,
    Settings,
    Calculator,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const sidebarItems = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Content Studio',
        href: '/studio',
        icon: PenTool,
    },
    {
        title: 'Fund Explorer',
        href: '/funds',
        icon: Search,
    },
    {
        title: 'Calculators',
        href: '/calculators',
        icon: Calculator,
    },
    {
        title: 'Leads',
        href: '/leads',
        icon: Users,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col border-r bg-card px-4 py-6">
            <div className="mb-8 flex items-center gap-2 px-2">
                <div className="h-8 w-8 rounded-lg bg-primary" />
                <span className="text-xl font-bold">MFD Engage</span>
            </div>

            <nav className="flex-1 space-y-2">
                {sidebarItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            pathname === item.href
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                    </Link>
                ))}
            </nav>

            <div className="mt-auto space-y-2">
                <Button variant="ghost" className="w-full justify-start gap-3">
                    <Settings className="h-4 w-4" />
                    Settings
                </Button>
            </div>
        </div>
    );
}
