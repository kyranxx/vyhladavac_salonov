import { getTranslation } from '@/lib/translations';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { PopularCities } from '@/components/home/PopularCities';
import { ForOwners } from '@/components/home/ForOwners';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
    return [
        { locale: 'en' },
        { locale: 'hu' },
    ];
}

export default async function LocalizedHomePage({ params }: PageProps) {
    const { locale } = await params;
    const t = getTranslation(locale);

    return (
        <>
            <Header locale={locale} />
            <main>
                <HeroSection locale={locale} translations={t} />
                <PopularCities locale={locale} />
                <ForOwners locale={locale} />
            </main>
            <Footer locale={locale} translations={t} />
        </>
    );
}
