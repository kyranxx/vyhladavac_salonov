'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SalonCard } from '@/components/salon/SalonCard';
import styles from './page.module.css';

// Normalize Slovak diacritics for comparison
function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/-/g, ' ');
}

// Extended mock data with more salons for testing
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
    { id: '13', slug: 'spa-wellness-piestany', name: 'Spa & Wellness Piešťany', description: 'Relaxačné procedúry a kúpele.', address: 'Kúpeľná 45', district: 'Piešťany', categories: ['Wellness', 'Masáže'], rating: 4.8, reviewCount: 112, isPremium: true },
    { id: '14', slug: 'hair-salon-martin', name: 'Hair Salon Martin', description: 'Moderné strihanie a styling.', address: 'Divadelná 6', district: 'Martin', categories: ['Dámske kaderníctvo'], rating: 4.3, reviewCount: 28 },
    { id: '15', slug: 'nails-studio-zilina', name: 'Nails Studio Žilina', description: 'Gélové nechty a manikúra.', address: 'Národná 22', district: 'Žilina', categories: ['Manikúra', 'Pedikúra'], rating: 4.4, reviewCount: 52 },
    { id: '16', slug: 'barber-king-bratislava', name: 'Barber King Bratislava', description: 'Prémiový barbershop.', address: 'Laurinská 7', district: 'Bratislava', categories: ['Barbershop'], rating: 4.9, reviewCount: 189, isPremium: true, isVerified: true },
    { id: '17', slug: 'permanent-makeup-kosice', name: 'Permanent Make-up Košice', description: 'Permanentný make-up očí a obočia.', address: 'Štúrova 33', district: 'Košice', categories: ['Permanentný make-up'], rating: 4.7, reviewCount: 67, isVerified: true },
    { id: '18', slug: 'lashes-brows-nitra', name: 'Lashes & Brows Nitra', description: 'Mihalnice a úprava obočia.', address: 'Farská 14', district: 'Nitra', categories: ['Mihalnice', 'Obočie'], rating: 4.6, reviewCount: 43 },
];

const categories = [
    { slug: 'all', name: 'Všetky kategórie' },
    { slug: 'damske-kadernictvo', name: 'Dámske kaderníctvo' },
    { slug: 'panske-kadernictvo', name: 'Pánske kaderníctvo' },
    { slug: 'kadernictvo', name: 'Kaderníctvo' },
    { slug: 'kozmetika', name: 'Kozmetika' },
    { slug: 'manikura', name: 'Manikúra' },
    { slug: 'pedikura', name: 'Pedikúra' },
    { slug: 'masaze', name: 'Masáže' },
    { slug: 'barbershop', name: 'Barbershop' },
    { slug: 'wellness', name: 'Wellness' },
    { slug: 'tetovanie', name: 'Tetovanie' },
    { slug: 'permanentny-make-up', name: 'Permanentný make-up' },
    { slug: 'mihalnice', name: 'Mihalnice' },
];

