'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import styles from './page.module.css';

const plans = [
    {
        id: 'free',
        name: 'Základný',
        price: '0€',
        period: 'zadarmo',
        priceId: null,
        features: [
            'Základný profil salónu',
            'Kontaktné údaje',
            'Otváracie hodiny',
            '1 fotografia',
        ],
        current: true,
    },
    {
        id: 'premium-monthly',
        name: 'Premium Mesačné',
        price: '3€',
        period: '/mesiac',
        priceId: 'price_1SdXsFKD2JDE6csJ3JchrhQO',
        features: [
            'Všetko zo Základného',
            'Neobmedzené fotografie',
            'Zoznam služieb',
            'Odkaz na web',
            'Štatistiky návštevnosti',
            'Prioritné zobrazenie',
        ],
        recommended: true,
    },
    {
        id: 'premium-yearly',
        name: 'Premium Ročné',
        price: '30€',
        period: '/rok',
        priceId: 'price_1SdXsGKD2JDE6csJke2BCvt6',
        features: [
            'Všetko z Premium',
            '2 mesiace zadarmo',
            'Prednostná podpora',
        ],
        savings: 'Ušetríte 6€',
    },
];

const addons = [
    {
        id: 'featured',
        name: 'Zvýraznený salón',
        price: '5€',
        period: '/7 dní',
        priceId: 'price_1SdXsHKD2JDE6csJnTVz7dat',
        description: 'Váš salón bude zobrazený na vrchu výsledkov vyhľadávania.',
    },
    {
        id: 'verified',
        name: 'Overený salón',
        price: '20€',
        period: '/rok',
        priceId: 'price_1SdXsIKD2JDE6csJhaVQLqYl',
        description: 'Získajte zelený odznak overenia a zvýšte dôveryhodnosť.',
    },
];

export default function SubscriptionPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState<string | null>(null);

    const handleSubscribe = async (priceId: string | null, planName: string) => {
        if (!priceId) return;
        if (!user) {
            alert('Musíte byť prihlásený.');
            return;
        }

        setLoading(planName);

        try {
            const response = await fetch('/api/subscriptions/create-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId,
                    userEmail: user.email,
                    userId: user.id,
                    successUrl: `${window.location.origin}/dashboard/predplatne?success=true`,
                    cancelUrl: `${window.location.origin}/dashboard/predplatne?canceled=true`,
                }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Failed to create checkout session');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Nepodarilo sa vytvoriť platbu. Skúste to znova.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Predplatné</h1>
                <p className={styles.subtitle}>Vyberte si plán, ktorý vám vyhovuje</p>
            </div>

            <div className={styles.content}>
                {/* Pricing Plans */}
                <div className={styles.plansGrid}>
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`${styles.planCard} ${plan.recommended ? styles.recommended : ''} ${plan.current ? styles.current : ''}`}
                        >
                            {plan.recommended && (
                                <span className={styles.recommendedBadge}>Odporúčané</span>
                            )}
                            {plan.current && (
                                <span className={styles.currentBadge}>Aktuálny plán</span>
                            )}
                            {plan.savings && (
                                <span className={styles.savingsBadge}>{plan.savings}</span>
                            )}

                            <h3 className={styles.planName}>{plan.name}</h3>
                            <div className={styles.planPrice}>
                                <span className={styles.price}>{plan.price}</span>
                                <span className={styles.period}>{plan.period}</span>
                            </div>

                            <ul className={styles.featuresList}>
                                {plan.features.map((feature, index) => (
                                    <li key={index}>✓ {feature}</li>
                                ))}
                            </ul>

                            <button
                                className={plan.current ? styles.currentButton : styles.selectButton}
                                disabled={plan.current || loading === plan.name}
                                onClick={() => handleSubscribe(plan.priceId, plan.name)}
                            >
                                {loading === plan.name ? 'Načítavam...' : plan.current ? 'Aktívny' : 'Objednať'}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add-ons */}
                <div className={styles.addonsSection}>
                    <h2 className={styles.sectionTitle}>Doplnkové služby</h2>
                    <div className={styles.addonsGrid}>
                        {addons.map((addon) => (
                            <div key={addon.id} className={styles.addonCard}>
                                <div className={styles.addonInfo}>
                                    <h4 className={styles.addonName}>{addon.name}</h4>
                                    <p className={styles.addonDescription}>{addon.description}</p>
                                </div>
                                <div className={styles.addonPrice}>
                                    <span>{addon.price}</span>
                                    <span className={styles.addonPeriod}>{addon.period}</span>
                                </div>
                                <button
                                    className={styles.addonButton}
                                    onClick={() => handleSubscribe(addon.priceId, addon.name)}
                                    disabled={loading === addon.name}
                                >
                                    {loading === addon.name ? 'Načítavam...' : 'Kúpiť'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className={styles.infoBox}>
                    <p>💡 <strong>Ako to funguje:</strong> Po kliknutí na &quot;Objednať&quot; budete presmerovaní na bezpečnú platobnú stránku Stripe. Po úspešnej platbe sa váš plán automaticky aktivuje.</p>
                </div>
            </div>
        </div>
    );
}
