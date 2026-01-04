import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export const locales = ['sk', 'en', 'hu'];
export const defaultLocale = 'sk';

// Admin emails that bypass maintenance mode
const ADMIN_EMAILS = ['admin@salonfinder.sk', 'admin@apollotech.sk', 'blanarikdaniel@gmail.com'];

// Simple in-memory rate limiting (resets on deploy)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string, limit: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
        return false;
    }

    if (record.count >= limit) {
        return true;
    }

    record.count++;
    return false;
}

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Rate limiting for API routes
    if (pathname.startsWith('/api')) {
        const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

        // Stricter limits for auth endpoints
        if (pathname.includes('/auth') || pathname.includes('/login')) {
            if (isRateLimited(ip, 10, 60000)) {
                return new NextResponse('Too Many Requests', { status: 429 });
            }
        } else {
            if (isRateLimited(ip, 100, 60000)) {
                return new NextResponse('Too Many Requests', { status: 429 });
            }
        }
    }

    // Check maintenance mode for public pages
    // Primary: environment variable, Secondary: cookie for dynamic toggle
    const isMaintenanceByEnv = process.env.MAINTENANCE_MODE === 'true';
    const maintenanceModeCookie = request.cookies.get('maintenance_mode');
    const isMaintenanceMode = isMaintenanceByEnv || maintenanceModeCookie?.value === 'true';

    // Pages that should show maintenance mode (exclude admin, dashboard, api, auth, static)
    const isPublicPage = !pathname.startsWith('/admin') &&
        !pathname.startsWith('/dashboard') &&
        !pathname.startsWith('/api') &&
        !pathname.startsWith('/auth') &&
        !pathname.startsWith('/prihlasenie') &&
        !pathname.startsWith('/registracia') &&
        !pathname.startsWith('/_next') &&
        !pathname.startsWith('/maintenance') &&
        !pathname.includes('.');

    if (isMaintenanceMode && isPublicPage) {
        // Check if user is admin by checking for admin session
        const adminBypassCookie = request.cookies.get('admin_bypass');
        if (adminBypassCookie?.value !== 'true') {
            // Redirect to maintenance page
            return NextResponse.redirect(new URL('/maintenance', request.url));
        }
    }

    // Skip locale processing for certain paths
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/auth') ||
        pathname.includes('.') ||
        pathname.startsWith('/admin') ||
        pathname.startsWith('/dashboard')
    ) {
        // Still refresh Supabase session for protected routes
        if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
            try {
                const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

                if (supabaseUrl && supabaseAnonKey) {
                    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
                        cookies: {
                            getAll() {
                                return request.cookies.getAll();
                            },
                            setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
                                cookiesToSet.forEach(({ name, value, options }) => {
                                    response.cookies.set(name, value, options);
                                });
                            },
                        },
                    });

                    // Refresh session - this extends the session lifetime
                    await supabase.auth.getUser();
                }
            } catch {
                // Ignore auth errors in middleware
            }
        }
        return response;
    }

    // Check if the pathname already has a locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) {
        // If it's the default locale, redirect without locale prefix
        if (pathname.startsWith(`/${defaultLocale}/`) || pathname === `/${defaultLocale}`) {
            const newPathname = pathname.replace(`/${defaultLocale}`, '') || '/';
            return NextResponse.redirect(new URL(newPathname, request.url));
        }
        return response;
    }

    return response;
}

export const config = {
    matcher: [
        // Match all paths except static files
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
