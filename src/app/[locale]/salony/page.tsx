'use client';

import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SalonCard } from '@/components/salon/SalonCard';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { getTranslation } from '@/lib/translations';
import styles from '@/app/salony/page.module.css';

interface Props {
    params: { locale: string };
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
    is_featured?: boolean;
}

function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/-/g, ' ');
}

export default function LocalizedSalonsPage({ params }: Props) {
    const [salons, setSalons] = useState<Salon[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const t = getTranslation(params.locale as 'en' | 'hu' | 'sk');
    const locale = params.locale;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const supabase = createBrowserSupabaseClient();
        if (!supabase) {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('salons')
                .select('*')
                .eq('status', 'approved')
                .order('tier', { ascending: false })
                .order('name');

            if (error) throw error;
            setSalons(data || []);
        } catch (error) {
            console.error('Error loading salons:', error);
        } finally {
            setLoading(false);
        }
    };

    const cities = useMemo(() => {
        const citySet = new Set(salons.map(s => s.city).filter(Boolean));
        return Array.from(citySet).sort();
    }, [salons]);

    const filteredSalons = useMemo(() => {
        return salons.filter((salon) => {
            if (searchQuery) {
                const query = normalizeText(searchQuery);
                const name = normalizeText(salon.name || '');
                const city = normalizeText(salon.city || '');
                if (!name.includes(query) && !city.includes(query)) {
                    return false;
                }
            }
            if (selectedCity && salon.city !== selectedCity) {
                return false;
            }
            return true;
        });
    }, [salons, searchQuery, selectedCity]);

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
        isFeatured: salon.is_featured || false,
    });

    const texts = {
        en: {
            title: 'All Salons',
            subtitle: 'Find the best beauty salons in Slovakia',
            search: 'Search salon...',
            allCities: 'All cities',
            found: 'Found',
            salons: 'salons',
            noSalons: 'No salons',
            noResults: 'Try changing your search criteria.',
            noData: 'No salons registered yet.',
            loading: 'Loading salons...',
        },
        hu: {
            title: 'Összes szalon',
            subtitle: 'Találja meg a legjobb szépségszalonokat Szlovákiában',
            search: 'Szalon keresése...',
            allCities: 'Összes város',
            found: 'Találat',
            salons: 'szalon',
            noSalons: 'Nincs szalon',
            noResults: 'Próbálja meg módosítani a keresési feltételeket.',
            noData: 'Még nincs regisztrált szalon.',
            loading: 'Szalonok betöltése...',
        },
    };

    const text = texts[locale as keyof typeof texts] || texts.en;

    if (loading) {
        return (
            <>
                <Header locale={locale} />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <div className={styles.loading}>{text.loading}</div>
                    </div>
                </main>
                <Footer locale={locale} translations={t} />
            </>
        );
    }

    return (
        <>
            <Header locale={locale} />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>{text.title}</h1>
                        <p className={styles.subtitle}>{text.subtitle}</p>
                    </div>

                    <div className={styles.filters}>
                        <div className={styles.searchBox}>
                            <input
                                type="text"
                                placeholder={text.search}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">{text.allCities}</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.results}>
                        <p className={styles.resultCount}>
                            {text.found} <strong>{filteredSalons.length}</strong> {text.salons}
                        </p>
                    </div>

                    {filteredSalons.length > 0 ? (
                        <div className={styles.grid}>
                            {filteredSalons.map((salon) => (
                                <SalonCard key={salon.id} salon={transformSalon(salon)} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyIcon}>🔍</span>
                            <h3>{text.noSalons}</h3>
                            <p>{searchQuery || selectedCity ? text.noResults : text.noData}</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer locale={locale} translations={t} />
        </>
    );
}
