'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SalonCard } from '@/components/salon/SalonCard';
import styles from './page.module.css';

// Mock salons for search
const allSalons = [
    {
        id: '1',
        slug: 'beauty-salon-bratislava',
        name: 'Beauty Salon Bratislava',
        description: 'Profesionálny salón krásy v centre Bratislavy.',
        address: 'Obchodná 25',
        district: 'Bratislava',
        categories: ['Kaderníctvo', 'Kozmetika', 'Manikúra'],
        rating: 4.8,
        reviewCount: 127,
        isPremium: true,
        isVerified: true,
        isFeatured: true,
    },
    {
        id: '2',
        slug: 'nail-studio-kosice',
        name: 'Nail Studio Košice',
        description: 'Špecializujeme sa na gélové nechty a manikúru.',
        address: 'Hlavná 89',
        district: 'Košice',
        categories: ['Manikúra', 'Pedikúra', 'Nechtový dizajn'],
        rating: 4.6,
        reviewCount: 84,
        isPremium: true,
        isVerified: true,
    },
    {
        id: '3',
        slug: 'wellness-spa-zilina',
        name: 'Wellness & Spa Žilina',
        description: 'Relaxačné centrum s masážami a wellness procedúrami.',
        address: 'Mariánske námestie 5',
        district: 'Žilina',
        categories: ['Masáže', 'Wellness', 'Spa'],
        rating: 4.9,
        reviewCount: 203,
        isVerified: true,
    },
    {
        id: '4',
        slug: 'barbershop-nitra',
        name: 'Gentleman Barbershop Nitra',
        description: 'Tradičný barbershop pre pánov.',
        address: 'Štefánikova 15',
        district: 'Nitra',
        categories: ['Barbershop', 'Pánske kaderníctvo'],
        rating: 4.7,
        reviewCount: 56,
        isPremium: true,
    },
    {
        id: '5',
        slug: 'kozmetika-presov',
        name: 'Studio Kozmetika Prešov',
        description: 'Profesionálna starostlivosť o pleť.',
        address: 'Jarková 23',
        district: 'Prešov',
        categories: ['Kozmetika', 'Líčenie'],
        rating: 4.5,
        reviewCount: 42,
    },
];

const categories = [
    { slug: 'all', name: 'Všetky kategórie' },
    { slug: 'kadernictvo', name: 'Kaderníctvo' },
    { slug: 'kozmetika', name: 'Kozmetika' },
    { slug: 'manikura', name: 'Manikúra' },
    { slug: 'masaze', name: 'Masáže' },
    { slug: 'wellness', name: 'Wellness' },
];

const cities = [
    { slug: 'all', name: 'Všetky mestá' },
    { slug: 'bratislava', name: 'Bratislava' },
    { slug: 'kosice', name: 'Košice' },
    { slug: 'zilina', name: 'Žilina' },
    { slug: 'nitra', name: 'Nitra' },
    { slug: 'presov', name: 'Prešov' },
];

function SearchContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const initialCity = searchParams.get('mesto') || 'all';

    const [query, setQuery] = useState(initialQuery);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedCity, setSelectedCity] = useState(initialCity);
    const [results, setResults] = useState(allSalons);

    useEffect(() => {
        // Filter salons based on search criteria
        let filtered = allSalons;

        if (query) {
            const lowerQuery = query.toLowerCase();
            filtered = filtered.filter(
                (salon) =>
                    salon.name.toLowerCase().includes(lowerQuery) ||
                    salon.description.toLowerCase().includes(lowerQuery) ||
                    salon.categories.some((cat) => cat.toLowerCase().includes(lowerQuery))
            );
        }

        if (selectedCity !== 'all') {
            filtered = filtered.filter(
                (salon) => salon.district.toLowerCase() === selectedCity.toLowerCase()
            );
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter((salon) =>
                salon.categories.some((cat) =>
                    cat.toLowerCase().includes(selectedCategory.toLowerCase())
                )
            );
        }

        setResults(filtered);
    }, [query, selectedCategory, selectedCity]);

    return (
        <div className={styles.container}>
            {/* Search Header */}
            <div className={styles.searchHeader}>
                <h1 className={styles.title}>Vyhľadávanie salónov</h1>

                {/* Search Form */}
                <div className={styles.searchForm}>
                    <div className={styles.searchInputWrapper}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder="Čo hľadáte? (napr. kaderníctvo, manikúra...)"
                            className={styles.searchInput}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    <select
                        className={styles.filterSelect}
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map((cat) => (
                            <option key={cat.slug} value={cat.slug}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className={styles.filterSelect}
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                    >
                        {cities.map((city) => (
                            <option key={city.slug} value={city.slug}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results */}
            <div className={styles.results}>
                <p className={styles.resultCount}>
                    {results.length === 0 ? (
                        'Žiadne výsledky'
                    ) : (
                        <>
                            Nájdených <strong>{results.length}</strong> salónov
                            {query && (
                                <>
                                    {' '}pre "<strong>{query}</strong>"
                                </>
                            )}
                        </>
                    )}
                </p>

                {results.length > 0 ? (
                    <div className={styles.grid}>
                        {results.map((salon) => (
                            <SalonCard key={salon.id} salon={salon} />
                        ))}
                    </div>
                ) : (
                    <div className={styles.noResults}>
                        <span className={styles.noResultsIcon}>🔍</span>
                        <h2>Žiadne výsledky</h2>
                        <p>Skúste upraviť vyhľadávanie alebo filtre</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function SearchLoading() {
    return (
        <div className={styles.container}>
            <div className={styles.searchHeader}>
                <h1 className={styles.title}>Vyhľadávanie salónov</h1>
                <div className={styles.loading}>Načítavam...</div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <Suspense fallback={<SearchLoading />}>
                    <SearchContent />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}
