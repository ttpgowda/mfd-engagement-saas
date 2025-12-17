import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { getTenantConfig } from "@/lib/tenant";

const inter = Inter({ subsets: ["latin"] });



export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantConfig();

  const getFullImageUrl = (url: string | undefined) => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    return `${apiUrl}${url}`;
  };
  const favicon = getFullImageUrl(tenant?.faviconUrl) || "/favicon.ico";
  const title = tenant?.name || "MFD Engagement SaaS";

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description: "Empowering Financial Growth",
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon // Also set apple touch icon
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
