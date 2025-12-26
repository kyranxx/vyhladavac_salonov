import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Cenník | Register salónov',
    description: 'Prehľad cien a balíčkov pre salóny. Základný profil zadarmo, Premium od 3€/mesiac.',
};

const plans = [
    {
        name: 'Základný',
        price: 'Zadarmo',
        period: 'navždy',
        description: 'Ideálne pre začiatok. Získajte základnú viditeľnosť.',
        features: [
            { text: 'Základný profil salónu', included: true },
            { text: 'Kontaktné údaje', included: true },
            { text: 'Adresa a mapa', included: true },
            { text: 'Kategórie služieb', included: true },
            { text: 'Do 5 fotografií', included: true },
            { text: 'Otváracie hodiny', included: true },
            { text: 'Prioritné zobrazenie', included: false },
            { text: 'Štatistiky návštevnosti', included: false },
            { text: 'Bez reklám na profile', included: false },
            { text: 'Odznaky Premium/Overený', included: false },
        ],
        cta: 'Zaregistrovať sa',
        ctaLink: '/registracia',
        popular: false,
    },
    {
        name: 'Premium',
        price: '3€',
        period: 'mesačne',
        yearlyPrice: '30€/rok (ušetríte 6€)',
        description: 'Pre salóny, ktoré chcú viac zákazníkov.',
        features: [
            { text: 'Všetko zo Základného', included: true },
            { text: 'Neobmedzené fotografie', included: true },
            { text: 'Prioritné zobrazenie vo výsledkoch', included: true },
            { text: 'Štatistiky návštevnosti', included: true },
            { text: 'Bez reklám na vašom profile', included: true },
            { text: 'Premium odznak', included: true },
            { text: 'Zvýraznenie v kategóriách', included: true },
            { text: 'Podpora cez email', included: true },
            { text: 'Zvýraznenie na homepage', included: false },
            { text: 'Overený odznak', included: false },
        ],
        cta: 'Vybrať Premium',
        ctaLink: '/registracia?plan=premium',
        popular: true,
    },
];

const addons = [
    {
        name: 'Zvýraznenie 7 dní',
        price: '5€',
        description: 'Váš salón sa zobrazí na vrchu výsledkov vyhľadávania na 7 dní.',
        icon: '⭐',
    },
    {
        name: 'Overený salón',
        price: '20€/rok',
        description: 'Zelený odznak "Overený" zvyšuje dôveryhodnosť vášho salónu.',
        icon: '✓',
    },
];

export default function PricingPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Hero */}
                <section className={styles.hero}>
                    <h1 className={styles.heroTitle}>Jednoduchý a transparentný cenník</h1>
                    <p className={styles.heroSubtitle}>
                        Vyberte si plán, ktorý vyhovuje vášmu salónu. Začnite zadarmo.
                    </p>
                </section>

                {/* Plans */}
                <section className={styles.plansSection}>
                    <div className={styles.container}>
                        <div className={styles.plansGrid}>
                            {plans.map((plan) => (
                                <div
                                    key={plan.name}
                                    className={`${styles.planCard} ${plan.popular ? styles.popular : ''}`}
                                >
                                    {plan.popular && (
                                        <span className={styles.popularBadge}>Najpopulárnejší</span>
                                    )}
                                    <h2 className={styles.planName}>{plan.name}</h2>
                                    <div className={styles.planPrice}>
                                        <span className={styles.priceValue}>{plan.price}</span>
                                        <span className={styles.pricePeriod}>/{plan.period}</span>
                                    </div>
                                    {plan.yearlyPrice && (
                                        <p className={styles.yearlyPrice}>{plan.yearlyPrice}</p>
                                    )}
                                    <p className={styles.planDescription}>{plan.description}</p>

                                    <ul className={styles.featuresList}>
                                        {plan.features.map((feature, index) => (
                                            <li
                                                key={index}
                                                className={feature.included ? styles.included : styles.excluded}
                                            >
                                                <span className={styles.featureIcon}>
                                                    {feature.included ? '✓' : '✗'}
                                                </span>
                                                {feature.text}
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href={plan.ctaLink}
                                        className={plan.popular ? styles.ctaPrimary : styles.ctaSecondary}
                                    >
                                        {plan.cta}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Add-ons */}
                <section className={styles.addonsSection}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Doplnkové služby</h2>
                        <div className={styles.addonsGrid}>
                            {addons.map((addon) => (
                                <div key={addon.name} className={styles.addonCard}>
                                    <span className={styles.addonIcon}>{addon.icon}</span>
                                    <div className={styles.addonContent}>
                                        <h3 className={styles.addonName}>{addon.name}</h3>
                                        <p className={styles.addonDescription}>{addon.description}</p>
                                    </div>
                                    <span className={styles.addonPrice}>{addon.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className={styles.faqSection}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Často kladené otázky</h2>
                        <div className={styles.faqGrid}>
                            <div className={styles.faqItem}>
                                <h3>Môžem zmeniť plán neskôr?</h3>
                                <p>Áno, svoj plán môžete kedykoľvek upgradovať alebo zrušiť.</p>
                            </div>
                            <div className={styles.faqItem}>
                                <h3>Ako funguje platba?</h3>
                                <p>Platby spracovávame bezpečne cez Stripe. Prijímame karty.</p>
                            </div>
                            <div className={styles.faqItem}>
                                <h3>Čo ak nie som spokojný?</h3>
                                <p>Ponúkame 14-dňovú garanciu vrátenia peňazí na Premium.</p>
                            </div>
                            <div className={styles.faqItem}>
                                <h3>Ako dlho trvá schválenie profilu?</h3>
                                <p>Profily schvaľujeme do 24 hodín od registrácie.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
