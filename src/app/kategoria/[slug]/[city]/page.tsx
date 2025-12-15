'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SalonCard } from '@/components/salon/SalonCard';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import styles from '../page.module.css';

interface Props {
    params: { slug: string; city: string };
}

interface Salon {
    id: string;
    slug: string;
    name: string;
    description_sk: string;
    address: string;
    city: string;
    tier: string;
    is_verified?: boolean;
}

interface Category {
    id: string;
    slug: string;
    name_sk: string;
    description_sk: string;
    icon: string;
}

// City name mapping for SEO-friendly URLs
const cityNames: Record<string, string> = {
    'bratislava': 'Bratislava',
    'kosice': 'Košice',
    'presov': 'Prešov',
    'zilina': 'Žilina',
    'banska-bystrica': 'Banská Bystrica',
    'nitra': 'Nitra',
    'trnava': 'Trnava',
    'trencin': 'Trenčín',
    'martin': 'Martin',
    'poprad': 'Poprad',
    'prievidza': 'Prievidza',
    'zvolen': 'Zvolen',
};

export default function CategoryCityPage({ params }: Props) {
    const [category, setCategory] = useState<Category | null>(null);
    const [salons, setSalons] = useState<Salon[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFoundState, setNotFoundState] = useState(false);

    const cityDisplayName = cityNames[params.city] || params.city.charAt(0).toUpperCase() + params.city.slice(1).replace(/-/g, ' ');

    useEffect(() => {
        loadData();
    }, [params.slug, params.city]);

    const loadData = async () => {
        const supabase = createBrowserSupabaseClient();
        if (!supabase) {
            setLoading(false);
            return;
        }

        try {
            // Load category
            const { data: categoryData, error: categoryError } = await supabase
                .from('categories')
                .select('*')
                .eq('slug', params.slug)
                .single();

            if (categoryError || !categoryData) {
                setNotFoundState(true);
                setLoading(false);
                return;
            }

            setCategory(categoryData);

            // Load salons in this category AND city
            const { data: salonCats } = await supabase
                .from('salon_categories')
                .select('salon_id')
                .eq('category_id', categoryData.id);

            if (salonCats && salonCats.length > 0) {
                const salonIds = salonCats.map(sc => sc.salon_id);

                // Filter by city (case-insensitive match)
                const { data: salonsData } = await supabase
                    .from('salons')
                    .select('*')
                    .in('id', salonIds)
                    .eq('status', 'approved')
                    .ilike('city', `%${cityDisplayName}%`)
                    .order('tier', { ascending: false });

                setSalons(salonsData || []);
            }

        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const transformSalon = (salon: Salon) => ({
        id: salon.id,
        slug: salon.slug,
        name: salon.name,
        description: salon.description_sk,
        address: salon.address,
        district: salon.city,
        categories: [],
        rating: 0,
        reviewCount: 0,
        isPremium: salon.tier === 'premium',
        isVerified: salon.is_verified || false,
    });

    if (loading) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <div className={styles.loading}>Načítavam...</div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (notFoundState || !category) {
        notFound();
    }

    // SEO-optimized title
    const pageTitle = `${category.name_sk} v meste ${cityDisplayName}`;
    const pageDescription = `Nájdite najlepšie ${category.name_sk.toLowerCase()} v meste ${cityDisplayName}. Porovnajte salóny, ceny a recenzie.`;

    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* SEO Hero with Location */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <span className={styles.heroIcon}>{category.icon || '✨'}</span>
                        <h1 className={styles.heroTitle}>{pageTitle}</h1>
                        <p className={styles.heroDescription}>{pageDescription}</p>
                    </div>
                </section>

                <div className={styles.container}>
                    {/* Breadcrumbs for SEO */}
                    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                        <a href="/">Domov</a>
                        <span> › </span>
                        <a href={`/kategoria/${category.slug}`}>{category.name_sk}</a>
                        <span> › </span>
                        <span>{cityDisplayName}</span>
                    </nav>

                    <div className={styles.header}>
                        <p className={styles.resultCount}>
                            Nájdených <strong>{salons.length}</strong> salónov kategórie{' '}
                            <strong>{category.name_sk}</strong> v meste <strong>{cityDisplayName}</strong>
                        </p>
                    </div>

                    {salons.length > 0 ? (
                        <div className={styles.grid}>
                            {salons.map((salon) => (
                                <SalonCard key={salon.id} salon={transformSalon(salon)} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyIcon}>🔍</span>
                            <h3>Žiadne salóny</h3>
                            <p>
                                V kategórii {category.name_sk} v meste {cityDisplayName} zatiaľ nie sú žiadne salóny.
                            </p>
                            <p style={{ marginTop: '1rem' }}>
                                <a href={`/kategoria/${category.slug}`} className={styles.linkButton}>
                                    Zobraziť všetky salóny v tejto kategórii
                                </a>
                            </p>
                        </div>
                    )}

                    {/* SEO Content Section */}
                    <section className={styles.seoContent}>
                        <h2>O kategórii {category.name_sk} v meste {cityDisplayName}</h2>
                        <p>
                            Hľadáte kvalitné služby {category.name_sk.toLowerCase()} v meste {cityDisplayName}?
                            Náš katalóg vám pomôže nájsť najlepšie salóny vo vašom okolí.
                            Porovnajte hodnotenia, ceny a dostupnosť termínov.
                        </p>
                        <p>
                            {cityDisplayName} ponúka široký výber salónov v kategórii {category.name_sk}.
                            Vyberte si z overených poskytovateľov služieb a rezervujte si termín ešte dnes.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
