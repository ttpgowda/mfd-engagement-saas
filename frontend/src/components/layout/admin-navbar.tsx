'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserNav } from '@/components/layout/user-nav';

export function AdminNavbar({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();

    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <div className="mr-4 hidden md:flex">
                    <Link href="/admin/dashboard" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block">
                            MFD Admin
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/admin/dashboard"
                            className={cn(
                                "transition-colors hover:text-foreground/80",
                                pathname === "/admin/dashboard" ? "text-foreground" : "text-foreground/60"
                            )}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/admin/tenants"
                            className={cn(
                                "transition-colors hover:text-foreground/80",
                                pathname?.startsWith("/admin/tenants") ? "text-foreground" : "text-foreground/60"
                            )}
                        >
                            Tenants
                        </Link>
                    </nav>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                    <ThemeToggle />
                    <UserNav />
                </div>
            </div>
        </div>
    );
}
