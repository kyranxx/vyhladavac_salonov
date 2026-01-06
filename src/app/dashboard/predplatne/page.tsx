'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { useToast } from '@/components/ui/Toast';
import styles from './page.module.css';

interface SalonOption {
    id: string;
    name: string;
    tier: string;
    is_verified: boolean;
    is_featured: boolean;
    featured_until?: string;
    verified_until?: string;
}

interface ActiveSubscription {
    id: string;
    type: string;
    status: string;
    start_date: string;
    end_date: string;
    amount_paid?: number;
    stripe_subscription_id?: string;
}

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

function SubscriptionContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState<string | null>(null);
    const [managingPortal, setManagingPortal] = useState(false);
    const [canceling, setCanceling] = useState(false);
    const [currentTier, setCurrentTier] = useState<string>('free');
    const [salonId, setSalonId] = useState<string | null>(null);
    const [salons, setSalons] = useState<SalonOption[]>([]);
    const [activeSubscription, setActiveSubscription] = useState<ActiveSubscription | null>(null);
    const [_isVerified, setIsVerified] = useState(false);
    const [_isFeatured, setIsFeatured] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const toast = useToast();

    // Check for success/cancel URL params
    useEffect(() => {
        if (searchParams.get('success') === 'true') {
            setMessage({
                type: 'success',
                text: '🎉 Platba bola úspešná! Váš prémiový plán je teraz aktívny.',
            });
            // Reload subscription status after successful payment
            if (user) {
                loadSubscriptionStatus();
            }
        } else if (searchParams.get('canceled') === 'true') {
            setMessage({
                type: 'error',
                text: 'Platba bola zrušená. Môžete to skúsiť znova.',
            });
        }
    }, [searchParams]);

    // Load current subscription status
    useEffect(() => {
        if (user) {
            loadSubscriptionStatus();
        }
    }, [user]);

    const loadSubscriptionStatus = async () => {
        const supabase = createBrowserSupabaseClient();
        if (!supabase || !user) return;

        // Admin emails get premium for free
        const adminEmails = ['blanarikdaniel@gmail.com'];
        if (user.email && adminEmails.includes(user.email)) {
            setCurrentTier('premium');

            // Also update their salon tier in database if they have one
            try {
                const { data: userSalons } = await supabase
                    .from('salons')
                    .select('id, name, tier, is_verified, is_featured')
                    .eq('owner_id', user.id);

                if (userSalons && userSalons.length > 0) {
                    setSalons(userSalons);
                    setSalonId(userSalons[0].id);
                    setIsVerified(true);
                    setIsFeatured(true);

                    // Update all salons to premium
                    await supabase
                        .from('salons')
                        .update({ tier: 'premium', is_featured: true, is_verified: true })
                        .eq('owner_id', user.id);
                }
            } catch {
                // Ignore if no salon
            }
            return;
        }

        try {
            // Get all user's salons
            const { data: userSalons } = await supabase
                .from('salons')
                .select('id, name, tier, is_verified, is_featured, featured_until, verified_until')
                .eq('owner_id', user.id);

            if (userSalons && userSalons.length > 0) {
                setSalons(userSalons);
                // Default to first salon
                const firstSalon = userSalons[0];
                setSalonId(firstSalon.id);
                setCurrentTier(firstSalon.tier || 'free');
                setIsVerified(firstSalon.is_verified || false);
                setIsFeatured(firstSalon.is_featured || false);

                // Fetch active subscription for this salon
                try {
                    const response = await fetch(`/api/subscriptions/status?userId=${user.id}&salonId=${firstSalon.id}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.activeSubscription) {
                            setActiveSubscription(data.activeSubscription);
                        }
                    }
                } catch {
                    // Ignore subscription fetch errors
                }
            }
        } catch {
            // User might not have a salon yet
        }
    };

    const handleSalonChange = (newSalonId: string) => {
        setSalonId(newSalonId);
        const salon = salons.find(s => s.id === newSalonId);
        if (salon) {
            setCurrentTier(salon.tier || 'free');
            setIsVerified(salon.is_verified || false);
            setIsFeatured(salon.is_featured || false);
        }
    };

    const handleSubscribe = async (priceId: string | null, planName: string, type?: string) => {
        if (!priceId) return;
        if (!user) {
            toast.error('Musíte byť prihlásený pre zakúpenie predplatného.');
            return;
        }
        if (!salonId) {
            toast.error('Najprv musíte zaregistrovať salón v sekcii "Môj salón".');
            return;
        }

        setLoading(planName);
        setMessage(null);

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId,
                    salonId,
                    userId: user.id,
                    type: type || (planName.includes('premium') ? 'premium' : planName.toLowerCase()),
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
            setMessage({
                type: 'error',
                text: 'Nepodarilo sa vytvoriť platbu. Skúste to znova.',
            });
        } finally {
            setLoading(null);
        }
    };

    const handleManagePortal = async () => {
        if (!user) {
            toast.error('Musíte byť prihlásený.');
            return;
        }

        setManagingPortal(true);
        try {
            const response = await fetch('/api/subscriptions/portal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    returnUrl: window.location.href,
                }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Failed to open portal');
            }
        } catch (error) {
            console.error('Portal error:', error);
            toast.error('Nepodarilo sa otvoriť správu predplatného.');
        } finally {
            setManagingPortal(false);
        }
    };

    const handleCancelSubscription = async () => {
        if (!user || !activeSubscription) {
            toast.error('Žiadna aktívna podpiska na zrušenie.');
            return;
        }

        if (!window.confirm('Naozaj chcete zrušiť predplatné? Prístup zostane aktívny do konca fakturačného obdobia.')) {
            return;
        }

        setCanceling(true);
        try {
            const response = await fetch('/api/subscriptions/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subscriptionId: activeSubscription.id,
                    userId: user.id,
                    cancelAtPeriodEnd: true,
                }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Predplatné bolo zrušené. Prístup zostáva aktívny do ' + new Date(data.currentPeriodEnd).toLocaleDateString('sk-SK'));
                setActiveSubscription({ ...activeSubscription, status: 'canceling' });
            } else {
                throw new Error(data.error || 'Failed to cancel');
            }
        } catch (error) {
            console.error('Cancel error:', error);
            toast.error('Nepodarilo sa zrušiť predplatné.');
        } finally {
            setCanceling(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Predplatné</h1>
                <p className={styles.subtitle}>Vyberte si plán, ktorý vám vyhovuje</p>
            </div>

            {/* Success/Error Message */}
            {message && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}

            {/* Salon Selector for Multi-Salon Users */}
            {salons.length > 1 && (
                <div className={styles.salonSelector}>
                    <label htmlFor="salon-select">Vybrať salón:</label>
                    <select
                        id="salon-select"
                        value={salonId || ''}
                        onChange={(e) => handleSalonChange(e.target.value)}
                        className={styles.salonSelect}
                    >
                        {salons.map((salon) => (
                            <option key={salon.id} value={salon.id}>
                                {salon.name} ({salon.tier === 'premium' ? 'Premium' : 'Základný'})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className={styles.content}>
                {/* Active Subscription Management */}
                {activeSubscription && activeSubscription.status === 'active' && (
                    <div className={styles.activeSubscription}>
                        <div className={styles.activeHeader}>
                            <div className={styles.activeIcon}>✨</div>
                            <div>
                                <h3 className={styles.activeTitle}>Aktívne predplatné</h3>
                                <p className={styles.activeType}>
                                    {activeSubscription.type === 'premium' ? 'Premium' :
                                        activeSubscription.type === 'featured' ? 'Zvýraznený salón' :
                                            activeSubscription.type === 'verified' ? 'Overený salón' : activeSubscription.type}
                                </p>
                            </div>
                        </div>
                        <div className={styles.activeDetails}>
                            <div className={styles.activeDetailItem}>
                                <span className={styles.activeLabel}>Platné od:</span>
                                <span>{new Date(activeSubscription.start_date).toLocaleDateString('sk-SK')}</span>
                            </div>
                            <div className={styles.activeDetailItem}>
                                <span className={styles.activeLabel}>Platné do:</span>
                                <span>{new Date(activeSubscription.end_date).toLocaleDateString('sk-SK')}</span>
                            </div>
                            {activeSubscription.amount_paid && (
                                <div className={styles.activeDetailItem}>
                                    <span className={styles.activeLabel}>Zaplatené:</span>
                                    <span>{activeSubscription.amount_paid}€</span>
                                </div>
                            )}
                        </div>
                        <div className={styles.activeActions}>
                            <button
                                className={styles.manageButton}
                                onClick={handleManagePortal}
                                disabled={managingPortal}
                            >
                                {managingPortal ? 'Otváram...' : '⚙️ Spravovať predplatné'}
                            </button>
                            <button
                                className={styles.cancelButton}
                                onClick={handleCancelSubscription}
                                disabled={canceling}
                            >
                                {canceling ? 'Ruším...' : '❌ Zrušiť predplatné'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Canceling notice */}
                {activeSubscription && activeSubscription.status === 'canceling' && (
                    <div className={styles.cancelingNotice}>
                        <span>⚠️</span>
                        <p>
                            Vaše predplatné bolo zrušené. Prístup k prémiovým funkciám zostáva aktívny do{' '}
                            <strong>{new Date(activeSubscription.end_date).toLocaleDateString('sk-SK')}</strong>.
                        </p>
                    </div>
                )}

                {/* Pricing Plans */}
                <div className={styles.plansGrid}>
                    {plans.map((plan) => {
                        const isCurrent = (plan.id === 'free' && currentTier === 'free') ||
                            (plan.id.includes('premium') && currentTier === 'premium');
                        return (
                            <div
                                key={plan.id}
                                className={`${styles.planCard} ${plan.recommended ? styles.recommended : ''} ${isCurrent ? styles.current : ''}`}
                            >
                                {plan.recommended && (
                                    <span className={styles.recommendedBadge}>Odporúčané</span>
                                )}
                                {isCurrent && (
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
                                    className={isCurrent ? styles.currentButton : styles.selectButton}
                                    disabled={isCurrent || loading === plan.name || !plan.priceId}
                                    onClick={() => handleSubscribe(plan.priceId, plan.name, 'premium')}
                                >
                                    {loading === plan.name ? 'Načítavam...' : isCurrent ? 'Aktívny' : plan.priceId ? 'Objednať' : 'Základný plán'}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* IMPORTANT: Add-ons Section - Featured and Verified */}
                <div className={styles.addonsSection}>
                    <h2 className={styles.sectionTitle}>🌟 Zvýšte viditeľnosť vášho salónu</h2>
                    <p className={styles.sectionSubtitle}>Tieto doplnky vám pomôžu získať viac zákazníkov</p>
                    <div className={styles.addonsGrid}>
                        {addons.map((addon) => (
                            <div key={addon.id} className={styles.addonCard}>
                                <div className={styles.addonIcon}>
                                    {addon.id === 'featured' ? '⭐' : '✅'}
                                </div>
                                <div className={styles.addonInfo}>
                                    <h4 className={styles.addonName}>{addon.name}</h4>
                                    <p className={styles.addonDescription}>{addon.description}</p>
                                </div>
                                <div className={styles.addonPriceRow}>
                                    <div className={styles.addonPrice}>
                                        <span>{addon.price}</span>
                                        <span className={styles.addonPeriod}>{addon.period}</span>
                                    </div>
                                    <button
                                        className={styles.addonButton}
                                        onClick={() => handleSubscribe(addon.priceId, addon.name, addon.id)}
                                        disabled={loading === addon.name}
                                    >
                                        {loading === addon.name ? 'Načítavam...' : 'Kúpiť teraz'}
                                    </button>
                                </div>
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

export default function SubscriptionPage() {
    return (
        <Suspense fallback={<div className={styles.loading}>Načítavam...</div>}>
            <SubscriptionContent />
        </Suspense>
    );
}
