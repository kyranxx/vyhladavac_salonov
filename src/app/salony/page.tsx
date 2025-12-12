import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SalonCard } from '@/components/salon/SalonCard';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Všetky salóny | Salon Finder SK',
    description: 'Prehľad všetkých salónov krásy na Slovensku. Kaderníctva, kozmetika, manikúra, masáže a ďalšie služby.',
};

// Mock data - will be replaced with Supabase query
const mockSalons = [
    {
        id: '1',
        slug: 'beauty-salon-bratislava',
        name: 'Beauty Salon Bratislava',
        description: 'Profesionálny salón krásy v centre Bratislavy. Ponúkame komplexné služby v oblasti kaderníctva, kozmetiky a manikúry.',
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
        description: 'Špecializujeme sa na gélové nechty, manikúru a pedikúru. Používame len kvalitné materiály.',
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
        description: 'Relaxačné centrum s masážami, saunou a wellness procedúrami. Darujte si oddych.',
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
        description: 'Tradičný barbershop pre pánov. Strihanie, holenie, úprava brady.',
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
        description: 'Profesionálna starostlivosť o pleť, ošetrenia tváre a tela.',
        address: 'Jarková 23',
        district: 'Prešov',
        categories: ['Kozmetika', 'Líčenie'],
        rating: 4.5,
        reviewCount: 42,
    },
    {
        id: '6',
        slug: 'hair-design-trnava',
        name: 'Hair Design Trnava',
        description: 'Moderné kaderníctvo s najnovšími trendami. Strihanie, farbenie, styling.',
        address: 'Hlavná 67',
        district: 'Trnava',
        categories: ['Dámske kaderníctvo', 'Farbenie', 'Styling'],
        rating: 4.4,
        reviewCount: 38,
    },
];

const categories = [
    { slug: 'damske-kadernictvo', name: 'Dámske kaderníctvo' },
    { slug: 'panske-kadernictvo', name: 'Pánske kaderníctvo' },
    { slug: 'kozmetika', name: 'Kozmetika' },
    { slug: 'manikura', name: 'Manikúra' },
    { slug: 'masaze', name: 'Masáže' },
];

const cities = [
    { slug: 'bratislava', name: 'Bratislava' },
    { slug: 'kosice', name: 'Košice' },
    { slug: 'zilina', name: 'Žilina' },
    { slug: 'nitra', name: 'Nitra' },
    { slug: 'presov', name: 'Prešov' },
];

export default function SalonsPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    {/* Page Header */}
                    <div className={styles.pageHeader}>
                        <h1 className={styles.title}>Všetky salóny</h1>
                        <p className={styles.subtitle}>
                            Nájdených <strong>{mockSalons.length}</strong> salónov
                        </p>
                    </div>

                    {/* Filters & Content */}
                    <div className={styles.layout}>
                        {/* Sidebar Filters */}
                        <aside className={styles.sidebar}>
                            <div className={styles.filterSection}>
                                <h3 className={styles.filterTitle}>Kategória</h3>
                                <ul className={styles.filterList}>
                                    <li>
                                        <a href="/salony" className={styles.filterLinkActive}>
                                            Všetky kategórie
                                        </a>
                                    </li>
                                    {categories.map((cat) => (
                                        <li key={cat.slug}>
                                            <a href={`/kategoria/${cat.slug}`} className={styles.filterLink}>
                                                {cat.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.filterSection}>
                                <h3 className={styles.filterTitle}>Mesto</h3>
                                <ul className={styles.filterList}>
                                    <li>
                                        <a href="/salony" className={styles.filterLinkActive}>
                                            Všetky mestá
                                        </a>
                                    </li>
                                    {cities.map((city) => (
                                        <li key={city.slug}>
                                            <a href={`/salony/${city.slug}`} className={styles.filterLink}>
                                                {city.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        {/* Salon Grid */}
                        <div className={styles.content}>
                            <div className={styles.grid}>
                                {mockSalons.map((salon) => (
                                    <SalonCard key={salon.id} salon={salon} />
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className={styles.pagination}>
                                <button className={styles.pageButton} disabled>
                                    ← Predchádzajúca
                                </button>
                                <span className={styles.pageInfo}>Strana 1 z 1</span>
                                <button className={styles.pageButton} disabled>
                                    Ďalšia →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
