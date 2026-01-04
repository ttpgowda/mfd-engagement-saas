import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TheWealthWeb - Smart Investing for India",
  description: "TheWealthWeb offers expert financial tools, mutual fund calculators, and comprehensive investment surveys to help Indian investors make smart, data-driven financial decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <header className="bg-white border-b border-gray-100">
          <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div className="flex lg:flex-1">
              <Link href="/" className="-m-1.5 p-1.5 font-bold text-xl text-indigo-600">
                TheWealthWeb
              </Link>
            </div>
            <div className="flex gap-x-12">
              <Link href="/tools" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">
                Tools
              </Link>
              <Link href="/surveys" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">
                Surveys
              </Link>
              <Link href="/surveys/spot-scam" className="text-sm font-semibold leading-6 text-red-600 hover:text-red-700">
                Spot a Scam
              </Link>
              <Link href="/surveys/financial-health-check" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">
                Check Your Financial Health
              </Link>
              <Link href="/blog" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">
                Blog
              </Link>
              <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">
                About
              </Link>
              <Link href="/contact" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">
                Contact
              </Link>
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">
                Log in <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
          <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
            <div className="mt-8 md:order-1 md:mt-0">
              <p className="text-center text-xs leading-5 text-gray-500">
                &copy; 2026 TheWealthWeb. All rights reserved.
              </p>{/*SEBI Registration No: INZ00000000*/}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
