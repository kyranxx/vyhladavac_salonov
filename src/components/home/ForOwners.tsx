import Link from 'next/link';
import styles from './ForOwners.module.css';

const benefits = [
    { icon: '🆓', title: 'Zadarmo', description: 'Základný profil úplne zadarmo' },
    { icon: '👀', title: 'Viditeľnosť', description: 'Tisíce potenciálnych zákazníkov' },
    { icon: '⭐', title: 'Hodnotenia', description: 'Budujte si reputáciu' },
    { icon: '📈', title: 'Štatistiky', description: 'Sledujte návštevnosť' },
];

export function ForOwners() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.text}>
                        <span className={styles.badge}>Pre majiteľov salónov</span>
                        <h2 className={styles.title}>
                            Pridajte svoj salón <span className={styles.highlight}>zadarmo</span>
                        </h2>
                        <p className={styles.subtitle}>
                            Získajte nových zákazníkov a zvýšte viditeľnosť vášho salónu.
                            Registrácia trvá len 2 minúty.
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
                                Pridať salón zadarmo
                            </Link>
                            <Link href="/pre-majitelov" className={styles.secondaryButton}>
                                Zistiť viac
                            </Link>
                        </div>
                    </div>

                    <div className={styles.visual}>
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <span className={styles.cardLogo}>💇</span>
                                <div>
                                    <h3 className={styles.cardName}>Váš salón</h3>
                                    <span className={styles.cardRating}>⭐ 4.9 (128 hodnotení)</span>
                                </div>
                                <span className={styles.verifiedBadge}>✓ Overený</span>
                            </div>
                            <div className={styles.cardStats}>
                                <div className={styles.cardStat}>
                                    <span className={styles.cardStatNumber}>1,234</span>
                                    <span className={styles.cardStatLabel}>zobrazení/mesiac</span>
                                </div>
                                <div className={styles.cardStat}>
                                    <span className={styles.cardStatNumber}>89</span>
                                    <span className={styles.cardStatLabel}>kliknutí na telefón</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
