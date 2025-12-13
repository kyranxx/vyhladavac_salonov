'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SalonCard } from '@/components/salon/SalonCard';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { getTranslation } from '@/lib/translations';
import styles from '@/app/kategoria/[slug]/page.module.css';

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
    name_en: string;
    description_en: string;
    icon: string;
}

export default function CategoryPageEN({ params }: Props) {
    const [category, setCategory] = useState<Category | null>(null);
    const [salons, setSalons] = useState<Salon[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFoundState, setNotFoundState] = useState(false);
    const t = getTranslation('en');

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
                <Header locale="en" />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <div className={styles.loading}>Loading...</div>
                    </div>
                </main>
                <Footer locale="en" translations={t} />
            </>
        );
    }

    if (notFoundState || !category) {
        notFound();
    }

    return (
        <>
            <Header locale="en" />
            <main className={styles.main}>
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <span className={styles.heroIcon}>{category.icon || '✨'}</span>
                        <h1 className={styles.heroTitle}>{category.name_en || category.slug}</h1>
                        <p className={styles.heroDescription}>{category.description_en}</p>
                    </div>
                </section>

                <div className={styles.container}>
                    <div className={styles.header}>
                        <p className={styles.resultCount}>
                            Found <strong>{salons.length}</strong> salons in <strong>{category.name_en}</strong>
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
                            <h3>No salons</h3>
                            <p>There are no salons in this category yet.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer locale="en" translations={t} />
        </>
    );
}
