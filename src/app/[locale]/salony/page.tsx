'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SalonCard } from '@/components/salon/SalonCard';
import { getTranslation } from '@/lib/translations';
import { useParams } from 'next/navigation';
import styles from '@/app/salony/page.module.css';

// Normalize Slovak diacritics for comparison
function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/-/g, ' ');
}

// Same mock data as main page
const mockSalons = [
    { id: '1', slug: 'beauty-salon-bratislava', name: 'Beauty Salon Bratislava', description: 'Profesionálny salón krásy v centre Bratislavy.', address: 'Obchodná 25', district: 'Bratislava', categories: ['Kaderníctvo', 'Kozmetika'], rating: 4.8, reviewCount: 127, isPremium: true, isVerified: true, isFeatured: true },
    { id: '2', slug: 'nail-studio-kosice', name: 'Nail Studio Košice', description: 'Gélové nechty, manikúra a pedikúra.', address: 'Hlavná 89', district: 'Košice', categories: ['Manikúra', 'Pedikúra'], rating: 4.6, reviewCount: 84, isPremium: true, isVerified: true },
    { id: '3', slug: 'wellness-spa-zilina', name: 'Wellness & Spa Žilina', description: 'Relaxačné centrum s masážami.', address: 'Mariánske námestie 5', district: 'Žilina', categories: ['Masáže', 'Wellness'], rating: 4.9, reviewCount: 203, isVerified: true },
    { id: '4', slug: 'barbershop-nitra', name: 'Gentleman Barbershop Nitra', description: 'Tradičný barbershop pre pánov.', address: 'Štefánikova 15', district: 'Nitra', categories: ['Barbershop', 'Pánske kaderníctvo'], rating: 4.7, reviewCount: 56, isPremium: true },
    { id: '5', slug: 'kozmetika-presov', name: 'Studio Kozmetika Prešov', description: 'Profesionálna starostlivosť o pleť.', address: 'Jarková 23', district: 'Prešov', categories: ['Kozmetika', 'Líčenie'], rating: 4.5, reviewCount: 42 },
    { id: '6', slug: 'hair-design-trnava', name: 'Hair Design Trnava', description: 'Moderné kaderníctvo.', address: 'Hlavná 67', district: 'Trnava', categories: ['Dámske kaderníctvo', 'Farbenie'], rating: 4.4, reviewCount: 38 },
    { id: '7', slug: 'relax-massage-bb', name: 'Relax Masáže Banská Bystrica', description: 'Klasické a relaxačné masáže.', address: 'Dolná 12', district: 'Banská Bystrica', categories: ['Masáže', 'Wellness'], rating: 4.8, reviewCount: 91, isPremium: true, isVerified: true },
    { id: '8', slug: 'elegance-salon-trencin', name: 'Elegance Salon Trenčín', description: 'Kompletná starostlivosť o vlasy.', address: 'Mierové námestie 8', district: 'Trenčín', categories: ['Kaderníctvo', 'Manikúra'], rating: 4.6, reviewCount: 65, isVerified: true },
    { id: '9', slug: 'hair-studio-bratislava', name: 'Hair Studio Bratislava', description: 'Prémiové kaderníctvo v centre.', address: 'Ventúrska 3', district: 'Bratislava', categories: ['Dámske kaderníctvo', 'Pánske kaderníctvo'], rating: 4.7, reviewCount: 156, isPremium: true },
    { id: '10', slug: 'manicure-queen-kosice', name: 'Manicure Queen Košice', description: 'Nechtový dizajn a nail art.', address: 'Mlynská 15', district: 'Košice', categories: ['Manikúra', 'Nechtový dizajn'], rating: 4.5, reviewCount: 78 },
    { id: '11', slug: 'beauty-center-poprad', name: 'Beauty Center Poprad', description: 'Komplexné služby krásy.', address: 'Námestie sv. Egídia 12', district: 'Poprad', categories: ['Kozmetika', 'Kaderníctvo'], rating: 4.6, reviewCount: 45, isVerified: true },
    { id: '12', slug: 'tattoo-art-bratislava', name: 'Tattoo Art Studio Bratislava', description: 'Profesionálne tetovanie.', address: 'Panská 8', district: 'Bratislava', categories: ['Tetovanie'], rating: 4.9, reviewCount: 234, isPremium: true, isFeatured: true },
];

const textsByLocale: Record<string, { title: string; subtitle: string; found: string; salons: string; search: string; category: string; city: string; allCategories: string; allCities: string; clearFilters: string; noResults: string; noResultsHint: string; searchCity: string }> = {
    en: {
        title: 'All Salons',
        subtitle: 'Found',
        found: 'Found',
        salons: 'salons',
        search: 'Search',
        category: 'Category',
        city: 'City',
        allCategories: 'All categories',
        allCities: 'All cities',
        clearFilters: 'Clear filters',
        noResults: 'No results',
        noResultsHint: 'Try adjusting filters or search term.',
        searchCity: 'Search city...',
    },
    hu: {
        title: 'Összes szalon',
        subtitle: 'Találva',
        found: 'Találva',
        salons: 'szalon',
        search: 'Keresés',
        category: 'Kategória',
        city: 'Város',
        allCategories: 'Összes kategória',
        allCities: 'Összes város',
        clearFilters: 'Szűrők törlése',
        noResults: 'Nincs találat',
        noResultsHint: 'Próbálja módosítani a szűrőket vagy a keresési kifejezést.',
        searchCity: 'Város keresése...',
    },
};

