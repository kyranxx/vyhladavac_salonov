import type { Metadata } from 'next';
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

export const metadata: Metadata = {
    title: {
        default: 'Salon Finder SK | Nájdite salóny krásy na Slovensku',
        template: '%s | Salon Finder SK',
    },
    description: 'Najväčší katalóg salónov krásy na Slovensku. Kaderníctva, kozmetika, manikúra, masáže a ďalšie služby vo vašom meste.',
    keywords: ['salóny krásy', 'kaderníctvo', 'kozmetika', 'manikúra', 'pedikúra', 'masáže', 'Slovensko', 'Bratislava', 'Košice'],
    authors: [{ name: 'Salon Finder SK' }],
    creator: 'Apollo Tech s.r.o.',
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://vyhladavac-salonov.vercel.app'),
    openGraph: {
        title: 'Salon Finder SK | Nájdite salóny krásy na Slovensku',
        description: 'Najväčší katalóg salónov krásy na Slovensku. Kaderníctva, kozmetika, manikúra, masáže a ďalšie služby vo vašom meste.',
        type: 'website',
        locale: 'sk_SK',
        alternateLocale: ['en_US', 'hu_HU'],
        siteName: 'Salon Finder SK',
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
        other: {
            'msvalidate.01': 'YOUR_BING_VERIFICATION_CODE',
        },
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

