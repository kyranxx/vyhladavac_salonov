import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SalonCard } from '@/components/salon/SalonCard';
import styles from './page.module.css';

interface Props {
    params: { city: string };
}

// Mock cities data
const citiesData: Record<string, { name: string; region: string }> = {
    'bratislava': { name: 'Bratislava', region: 'Bratislavský kraj' },
    'kosice': { name: 'Košice', region: 'Košický kraj' },
    'zilina': { name: 'Žilina', region: 'Žilinský kraj' },
    'nitra': { name: 'Nitra', region: 'Nitriansky kraj' },
    'presov': { name: 'Prešov', region: 'Prešovský kraj' },
    'banska-bystrica': { name: 'Banská Bystrica', region: 'Banskobystrický kraj' },
    'trnava': { name: 'Trnava', region: 'Trnavský kraj' },
    'trencin': { name: 'Trenčín', region: 'Trenčiansky kraj' },
};

// Mock salons
const mockSalons = [
    {
        id: '1',
        slug: 'beauty-salon-bratislava',
        name: 'Beauty Salon Bratislava',
        description: 'Profesionálny salón krásy v centre mesta.',
        address: 'Obchodná 25',
        district: 'Staré Mesto',
        categories: ['Kaderníctvo', 'Kozmetika', 'Manikúra'],
        rating: 4.8,
        reviewCount: 127,
        isPremium: true,
        isVerified: true,
        isFeatured: true,
    },
    {
        id: '2',
        slug: 'nail-studio-city',
        name: 'Nail Studio',
        description: 'Špecializujeme sa na gélové nechty a manikúru.',
        address: 'Hlavná 89',
        district: 'Centrum',
        categories: ['Manikúra', 'Pedikúra'],
        rating: 4.6,
        reviewCount: 84,
        isPremium: true,
        isVerified: true,
    },
    {
        id: '3',
        slug: 'wellness-spa-city',
        name: 'Wellness & Spa',
        description: 'Relaxačné centrum s masážami a wellness procedúrami.',
        address: 'Mariánske námestie 5',
        district: 'Centrum',
        categories: ['Masáže', 'Wellness'],
        rating: 4.9,
        reviewCount: 203,
        isVerified: true,
    },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const city = citiesData[params.city];

    if (!city) {
        return { title: 'Mesto nenájdené' };
    }

    return {
        title: `Salóny v meste ${city.name} | Salon Finder SK`,
        description: `Nájdite najlepšie salóny krásy v meste ${city.name}. Kaderníctva, kozmetika, manikúra a ďalšie služby.`,
    };
}

export default function CityPage({ params }: Props) {
    const city = citiesData[params.city];

    if (!city) {
        notFound();
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* City Hero */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <span className={styles.heroIcon}>📍</span>
                        <h1 className={styles.heroTitle}>Salóny v meste {city.name}</h1>
                        <p className={styles.heroDescription}>
                            {city.region} • Nájdite najlepšie salóny krásy vo vašom okolí
                        </p>
                    </div>
                </section>

                <div className={styles.container}>
                    <div className={styles.header}>
                        <p className={styles.resultCount}>
                            Nájdených <strong>{mockSalons.length}</strong> salónov v meste <strong>{city.name}</strong>
                        </p>
                    </div>

                    <div className={styles.grid}>
                        {mockSalons.map((salon) => (
                            <SalonCard key={salon.id} salon={salon} />
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
