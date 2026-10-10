import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './utils/supabase/middleware';

/**
 * Lex System: Master Routing & Auth Middleware
 * Objective: 
 * 1. Refresh Supabase secure sessions and protect internal routes (e.g., /dashboard).
 * 2. Handle White-Label dynamic routing for tenant domains.
 */
export async function middleware(req: NextRequest) {
    // 1. Core Security: Refresh Supabase Session and assert route protection.
    // This will redirect to /login if an unauthenticated user hits /dashboard.
    const authResponse = await updateSession(req);

    // If the auth middleware explicitly redirected (e.g. to /login), obey it immediately.
    if (authResponse.headers.get('location')) {
        return authResponse;
    }

    const url = req.nextUrl.clone();
    const hostname = req.headers.get('host') || '';
    const isMasterDomain = hostname.includes('localhost') || hostname.includes('lexsystem.com');

    if (
        url.pathname.startsWith('/api') ||
        url.pathname.startsWith('/_next') ||
        url.pathname.includes('.')
    ) {
        return authResponse;
    }

    // 2. White-Label Logic:
    // Rewrite path to `/[domain]/...` for tenant domains to load their specific UI config.
    if (!isMasterDomain) {
        url.pathname = `/${hostname}${url.pathname}`;
        // Preserve the auth cookies and headers
        const rewriteResponse = NextResponse.rewrite(url);
        authResponse.cookies.getAll().forEach(cookie => {
            rewriteResponse.cookies.set(cookie.name, cookie.value, cookie);
        });
        return rewriteResponse;
    }

    // Otherwise, return the auth-refreshed response for standard routes
    return authResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
