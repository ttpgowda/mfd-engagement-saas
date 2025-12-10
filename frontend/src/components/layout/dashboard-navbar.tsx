'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { UserNav } from '@/components/layout/user-nav';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

import { useState, useEffect } from 'react';

interface DashboardNavbarProps {
    onMenuClick?: () => void;
}

export function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="flex items-center justify-between gap-4 border-b bg-background px-4 md:px-8 py-4">
                {/* Left side - Hamburger menu and brand */}
                <div className="flex items-center gap-3">
                    {/* Hamburger menu for mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={onMenuClick}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Brand name - always visible */}
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex-shrink-0" />
                        <span className="text-lg md:text-xl font-bold whitespace-nowrap">MFD Engage</span>
                    </div>
                </div>
                {/* Right side controls - Placeholder to prevent layout shift */}
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="w-8 h-8" />
                    <div className="w-8 h-8" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between gap-4 border-b bg-background px-4 md:px-8 py-4">
            {/* Left side - Hamburger menu and brand */}
            <div className="flex items-center gap-3">
                {/* Hamburger menu for mobile */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={onMenuClick}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Brand name - always visible */}
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex-shrink-0" />
                    <span className="text-lg md:text-xl font-bold whitespace-nowrap">MFD Engage</span>
                </div>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2 md:gap-4">
                <ThemeToggle />
                <UserNav />
            </div>
        </div>
    );
}
