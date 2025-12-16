import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { GoogleAnalytics, MicrosoftClarity } from '@/lib/analytics';
import { CookieConsent } from '@/components/layout/CookieConsent';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ToastProvider } from '@/components/ui/Toast';
import { WebsiteSchema, OrganizationSchema } from '@/components/seo/SchemaOrg';

const inter = Inter({
    subsets: ['latin', 'latin-ext'],
    display: 'swap',
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: {
        default: 'Salon Finder SK | Nájdite salóny krásy na Slovensku',
        template: '%s | Salon Finder SK',
    },
    description: 'Najväčší katalóg salónov krásy na Slovensku. Kaderníctva, kozmetika, manikúra, masáže a ďalšie služby vo vašom meste.',
    keywords: [
        'salóny krásy', 'kaderníctvo', 'kozmetika', 'manikúra', 'pedikúra',
        'masáže', 'Slovensko', 'Bratislava', 'Košice', 'kadernícky salón',
        'beauty salon', 'nechty', 'mihalnice', 'barbershop', 'wellness'
    ],
    authors: [{ name: 'Salon Finder SK' }],
    creator: 'Apollo Tech s.r.o.',
    metadataBase: new URL('https://vyhladavacsalonov.vercel.app'),
    alternates: {
        canonical: '/',
        languages: {
            'sk': '/',
            'en': '/en',
            'hu': '/hu',
        },
    },
    openGraph: {
        title: 'Salon Finder SK | Nájdite salóny krásy na Slovensku',
        description: 'Najväčší katalóg salónov krásy na Slovensku. Kaderníctva, kozmetika, manikúra, masáže a ďalšie služby vo vašom meste.',
        type: 'website',
        locale: 'sk_SK',
        alternateLocale: ['en_US', 'hu_HU'],
        siteName: 'Salon Finder SK',
        url: 'https://vyhladavacsalonov.vercel.app',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Salon Finder SK',
        description: 'Nájdite najlepšie salóny krásy vo vašom meste',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'Uuu_J9NwozI5jZRea28koZyPuqNHhbQYg26Gxdpk0os',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="sk" className={inter.variable}>
            <head>
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <link rel="icon" href="/favicon.ico" sizes="32x32" />
                <meta name="theme-color" content="#C9A86C" />
                {/* Hreflang for international SEO */}
                <link rel="alternate" hrefLang="sk" href="https://vyhladavacsalonov.vercel.app/" />
                <link rel="alternate" hrefLang="en" href="https://vyhladavacsalonov.vercel.app/en" />
                <link rel="alternate" hrefLang="hu" href="https://vyhladavacsalonov.vercel.app/hu" />
                <link rel="alternate" hrefLang="x-default" href="https://vyhladavacsalonov.vercel.app/" />
                {/* Schema.org Structured Data */}
                <WebsiteSchema />
                <OrganizationSchema />
            </head>
            <body className={inter.className}>
                {/* Analytics */}
                <GoogleAnalytics />
                <MicrosoftClarity />

                <ToastProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </ToastProvider>

                {/* Cookie Consent Banner */}
                <CookieConsent />
            </body>
        </html>
    );
}

