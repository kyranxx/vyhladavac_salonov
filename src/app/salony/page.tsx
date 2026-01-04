'use client';

import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SalonCard } from '@/components/salon/SalonCard';
import { Select } from '@/components/ui/Select';
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
    status: string;
    rating?: number;
    review_count?: number;
    is_verified?: boolean;
    is_featured?: boolean;
}

interface Category {
    id: string;
    slug: string;
    name_sk: string;
}

// Normalize Slovak diacritics for comparison
function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/-/g, ' ');
}

export default function SalonsPage() {
    const [salons, setSalons] = useState<Salon[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const supabase = createBrowserSupabaseClient();

    // Load data from database
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        if (!supabase) {
            setLoading(false);
            return;
        }

        try {
            // Load salons (only approved ones)
            const { data: salonsData, error: salonsError } = await supabase
                .from('salons')
                .select('*')
                .eq('status', 'approved')
                .order('tier', { ascending: false }) // Premium first
                .order('name');

            if (salonsError) throw salonsError;
            setSalons(salonsData || []);

            // Load categories
            const { data: categoriesData, error: categoriesError } = await supabase
                .from('categories')
                .select('id, slug, name_sk')
                .order('name_sk');

            if (categoriesError) throw categoriesError;
            setCategories(categoriesData || []);

        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get unique cities from salons
    const cities = useMemo(() => {
        const citySet = new Set(salons.map(s => s.city).filter(Boolean));
        return Array.from(citySet).sort();
    }, [salons]);

    // Filter salons
    const filteredSalons = useMemo(() => {
        return salons.filter((salon) => {
            // Search filter
            if (searchQuery) {
                const query = normalizeText(searchQuery);
                const name = normalizeText(salon.name || '');
                const description = normalizeText(salon.description_sk || '');
                const city = normalizeText(salon.city || '');
                if (!name.includes(query) && !description.includes(query) && !city.includes(query)) {
                    return false;
                }
            }

            // City filter
            if (selectedCity && salon.city !== selectedCity) {
                return false;
            }

            return true;
        });
    }, [salons, searchQuery, selectedCity]);

    // Transform salon for SalonCard
    const transformSalon = (salon: Salon) => ({
        id: salon.id,
        slug: salon.slug,
        name: salon.name,
        description: salon.description_sk,
        address: salon.address,
        district: salon.city,
        categories: [], // Would need to join with salon_categories
        rating: salon.rating || 0,
        reviewCount: salon.review_count || 0,
        isPremium: salon.tier === 'premium',
        isVerified: salon.is_verified || false,
        isFeatured: salon.is_featured || false,
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

    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    {/* Page Header */}
                    <div className={styles.header}>
                        <h1 className={styles.title}>Všetky salóny</h1>
                        <p className={styles.subtitle}>
                            Nájdite najlepšie salóny krásy na Slovensku
                        </p>
                    </div>

                    {/* Filters */}
                    <div className={styles.filters}>
                        <div className={styles.searchBox}>
                            <input
                                type="text"
                                placeholder="Hľadať salón..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        <Select
                            options={[
                                { value: '', label: 'Všetky mestá' },
                                ...cities.map(city => ({ value: city, label: city }))
                            ]}
                            value={selectedCity}
                            onChange={setSelectedCity}
                            placeholder="Všetky mestá"
                            searchable
                            className={styles.selectWrapper}
                        />

                        <Select
                            options={[
                                { value: '', label: 'Všetky kategórie' },
                                ...categories.map(cat => ({ value: cat.slug, label: cat.name_sk }))
                            ]}
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            placeholder="Všetky kategórie"
                            searchable
                            className={styles.selectWrapper}
                        />
                    </div>

                    {/* Results */}
                    <div className={styles.results}>
                        <p className={styles.resultCount}>
                            Nájdených <strong>{filteredSalons.length}</strong> salónov
                        </p>
                    </div>

                    {/* Salon Grid */}
                    {filteredSalons.length > 0 ? (
                        <div className={styles.grid}>
                            {filteredSalons.map((salon) => (
                                <SalonCard key={salon.id} salon={transformSalon(salon)} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyIcon}>🔍</span>
                            <h3>Žiadne salóny</h3>
                            <p>
                                {searchQuery || selectedCity
                                    ? 'Skúste zmeniť kritériá vyhľadávania.'
                                    : 'Zatiaľ neboli zaregistrované žiadne salóny.'}
                            </p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
