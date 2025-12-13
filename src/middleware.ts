import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const locales = ['sk', 'en', 'hu'];
export const defaultLocale = 'sk';

// Get the preferred locale from the request
function getLocale(request: NextRequest) {
    // Check if locale is already in the pathname
    const pathname = request.nextUrl.pathname;
    const pathnameLocale = locales.find(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameLocale) return pathnameLocale;

    // Check Accept-Language header
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
        const preferredLocale = acceptLanguage
            .split(',')
            .map((lang) => lang.split(';')[0].trim().substring(0, 2))
            .find((lang) => locales.includes(lang));
        if (preferredLocale) return preferredLocale;
    }

    return defaultLocale;
}

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Skip for API routes, static files, etc.
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/auth') ||
        pathname.includes('.') ||
        pathname.startsWith('/admin') ||
        pathname.startsWith('/dashboard')
    ) {
        return NextResponse.next();
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
        return NextResponse.next();
    }

    // For default locale, don't add prefix (keep URL clean)
    // For other locales, they need to explicitly navigate to /en or /hu
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Skip all internal paths (_next, api, etc.)
        '/((?!_next|api|auth|admin|dashboard|.*\\..*).*)',
    ],
};
