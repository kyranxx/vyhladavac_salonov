'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { useDashboardTranslations } from '@/hooks/useTranslations';
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
    const t = useDashboardTranslations();

    useEffect(() => {
        if (user) {
            loadUserSalon();
        }
    }, [user]);

    const loadUserSalon = async () => {
        const supabase = createBrowserSupabaseClient();
        if (!supabase || !user) return;

        try {
            const { data } = await supabase
                .from('salons')
                .select('id, name, status, tier')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setSalon(data);
            }
        } catch (_err) {
            // No salon found is not an error
        } finally {
            setLoadingSalon(false);
        }
    };

    const getSalonStatus = () => {
        if (loadingSalon) {
            return { text: '...', class: styles.statusBadgeLoading };
        }
        if (!salon) {
            return { text: t.noSalon, class: styles.statusBadge };
        }
        switch (salon.status) {
            case 'approved':
                return { text: `${t.active} ✓`, class: styles.statusBadgeActive };
            case 'pending':
                return { text: t.pending, class: styles.statusBadgePending };
            case 'rejected':
                return { text: t.rejected, class: styles.statusBadgeRejected };
            default:
                return { text: salon.status, class: styles.statusBadge };
        }
    };

    const getSubscriptionStatus = () => {
        if (!salon) return t.noSalon;
        if (salon.tier === 'premium') return `${t.premium} ⭐`;
        return t.basic;
    };

    const status = getSalonStatus();

    return (
        <div className={styles.dashboard}>
            <h1 className={styles.title}>{t.title}</h1>
            <p className={styles.subtitle}>{t.welcome}, {user?.user_metadata?.first_name || user?.email?.split('@')[0] || ''}!</p>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>👁️</span>
                    <div>
                        <span className={styles.statValue}>0</span>
                        <span className={styles.statLabel}>{t.profileViews}</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>📞</span>
                    <div>
                        <span className={styles.statValue}>0</span>
                        <span className={styles.statLabel}>{t.phoneClicks}</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>🌐</span>
                    <div>
                        <span className={styles.statValue}>0</span>
                        <span className={styles.statLabel}>{t.webClicks}</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>⭐</span>
                    <div>
                        <span className={styles.statValue}>0</span>
                        <span className={styles.statLabel}>{t.ratings}</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t.quickActions}</h2>
                <div className={styles.actionsGrid}>
                    <Link href="/dashboard/moj-salon" className={styles.actionCard}>
                        <span className={styles.actionIcon}>✏️</span>
                        <span className={styles.actionLabel}>{salon ? t.editSalon : t.addSalon}</span>
                    </Link>
                    <Link href="/dashboard/fotky" className={styles.actionCard}>
                        <span className={styles.actionIcon}>📷</span>
                        <span className={styles.actionLabel}>{t.addPhotos}</span>
                    </Link>
                    <Link href="/dashboard/sluzby" className={styles.actionCard}>
                        <span className={styles.actionIcon}>📋</span>
                        <span className={styles.actionLabel}>{t.manageServices}</span>
                    </Link>
                    <Link href="/dashboard/predplatne" className={styles.actionCard}>
                        <span className={styles.actionIcon}>⭐</span>
                        <span className={styles.actionLabel}>{t.goPremium}</span>
                    </Link>
                </div>
            </div>

            {/* Salon Status */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t.salonStatus}</h2>
                <div className={styles.statusCard}>
                    <div className={styles.statusItem}>
                        <span className={styles.statusLabel}>{t.salonStatus}</span>
                        <span className={status.class}>{status.text}</span>
                    </div>
                    <div className={styles.statusItem}>
                        <span className={styles.statusLabel}>{t.subscription}</span>
                        <span className={salon?.tier === 'premium' ? styles.statusBadgePremium : styles.statusBadgeBasic}>
                            {getSubscriptionStatus()}
                        </span>
                    </div>

                    {/* Contextual help based on salon state */}
                    {!salon && (
                        <div className={styles.statusHint}>
                            <p><strong>{t.noSalonYet}</strong></p>
                            <p>
                                <Link href="/dashboard/moj-salon">{t.registerSalon}</Link> {t.getCustomers}
                            </p>
                        </div>
                    )}
                    {salon?.status === 'pending' && (
                        <div className={styles.statusHintPending}>
                            <p><strong>🕐 {t.pendingApproval}</strong></p>
                            <p>{t.pendingApprovalDesc}</p>
                        </div>
                    )}
                    {salon?.status === 'approved' && salon?.tier !== 'premium' && (
                        <div className={styles.statusHintSuccess}>
                            <p><strong>✓ {t.salonActive}</strong></p>
                            <p>
                                <Link href="/dashboard/predplatne">{t.upgradePremium}</Link>
                            </p>
                        </div>
                    )}
                    {salon?.status === 'rejected' && (
                        <div className={styles.statusHintRejected}>
                            <p><strong>❌ {t.salonRejected}</strong></p>
                            <p>{t.contactUs} <Link href="/dashboard/moj-salon">{t.editSalon}</Link>.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
