'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/Toast';
import styles from './page.module.css';

interface Subscription {
    id: string;
    salon_id: string;
    plan_type: string;
    stripe_subscription_id: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
    salons?: {
        name: string;
        display_id?: number;
    };
}

export default function AdminSubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const toast = useToast();

    useEffect(() => {
        loadSubscriptions();
    }, []);

    const loadSubscriptions = async () => {
        try {
            const response = await fetch('/api/admin/subscriptions');
            const data = await response.json();

            if (Array.isArray(data)) {
                setSubscriptions(data);
            } else {
                console.error('Error loading subscriptions:', data.error);
            }
        } catch (error) {
            console.error('Error loading subscriptions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExtend = async (subId: string, days: number) => {
        setActionLoading(subId);
        try {
            const response = await fetch('/api/admin/subscriptions/extend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscriptionId: subId, days })
            });

            if (response.ok) {
                toast.success(`Predplatné predĺžené o ${days} dní`);
                loadSubscriptions();
            } else {
                toast.error('Nepodarilo sa predĺžiť predplatné');
            }
        } catch {
            toast.error('Chyba pri predlžovaní');
        } finally {
            setActionLoading(null);
        }
    };

    const handleCancel = async (subId: string) => {
        if (!confirm('Naozaj chcete zrušiť toto predplatné?')) return;

        setActionLoading(subId);
        try {
            const response = await fetch('/api/admin/subscriptions/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscriptionId: subId })
            });

            if (response.ok) {
                toast.success('Predplatné bolo zrušené');
                loadSubscriptions();
            } else {
                toast.error('Nepodarilo sa zrušiť predplatné');
            }
        } catch {
            toast.error('Chyba pri rušení');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReactivate = async (subId: string) => {
        setActionLoading(subId);
        try {
            const response = await fetch('/api/admin/subscriptions/reactivate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscriptionId: subId })
            });

            if (response.ok) {
                toast.success('Predplatné bolo reaktivované');
                loadSubscriptions();
            } else {
                toast.error('Nepodarilo sa reaktivovať predplatné');
            }
        } catch {
            toast.error('Chyba pri reaktivácii');
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('sk-SK');
    };

    const getDaysRemaining = (endDate: string | null) => {
        if (!endDate) return null;
        const end = new Date(endDate);
        const now = new Date();
        const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className={styles.badgeActive}>Aktívne</span>;
            case 'canceled':
                return <span className={styles.badgeCanceled}>Zrušené</span>;
            case 'past_due':
                return <span className={styles.badgePastDue}>Po splatnosti</span>;
            default:
                return <span className={styles.badge}>{status}</span>;
        }
    };

    const getPlanName = (planType: string) => {
        switch (planType) {
            case 'premium_monthly':
                return 'Premium Mesačne';
            case 'premium_yearly':
                return 'Premium Ročne';
            case 'featured':
                return 'Zvýraznenie';
            case 'verified':
                return 'Overenie';
            default:
                return planType;
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Načítavam predplatné...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Predplatné</h1>
                <p className={styles.subtitle}>Správa aktívnych predplatných a manuálne úpravy</p>
            </div>

            {/* Stats */}
            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>{subscriptions.length}</span>
                    <span className={styles.statLabel}>Celkom</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>{subscriptions.filter(s => s.status === 'active').length}</span>
                    <span className={styles.statLabel}>Aktívne</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>{subscriptions.filter(s => s.status === 'canceled').length}</span>
                    <span className={styles.statLabel}>Zrušené</span>
                </div>
            </div>

            <div className={styles.content}>
                {subscriptions.length > 0 ? (
                    <div className={styles.subscriptionsList}>
                        {subscriptions.map((sub) => {
                            const daysRemaining = getDaysRemaining(sub.current_period_end);
                            const isExpiringSoon = daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0;
                            const isExpired = daysRemaining !== null && daysRemaining <= 0;

                            return (
                                <div key={sub.id} className={`${styles.subCard} ${isExpiringSoon ? styles.expiringSoon : ''} ${isExpired ? styles.expired : ''}`}>
                                    <div className={styles.subCardMain}>
                                        <div className={styles.subCardInfo}>
                                            <div className={styles.subCardHeader}>
                                                <span className={styles.subId}>#{sub.salons?.display_id || sub.id.slice(0, 8)}</span>
                                                <span className={styles.subCardName}>
                                                    {sub.salons?.name || 'Neznámy salón'}
                                                </span>
                                            </div>
                                            <div className={styles.subCardMeta}>
                                                <span className={styles.planBadge}>{getPlanName(sub.plan_type)}</span>
                                                {getStatusBadge(sub.status)}
                                            </div>
                                        </div>

                                        <div className={styles.subCardDates}>
                                            <div className={styles.dateRow}>
                                                <span className={styles.dateLabel}>Od:</span>
                                                <span className={styles.dateValue}>{formatDate(sub.current_period_start)}</span>
                                            </div>
                                            <div className={styles.dateRow}>
                                                <span className={styles.dateLabel}>Do:</span>
                                                <span className={`${styles.dateValue} ${isExpiringSoon ? styles.dateWarning : ''}`}>
                                                    {formatDate(sub.current_period_end)}
                                                    {daysRemaining !== null && daysRemaining > 0 && (
                                                        <span className={styles.daysLeft}>({daysRemaining} dní)</span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.subCardActions}>
                                        {sub.status === 'active' ? (
                                            <>
                                                <button
                                                    onClick={() => handleExtend(sub.id, 30)}
                                                    disabled={actionLoading === sub.id}
                                                    className={styles.extendBtn}
                                                >
                                                    +30 dní
                                                </button>
                                                <button
                                                    onClick={() => handleExtend(sub.id, 365)}
                                                    disabled={actionLoading === sub.id}
                                                    className={styles.extendBtn}
                                                >
                                                    +1 rok
                                                </button>
                                                <button
                                                    onClick={() => handleCancel(sub.id)}
                                                    disabled={actionLoading === sub.id}
                                                    className={styles.cancelBtn}
                                                >
                                                    Zrušiť
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleReactivate(sub.id)}
                                                disabled={actionLoading === sub.id}
                                                className={styles.reactivateBtn}
                                            >
                                                Reaktivovať
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                        </span>
                        <h3>Žiadne predplatné</h3>
                        <p>Zatiaľ neboli zakúpené žiadne prémiové plány.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