// Major Slovak cities first, then alphabetically
const allCities = [
    // Major cities (featured)
    { slug: 'bratislava', name: 'Bratislava', isMajor: true },
    { slug: 'kosice', name: 'Košice', isMajor: true },
    { slug: 'zilina', name: 'Žilina', isMajor: true },
    { slug: 'nitra', name: 'Nitra', isMajor: true },
    { slug: 'presov', name: 'Prešov', isMajor: true },
    { slug: 'banska-bystrica', name: 'Banská Bystrica', isMajor: true },
    { slug: 'trnava', name: 'Trnava', isMajor: true },
    { slug: 'trencin', name: 'Trenčín', isMajor: true },
    // Other cities
    { slug: 'martin', name: 'Martin', isMajor: false },
    { slug: 'poprad', name: 'Poprad', isMajor: false },
    { slug: 'piestany', name: 'Piešťany', isMajor: false },
    { slug: 'prievidza', name: 'Prievidza', isMajor: false },
    { slug: 'zvolen', name: 'Zvolen', isMajor: false },
    { slug: 'povazska-bystrica', name: 'Považská Bystrica', isMajor: false },
    { slug: 'komarno', name: 'Komárno', isMajor: false },
    { slug: 'nove-zamky', name: 'Nové Zámky', isMajor: false },
    { slug: 'michalovce', name: 'Michalovce', isMajor: false },
    { slug: 'levice', name: 'Levice', isMajor: false },
    { slug: 'humenne', name: 'Humenné', isMajor: false },
    { slug: 'spisska-nova-ves', name: 'Spišská Nová Ves', isMajor: false },
    { slug: 'bardejov', name: 'Bardejov', isMajor: false },
    { slug: 'liptovsky-mikulas', name: 'Liptovský Mikuláš', isMajor: false },
    { slug: 'ruzomberok', name: 'Ružomberok', isMajor: false },
    { slug: 'lucenec', name: 'Lučenec', isMajor: false },
    { slug: 'dunajska-streda', name: 'Dunajská Streda', isMajor: false },
    { slug: 'pezinok', name: 'Pezinok', isMajor: false },
    { slug: 'hlohovec', name: 'Hlohovec', isMajor: false },
    { slug: 'senica', name: 'Senica', isMajor: false },
    { slug: 'sala', name: 'Šaľa', isMajor: false },
    { slug: 'partizanske', name: 'Partizánske', isMajor: false },
    { slug: 'cadca', name: 'Čadca', isMajor: false },
    { slug: 'dolny-kubin', name: 'Dolný Kubín', isMajor: false },
    { slug: 'revuca', name: 'Revúca', isMajor: false },
    { slug: 'rimavska-sobota', name: 'Rimavská Sobota', isMajor: false },
    { slug: 'vranov-nad-toplou', name: 'Vranov nad Topľou', isMajor: false },
    { slug: 'snina', name: 'Snina', isMajor: false },
    { slug: 'trebisov', name: 'Trebišov', isMajor: false },
    { slug: 'krupina', name: 'Krupina', isMajor: false },
    { slug: 'brezno', name: 'Brezno', isMajor: false },
    { slug: 'detva', name: 'Detva', isMajor: false },
];

