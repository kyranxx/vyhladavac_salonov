import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
    title: 'Salon Finder SK | Nájdite salóny krásy na Slovensku',
    description: 'Najväčší katalóg salónov krásy na Slovensku. Kaderníctva, kozmetika, manikúra, masáže a ďalšie služby vo vašom meste.',
    keywords: 'salóny krásy, kaderníctvo, kozmetika, manikúra, Slovensko, Bratislava, Košice',
    authors: [{ name: 'Salon Finder SK' }],
    openGraph: {
        title: 'Salon Finder SK',
        description: 'Nájdite najlepšie salóny krásy vo vašom meste',
        type: 'website',
        locale: 'sk_SK',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="sk">
            <body>{children}</body>
        </html>
    );
}
