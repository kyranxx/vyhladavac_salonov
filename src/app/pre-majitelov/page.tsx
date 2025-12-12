import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Pre majiteľov salónov | Salon Finder SK',
    description: 'Pridajte svoj salón zadarmo a získajte nových zákazníkov. Zvýšte viditeľnosť vášho salónu na najväčšom katalógu krásy na Slovensku.',
};

const benefits = [
    {
        icon: '🆓',
        title: 'Základný profil zadarmo',
        description: 'Vytvorte si profil vášho salónu úplne bezplatne. Žiadne skryté poplatky.',
    },
    {
        icon: '👥',
        title: 'Tisíce potenciálnych zákazníkov',
        description: 'Každý mesiac nás navštívia tisíce ľudí hľadajúcich salóny krásy.',
    },
    {
        icon: '📱',
        title: 'Mobilná optimalizácia',
        description: 'Váš profil vyzerá perfektne na všetkých zariadeniach - mobile, tablete aj počítači.',
    },
    {
        icon: '⭐',
        title: 'Hodnotenia a recenzie',
        description: 'Zákazníci môžu hodnotiť váš salón a písať recenzie. Budujte si reputáciu.',
    },
    {
        icon: '📊',
        title: 'Štatistiky návštevnosti',
        description: 'Sledujte koľko ľudí si prezrelo váš profil a kliklo na kontakt.',
    },
    {
        icon: '🔍',
        title: 'SEO optimalizácia',
        description: 'Váš salón bude viditeľný vo vyhľadávačoch ako Google.',
    },
];

const steps = [
    {
        number: '1',
        title: 'Zaregistrujte sa',
        description: 'Vytvorte si účet pomocou e-mailu. Trvá to len 30 sekúnd.',
    },
    {
        number: '2',
        title: 'Vyplňte profil',
        description: 'Pridajte informácie o vašom salóne, služby, fotky a otváracie hodiny.',
    },
    {
        number: '3',
        title: 'Čakajte na schválenie',
        description: 'Náš tím skontroluje váš profil a schváli ho do 24 hodín.',
    },
    {
        number: '4',
        title: 'Získajte zákazníkov',
        description: 'Váš salón je online! Zákazníci vás môžu nájsť a kontaktovať.',
    },
];

export default function ForOwnersPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Hero */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <span className={styles.heroBadge}>Pre majiteľov salónov</span>
                        <h1 className={styles.heroTitle}>
                            Pridajte svoj salón <span className={styles.highlight}>zadarmo</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Získajte nových zákazníkov a zvýšte viditeľnosť vášho salónu na najväčšom
                            katalógu krásy na Slovensku. Registrácia trvá len 2 minúty.
                        </p>
                        <div className={styles.heroCta}>
                            <Link href="/registracia" className={styles.primaryButton}>
                                Pridať salón zadarmo
                            </Link>
                            <Link href="/cennik" className={styles.secondaryButton}>
                                Pozrieť cenník
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className={styles.section}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Prečo sa pridať?</h2>
                        <div className={styles.benefitsGrid}>
                            {benefits.map((benefit, index) => (
                                <div key={index} className={styles.benefitCard}>
                                    <span className={styles.benefitIcon}>{benefit.icon}</span>
                                    <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                                    <p className={styles.benefitDescription}>{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className={styles.sectionAlt}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Ako to funguje?</h2>
                        <div className={styles.stepsGrid}>
                            {steps.map((step) => (
                                <div key={step.number} className={styles.stepCard}>
                                    <span className={styles.stepNumber}>{step.number}</span>
                                    <h3 className={styles.stepTitle}>{step.title}</h3>
                                    <p className={styles.stepDescription}>{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className={styles.ctaSection}>
                    <div className={styles.container}>
                        <div className={styles.ctaCard}>
                            <h2 className={styles.ctaTitle}>Pripravení začať?</h2>
                            <p className={styles.ctaDescription}>
                                Pridajte svoj salón ešte dnes a začnite získavať nových zákazníkov.
                            </p>
                            <Link href="/registracia" className={styles.ctaButton}>
                                Pridať salón zadarmo →
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
