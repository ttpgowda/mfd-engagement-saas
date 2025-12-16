import { headers } from 'next/headers';

// Define TenantConfig interface locally or import shared type if available
export interface TenantConfig {
    id: number;
    tenantId: string;
    name: string;
    contactEmail: string;
    phone: string;
    logoUrl?: string;
    faviconUrl?: string;
    darkLogoUrl?: string;
    mobileLogoUrl?: string;
    instagramUrl?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    website?: string;
}

export async function getTenantConfig(): Promise<TenantConfig | null> {
    const headersList = await headers();
    const host = headersList.get('host') || '';

    // Logic: Identify Tenant ID from subdomain
    // localhost -> default
    // tenant.localhost -> tenant
    // tenant.domain.com -> tenant

    let tenantId = 'default';

    if (host.includes('localhost') || host.includes('127.0.0.1')) {
        const parts = host.split('.');
        // e.g. tenant.localhost:3000 -> ["tenant", "localhost:3000"]
        // If we have at least 2 parts (subdomain + localhost), use the first part.
        if (parts.length > 1 && parts[0] !== 'localhost') {
            tenantId = parts[0];
        }
    } else {
        // e.g. tenant.domain.com -> ["tenant", "domain", "com"]
        const parts = host.split('.');
        if (parts.length > 2 && parts[0] !== 'www') {
            tenantId = parts[0];
        }
    }

    // Add logging to debug
    console.log(`[getTenantConfig] Host: ${host}, TenantID: ${tenantId}`);

    // If tenantId is default and we are on localhost, we might want to fetch default tenant?
    // Or return null which implies default branding.
    if (tenantId === 'default') {
        // Option: return a default config directly without API call if suitable, 
        // or let API handle "default" tenantId look up.
        // Let's try to fetch "default" from backend if it exists, or handle fallback.
    }

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const res = await fetch(`${apiUrl}/api/public/tenant/${tenantId}`, {
            next: { revalidate: 60 }, // Cache for 60s
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            // Only log if not 404 (404 means tenant not found -> use default)
            if (res.status !== 404) {
                console.error(`Failed to fetch tenant config for ${tenantId}: ${res.status}`);
            }
            return null;
        }

        return res.json();
    } catch (e) {
        console.error("Failed to fetch tenant config", e);
        return null;
    }
}