const categoriesByLocale: Record<string, Array<{ slug: string; name: string }>> = {
    en: [
        { slug: 'all', name: 'All categories' },
        { slug: 'damske-kadernictvo', name: "Women's Hair Salon" },
        { slug: 'panske-kadernictvo', name: "Men's Hair Salon" },
        { slug: 'kozmetika', name: 'Cosmetics' },
        { slug: 'manikura', name: 'Manicure' },
        { slug: 'masaze', name: 'Massage' },
        { slug: 'barbershop', name: 'Barbershop' },
        { slug: 'wellness', name: 'Wellness' },
    ],
    hu: [
        { slug: 'all', name: 'Összes kategória' },
        { slug: 'damske-kadernictvo', name: 'Női fodrászat' },
        { slug: 'panske-kadernictvo', name: 'Férfi fodrászat' },
        { slug: 'kozmetika', name: 'Kozmetika' },
        { slug: 'manikura', name: 'Manikűr' },
        { slug: 'masaze', name: 'Masszázs' },
        { slug: 'barbershop', name: 'Borbély' },
        { slug: 'wellness', name: 'Wellness' },
    ],
};

const cities = [
    { slug: 'bratislava', name: 'Bratislava', isMajor: true },
    { slug: 'kosice', name: 'Košice', isMajor: true },
    { slug: 'zilina', name: 'Žilina', isMajor: true },
    { slug: 'nitra', name: 'Nitra', isMajor: true },
    { slug: 'presov', name: 'Prešov', isMajor: true },
    { slug: 'banska-bystrica', name: 'Banská Bystrica', isMajor: true },
    { slug: 'trnava', name: 'Trnava', isMajor: true },
    { slug: 'trencin', name: 'Trenčín', isMajor: true },
    { slug: 'martin', name: 'Martin', isMajor: false },
    { slug: 'poprad', name: 'Poprad', isMajor: false },
];

export default function LocalizedSalonsPage() {
    const params = useParams();
    const locale = (params.locale as string) || 'en';
    const texts = textsByLocale[locale] || textsByLocale.en;
    const categories = categoriesByLocale[locale] || categoriesByLocale.en;
    const t = getTranslation(locale);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedCity, setSelectedCity] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSalons = useMemo(() => {
        return mockSalons.filter((salon) => {
            if (selectedCategory !== 'all') {
                const categoryMatch = salon.categories.some((cat) =>
                    normalizeText(cat).includes(normalizeText(selectedCategory.replace('-', ' ')))
                );
                if (!categoryMatch) return false;
            }
            if (selectedCity !== 'all') {
                const selectedCityName = cities.find(c => c.slug === selectedCity)?.name || selectedCity;
                const cityMatch = normalizeText(salon.district) === normalizeText(selectedCityName);
                if (!cityMatch) return false;
            }
            if (searchQuery) {
                const query = normalizeText(searchQuery);
                const matchesName = normalizeText(salon.name).includes(query);
                const matchesAddress = normalizeText(salon.address).includes(query);
                if (!matchesName && !matchesAddress) return false;
            }
            return true;
        });
    }, [selectedCategory, selectedCity, searchQuery]);

    const clearFilters = () => {
        setSelectedCategory('all');
        setSelectedCity('all');
        setSearchQuery('');
    };

    const hasActiveFilters = selectedCategory !== 'all' || selectedCity !== 'all' || searchQuery !== '';

    return (
        <>
            <Header locale={locale} />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.pageHeader}>
                        <h1 className={styles.title}>{texts.title}</h1>
                        <p className={styles.subtitle}>
                            {texts.found} <strong>{filteredSalons.length}</strong> {texts.salons}
                        </p>
                    </div>

                    <div className={styles.layout}>
                        <aside className={styles.sidebar}>
                            <div className={styles.filterSection}>
                                <h3 className={styles.filterTitle}>{texts.search}</h3>
                                <input
                                    type="text"
                                    className={styles.searchInput}
                                    placeholder={texts.search + '...'}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className={styles.filterSection}>
                                <h3 className={styles.filterTitle}>{texts.category}</h3>
                                <div className={styles.filterList}>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.slug}
                                            className={`${styles.filterButton} ${selectedCategory === cat.slug ? styles.filterButtonActive : ''}`}
                                            onClick={() => setSelectedCategory(cat.slug)}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.filterSection}>
                                <h3 className={styles.filterTitle}>{texts.city}</h3>
                                <div className={styles.filterList}>
                                    <button
                                        className={`${styles.filterButton} ${selectedCity === 'all' ? styles.filterButtonActive : ''}`}
                                        onClick={() => setSelectedCity('all')}
                                    >
                                        {texts.allCities}
                                    </button>
                                    {cities.map((city) => (
                                        <button
                                            key={city.slug}
                                            className={`${styles.filterButton} ${city.isMajor ? styles.majorCity : ''} ${selectedCity === city.slug ? styles.filterButtonActive : ''}`}
                                            onClick={() => setSelectedCity(city.slug)}
                                        >
                                            {city.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {hasActiveFilters && (
                                <button className={styles.clearButton} onClick={clearFilters}>
                                    ✕ {texts.clearFilters}
                                </button>
                            )}
                        </aside>

                        <div className={styles.content}>
                            {filteredSalons.length > 0 ? (
                                <div className={styles.grid}>
                                    {filteredSalons.map((salon) => (
                                        <SalonCard key={salon.id} salon={salon} />
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.noResults}>
                                    <span className={styles.noResultsIcon}>🔍</span>
                                    <h3>{texts.noResults}</h3>
                                    <p>{texts.noResultsHint}</p>
                                    <button className={styles.clearButton} onClick={clearFilters}>
                                        {texts.clearFilters}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer locale={locale} translations={t} />
        </>
    );
}
