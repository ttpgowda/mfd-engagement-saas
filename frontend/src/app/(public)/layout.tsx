import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen bg-background flex flex-col font-sans antialiased selection:bg-primary/20">
            {/* Subtle background pattern */}
            <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm ring-1 ring-primary/20">
                            <span className="text-lg font-bold text-primary-foreground">M</span>
                        </div>
                        <span className="hidden text-xl font-bold tracking-tight text-foreground sm:inline-block">
                            MFD Engagement
                        </span>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-muted-foreground px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            System Operational
                        </div>

                        <div className="h-4 w-px bg-border hidden sm:block"></div>

                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full">
                <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-7xl animate-in fade-in-50 slide-in-from-bottom-3 duration-700">
                    {children}
                </div>
            </main>

            <footer className="border-t bg-card/30 backdrop-blur-sm mt-auto">
                <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="flex flex-col items-center md:items-start gap-1">
                            <p className="text-sm font-medium text-foreground">
                                Wealth Advisory Platform
                            </p>
                            <p className="text-xs text-muted-foreground">
                                © {new Date().getFullYear()} All rights reserved. Built for excellence.
                            </p>
                        </div>

                        <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
                            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
                            <Link href="#" className="hover:text-primary transition-colors">Support</Link>
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    );
}
