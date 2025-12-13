'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import styles from './page.module.css';

interface Props {
    params: { slug: string };
}

interface Salon {
    id: string;
    slug: string;
    name: string;
    description_sk: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    website: string;
    tier: string;
    is_verified: boolean;
    is_featured: boolean;
}

interface Service {
    id: string;
    name_sk: string;
    price: number;
    price_from: number;
    price_to: number;
    duration: number;
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
    const [salon, setSalon] = useState<Salon | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFoundState, setNotFoundState] = useState(false);

    useEffect(() => {
        loadSalon();
    }, [params.slug]);

    const loadSalon = async () => {
        const supabase = createBrowserSupabaseClient();
        if (!supabase) {
            setLoading(false);
            return;
        }

        try {
            // Load salon by slug
            const { data: salonData, error: salonError } = await supabase
                .from('salons')
                .select('*')
                .eq('slug', params.slug)
                .eq('status', 'approved')
                .single();

            if (salonError || !salonData) {
                setNotFoundState(true);
                setLoading(false);
                return;
            }

            setSalon(salonData);

            // Load services for this salon
            const { data: servicesData } = await supabase
                .from('services')
                .select('*')
                .eq('salon_id', salonData.id)
                .order('name_sk');

            setServices(servicesData || []);

        } catch (error) {
            console.error('Error loading salon:', error);
            setNotFoundState(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <div className={styles.loading}>Načítavam salón...</div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (notFoundState || !salon) {
        notFound();
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.heroOverlay} />
                    <div className={styles.heroContent}>
                        <div className={styles.badges}>
                            {salon.is_verified && (
                                <span className={styles.verifiedBadge}>✓ Overený salón</span>
                            )}
                            {salon.tier === 'premium' && (
                                <span className={styles.premiumBadge}>Premium</span>
                            )}
                        </div>
                        <h1 className={styles.salonName}>{salon.name}</h1>
                        <p className={styles.salonLocation}>
                            📍 {salon.address}, {salon.city}
                        </p>
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
                                <p className={styles.description}>
                                    {salon.description_sk || 'Popis salónu bude čoskoro dostupný.'}
                                </p>
                            </section>

                            {/* Services */}
                            {services.length > 0 && (
                                <section className={styles.section}>
                                    <h2 className={styles.sectionTitle}>Služby a cenník</h2>
                                    <div className={styles.servicesList}>
                                        {services.map((service) => (
                                            <div key={service.id} className={styles.serviceItem}>
                                                <div className={styles.serviceInfo}>
                                                    <span className={styles.serviceName}>{service.name_sk}</span>
                                                    {service.duration > 0 && (
                                                        <span className={styles.serviceDuration}>
                                                            ~{service.duration} min
                                                        </span>
                                                    )}
                                                </div>
                                                <span className={styles.servicePrice}>
                                                    {service.price_from && service.price_to
                                                        ? `${service.price_from}€ - ${service.price_to}€`
                                                        : service.price > 0
                                                            ? `${service.price}€`
                                                            : 'Na dopyt'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

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

                                {salon.phone && (
                                    <a href={`tel:${salon.phone}`} className={styles.contactButton}>
                                        📞 {salon.phone}
                                    </a>
                                )}

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
                                            {salon.city}
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
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
