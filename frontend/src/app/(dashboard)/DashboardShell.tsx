"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthService } from "@/services/api";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    Menu,
    X,
    Bell,
    Search,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Calculator,
    FileBarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

// --- UPDATED NAVIGATION ITEMS (From your Sidebar snippet) ---
const navItems = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Mutual Fund Research',
        href: '/research',
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
    {
        title: 'Surveys',
        href: '/surveys',
        icon: FileText,
    },
    {
        title: 'Reports',
        href: '/reports',
        icon: FileBarChart,
    },
];

const secondaryNavItems = [
    {
        title: "Settings",
        href: "/dashboard/settings", // Kept consistent with settings pattern
        icon: Settings,
    },
];

interface DashboardShellProps {
    children: React.ReactNode;
    tenant: any;
}

export function DashboardShell({ children, tenant }: DashboardShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const pathname = usePathname();

    const getFullImageUrl = (url: string | undefined) => {
        if (!url) return undefined;
        if (url.startsWith('http')) return url;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        return `${apiUrl}${url}`;
    };

    const logoUrl = getFullImageUrl(tenant?.logoUrl);
    const tenantName = tenant?.name || "MFD Panel";

    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Try to get username from token for backend logout
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    if (payload.sub) {
                        await AuthService.logout(payload.sub);
                    }
                } catch (e) {
                    console.error("Error decoding token for logout", e);
                }
            }
        } catch (e) {
            console.error("Logout failed", e);
        }

        try {
            // Call Next.js API route to clear cookies server-side
            await fetch('/api/logout', { method: 'POST' });
        } catch (e) {
            console.error("Failed to clear cookies server-side", e);
        }

        // Clear tokens
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

        // Clear cookies client-side
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        // Redirect to login (hard refresh to clear any in-memory state)
        window.location.href = '/login';
    };

    return (
        <div className="relative min-h-screen bg-background/50 flex flex-col md:flex-row font-sans antialiased selection:bg-primary/20">

            {/* --- 1. THE "PRETTY" BACKGROUND PATTERN --- */}
            <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="fixed inset-0 -z-10 bg-primary/5 blur-[100px] rounded-full w-[40%] h-[40%] top-0 right-0 pointer-events-none opacity-50"></div>

            {/* --- MOBILE OVERLAY --- */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* --- SIDEBAR --- */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background/70 backdrop-blur-xl transition-all duration-300 ease-in-out md:sticky md:top-0 md:h-screen border-border/50",
                    isSidebarOpen ? "w-64" : "w-[70px]",
                    !isMobileMenuOpen && "-translate-x-full md:translate-x-0",
                    isMobileMenuOpen && "translate-x-0 w-64"
                )}
            >
                {/* Sidebar Header */}
                <div className="flex h-16 items-center border-b border-border/50 px-4">
                    <div className={cn("flex items-center gap-3 overflow-hidden transition-all w-full", !isSidebarOpen && "md:justify-center")}>
                        {logoUrl ? (
                            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg shadow-sm">
                                <img src={logoUrl} alt={tenantName} className="h-full w-full object-contain bg-white/50" />
                            </div>
                        ) : (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-md">
                                {tenantName.charAt(0)}
                            </div>
                        )}
                        <span className={cn("font-bold truncate text-foreground transition-all duration-300", !isSidebarOpen && "md:hidden md:w-0 md:opacity-0")}>
                            {tenantName}
                        </span>
                    </div>

                    <Button variant="ghost" size="icon" className="ml-auto md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Sidebar Navigation */}
                <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-muted">
                    <nav className="grid gap-1 px-3">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-primary/10 text-primary shadow-sm"
                                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                                        !isSidebarOpen && "justify-center px-2"
                                    )}
                                    title={!isSidebarOpen ? item.title : undefined}
                                >
                                    <item.icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                    <span className={cn("transition-all duration-300", !isSidebarOpen && "md:hidden md:w-0 md:opacity-0")}>
                                        {item.title}
                                    </span>
                                    {/* Active Indicator Bar */}
                                    {isActive && isSidebarOpen && (
                                        <div className="absolute left-0 h-8 w-1 rounded-r-full bg-primary opacity-100" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="my-4 border-t border-border/50 mx-4" />

                    <nav className="grid gap-1 px-3">
                        {secondaryNavItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                                        !isSidebarOpen && "justify-center px-2"
                                    )}
                                    title={!isSidebarOpen ? item.title : undefined}
                                >
                                    <item.icon className="h-5 w-5 shrink-0" />
                                    <span className={cn("transition-all duration-300", !isSidebarOpen && "md:hidden md:w-0 md:opacity-0")}>
                                        {item.title}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Sidebar Footer / Toggle */}
                <div className="border-t border-border/50 p-3 hidden md:flex justify-end bg-background/30 backdrop-blur-sm">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center h-8 hover:bg-background/80"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">

                {/* Header - Glassmorphism */}
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/40 bg-background/70 px-6 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden -ml-2"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Search Bar - styled to blend in */}
                    <div className="flex-1 hidden md:flex max-w-md">
                        <div className="relative w-full group">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                type="search"
                                placeholder="Search clients, portfolios..."
                                className="w-full bg-background/50 border-border/50 pl-10 md:w-[300px] lg:w-[400px] focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:bg-background transition-all"
                            />
                        </div>
                    </div>

                    <div className="ml-auto flex items-center gap-3 sm:gap-4">
                        <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background"></span>
                        </Button>

                        <ThemeToggle />

                        <div className="h-6 w-px bg-border/60 mx-1 hidden sm:block"></div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all">
                                    <Avatar className="h-9 w-9 border border-border/50">
                                        <AvatarImage src="/avatars/01.png" alt="@admin" />
                                        <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">Admin User</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {tenant?.contactEmail || "admin@example.com"}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer">
                                    <Users className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 md:p-8 overflow-x-hidden relative">
                    {/* Content Fade-in animation */}
                    <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                        <Breadcrumbs />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}