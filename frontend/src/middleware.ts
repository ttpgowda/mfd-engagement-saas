import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value || '';
    const path = request.nextUrl.pathname;

    const isPublicPath = path === '/login' || path === '/register' || path === '/';

    // Check if token exists and is not empty (basic validation)
    const hasValidToken = token && token.trim().length > 0;

    if (hasValidToken) {
        // User has a token, redirect away from public paths
        if (isPublicPath) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    } else {
        // No valid token
        if (!isPublicPath && !path.startsWith('/api') && !path.startsWith('/_next') && !path.startsWith('/static')) {
            // Clear any invalid token cookie before redirecting
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('token');
            return response;
        }
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
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
