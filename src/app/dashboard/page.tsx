'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import styles from './page.module.css';

interface Salon {
    id: string;
    name: string;
    status: string;
    tier: string;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [salon, setSalon] = useState<Salon | null>(null);
    const [loadingSalon, setLoadingSalon] = useState(true);

    useEffect(() => {
        if (user) {
            loadUserSalon();
        }
    }, [user]);

    const loadUserSalon = async () => {
        const supabase = createBrowserSupabaseClient();
        if (!supabase || !user) return;

        try {
            const { data, error } = await supabase
                .from('salons')
                .select('id, name, status, tier')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setSalon(data);
            }
        } catch (err) {
            // No salon found is not an error
        } finally {
            setLoadingSalon(false);
        }
    };

    const getSalonStatus = () => {
        if (loadingSalon) {
            return { text: 'Načítavam...', class: styles.statusBadgeLoading };
        }
        if (!salon) {
            return { text: 'Nemáte salón', class: styles.statusBadge };
        }
        switch (salon.status) {
            case 'approved':
                return { text: 'Aktívny ✓', class: styles.statusBadgeActive };
            case 'pending':
                return { text: 'Čaká na schválenie', class: styles.statusBadgePending };
            case 'rejected':
                return { text: 'Zamietnutý', class: styles.statusBadgeRejected };
            default:
                return { text: salon.status, class: styles.statusBadge };
        }
    };

    const getSubscriptionStatus = () => {
        if (!salon) return 'Žiadne';
        if (salon.tier === 'premium') return 'Premium ⭐';
        return 'Základné (zadarmo)';
    };

    const status = getSalonStatus();

    return (
        <div className={styles.dashboard}>
            <h1 className={styles.title}>Prehľad</h1>
            <p className={styles.subtitle}>Vitajte, {user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'používateľ'}!</p>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>👁️</span>
                    <div>
                        <span className={styles.statValue}>0</span>
                        <span className={styles.statLabel}>Zobrazenia profilu</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>📞</span>
                    <div>
                        <span className={styles.statValue}>0</span>
                        <span className={styles.statLabel}>Kliknutia na telefón</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>🌐</span>
                    <div>
                        <span className={styles.statValue}>0</span>
                        <span className={styles.statLabel}>Kliknutia na web</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>⭐</span>
                    <div>
                        <span className={styles.statValue}>0</span>
                        <span className={styles.statLabel}>Hodnotenia</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Rýchle akcie</h2>
                <div className={styles.actionsGrid}>
                    <Link href="/dashboard/moj-salon" className={styles.actionCard}>
                        <span className={styles.actionIcon}>✏️</span>
                        <span className={styles.actionLabel}>{salon ? 'Upraviť salón' : 'Pridať salón'}</span>
                    </Link>
                    <Link href="/dashboard/fotky" className={styles.actionCard}>
                        <span className={styles.actionIcon}>📷</span>
                        <span className={styles.actionLabel}>Pridať fotky</span>
                    </Link>
                    <Link href="/dashboard/sluzby" className={styles.actionCard}>
                        <span className={styles.actionIcon}>📋</span>
                        <span className={styles.actionLabel}>Spravovať služby</span>
                    </Link>
                    <Link href="/dashboard/predplatne" className={styles.actionCard}>
                        <span className={styles.actionIcon}>⭐</span>
                        <span className={styles.actionLabel}>Prejsť na Premium</span>
                    </Link>
                </div>
            </div>

            {/* Salon Status */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Stav salónu</h2>
                <div className={styles.statusCard}>
                    <div className={styles.statusItem}>
                        <span className={styles.statusLabel}>Stav salónu</span>
                        <span className={status.class}>{status.text}</span>
                    </div>
                    <div className={styles.statusItem}>
                        <span className={styles.statusLabel}>Predplatné</span>
                        <span className={salon?.tier === 'premium' ? styles.statusBadgePremium : styles.statusBadgeBasic}>
                            {getSubscriptionStatus()}
                        </span>
                    </div>

                    {/* Contextual help based on salon state */}
                    {!salon && (
                        <div className={styles.statusHint}>
                            <p><strong>Ešte nemáte salón</strong></p>
                            <p>
                                <Link href="/dashboard/moj-salon">Zaregistrujte svoj salón</Link> a začnite získavať zákazníkov.
                            </p>
                        </div>
                    )}
                    {salon?.status === 'pending' && (
                        <div className={styles.statusHintPending}>
                            <p><strong>🕐 Čaká na schválenie</strong></p>
                            <p>Váš salón čaká na schválenie administrátorom. Zvyčajne to trvá do 24 hodín.</p>
                        </div>
                    )}
                    {salon?.status === 'approved' && salon?.tier !== 'premium' && (
                        <div className={styles.statusHintSuccess}>
                            <p><strong>✓ Váš salón je aktívny</strong></p>
                            <p>
                                <Link href="/dashboard/predplatne">Prejdite na Premium</Link> pre lepšiu viditeľnosť!
                            </p>
                        </div>
                    )}
                    {salon?.status === 'rejected' && (
                        <div className={styles.statusHintRejected}>
                            <p><strong>❌ Salón bol zamietnutý</strong></p>
                            <p>Kontaktujte nás pre viac informácií alebo <Link href="/dashboard/moj-salon">upravte údaje</Link>.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

