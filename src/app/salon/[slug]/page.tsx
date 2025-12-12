import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './page.module.css';

interface Props {
    params: { slug: string };
}

// Mock data - will be replaced with Supabase query
const getSalon = (slug: string) => {
    const salons: Record<string, any> = {
        'beauty-salon-bratislava': {
            id: '1',
            slug: 'beauty-salon-bratislava',
            name: 'Beauty Salon Bratislava',
            description: 'Profesionálny salón krásy v centre Bratislavy. Ponúkame komplexné služby v oblasti kaderníctva, kozmetiky a manikúry. Náš tím skúsených odborníkov sa postará o váš dokonalý vzhľad.',
            address: 'Obchodná 25',
            city: 'Bratislava',
            district: 'Staré Mesto',
            postalCode: '811 06',
            phone: '+421 900 123 456',
            email: 'info@beautysalon.sk',
            website: 'https://beautysalon.sk',
            categories: ['Kaderníctvo', 'Kozmetika', 'Manikúra'],
            rating: 4.8,
            reviewCount: 127,
            isPremium: true,
            isVerified: true,
            openingHours: {
                monday: { open: '09:00', close: '20:00' },
                tuesday: { open: '09:00', close: '20:00' },
                wednesday: { open: '09:00', close: '20:00' },
                thursday: { open: '09:00', close: '20:00' },
                friday: { open: '09:00', close: '20:00' },
                saturday: { open: '10:00', close: '16:00' },
                sunday: null,
            },
            services: [
                { name: 'Dámsky strih', price: 25, duration: 45 },
                { name: 'Pánsky strih', price: 15, duration: 30 },
                { name: 'Farbenie', priceFrom: 40, priceTo: 80, duration: 120 },
                { name: 'Manikúra klasická', price: 20, duration: 45 },
                { name: 'Gélové nechty', price: 35, duration: 90 },
                { name: 'Ošetrenie pleti', price: 45, duration: 60 },
            ],
        },
    };

    return salons[slug] || null;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const salon = getSalon(params.slug);

    if (!salon) {
        return { title: 'Salón nenájdený' };
    }

    return {
        title: `${salon.name} | Salon Finder SK`,
        description: salon.description,
        openGraph: {
            title: salon.name,
            description: salon.description,
            type: 'website',
        },
    };
}

const dayNames: Record<string, string> = {
    monday: 'Pondelok',
    tuesday: 'Utorok',
    wednesday: 'Streda',
    thursday: 'Štvrtok',
    friday: 'Piatok',
    saturday: 'Sobota',
    sunday: 'Nedeľa',
};

export default function SalonPage({ params }: Props) {
    const salon = getSalon(params.slug);

    if (!salon) {
        notFound();
    }

    // Structured Data for LocalBusiness
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BeautySalon',
        name: salon.name,
        description: salon.description,
        url: `https://vyhladavac-salonov.vercel.app/salon/${salon.slug}`,
        telephone: salon.phone,
        email: salon.email,
        address: {
            '@type': 'PostalAddress',
            streetAddress: salon.address,
            addressLocality: salon.city,
            addressRegion: salon.district,
            postalCode: salon.postalCode,
            addressCountry: 'SK',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: salon.rating,
            reviewCount: salon.reviewCount,
        },
        openingHoursSpecification: Object.entries(salon.openingHours)
            .filter(([_, hours]) => hours !== null)
            .map(([day, hours]: [string, any]) => ({
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
                opens: hours?.open,
                closes: hours?.close,
            })),
        priceRange: '€€',
    };

    return (
        <>
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <Header />
            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.heroOverlay} />
                    <div className={styles.heroContent}>
                        <div className={styles.badges}>
                            {salon.isVerified && (
                                <span className={styles.verifiedBadge}>✓ Overený salón</span>
                            )}
                            {salon.isPremium && (
                                <span className={styles.premiumBadge}>Premium</span>
                            )}
                        </div>
                        <h1 className={styles.salonName}>{salon.name}</h1>
                        <p className={styles.salonLocation}>
                            📍 {salon.address}, {salon.city}
                        </p>
                        <div className={styles.rating}>
                            <span className={styles.ratingStars}>⭐</span>
                            <span className={styles.ratingValue}>{salon.rating}</span>
                            <span className={styles.reviewCount}>
                                ({salon.reviewCount} hodnotení)
                            </span>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <div className={styles.container}>
                    <div className={styles.layout}>
                        {/* Left Column - Main Info */}
                        <div className={styles.mainColumn}>
                            {/* About */}
                            <section className={styles.section}>
                                <h2 className={styles.sectionTitle}>O salóne</h2>
                                <p className={styles.description}>{salon.description}</p>
                                <div className={styles.categories}>
                                    {salon.categories.map((cat: string) => (
                                        <span key={cat} className={styles.category}>
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            {/* Services */}
                            <section className={styles.section}>
                                <h2 className={styles.sectionTitle}>Služby a cenník</h2>
                                <div className={styles.servicesList}>
                                    {salon.services.map((service: any, index: number) => (
                                        <div key={index} className={styles.serviceItem}>
                                            <div className={styles.serviceInfo}>
                                                <span className={styles.serviceName}>{service.name}</span>
                                                {service.duration && (
                                                    <span className={styles.serviceDuration}>
                                                        ~{service.duration} min
                                                    </span>
                                                )}
                                            </div>
                                            <span className={styles.servicePrice}>
                                                {service.priceFrom
                                                    ? `${service.priceFrom}€ - ${service.priceTo}€`
                                                    : `${service.price}€`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Gallery Placeholder */}
                            <section className={styles.section}>
                                <h2 className={styles.sectionTitle}>Galéria</h2>
                                <div className={styles.galleryPlaceholder}>
                                    <span>📷</span>
                                    <p>Galéria bude čoskoro dostupná</p>
                                </div>
                            </section>
                        </div>

                        {/* Right Column - Contact Info */}
                        <aside className={styles.sidebar}>
                            {/* Contact Card */}
                            <div className={styles.contactCard}>
                                <h3 className={styles.contactTitle}>Kontakt</h3>

                                <a href={`tel:${salon.phone}`} className={styles.contactButton}>
                                    📞 {salon.phone}
                                </a>

                                {salon.website && (
                                    <a
                                        href={salon.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.websiteButton}
                                    >
                                        🌐 Navštíviť web
                                    </a>
                                )}

                                <div className={styles.contactInfo}>
                                    <div className={styles.contactRow}>
                                        <span className={styles.contactLabel}>Adresa</span>
                                        <span className={styles.contactValue}>
                                            {salon.address}<br />
                                            {salon.postalCode} {salon.city}
                                        </span>
                                    </div>

                                    {salon.email && (
                                        <div className={styles.contactRow}>
                                            <span className={styles.contactLabel}>E-mail</span>
                                            <a href={`mailto:${salon.email}`} className={styles.contactLink}>
                                                {salon.email}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Opening Hours */}
                            <div className={styles.hoursCard}>
                                <h3 className={styles.hoursTitle}>Otváracie hodiny</h3>
                                <ul className={styles.hoursList}>
                                    {Object.entries(salon.openingHours).map(([day, hours]: [string, any]) => (
                                        <li key={day} className={styles.hoursRow}>
                                            <span className={styles.dayName}>{dayNames[day]}</span>
                                            <span className={styles.hours}>
                                                {hours ? `${hours.open} - ${hours.close}` : 'Zatvorené'}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
