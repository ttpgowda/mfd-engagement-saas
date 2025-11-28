import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value || ''; // In a real app, you might store token in cookies
    // However, our current implementation uses localStorage, which middleware cannot access directly.
    // Middleware runs on the server (Edge), localStorage is client-side.
    // To make this work with middleware, we need to store the token in a cookie as well upon login.
    // For now, since we can't easily change the login flow to use cookies without more work,
    // we will assume the token is in a cookie named 'token'.

    // Wait, if we only use localStorage, middleware can't see it.
    // We should probably rely on a client-side check or move to cookies.
    // Given the constraints and the user's request "when user just open the base url means we need to goes to /dashboard logined",
    // we can try to check for a cookie. If we can't change login to set a cookie, we might need a client-side wrapper.

    // BUT, the user asked to "correct this things now".
    // The best practice is HttpOnly cookies.
    // Let's assume for this step we will update the login page to ALSO set a cookie, or we use a client-side protection.
    // Middleware is better for redirects.

    // Let's write a middleware that checks for a 'token' cookie.
    // We will also need to update the Login page to set this cookie.

    const path = request.nextUrl.pathname;

    const isPublicPath = path === '/login' || path === '/register' || path === '/';

    // If we have a token (dummy check for existence for now, real validation happens on backend or with jwt-decode)
    if (token) {
        if (isPublicPath) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    } else {
        if (!isPublicPath && !path.startsWith('/api') && !path.startsWith('/_next') && !path.startsWith('/static')) {
            return NextResponse.redirect(new URL('/login', request.url));
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
