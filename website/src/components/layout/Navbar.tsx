"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeSelect } from "@/components/theme-select";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/base";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const navigation = [
        { name: "Tools", href: "/tools" },
        { name: "Surveys", href: "/surveys" },
        { name: "Spot a Scam", href: "/surveys/spot-scam", className: "text-red-600 dark:text-red-400 font-bold" },
        { name: "Check Your Financial Health", href: "/surveys/financial-health-check" },
        { name: "Blog", href: "/blog" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <header className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5 font-bold text-xl text-indigo-600 dark:text-indigo-400">
                        TheWealthWeb
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex lg:gap-x-8 items-center">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${item.className || ''}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4 items-center">
                    <ThemeSelect />
                    <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400">
                        Log in <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex lg:hidden gap-4 items-center">
                    <ThemeSelect />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMenu}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
                    >
                        <span className="sr-only">Open main menu</span>
                        {isOpen ? (
                            <X className="h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Menu className="h-6 w-6" aria-hidden="true" />
                        )}
                    </Button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-lg py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={toggleMenu}
                            className={`text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0 ${item.className || ''}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <div className="pt-4 flex justify-between items-center border-t border-gray-100 dark:border-gray-800">
                        <Link
                            href="/login"
                            onClick={toggleMenu}
                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
