'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import styles from './page.module.css';

interface Salon {
    id: string;
    owner_id: string;
    name: string;
    status: string;
    tier: string;
    created_at: string;
}

interface UserWithSalon {
    owner_id: string;
    salon_name: string | null;
    salon_status: string | null;
    tier: string | null;
    created_at: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserWithSalon[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, withSalon: 0, premium: 0 });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const supabase = createBrowserSupabaseClient();
        if (!supabase) {
            setLoading(false);
            return;
        }

        try {
            // Get all salons with owner info - this gives us users who have salons
            const { data: salons } = await supabase
                .from('salons')
                .select('*')
                .order('created_at', { ascending: false });

            if (salons) {
                const usersData: UserWithSalon[] = salons.map((salon: Salon) => ({
                    owner_id: salon.owner_id,
                    salon_name: salon.name,
                    salon_status: salon.status,
                    tier: salon.tier,
                    created_at: salon.created_at,
                }));

                setUsers(usersData);
                setStats({
                    total: usersData.length,
                    withSalon: usersData.filter(u => u.salon_name).length,
                    premium: usersData.filter(u => u.tier === 'premium').length,
                });
            }
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('sk-SK', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusBadge = (status: string | null) => {
        switch (status) {
            case 'approved':
                return <span className={styles.badgeGreen}>Schválený</span>;
            case 'pending':
                return <span className={styles.badgeYellow}>Čaká</span>;
            case 'rejected':
                return <span className={styles.badgeRed}>Zamietnutý</span>;
            default:
                return <span className={styles.badgeGray}>—</span>;
        }
    };

    const getTierBadge = (tier: string | null) => {
        if (tier === 'premium') {
            return <span className={styles.badgePremium}>⭐ Premium</span>;
        }
        return <span className={styles.badgeGray}>Free</span>;
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Načítavam používateľov...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Používatelia</h1>
                    <p className={styles.subtitle}>Správa registrovaných používateľov a ich salónov</p>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>{stats.total}</span>
                    <span className={styles.statLabel}>Celkom salónov</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>{stats.withSalon}</span>
                    <span className={styles.statLabel}>Aktívnych</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>{stats.premium}</span>
                    <span className={styles.statLabel}>Premium</span>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.infoBox}>
                    <p>ℹ️ Pre kompletnú správu používateľov použite <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">Supabase Dashboard</a> → Authentication → Users</p>
                </div>

                {users.length > 0 ? (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Salón</th>
                                    <th>Stav</th>
                                    <th>Plán</th>
                                    <th>Vytvorený</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index}>
                                        <td className={styles.salonName}>{user.salon_name || '—'}</td>
                                        <td>{getStatusBadge(user.salon_status)}</td>
                                        <td>{getTierBadge(user.tier)}</td>
                                        <td>{formatDate(user.created_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>👥</span>
                        <h3>Žiadni používatelia</h3>
                        <p>Zatiaľ sa nezaregistroval žiadny používateľ so salónom.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
