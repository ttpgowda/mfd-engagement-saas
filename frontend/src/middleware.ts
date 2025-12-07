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

    let payload: JWTPayload | null = null;
    let newToken: string | null = null;
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

    if (token) {
        payload = decodeToken(token);
        if (payload) {
            const exp = payload.exp;
            const now = Math.floor(Date.now() / 1000);

            if (exp && exp < now) {
                if (refreshToken) {
                    try {
                        const refreshRes = await fetch('http://localhost:8080/api/auth/refresh?token=' + refreshToken, {
                            method: 'POST',
                        });

                        if (refreshRes.ok) {
                            const data = await refreshRes.json();
                            if (data.accessToken) {
                                newToken = data.accessToken;
                                payload = decodeToken(data.accessToken);
                                hasValidToken = true;
                            }
                        }
                    } catch (err) {
                        console.error('Token refresh failed in middleware:', err);
                    }
                }
            } else {
                hasValidToken = true;
            }
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
                applyNewToken(response, newToken);
            }
            return response;
        }

        if (newToken) {
            const response = NextResponse.next();
            applyNewToken(response, newToken);
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

function applyNewToken(response: NextResponse, token: string) {
    response.cookies.set('token', token, {
        path: '/',
        maxAge: 86400,
        sameSite: 'strict',
    });
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/register',
        '/dashboard/:path*',
        '/leads/:path*',
        '/studio/:path*',
        '/funds/:path*',
        '/calculators/:path*',
    ],
};
