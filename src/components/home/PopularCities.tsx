'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import styles from './PopularCities.module.css';

interface City {
    slug: string;
    name: string;
    count: number;
    region: string;
    image: string;
}

const defaultCities = [
    { slug: 'bratislava', name: 'Bratislava', region: 'Bratislavský kraj', image: 'https://images.unsplash.com/photo-1565711561500-49678a10a63f?w=400&h=300&fit=crop' },
    { slug: 'kosice', name: 'Košice', region: 'Košický kraj', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop' },
    { slug: 'zilina', name: 'Žilina', region: 'Žilinský kraj', image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=400&h=300&fit=crop' },
    { slug: 'nitra', name: 'Nitra', region: 'Nitriansky kraj', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop' },
    { slug: 'presov', name: 'Prešov', region: 'Prešovský kraj', image: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=400&h=300&fit=crop' },
    { slug: 'banska-bystrica', name: 'Banská Bystrica', region: 'Banskobystrický kraj', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop' },
    { slug: 'trnava', name: 'Trnava', region: 'Trnavský kraj', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop' },
    { slug: 'trencin', name: 'Trenčín', region: 'Trenčiansky kraj', image: 'https://images.unsplash.com/photo-1558618047-f4b511985e72?w=400&h=300&fit=crop' },
];

const textsByLocale: Record<string, { title: string; subtitle: string; viewAll: string; salons: string }> = {
    sk: { title: 'Populárne mestá', subtitle: 'Nájdite salóny v najväčších slovenských mestách', viewAll: 'Zobraziť všetky mestá', salons: 'salónov' },
    en: { title: 'Popular Cities', subtitle: 'Find salons in the largest Slovak cities', viewAll: 'View all cities', salons: 'salons' },
    hu: { title: 'Népszerű városok', subtitle: 'Találj szalonokat a legnagyobb szlovák városokban', viewAll: 'Összes város', salons: 'szalon' },
};

interface PopularCitiesProps {
    locale?: string;
}

export function PopularCities({ locale = 'sk' }: PopularCitiesProps) {
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);

    const texts = textsByLocale[locale] || textsByLocale.sk;
    const basePath = locale === 'sk' ? '' : `/${locale}`;

    useEffect(() => {
        loadCities();
    }, []);

    const loadCities = async () => {
        const supabase = createBrowserSupabaseClient();

        // Start with default cities, 0 count
        const citiesWithCount: City[] = defaultCities.map(c => ({ ...c, count: 0 }));

        if (supabase) {
            try {
                // Get salon counts per city
                const { data: salons } = await supabase
                    .from('salons')
                    .select('city')
                    .eq('status', 'approved');

                if (salons) {
                    const countMap = new Map<string, number>();
                    salons.forEach((s: { city: string }) => {
                        if (s.city) {
                            countMap.set(s.city, (countMap.get(s.city) || 0) + 1);
                        }
                    });

                    // Update counts for default cities
                    citiesWithCount.forEach(city => {
                        city.count = countMap.get(city.name) || 0;
                    });
                }
            } catch (error) {
                console.error('Error loading cities:', error);
            }
        }

        setCities(citiesWithCount);
        setLoading(false);
    };

    if (loading) {
        return (
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>{texts.title}</h2>
                        <p className={styles.subtitle}>{texts.subtitle}</p>
                    </div>
                    <div className={styles.grid}>
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className={styles.cardSkeleton}></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{texts.title}</h2>
                    <p className={styles.subtitle}>{texts.subtitle}</p>
                </div>

                <div className={styles.grid}>
                    {cities.map((city, index) => (
                        <Link
                            key={city.slug}
                            href={`${basePath}/salony/${city.slug}`}
                            className={`${styles.card} ${index === 0 ? styles.featured : ''}`}
                        >
                            <div className={styles.cardImage}>
                                <img src={city.image} alt={city.name} loading="lazy" />
                            </div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cityName}>{city.name}</h3>
                                <p className={styles.region}>{city.region}</p>
                                <span className={styles.count}>
                                    {city.count > 0 ? `${city.count} ${texts.salons}` : texts.salons}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className={styles.footer}>
                    <Link href={`${basePath}/salony`} className={styles.viewAllButton}>
                        {texts.viewAll}
                        <span className={styles.arrowIcon}>→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
