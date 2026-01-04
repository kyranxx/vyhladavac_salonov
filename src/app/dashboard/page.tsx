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
            {salon?.status === 'approved' && (
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <span className={styles.statIconSvg}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        </span>
                        <div>
                            <span className={styles.statValue}>0</span>
                            <span className={styles.statLabel}>{t.profileViews}</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIconSvg}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                        </span>
                        <div>
                            <span className={styles.statValue}>0</span>
                            <span className={styles.statLabel}>{t.phoneClicks}</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIconSvg}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                        </span>
                        <div>
                            <span className={styles.statValue}>0</span>
                            <span className={styles.statLabel}>{t.webClicks}</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIconSvg}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        </span>
                        <div>
                            <span className={styles.statValue}>0</span>
                            <span className={styles.statLabel}>{t.ratings}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Salon Status Card */}
            <div className={styles.section}>
                <div className={styles.statusCard}>
                    <div className={styles.statusHeader}>
                        <h2 className={styles.sectionTitle}>{t.salonStatus}</h2>
                        <span className={status.class}>{status.text}</span>
                    </div>

                    {salon && (
                        <div className={styles.statusItem}>
                            <span className={styles.statusLabel}>{t.subscription}</span>
                            <span className={salon?.tier === 'premium' ? styles.statusBadgePremium : styles.statusBadgeBasic}>
                                {getSubscriptionStatus()}
                            </span>
                        </div>
                    )}

                    {/* Contextual help based on salon state */}
                    {!salon && (
                        <div className={styles.emptyStateCenter}>
                            <div className={styles.emptyIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                            </div>
                            <h3>{t.noSalonYet}</h3>
                            <p>{t.getCustomers}</p>
                            <Link href="/dashboard/moj-salon" className={styles.primaryButton}>
                                {t.registerSalon}
                            </Link>
                        </div>
                    )}
                    {salon?.status === 'pending' && (
                        <div className={styles.statusHintPending}>
                            <p><strong>{t.pendingApproval}</strong></p>
                            <p>{t.pendingApprovalDesc}</p>
                        </div>
                    )}
                    {salon?.status === 'approved' && salon?.tier !== 'premium' && (
                        <div className={styles.statusHintSuccess}>
                            <p><strong>{t.salonActive}</strong></p>
                            <p>
                                <Link href="/dashboard/predplatne">{t.upgradePremium}</Link>
                            </p>
                        </div>
                    )}
                    {salon?.status === 'rejected' && (
                        <div className={styles.statusHintRejected}>
                            <p><strong>{t.salonRejected}</strong></p>
                            <p>{t.contactUs} <Link href="/dashboard/moj-salon">{t.editSalon}</Link>.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
