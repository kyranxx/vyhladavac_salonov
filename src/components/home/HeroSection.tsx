'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './HeroSection.module.css';

const rotatingWords = [
    'salón krásy',
    'kaderníctvo',
    'wellness',
    'nechtový salón',
    'kozmetiku',
    'masáže',
    'barbershop',
    'make-up štúdio',
];

export function HeroSection() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
                setIsAnimating(false);
            }, 200);
        }, 1800);

        return () => clearInterval(interval);
    }, []);

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
        router.push(`/vyhladavanie?${params.toString()}`);
    };

    return (
        <section className={styles.hero}>
            <div className={styles.background}>
                <div className={styles.overlay} />
            </div>

            <div className={styles.container}>
                <div className={styles.content}>
                    <h1 className={styles.title}>
                        Nájdite{' '}
                        <span className={`${styles.highlight} ${styles.rotatingText}`}>
                            <span className={`${styles.word} ${isAnimating ? styles.fadeOut : styles.fadeIn}`}>
                                {rotatingWords[currentWordIndex]}
                            </span>
                        </span>
                        <br />vo vašom meste
                    </h1>

                    <p className={styles.subtitle}>
                        Prehľadajte tisíce salónov na Slovensku. Kaderníctva, kozmetika,
                        manikúra, masáže a ďalšie služby na jednom mieste.
                    </p>

                    {/* Search Form */}
                    <form className={styles.searchForm} onSubmit={handleSearch}>
                        <div className={styles.searchInputGroup}>
                            <div className={styles.inputWrapper}>
                                <span className={styles.inputIcon}>🔍</span>
                                <input
                                    type="text"
                                    placeholder="Čo hľadáte? (napr. kaderníctvo, manikúra...)"
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
                                    <option value="">Všetky mestá</option>
                                    {cities.map((city) => (
                                        <option key={city.value} value={city.value}>
                                            {city.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className={styles.searchButton}>
                                Hľadať
                            </button>
                        </div>
                    </form>

                    {/* Quick Links */}
                    <div className={styles.quickLinks}>
                        <span className={styles.quickLinksLabel}>Populárne:</span>
                        <a href="/kategoria/damske-kadernictvo" className={styles.quickLink}>
                            Kaderníctvo
                        </a>
                        <a href="/kategoria/kozmetika" className={styles.quickLink}>
                            Kozmetika
                        </a>
                        <a href="/kategoria/manikura" className={styles.quickLink}>
                            Manikúra
                        </a>
                        <a href="/kategoria/masaze" className={styles.quickLink}>
                            Masáže
                        </a>
                    </div>
                </div>

                {/* Stats */}
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>1000+</span>
                        <span className={styles.statLabel}>Salónov</span>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>79</span>
                        <span className={styles.statLabel}>Okresov</span>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>32</span>
                        <span className={styles.statLabel}>Kategórií</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
