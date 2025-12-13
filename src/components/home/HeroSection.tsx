'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TranslationKey } from '@/lib/translations';
import styles from './HeroSection.module.css';

const rotatingWordsByLocale: Record<string, string[]> = {
    sk: ['salón krásy', 'kaderníctvo', 'wellness', 'nechtový salón', 'kozmetiku', 'masáže', 'barbershop', 'make-up štúdio'],
    en: ['beauty salon', 'hair salon', 'wellness', 'nail salon', 'cosmetics', 'massage', 'barbershop', 'make-up studio'],
    hu: ['szépségszalon', 'fodrászat', 'wellness', 'körömszalon', 'kozmetika', 'masszázs', 'borbély', 'sminkes stúdió'],
};

interface HeroSectionProps {
    locale?: string;
    translations?: TranslationKey;
}

export function HeroSection({ locale = 'sk', translations }: HeroSectionProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const rotatingWords = rotatingWordsByLocale[locale] || rotatingWordsByLocale.sk;
    const t = translations;

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
                setIsAnimating(false);
            }, 200);
        }, 1800);

        return () => clearInterval(interval);
    }, [rotatingWords.length]);

    const cities = [
        { value: 'bratislava', label: 'Bratislava' },
        { value: 'kosice', label: 'Košice' },
        { value: 'zilina', label: 'Žilina' },
        { value: 'nitra', label: 'Nitra' },
        { value: 'presov', label: 'Prešov' },
        { value: 'banska-bystrica', label: 'Banská Bystrica' },
        { value: 'trnava', label: 'Trnava' },
        { value: 'trencin', label: 'Trenčín' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        if (selectedCity) params.set('mesto', selectedCity);
        const basePath = locale === 'sk' ? '' : `/${locale}`;
        router.push(`${basePath}/vyhladavanie?${params.toString()}`);
    };

    const basePath = locale === 'sk' ? '' : `/${locale}`;

    return (
        <section className={styles.hero}>
            <div className={styles.background}>
                <div className={styles.overlay} />
            </div>

            <div className={styles.container}>
                <div className={styles.content}>
                    <h1 className={styles.title}>
                        {t?.hero.title || 'Nájdite'}{' '}
                        <span className={`${styles.highlight} ${styles.rotatingText}`}>
                            <span className={`${styles.word} ${isAnimating ? styles.fadeOut : styles.fadeIn}`}>
                                {rotatingWords[currentWordIndex]}
                            </span>
                        </span>
                        <br />{t?.hero.titleEnd || 'vo vašom meste'}
                    </h1>

                    <p className={styles.subtitle}>
                        {t?.hero.subtitle || 'Prehľadajte tisíce salónov na Slovensku. Kaderníctva, kozmetika, manikúra, masáže a ďalšie služby na jednom mieste.'}
                    </p>

                    {/* Search Form */}
                    <form className={styles.searchForm} onSubmit={handleSearch}>
                        <div className={styles.searchInputGroup}>
                            <div className={styles.inputWrapper}>
                                <span className={styles.inputIcon}>🔍</span>
                                <input
                                    type="text"
                                    placeholder={t?.hero.searchPlaceholder || "Čo hľadáte? (napr. kaderníctvo, manikúra...)"}
                                    className={styles.searchInput}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className={styles.inputWrapper}>
                                <span className={styles.inputIcon}>📍</span>
                                <select
                                    className={styles.citySelect}
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                >
                                    <option value="">{t?.hero.allCities || 'Všetky mestá'}</option>
                                    {cities.map((city) => (
                                        <option key={city.value} value={city.value}>
                                            {city.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className={styles.searchButton}>
                                {t?.hero.search || 'Hľadať'}
                            </button>
                        </div>
                    </form>

                    {/* Quick Links */}
                    <div className={styles.quickLinks}>
                        <span className={styles.quickLinksLabel}>{t?.hero.popular || 'Populárne:'}</span>
                        <a href={`${basePath}/kategoria/damske-kadernictvo`} className={styles.quickLink}>
                            {locale === 'en' ? 'Hair Salon' : locale === 'hu' ? 'Fodrászat' : 'Kaderníctvo'}
                        </a>
                        <a href={`${basePath}/kategoria/kozmetika`} className={styles.quickLink}>
                            {locale === 'en' ? 'Cosmetics' : locale === 'hu' ? 'Kozmetika' : 'Kozmetika'}
                        </a>
                        <a href={`${basePath}/kategoria/manikura`} className={styles.quickLink}>
                            {locale === 'en' ? 'Manicure' : locale === 'hu' ? 'Manikűr' : 'Manikúra'}
                        </a>
                        <a href={`${basePath}/kategoria/masaze`} className={styles.quickLink}>
                            {locale === 'en' ? 'Massage' : locale === 'hu' ? 'Masszázs' : 'Masáže'}
                        </a>
                    </div>
                </div>

                {/* Stats */}
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>1000+</span>
                        <span className={styles.statLabel}>{t?.stats.salons || 'Salónov'}</span>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>79</span>
                        <span className={styles.statLabel}>{t?.stats.districts || 'Okresov'}</span>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>32</span>
                        <span className={styles.statLabel}>{t?.stats.categories || 'Kategórií'}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
