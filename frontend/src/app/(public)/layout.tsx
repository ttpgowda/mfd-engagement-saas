import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { getTenantConfig } from "@/lib/tenant";
import { Phone, Mail, MessageCircle, ArrowRight, Menu } from "lucide-react";

export default async function PublicLayout({
                                               children,
                                           }: {
    children: React.ReactNode;
}) {
    const tenant = await getTenantConfig();

    // --- Data Preparation ---
    const getFullImageUrl = (url: string | undefined) => {
        if (!url) return undefined;
        if (url.startsWith('http')) return url;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        return `${apiUrl}${url}`;
    };

    const logoUrl = getFullImageUrl(tenant?.logoUrl);
    const tenantName = tenant?.name || "MFD Engagement";
    const contactEmail = tenant?.contactEmail || "support@mfdengagement.com";
    const phone = tenant?.phone;

    // Helper for WhatsApp
    const sanitizeNumber = (p?: string) => (p ? p.replace(/\D/g, "") : "");
    const waLink = sanitizeNumber(phone) ? `https://wa.me/${sanitizeNumber(phone)}` : undefined;

    return (
        <div className="relative min-h-screen bg-background flex flex-col font-sans antialiased selection:bg-primary/20">
            {/* Background Pattern */}
            <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* --- 1. TOP UTILITY STRIP (High Visibility for Contact) --- */}
            <div className="w-full bg-primary text-primary-foreground shadow-sm">
                <div className="container mx-auto flex items-center justify-between px-4 py-2 text-xs sm:text-sm font-medium">
                    <div className="flex items-center gap-4">
                        <span className="opacity-90 hidden sm:inline">Need assistance?</span>
                        {phone && (
                            <a href={`tel:${phone}`} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                                <Phone size={14} className="fill-current" />
                                <span>{phone}</span>
                            </a>
                        )}
                        {contactEmail && (
                            <a href={`mailto:${contactEmail}`} className="hidden md:flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                                <Mail size={14} />
                                <span>{contactEmail}</span>
                            </a>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {waLink && (
                            <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 bg-white/10 px-3 py-0.5 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <MessageCircle size={14} />
                                <span>WhatsApp</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* --- 2. MAIN HEADER (Branding & Navigation) --- */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90 group">
                        {logoUrl ? (
                            <div className="relative h-12 w-12 overflow-hidden rounded-lg shadow-sm border border-border/50 group-hover:border-primary/50 transition-colors bg-card">
                                <img
                                    src={logoUrl}
                                    alt={tenantName}
                                    className="h-full w-full object-contain p-1"
                                />
                            </div>
                        ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary shadow-sm">
                                <span className="text-xl font-bold text-primary-foreground">{tenantName.charAt(0)}</span>
                            </div>
                        )}
                        <span className="text-xl font-bold tracking-tight text-foreground hidden sm:block">
                            {tenantName}
                        </span>
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        <Link
                            href="#contact-banner"
                            className="hidden sm:inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            Get in Touch
                        </Link>

                        {/* Mobile Menu Placeholder (Optional) */}
                        <button className="sm:hidden p-2 rounded-md hover:bg-muted">
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* --- 3. MAIN CONTENT --- */}
            <main className="flex-1 w-full">
                <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-7xl animate-in fade-in-50 slide-in-from-bottom-3 duration-700">
                    {children}
                </div>
            </main>

            {/* --- 4. CONTACT ACTION BAND (The "Lead Magnet") --- */}
            <section id="contact-banner" className="relative border-t bg-muted/30 overflow-hidden">
                {/* Decorative background blobs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>

                <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Left: Persuasive Text */}
                        <div className="space-y-4 text-center lg:text-left">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Let's start a conversation.
                            </h2>
                            <p className="text-muted-foreground text-lg max-w-xl mx-auto lg:mx-0">
                                Whether you have questions about your portfolio or need advice on your financial goals, {tenantName} is here to guide your wealth creation journey.
                            </p>
                        </div>

                        {/* Right: Action Cards */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            {/* Phone Card */}
                            {phone && (
                                <a
                                    href={`tel:${phone}`}
                                    className="group flex flex-col items-center sm:items-start p-6 rounded-2xl bg-background border shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300"
                                >
                                    <div className="mb-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Phone size={20} />
                                    </div>
                                    <span className="font-semibold text-lg text-foreground">Call Us</span>
                                    <span className="text-muted-foreground group-hover:text-primary transition-colors">{phone}</span>
                                </a>
                            )}

                            {/* WhatsApp Card */}
                            {waLink && (
                                <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex flex-col items-center sm:items-start p-6 rounded-2xl bg-background border shadow-sm hover:shadow-md hover:border-[#25D366]/50 transition-all duration-300"
                                >
                                    <div className="mb-4 h-10 w-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform">
                                        <MessageCircle size={20} />
                                    </div>
                                    <span className="font-semibold text-lg text-foreground">WhatsApp</span>
                                    <span className="text-muted-foreground group-hover:text-[#25D366] transition-colors">Chat Now</span>
                                </a>
                            )}

                            {/* Email Card - Full Width if needed */}
                            {contactEmail && (
                                <a
                                    href={`mailto:${contactEmail}`}
                                    className="sm:col-span-2 group flex flex-row items-center gap-4 p-6 rounded-2xl bg-background border shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300"
                                >
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Mail size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-lg text-foreground">Email Support</span>
                                        <span className="text-muted-foreground break-all group-hover:text-primary transition-colors">{contactEmail}</span>
                                    </div>
                                    <ArrowRight className="ml-auto text-muted-foreground group-hover:translate-x-1 transition-transform" size={20} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 5. TRUST FOOTER --- */}
            <footer className="border-t bg-background pt-12 pb-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
                        {/* Brand Column */}
                        <div className="space-y-4 max-w-sm">
                            <div className="flex items-center gap-2">
                                {logoUrl ? (
                                    <img src={logoUrl} alt="Logo" className="h-8 w-auto object-contain grayscale hover:grayscale-0 transition-all" />
                                ) : (
                                    <span className="font-bold text-xl tracking-tight">{tenantName}</span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Your trusted partner in financial growth. We are dedicated to helping you build wealth through personalized investment strategies and expert advice.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="grid grid-cols-2 gap-8 sm:gap-16">
                            <div className="space-y-3">
                                <h3 className="font-semibold text-foreground text-sm">Legal</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                                    <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                                    <li><Link href="#" className="hover:text-primary transition-colors">Compliance</Link></li>
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <h3 className="font-semibold text-foreground text-sm">Company</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                                    <li><Link href="#contact-banner" className="hover:text-primary transition-colors">Contact</Link></li>
                                    <li><Link href="#" className="hover:text-primary transition-colors">Support Center</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Copyright Bar */}
                    <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                        <p>© {new Date().getFullYear()} {tenantName}. All rights reserved.</p>
                        <div className="flex items-center gap-4">
                            <span>Designed for Growth</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}