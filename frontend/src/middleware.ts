import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface JWTPayload {
    exp?: number;
    permissions?: string[];
    [key: string]: unknown;
}

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;
    const path = request.nextUrl.pathname;

    console.log("token", token);
    console.log("refreshToken", refreshToken);

    let payload: JWTPayload | null = null;
    let newToken: string | null = null;
    let newRefreshToken: string | null = null;
    let hasValidToken = false;

    const decodeToken = (t: string): JWTPayload | null => {
        try {
            const parts = t.split('.');
            if (parts.length < 2) return null;
            return JSON.parse(atob(parts[1]));
        } catch {
            return null;
        }
    };

    // 1. Initial Token Checks
    if (token) {
        payload = decodeToken(token);
        if (payload && payload.exp) {
            const now = Math.floor(Date.now() / 1000);
            if (payload.exp > now) {
                hasValidToken = true;
            } else {
                console.log("Middleware: Token expired");
            }
        }
    }

    // 2. Refresh Logic (if invalid/missing token but have refresh token)
    if (!hasValidToken && refreshToken) {
        try {
            const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
            const host = request.nextUrl.hostname;
            const parts = host.split('.');
            let tenantId = 'saas-provider';

            if (host.endsWith('localhost')) {
                if (parts.length > 1 && parts[0] !== 'localhost' && parts[0] !== 'www') tenantId = parts[0];
            } else if (parts.length > 2 && parts[0] !== 'www') {
                tenantId = parts[0];
            }

            const refreshRes = await fetch(`${baseURL}/api/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Tenant-ID': tenantId,
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (refreshRes.ok) {
                const data = await refreshRes.json();
                if (data.accessToken) {
                    console.log("Middleware: Token refresh successful");
                    newToken = data.accessToken;
                    if (data.refreshToken) {
                        newRefreshToken = data.refreshToken;
                    }
                    payload = decodeToken(data.accessToken);
                    hasValidToken = true;
                }
            } else {
                console.error("Middleware: Refresh failed with status", refreshRes.status);
                const text = await refreshRes.text();
                console.error("Middleware: Refresh response:", text);
            }
        } catch (err) {
            console.error('Token refresh failed in middleware:', err);
        }
    }

    const permissions = payload?.permissions || [];
    const isPublicPath = path === '/login' || path === '/register' || path === '/';

    if (hasValidToken) {
        if (isPublicPath) {
            let response: NextResponse;
            if (permissions.includes('TENANT_MANAGE')) {
                response = NextResponse.redirect(new URL('/admin/dashboard', request.url));
            } else {
                response = NextResponse.redirect(new URL('/dashboard', request.url));
            }
            if (newToken) {
                applyNewToken(response, newToken, newRefreshToken);
            }
            return response;
        }

        if (newToken) {
            const response = NextResponse.next();
            applyNewToken(response, newToken, newRefreshToken);
            return response;
        }
    } else {
        if (!isPublicPath && !path.startsWith('/api') && !path.startsWith('/_next') && !path.startsWith('/static')) {
            const response = NextResponse.redirect(new URL('/login', request.url));
            // Clear invalid tokens
            response.cookies.delete('token');
            response.cookies.delete('refreshToken');
            return response;
        }
    }

    return NextResponse.next();
}

function applyNewToken(response: NextResponse, token: string, refreshToken?: string | null) {
    response.cookies.set('token', token, {
        path: '/',
        maxAge: 86400,
        sameSite: 'strict',
    });
    if (refreshToken) {
        response.cookies.set('refreshToken', refreshToken, {
            path: '/',
            maxAge: 604800, // 7 days matching backend
            sameSite: 'strict',
        });
    }
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/register',
        '/dashboard',
        '/dashboard/:path*',
        '/research/:path*',
        '/leads/:path*',
        '/surveys/:path*',
        '/reports/:path*',
        '/calculators/:path*',
        '/users/:path*',
        '/admin/:path*',
        '/settings/:path*',
        '/studio/:path*',
        '/funds/:path*',
    ],
};
