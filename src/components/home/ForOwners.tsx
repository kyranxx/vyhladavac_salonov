import Link from 'next/link';
import styles from './ForOwners.module.css';

const benefitsByLocale: Record<string, Array<{ icon: string; title: string; description: string }>> = {
    sk: [
        { icon: '🆓', title: 'Zadarmo', description: 'Základný profil úplne zadarmo' },
        { icon: '👀', title: 'Viditeľnosť', description: 'Tisíce potenciálnych zákazníkov' },
        { icon: '⭐', title: 'Hodnotenia', description: 'Budujte si reputáciu' },
        { icon: '📈', title: 'Štatistiky', description: 'Sledujte návštevnosť' },
    ],
    en: [
        { icon: '🆓', title: 'Free', description: 'Basic profile completely free' },
        { icon: '👀', title: 'Visibility', description: 'Thousands of potential customers' },
        { icon: '⭐', title: 'Reviews', description: 'Build your reputation' },
        { icon: '📈', title: 'Analytics', description: 'Track your traffic' },
    ],
    hu: [
        { icon: '🆓', title: 'Ingyenes', description: 'Alap profil teljesen ingyenes' },
        { icon: '👀', title: 'Láthatóság', description: 'Több ezer potenciális ügyfél' },
        { icon: '⭐', title: 'Értékelések', description: 'Építse fel hírnevét' },
        { icon: '📈', title: 'Statisztikák', description: 'Kövesse a forgalmat' },
    ],
};

const textsByLocale: Record<string, { badge: string; title: string; free: string; subtitle: string; addFree: string; learnMore: string; yourSalon: string; reviews: string; viewsMonth: string; phoneCalls: string; verified: string }> = {
    sk: { badge: 'Pre majiteľov salónov', title: 'Pridajte svoj salón', free: 'zadarmo', subtitle: 'Získajte nových zákazníkov a zvýšte viditeľnosť vášho salónu. Registrácia trvá len 2 minúty.', addFree: 'Pridať salón zadarmo', learnMore: 'Zistiť viac', yourSalon: 'Váš salón', reviews: 'hodnotení', viewsMonth: 'zobrazení/mesiac', phoneCalls: 'kliknutí na telefón', verified: 'Overený' },
    en: { badge: 'For Salon Owners', title: 'Add Your Salon', free: 'for free', subtitle: 'Get new customers and increase the visibility of your salon. Registration takes only 2 minutes.', addFree: 'Add salon for free', learnMore: 'Learn more', yourSalon: 'Your Salon', reviews: 'reviews', viewsMonth: 'views/month', phoneCalls: 'phone clicks', verified: 'Verified' },
    hu: { badge: 'Szalontulajdonosoknak', title: 'Add hozzá a szalont', free: 'ingyen', subtitle: 'Szerezzen új ügyfeleket és növelje szalonjának láthatóságát. A regisztráció csak 2 percet vesz igénybe.', addFree: 'Szalon hozzáadása ingyen', learnMore: 'Tudj meg többet', yourSalon: 'A te szalonod', reviews: 'értékelés', viewsMonth: 'megtekintés/hónap', phoneCalls: 'telefonos kattintás', verified: 'Ellenőrzött' },
};

interface ForOwnersProps {
    locale?: string;
}

export function ForOwners({ locale = 'sk' }: ForOwnersProps) {
    const benefits = benefitsByLocale[locale] || benefitsByLocale.sk;
    const texts = textsByLocale[locale] || textsByLocale.sk;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.text}>
                        <span className={styles.badge}>{texts.badge}</span>
                        <h2 className={styles.title}>
                            {texts.title} <span className={styles.highlight}>{texts.free}</span>
                        </h2>
                        <p className={styles.subtitle}>
                            {texts.subtitle}
                        </p>

                        <div className={styles.benefits}>
                            {benefits.map((benefit) => (
                                <div key={benefit.title} className={styles.benefit}>
                                    <span className={styles.benefitIcon}>{benefit.icon}</span>
                                    <div>
                                        <strong>{benefit.title}</strong>
                                        <p>{benefit.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.actions}>
                            <Link href="/registracia" className={styles.primaryButton}>
                                {texts.addFree}
                            </Link>
                            <Link href="/pre-majitelov" className={styles.secondaryButton}>
                                {texts.learnMore}
                            </Link>
                        </div>
                    </div>

                    <div className={styles.visual}>
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <span className={styles.cardLogo}>💇</span>
                                <div>
                                    <h3 className={styles.cardName}>{texts.yourSalon}</h3>
                                    <span className={styles.cardRating}>⭐ 4.9 (128 {texts.reviews})</span>
                                </div>
                                <span className={styles.verifiedBadge}>✓ {texts.verified}</span>
                            </div>
                            <div className={styles.cardStats}>
                                <div className={styles.cardStat}>
                                    <span className={styles.cardStatNumber}>1,234</span>
                                    <span className={styles.cardStatLabel}>{texts.viewsMonth}</span>
                                </div>
                                <div className={styles.cardStat}>
                                    <span className={styles.cardStatNumber}>89</span>
                                    <span className={styles.cardStatLabel}>{texts.phoneCalls}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
