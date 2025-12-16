import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import '@/styles/globals.css';
import { GoogleAnalytics, MicrosoftClarity } from '@/lib/analytics';
import { CookieConsent } from '@/components/layout/CookieConsent';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ToastProvider } from '@/components/ui/Toast';

const inter = Inter({
    subsets: ['latin', 'latin-ext'],
    display: 'swap',
    variable: '--font-inter',
});

export const viewport: Viewport = {
    themeColor: '#C9A86C',
};

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
        canonical: 'https://vyhladavacsalonov.vercel.app/',
        languages: {
            'sk': 'https://vyhladavacsalonov.vercel.app/',
            'en': 'https://vyhladavacsalonov.vercel.app/en',
            'hu': 'https://vyhladavacsalonov.vercel.app/hu',
        },
    },
    icons: {
        icon: [
            { url: '/favicon.svg', type: 'image/svg+xml' },
            { url: '/favicon.ico', sizes: '32x32' },
        ],
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

// Schema.org structured data
const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Salon Finder SK',
    alternateName: 'Vyhľadávač salónov',
    url: 'https://vyhladavacsalonov.vercel.app',
    description: 'Najväčší katalóg salónov krásy na Slovensku',
    inLanguage: ['sk', 'en', 'hu'],
    potentialAction: {
        '@type': 'SearchAction',
        target: 'https://vyhladavacsalonov.vercel.app/salony?q={search_term_string}',
        'query-input': 'required name=search_term_string'
    }
};

const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Salon Finder SK',
    url: 'https://vyhladavacsalonov.vercel.app',
    description: 'Najväčší katalóg salónov krásy na Slovensku',
    address: {
        '@type': 'PostalAddress',
        addressCountry: 'SK'
    }
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="sk" className={inter.variable}>
            <body className={inter.className}>
                {/* Schema.org JSON-LD - using native script tag for better SEO compatibility */}
                <script
                    id="schema-website"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
                />
                <script
                    id="schema-organization"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
                />

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
