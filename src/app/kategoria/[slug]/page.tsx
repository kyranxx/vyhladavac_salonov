import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SalonCard } from '@/components/salon/SalonCard';
import styles from './page.module.css';

interface Props {
    params: { slug: string };
}

// Mock categories data
const categoriesData: Record<string, { name: string; description: string; icon: string }> = {
    'damske-kadernictvo': {
        name: 'Dámske kaderníctvo',
        description: 'Nájdite najlepšie dámske kaderníctva na Slovensku. Strihanie, farbenie, styling a ďalšie služby.',
        icon: '💇‍♀️',
    },
    'panske-kadernictvo': {
        name: 'Pánske kaderníctvo',
        description: 'Profesionálne pánske kaderníctva a barbershopy vo vašom meste.',
        icon: '💇‍♂️',
    },
    'kozmetika': {
        name: 'Kozmetika',
        description: 'Kozmetické salóny a ošetrenia pleti. Starostlivosť o vašu krásu.',
        icon: '✨',
    },
    'manikura': {
        name: 'Manikúra',
        description: 'Gélové nechty, manikúra, nechtový dizajn a nail art.',
        icon: '💅',
    },
    'pedikura': {
        name: 'Pedikúra',
        description: 'Profesionálna pedikúra a starostlivosť o nohy.',
        icon: '🦶',
    },
    'masaze': {
        name: 'Masáže',
        description: 'Relaxačné a liečebné masáže. Oddych pre telo i dušu.',
        icon: '💆',
    },
    'make-up': {
        name: 'Make-up',
        description: 'Profesionálne líčenie na svadby, večierky a špeciálne príležitosti.',
        icon: '💄',
    },
    'wellness': {
        name: 'Wellness',
        description: 'Wellness centrá, sauny a relaxačné procedúry.',
        icon: '🧖',
    },
};

// Mock salons
const mockSalons = [
    {
        id: '1',
        slug: 'beauty-salon-bratislava',
        name: 'Beauty Salon Bratislava',
        description: 'Profesionálny salón krásy v centre Bratislavy.',
        address: 'Obchodná 25',
        district: 'Bratislava',
        categories: ['Kaderníctvo', 'Kozmetika'],
        rating: 4.8,
        reviewCount: 127,
        isPremium: true,
        isVerified: true,
        isFeatured: true,
    },
    {
        id: '2',
        slug: 'hair-studio-kosice',
        name: 'Hair Studio Košice',
        description: 'Moderné kaderníctvo s najnovšími trendami.',
        address: 'Hlavná 45',
        district: 'Košice',
        categories: ['Dámske kaderníctvo', 'Farbenie'],
        rating: 4.6,
        reviewCount: 84,
        isPremium: true,
        isVerified: true,
    },
    {
        id: '3',
        slug: 'style-hair-zilina',
        name: 'Style Hair Žilina',
        description: 'Kvalitné kaderníctvo pre celú rodinu.',
        address: 'Národná 12',
        district: 'Žilina',
        categories: ['Dámske kaderníctvo', 'Pánske kaderníctvo'],
        rating: 4.5,
        reviewCount: 56,
        isVerified: true,
    },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const category = categoriesData[params.slug];

    if (!category) {
        return { title: 'Kategória nenájdená' };
    }

    return {
        title: `${category.name} | Salon Finder SK`,
        description: category.description,
    };
}

export default function CategoryPage({ params }: Props) {
    const category = categoriesData[params.slug];

    if (!category) {
        notFound();
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Category Hero */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <span className={styles.heroIcon}>{category.icon}</span>
                        <h1 className={styles.heroTitle}>{category.name}</h1>
                        <p className={styles.heroDescription}>{category.description}</p>
                    </div>
                </section>

                <div className={styles.container}>
                    <div className={styles.header}>
                        <p className={styles.resultCount}>
                            Nájdených <strong>{mockSalons.length}</strong> salónov v kategórii <strong>{category.name}</strong>
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
