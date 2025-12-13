import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SalonCard } from '@/components/salon/SalonCard';
import { getTranslation } from '@/lib/translations';
import styles from '@/app/kategoria/[slug]/page.module.css';

interface Props {
    params: { slug: string };
}

// Category data with translations
const categoriesData: Record<string, { name_hu: string; name_sk: string; description: string; icon: string }> = {
    'damske-kadernictvo': {
        name_hu: 'Női fodrászat',
        name_sk: 'Dámske kaderníctvo',
        description: 'Találja meg a legjobb női fodrászatokat. Vágás, festés, formázás és egyebek.',
        icon: '💇‍♀️',
    },
    'panske-kadernictvo': {
        name_hu: 'Férfi fodrászat',
        name_sk: 'Pánske kaderníctvo',
        description: 'Professzionális borbély- és férfi fodrászati szolgáltatások.',
        icon: '💇‍♂️',
    },
    'kozmetika': {
        name_hu: 'Kozmetika',
        name_sk: 'Kozmetika',
        description: 'Szépségszalonok és bőrápolási kezelések.',
        icon: '✨',
    },
    'manikura': {
        name_hu: 'Manikűr',
        name_sk: 'Manikúra',
        description: 'Zselés körmök, manikűr, körömdizájn és nail art.',
        icon: '💅',
    },
    'pedikura': {
        name_hu: 'Pedikűr',
        name_sk: 'Pedikúra',
        description: 'Professzionális pedikűr és lábápolás.',
        icon: '🦶',
    },
    'masaze': {
        name_hu: 'Masszázs',
        name_sk: 'Masáže',
        description: 'Relaxációs és terápiás masszázsok.',
        icon: '💆',
    },
    'make-up': {
        name_hu: 'Smink',
        name_sk: 'Make-up',
        description: 'Professzionális smink esküvőre, partikra és különleges alkalmakra.',
        icon: '💄',
    },
    'wellness': {
        name_hu: 'Wellness & Spa',
        name_sk: 'Wellness',
        description: 'Wellness központok, szaunák és relaxációs kezelések.',
        icon: '🧖',
    },
};

// Mock salons
const mockSalons = [
    {
        id: '1',
        slug: 'beauty-salon-bratislava',
        name: 'Beauty Salon Bratislava',
        description: 'Professzionális szépségszalon Pozsony központjában.',
        address: 'Obchodná 25',
        district: 'Bratislava',
        categories: ['Fodrászat', 'Kozmetika'],
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
        description: 'Modern fodrászat a legújabb trendekkel.',
        address: 'Hlavná 45',
        district: 'Košice',
        categories: ['Női fodrászat', 'Festés'],
        rating: 4.6,
        reviewCount: 84,
        isPremium: true,
        isVerified: true,
    },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const category = categoriesData[params.slug];

    if (!category) {
        return { title: 'Kategória nem található' };
    }

    return {
        title: `${category.name_hu} | Salon Finder SK`,
        description: category.description,
    };
}

export default function CategoryPageHU({ params }: Props) {
    const category = categoriesData[params.slug];
    const t = getTranslation('hu');

    if (!category) {
        notFound();
    }

    return (
        <>
            <Header locale="hu" />
            <main className={styles.main}>
                {/* Category Hero */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <span className={styles.heroIcon}>{category.icon}</span>
                        <h1 className={styles.heroTitle}>{category.name_hu}</h1>
                        <p className={styles.heroDescription}>{category.description}</p>
                    </div>
                </section>

                <div className={styles.container}>
                    <div className={styles.header}>
                        <p className={styles.resultCount}>
                            Találat: <strong>{mockSalons.length}</strong> szalon a <strong>{category.name_hu}</strong> kategóriában
                        </p>
                    </div>

                    <div className={styles.grid}>
                        {mockSalons.map((salon) => (
                            <SalonCard key={salon.id} salon={salon} />
                        ))}
                    </div>
                </div>
            </main>
            <Footer locale="hu" translations={t} />
        </>
    );
}
