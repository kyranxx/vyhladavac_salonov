import Link from 'next/link';
import styles from './PopularCities.module.css';

const cities = [
    { slug: 'bratislava', name: 'Bratislava', count: '450+', region: 'Bratislavský kraj' },
    { slug: 'kosice', name: 'Košice', count: '180+', region: 'Košický kraj' },
    { slug: 'zilina', name: 'Žilina', count: '95+', region: 'Žilinský kraj' },
    { slug: 'nitra', name: 'Nitra', count: '85+', region: 'Nitriansky kraj' },
    { slug: 'presov', name: 'Prešov', count: '75+', region: 'Prešovský kraj' },
    { slug: 'banska-bystrica', name: 'Banská Bystrica', count: '70+', region: 'Banskobystrický kraj' },
    { slug: 'trnava', name: 'Trnava', count: '60+', region: 'Trnavský kraj' },
    { slug: 'trencin', name: 'Trenčín', count: '55+', region: 'Trenčiansky kraj' },
];

const textsByLocale: Record<string, { title: string; subtitle: string; viewAll: string; salons: string }> = {
    sk: { title: 'Populárne mestá', subtitle: 'Nájdite salóny v najväčších slovenských mestách', viewAll: 'Zobraziť všetky mestá', salons: 'salónov' },
    en: { title: 'Popular Cities', subtitle: 'Find salons in the largest Slovak cities', viewAll: 'View all cities', salons: 'salons' },
    hu: { title: 'Népszerű városok', subtitle: 'Találj szalonokat a legnagyobb szlovák városokban', viewAll: 'Összes város', salons: 'szalon' },
};

interface PopularCitiesProps {
    locale?: string;
}

export function PopularCities({ locale = 'sk' }: PopularCitiesProps) {
    const texts = textsByLocale[locale] || textsByLocale.sk;
    const basePath = locale === 'sk' ? '' : `/${locale}`;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{texts.title}</h2>
                    <p className={styles.subtitle}>
                        {texts.subtitle}
                    </p>
                </div>

                <div className={styles.grid}>
                    {cities.map((city, index) => (
                        <Link
                            key={city.slug}
                            href={`${basePath}/salony/${city.slug}`}
                            className={`${styles.card} ${index === 0 ? styles.featured : ''}`}
                        >
                            <div className={styles.cardContent}>
                                <span className={styles.pin}>📍</span>
                                <h3 className={styles.cityName}>{city.name}</h3>
                                <p className={styles.region}>{city.region}</p>
                                <span className={styles.count}>{city.count} {texts.salons}</span>
                            </div>
                            <span className={styles.arrow}>→</span>
                        </Link>
                    ))}
                </div>

                <div className={styles.footer}>
                    <Link href={`${basePath}/mesta`} className={styles.viewAllButton}>
                        {texts.viewAll}
                        <span className={styles.arrowIcon}>→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
