'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TranslationKey } from '@/lib/translations';
import { Select } from '@/components/ui/Select';
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
        { value: 'presov', label: 'Prešov' },
        { value: 'zilina', label: 'Žilina' },
        { value: 'nitra', label: 'Nitra' },
        { value: 'banska-bystrica', label: 'Banská Bystrica' },
        { value: 'trnava', label: 'Trnava' },
        { value: 'trencin', label: 'Trenčín' },
        { value: 'martin', label: 'Martin' },
        { value: 'poprad', label: 'Poprad' },
        { value: 'prievidza', label: 'Prievidza' },
        { value: 'zvolen', label: 'Zvolen' },
        { value: 'povazska-bystrica', label: 'Považská Bystrica' },
        { value: 'nove-zamky', label: 'Nové Zámky' },
        { value: 'michalovce', label: 'Michalovce' },
        { value: 'spisska-nova-ves', label: 'Spišská Nová Ves' },
        { value: 'komarno', label: 'Komárno' },
        { value: 'humenne', label: 'Humenné' },
        { value: 'levice', label: 'Levice' },
        { value: 'bardejov', label: 'Bardejov' },
        { value: 'liptovsky-mikulas', label: 'Liptovský Mikuláš' },
        { value: 'ruzomberok', label: 'Ružomberok' },
        { value: 'lucenec', label: 'Lučenec' },
        { value: 'piestany', label: 'Piešťany' },
        { value: 'topolcany', label: 'Topoľčany' },
        { value: 'dubnica', label: 'Dubnica nad Váhom' },
        { value: 'dunajska-streda', label: 'Dunajská Streda' },
        { value: 'partizanske', label: 'Partizánske' },
        { value: 'cadca', label: 'Čadca' },
        { value: 'pezinok', label: 'Pezinok' },
        { value: 'skalica', label: 'Skalica' },
        { value: 'senec', label: 'Senec' },
        { value: 'hlohovec', label: 'Hlohovec' },
        { value: 'malacky', label: 'Malacky' },
        { value: 'senica', label: 'Senica' },
        { value: 'sala', label: 'Šaľa' },
        { value: 'dolny-kubin', label: 'Dolný Kubín' },
        { value: 'galanta', label: 'Galanta' },
        { value: 'trebisov', label: 'Trebišov' },
        { value: 'vranov', label: 'Vranov nad Topľou' },
        { value: 'snina', label: 'Snina' },
        { value: 'revuca', label: 'Revúca' },
        { value: 'rimavska-sobota', label: 'Rimavská Sobota' },
        { value: 'brezno', label: 'Brezno' },
        { value: 'detva', label: 'Detva' },
        { value: 'krupina', label: 'Krupina' },
        { value: 'zarnovica', label: 'Žarnovica' },
        { value: 'banska-stiavnica', label: 'Banská Štiavnica' },
        { value: 'sturovo', label: 'Štúrovo' },
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
                        {t?.hero.title || 'Nájdite'}
                        <span className={`${styles.highlight} ${styles.rotatingText}`}>
                            <span className={`${styles.word} ${isAnimating ? styles.fadeOut : styles.fadeIn}`}>
                                {rotatingWords[currentWordIndex]}
                            </span>
                        </span>
                        {t?.hero.titleEnd || 'vo vašom meste'}
                    </h1>

                    <p className={styles.subtitle}>
                        {t?.hero.subtitle || 'Prehľadajte tisíce salónov na Slovensku. Kaderníctva, kozmetika, manikúra, masáže a ďalšie služby na jednom mieste.'}
                    </p>

                    {/* Search Form */}
                    <form className={styles.searchForm} onSubmit={handleSearch}>
                        <div className={styles.searchInputGroup}>
                            <div className={styles.inputWrapper}>
                                <span className={styles.inputIcon}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder={t?.hero.searchPlaceholder || "Čo hľadáte? (napr. kaderníctvo, manikúra...)"}
                                    className={styles.searchInput}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className={styles.citySelectWrapper}>
                                <span className={styles.inputIcon}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                </span>
                                <Select
                                    options={[{ value: '', label: t?.hero.allCities || 'Všetky mestá' }, ...cities]}
                                    value={selectedCity}
                                    onChange={setSelectedCity}
                                    placeholder={t?.hero.allCities || 'Všetky mestá'}
                                    searchable
                                    className={styles.citySelect}
                                />
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
