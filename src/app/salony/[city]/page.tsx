'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SalonCard } from '@/components/salon/SalonCard';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import styles from './page.module.css';

interface Props {
    params: { city: string };
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

// City slug to name mapping
const cityNames: Record<string, string> = {
    'bratislava': 'Bratislava',
    'kosice': 'Košice',
    'presov': 'Prešov',
    'zilina': 'Žilina',
    'nitra': 'Nitra',
    'banska-bystrica': 'Banská Bystrica',
    'trnava': 'Trnava',
    'trencin': 'Trenčín',
    'martin': 'Martin',
    'poprad': 'Poprad',
    'prievidza': 'Prievidza',
    'zvolen': 'Zvolen',
    'povazska-bystrica': 'Považská Bystrica',
    'michalovce': 'Michalovce',
    'nove-zamky': 'Nové Zámky',
    'spisska-nova-ves': 'Spišská Nová Ves',
    'komarno': 'Komárno',
    'levice': 'Levice',
    'humenne': 'Humenné',
    'bardejov': 'Bardejov',
    'liptovsky-mikulas': 'Liptovský Mikuláš',
    'ruzomberok': 'Ružomberok',
    'piestany': 'Piešťany',
    'lucenec': 'Lučenec',
    'dunajska-streda': 'Dunajská Streda',
    'cadca': 'Čadca',
    'pezinok': 'Pezinok',
    'malacky': 'Malacky',
    'senec': 'Senec',
};

export default function CitySalonsPage({ params }: Props) {
    const [salons, setSalons] = useState<Salon[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFoundState, setNotFoundState] = useState(false);

    const citySlug = params.city;
    const cityName = cityNames[citySlug];

    useEffect(() => {
        if (!cityName) {
            setNotFoundState(true);
            setLoading(false);
            return;
        }
        loadSalons();
    }, [citySlug, cityName]);

    const loadSalons = async () => {
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
                .eq('city', cityName)
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
                        <div className={styles.loading}>Načítavam salóny...</div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (notFoundState || !cityName) {
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
                        <h1 className={styles.heroTitle}>Salóny v meste {cityName}</h1>
                        <p className={styles.heroDescription}>
                            Nájdite najlepšie salóny krásy v meste {cityName}
                        </p>
                    </div>
                </section>

                <div className={styles.container}>
                    <div className={styles.header}>
                        <p className={styles.resultCount}>
                            Nájdených <strong>{salons.length}</strong> salónov v meste <strong>{cityName}</strong>
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
                            <p>V tomto meste zatiaľ nie sú žiadne salóny.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