export default function SalonsPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedCity, setSelectedCity] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [citySearchQuery, setCitySearchQuery] = useState('');

    // Filter cities based on search
    const filteredCities = useMemo(() => {
        if (!citySearchQuery) return allCities;
        const query = normalizeText(citySearchQuery);
        return allCities.filter(city => normalizeText(city.name).includes(query));
    }, [citySearchQuery]);

    const filteredSalons = useMemo(() => {
        return mockSalons.filter((salon) => {
            // Filter by category - normalize for comparison
            if (selectedCategory !== 'all') {
                const categoryMatch = salon.categories.some((cat) =>
                    normalizeText(cat).includes(normalizeText(selectedCategory.replace('-', ' ')))
                );
                if (!categoryMatch) return false;
            }

            // Filter by city - normalize for comparison
            if (selectedCity !== 'all') {
                const selectedCityName = allCities.find(c => c.slug === selectedCity)?.name || selectedCity;
                const cityMatch = normalizeText(salon.district) === normalizeText(selectedCityName);
                if (!cityMatch) return false;
            }

            // Filter by search query
            if (searchQuery) {
                const query = normalizeText(searchQuery);
                const matchesName = normalizeText(salon.name).includes(query);
                const matchesDescription = normalizeText(salon.description || '').includes(query);
                const matchesAddress = normalizeText(salon.address).includes(query);
                const matchesDistrict = normalizeText(salon.district).includes(query);
                if (!matchesName && !matchesDescription && !matchesAddress && !matchesDistrict) {
                    return false;
                }
            }

            return true;
        });
    }, [selectedCategory, selectedCity, searchQuery]);

    const clearFilters = () => {
        setSelectedCategory('all');
        setSelectedCity('all');
        setSearchQuery('');
        setCitySearchQuery('');
    };

    const hasActiveFilters = selectedCategory !== 'all' || selectedCity !== 'all' || searchQuery !== '';

    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    {/* Page Header */}
                    <div className={styles.pageHeader}>
                        <h1 className={styles.title}>Všetky salóny</h1>
                        <p className={styles.subtitle}>
                            Nájdených <strong>{filteredSalons.length}</strong> salónov
                        </p>
                    </div>

                    {/* Filters & Content */}
                    <div className={styles.layout}>
                        {/* Sidebar Filters */}
                        <aside className={styles.sidebar}>
                            {/* Search */}
                            <div className={styles.filterSection}>
                                <h3 className={styles.filterTitle}>Hľadať</h3>
                                <input
                                    type="text"
                                    className={styles.searchInput}
                                    placeholder="Názov, adresa..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Category Filter */}
                            <div className={styles.filterSection}>
                                <h3 className={styles.filterTitle}>Kategória</h3>
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

                            {/* City Filter with Search */}
                            <div className={styles.filterSection}>
                                <h3 className={styles.filterTitle}>Mesto</h3>
                                <input
                                    type="text"
                                    className={styles.citySearchInput}
                                    placeholder="Hľadať mesto..."
                                    value={citySearchQuery}
                                    onChange={(e) => setCitySearchQuery(e.target.value)}
                                />
                                <div className={styles.filterList}>
                                    <button
                                        className={`${styles.filterButton} ${selectedCity === 'all' ? styles.filterButtonActive : ''}`}
                                        onClick={() => setSelectedCity('all')}
                                    >
                                        Všetky mestá
                                    </button>
                                    {filteredCities.map((city) => (
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

                            {/* Clear Filters */}
                            {hasActiveFilters && (
                                <button className={styles.clearButton} onClick={clearFilters}>
                                    ✕ Zrušiť filtre
                                </button>
                            )}
                        </aside>

                        {/* Salon Grid */}
                        <div className={styles.content}>
                            {/* Active filters chips */}
                            {hasActiveFilters && (
                                <div className={styles.activeFilters}>
                                    {selectedCategory !== 'all' && (
                                        <span className={styles.filterChip}>
                                            {categories.find(c => c.slug === selectedCategory)?.name}
                                            <button onClick={() => setSelectedCategory('all')}>×</button>
                                        </span>
                                    )}
                                    {selectedCity !== 'all' && (
                                        <span className={styles.filterChip}>
                                            {allCities.find(c => c.slug === selectedCity)?.name}
                                            <button onClick={() => setSelectedCity('all')}>×</button>
                                        </span>
                                    )}
                                    {searchQuery && (
                                        <span className={styles.filterChip}>
                                            &quot;{searchQuery}&quot;
                                            <button onClick={() => setSearchQuery('')}>×</button>
                                        </span>
                                    )}
                                </div>
                            )}

                            {filteredSalons.length > 0 ? (
                                <div className={styles.grid}>
                                    {filteredSalons.map((salon) => (
                                        <SalonCard key={salon.id} salon={salon} />
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.noResults}>
                                    <span className={styles.noResultsIcon}>🔍</span>
                                    <h3>Žiadne výsledky</h3>
                                    <p>Skúste upraviť filtre alebo hľadaný výraz.</p>
                                    <button className={styles.clearButton} onClick={clearFilters}>
                                        Zrušiť filtre
                                    </button>
                                </div>
                            )}

                            {/* Pagination */}
                            {filteredSalons.length > 0 && (
                                <div className={styles.pagination}>
                                    <button className={styles.pageButton} disabled>
                                        ← Predchádzajúca
                                    </button>
                                    <span className={styles.pageInfo}>Strana 1 z 1</span>
                                    <button className={styles.pageButton} disabled>
                                        Ďalšia →
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
