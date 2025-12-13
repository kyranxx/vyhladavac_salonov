'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SalonCard } from '@/components/salon/SalonCard';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import styles from './page.module.css';

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

function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/-/g, ' ');
}

function SearchContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [salons, setSalons] = useState<Salon[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(initialQuery);

    useEffect(() => {
        loadSalons();
    }, []);

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

    const filteredSalons = useMemo(() => {
        if (!searchQuery.trim()) return salons;

        const query = normalizeText(searchQuery);
        return salons.filter((salon) => {
            const name = normalizeText(salon.name || '');
            const description = normalizeText(salon.description_sk || '');
            const city = normalizeText(salon.city || '');
            const address = normalizeText(salon.address || '');

            return name.includes(query) ||
                description.includes(query) ||
                city.includes(query) ||
                address.includes(query);
        });
    }, [salons, searchQuery]);

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

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Vyhľadávanie</h1>
                <p className={styles.subtitle}>
                    Nájdite salón podľa názvu, lokality alebo služby
                </p>
            </div>

            <div className={styles.searchBox}>
                <input
                    type="text"
                    placeholder="Hľadať salón, mesto, službu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                    autoFocus
                />
            </div>

            {loading ? (
                <div className={styles.loading}>Načítavam...</div>
            ) : (
                <>
                    <div className={styles.results}>
                        <p className={styles.resultCount}>
                            {searchQuery ? (
                                <>
                                    Výsledky pre "<strong>{searchQuery}</strong>": {filteredSalons.length} salónov
                                </>
                            ) : (
                                <>Všetky salóny: {filteredSalons.length}</>
                            )}
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
                            <h3>Žiadne výsledky</h3>
                            <p>
                                {searchQuery
                                    ? 'Skúste iné hľadané slovo alebo kategóriu.'
                                    : 'Zatiaľ neboli zaregistrované žiadne salóny.'}
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <Suspense fallback={<div className={styles.loading}>Načítavam...</div>}>
                    <SearchContent />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}
