"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { Button, cn } from "@/components/ui/base";

export function ThemeSelect() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setMounted(true);

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="w-10 h-10 opacity-50">
                <Sun className="h-[1.2rem] w-[1.2rem]" />
            </Button>
        );
    }

    const themes = [
        { name: 'light', icon: Sun, label: 'Light' },
        { name: 'dark', icon: Moon, label: 'Dark' },
        { name: 'system', icon: Monitor, label: 'System' },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-full w-10 h-10 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Select theme"
            >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                    {themes.map((t) => (
                        <button
                            key={t.name}
                            onClick={() => {
                                setTheme(t.name);
                                setIsOpen(false);
                            }}
                            className={cn(
                                "flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                                theme === t.name ? "text-indigo-600 dark:text-indigo-400 font-medium" : "text-gray-700 dark:text-gray-300"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <t.icon className="h-4 w-4" />
                                {t.label}
                            </div>
                            {theme === t.name && <Check className="h-3.5 w-3.5" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
