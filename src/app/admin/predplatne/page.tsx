'use client';

import { useState, useEffect } from 'react';
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
    };
}

export default function AdminSubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);

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

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('sk-SK');
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
                <p className={styles.subtitle}>Správa aktívnych predplatných ({subscriptions.length})</p>
            </div>

            <div className={styles.content}>
                {subscriptions.length > 0 ? (
                    <>
                        {/* Mobile Card Layout */}
                        <div className={styles.cardList}>
                            {subscriptions.map((sub) => (
                                <div key={sub.id} className={styles.subCard}>
                                    <div className={styles.subCardHeader}>
                                        <span className={styles.subCardName}>
                                            {sub.salons?.name || 'Neznámy salón'}
                                        </span>
                                        {getStatusBadge(sub.status)}
                                    </div>
                                    <div className={styles.subCardMeta}>
                                        <span className={styles.planBadge}>{getPlanName(sub.plan_type)}</span>
                                        <span>{formatDate(sub.current_period_start)} – {formatDate(sub.current_period_end)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table Layout */}
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Salón</th>
                                        <th>Plán</th>
                                        <th>Stav</th>
                                        <th>Obdobie od</th>
                                        <th>Obdobie do</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscriptions.map((sub) => (
                                        <tr key={sub.id}>
                                            <td>{sub.salons?.name || 'Neznámy salón'}</td>
                                            <td>{getPlanName(sub.plan_type)}</td>
                                            <td>{getStatusBadge(sub.status)}</td>
                                            <td>{formatDate(sub.current_period_start)}</td>
                                            <td>{formatDate(sub.current_period_end)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>💳</span>
                        <h3>Žiadne predplatné</h3>
                        <p>Zatiaľ neboli zakúpené žiadne prémiové plány.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
