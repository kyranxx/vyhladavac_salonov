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
const categoriesData: Record<string, { name_en: string; name_sk: string; description: string; icon: string }> = {
    'damske-kadernictvo': {
        name_en: "Women's Hairdressing",
        name_sk: 'Dámske kaderníctvo',
        description: 'Find the best hairdressing salons for women. Cutting, coloring, styling and more.',
        icon: '💇‍♀️',
    },
    'panske-kadernictvo': {
        name_en: "Men's Hairdressing",
        name_sk: 'Pánske kaderníctvo',
        description: 'Professional barbershops and men\'s haircut services.',
        icon: '💇‍♂️',
    },
    'kozmetika': {
        name_en: 'Cosmetics',
        name_sk: 'Kozmetika',
        description: 'Beauty salons and skin care treatments.',
        icon: '✨',
    },
    'manikura': {
        name_en: 'Manicure',
        name_sk: 'Manikúra',
        description: 'Gel nails, manicure, nail design and nail art.',
        icon: '💅',
    },
    'pedikura': {
        name_en: 'Pedicure',
        name_sk: 'Pedikúra',
        description: 'Professional pedicure and foot care services.',
        icon: '🦶',
    },
    'masaze': {
        name_en: 'Massage',
        name_sk: 'Masáže',
        description: 'Relaxation and therapeutic massages.',
        icon: '💆',
    },
    'make-up': {
        name_en: 'Make-up',
        name_sk: 'Make-up',
        description: 'Professional makeup for weddings, parties and special occasions.',
        icon: '💄',
    },
    'wellness': {
        name_en: 'Wellness & Spa',
        name_sk: 'Wellness',
        description: 'Wellness centers, saunas and relaxation treatments.',
        icon: '🧖',
    },
};

// Mock salons
const mockSalons = [
    {
        id: '1',
        slug: 'beauty-salon-bratislava',
        name: 'Beauty Salon Bratislava',
        description: 'Professional beauty salon in the center of Bratislava.',
        address: 'Obchodná 25',
        district: 'Bratislava',
        categories: ['Hairdressing', 'Cosmetics'],
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
        description: 'Modern hairdressing with the latest trends.',
        address: 'Hlavná 45',
        district: 'Košice',
        categories: ["Women's Hairdressing", 'Coloring'],
        rating: 4.6,
        reviewCount: 84,
        isPremium: true,
        isVerified: true,
    },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const category = categoriesData[params.slug];

    if (!category) {
        return { title: 'Category not found' };
    }

    return {
        title: `${category.name_en} | Salon Finder SK`,
        description: category.description,
    };
}

export default function CategoryPageEN({ params }: Props) {
    const category = categoriesData[params.slug];
    const t = getTranslation('en');

    if (!category) {
        notFound();
    }

    return (
        <>
            <Header locale="en" />
            <main className={styles.main}>
                {/* Category Hero */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <span className={styles.heroIcon}>{category.icon}</span>
                        <h1 className={styles.heroTitle}>{category.name_en}</h1>
                        <p className={styles.heroDescription}>{category.description}</p>
                    </div>
                </section>

                <div className={styles.container}>
                    <div className={styles.header}>
                        <p className={styles.resultCount}>
                            Found <strong>{mockSalons.length}</strong> salons in <strong>{category.name_en}</strong>
                        </p>
                    </div>

                    <div className={styles.grid}>
                        {mockSalons.map((salon) => (
                            <SalonCard key={salon.id} salon={salon} />
                        ))}
                    </div>
                </div>
            </main>
            <Footer locale="en" translations={t} />
        </>
    );
}
