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
}

const defaultCities = [
    { slug: 'bratislava', name: 'Bratislava', region: 'Bratislavský kraj' },
    { slug: 'kosice', name: 'Košice', region: 'Košický kraj' },
    { slug: 'zilina', name: 'Žilina', region: 'Žilinský kraj' },
    { slug: 'nitra', name: 'Nitra', region: 'Nitriansky kraj' },
    { slug: 'presov', name: 'Prešov', region: 'Prešovský kraj' },
    { slug: 'banska-bystrica', name: 'Banská Bystrica', region: 'Banskobystrický kraj' },
    { slug: 'trnava', name: 'Trnava', region: 'Trnavský kraj' },
    { slug: 'trencin', name: 'Trenčín', region: 'Trenčiansky kraj' },
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
                            <div className={styles.cardContent}>
                                <span className={styles.pin}>📍</span>
                                <h3 className={styles.cityName}>{city.name}</h3>
                                <p className={styles.region}>{city.region}</p>
                                <span className={styles.count}>
                                    {city.count > 0 ? `${city.count} ${texts.salons}` : texts.salons}
                                </span>
                            </div>
                            <span className={styles.arrow}>→</span>
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
