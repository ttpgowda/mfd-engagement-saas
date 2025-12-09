export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b bg-card">
                <div className="container flex items-center h-16 px-4">
                    {/* Placeholder for Logo - In real app, fetch from tenant or context */}
                    <div className="font-bold text-xl">MFD Ex.</div>
                    <div className="ml-auto text-sm text-muted-foreground">
                        Provided by Your Advisor
                    </div>
                </div>
            </header>
            <main className="flex-1 container py-8 px-4">
                {children}
            </main>
            <footer className="border-t py-4 text-center text-sm text-muted-foreground bg-muted/30">
                <div className="container">
                    © {new Date().getFullYear()} Wealth Advisory. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
