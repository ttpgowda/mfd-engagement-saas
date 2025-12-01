'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserNav } from '@/components/layout/user-nav';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
    LayoutDashboard,
    Users,
    Menu,
    Command,
    Settings
} from 'lucide-react';
import { useState } from 'react';

export function AdminNavbar({
                                className,
                                ...props
                            }: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const routes = [
        {
            href: '/admin/dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            active: pathname === '/admin/dashboard',
        },
        {
            href: '/admin/tenants',
            label: 'Tenants',
            icon: Users,
            active: pathname?.startsWith('/admin/tenants'),
        },
        {
            href: '/admin/settings',
            label: 'Settings',
            icon: Settings,
            active: pathname === '/admin/settings',
        },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 md:px-8">

                {/* Mobile Menu Trigger */}
                <div className="md:hidden mr-2">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="pr-0">
                            <div className="px-7">
                                <Link
                                    href="/admin/dashboard"
                                    className="flex items-center space-x-2 font-bold"
                                    onClick={() => setOpen(false)}
                                >
                                    <Command className="h-6 w-6" />
                                    <span>MFD Admin</span>
                                </Link>
                            </div>
                            <div className="flex flex-col gap-4 py-8 px-2">
                                {routes.map((route) => (
                                    <Link
                                        key={route.href}
                                        href={route.href}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            "flex items-center gap-2 text-lg font-medium transition-colors hover:text-primary px-4 py-2 rounded-md",
                                            route.active
                                                ? "bg-accent text-accent-foreground"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        <route.icon className="h-5 w-5" />
                                        {route.label}
                                    </Link>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Desktop Logo */}
                <div className="mr-4 hidden md:flex">
                    <Link href="/admin/dashboard" className="mr-6 flex items-center space-x-2">
                        <div className="bg-primary/10 p-1.5 rounded-lg">
                            <Command className="h-5 w-5 text-primary" />
                        </div>
                        <span className="hidden font-bold sm:inline-block">
                            MFD Admin
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "flex items-center gap-2 transition-colors hover:text-primary",
                                    route.active ? "text-foreground font-semibold" : "text-muted-foreground"
                                )}
                            >
                                <route.icon className={cn("h-4 w-4", route.active ? "text-primary" : "text-muted-foreground")} />
                                {route.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right Side Tools */}
                <div className="ml-auto flex items-center space-x-4">
                    <ThemeToggle />
                    <UserNav />
                </div>
            </div>
        </header>
    );
}