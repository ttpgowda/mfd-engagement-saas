import Link from 'next/link';
import { Twitter, Instagram, Linkedin } from 'lucide-react';
import { NewsletterForm } from "@/components/layout/NewsletterForm";

export function Footer() {
    return (
        <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 pt-16 pb-8 transition-colors duration-300">
            {/* Main Footer Content */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            TheWealthWeb
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs">
                            Empowering Indian investors with free, unbiased tools and educational resources. Build your wealth with confidence.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
                            Platform
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/tools" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                    Financial Calculators
                                </Link>
                            </li>
                            <li>
                                <Link href="/surveys" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                    Assessments
                                </Link>
                            </li>
                            <li>
                                <Link href="/surveys/spot-scam" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                    Spot a Scam
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                    Blog & Insights
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
                            Company
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                    Contact
                                </Link>
                            </li>
                            {/*<li>
                                <Link href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                    Terms of Service
                                </Link>
                            </li>*/}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
                            Stay Updated
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Subscribe to get the latest financial insights and tool updates.
                        </p>
                        <NewsletterForm />
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        &copy; 2026 TheWealthWeb. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                        Not a SEBI Registered Investment Advisor. For educational purposes only.
                    </p>
                </div>
            </div>
        </footer>
    );
}
