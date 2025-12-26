import { Metadata } from 'next';

// Only export these for non-Default locales (en, hu)
// Slovak (sk) is default and doesn't need a prefix
const SUPPORTED_LOCALES = ['en', 'hu'];

export async function generateStaticParams() {
    return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params;

    const titles: Record<string, string> = {
        en: 'Register salónov - Beauty Salons in Slovakia',
        hu: 'Register salónov - Szépségszalonok Szlovákiában',
    };

    const descriptions: Record<string, string> = {
        en: 'Find the best beauty salons in Slovakia. Hairdressers, cosmetics, manicure, massage and more.',
        hu: 'Találja meg a legjobb szépségszalonokat Szlovákiában. Fodrászatok, kozmetikák, manikűr, masszázs és más.',
    };

    return {
        title: titles[locale] || titles.en,
        description: descriptions[locale] || descriptions.en,
        alternates: {
            canonical: `/${locale}`,
            languages: {
                'en': '/en',
                'hu': '/hu',
                'sk': '/',
            },
        },
    };
}

export default function LocaleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
