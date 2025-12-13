'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SalonCard } from '@/components/salon/SalonCard';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import styles from './page.module.css';

interface Props {
    params: { slug: string };
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

export default function CategoryPage({ params }: Props) {
    const [category, setCategory] = useState<Category | null>(null);
    const [salons, setSalons] = useState<Salon[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFoundState, setNotFoundState] = useState(false);

    useEffect(() => {
        loadData();
    }, [params.slug]);

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

            // Load salons in this category (via salon_categories junction table)
            const { data: salonCats } = await supabase
                .from('salon_categories')
                .select('salon_id')
                .eq('category_id', categoryData.id);

            if (salonCats && salonCats.length > 0) {
                const salonIds = salonCats.map(sc => sc.salon_id);

                const { data: salonsData } = await supabase
                    .from('salons')
                    .select('*')
                    .in('id', salonIds)
                    .eq('status', 'approved')
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

    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Category Hero */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <span className={styles.heroIcon}>{category.icon || '✨'}</span>
                        <h1 className={styles.heroTitle}>{category.name_sk}</h1>
                        <p className={styles.heroDescription}>{category.description_sk}</p>
                    </div>
                </section>

                <div className={styles.container}>
                    <div className={styles.header}>
                        <p className={styles.resultCount}>
                            Nájdených <strong>{salons.length}</strong> salónov v kategórii <strong>{category.name_sk}</strong>
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
                            <p>V tejto kategórii zatiaľ nie sú žiadne salóny.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
