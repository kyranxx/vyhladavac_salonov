'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface Stats {
    totalSalons: number;
    pendingSalons: number;
    approvedSalons: number;
    rejectedSalons: number;
    totalUsers: number;
    premiumSalons: number;
    todayViews: number;
    thisMonthSalons: number;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats>({
        totalSalons: 0,
        pendingSalons: 0,
        approvedSalons: 0,
        rejectedSalons: 0,
        totalUsers: 0,
        premiumSalons: 0,
        todayViews: 0,
        thisMonthSalons: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            // Load salons
            const salonsRes = await fetch('/api/admin/salons');
            const salons = await salonsRes.json();

            if (Array.isArray(salons)) {
                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

                setStats({
                    totalSalons: salons.length,
                    pendingSalons: salons.filter((s: { status: string }) => s.status === 'pending').length,
                    approvedSalons: salons.filter((s: { status: string }) => s.status === 'approved').length,
                    rejectedSalons: salons.filter((s: { status: string }) => s.status === 'rejected').length,
                    premiumSalons: salons.filter((s: { tier: string }) => s.tier === 'premium').length,
                    totalUsers: 0, // Would need separate API
                    todayViews: 0, // Would need analytics
                    thisMonthSalons: salons.filter((s: { created_at: string }) =>
                        new Date(s.created_at) >= startOfMonth
                    ).length,
                });
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.dashboard}>
            <h1 className={styles.title}>Admin Panel</h1>
            <p className={styles.subtitle}>Prehľad platformy Register salónov</p>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statIconSvg}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </span>
                    <div>
                        <span className={styles.statValue}>{loading ? '...' : stats.totalSalons}</span>
                        <span className={styles.statLabel}>Celkom salónov</span>
                    </div>
                </div>
                <div className={`${styles.statCard} ${stats.pendingSalons > 0 ? styles.statCardWarning : ''}`}>
                    <span className={styles.statIconSvg}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    </span>
                    <div>
                        <span className={styles.statValue}>{loading ? '...' : stats.pendingSalons}</span>
                        <span className={styles.statLabel}>Čakajúce na schválenie</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statIconSvg}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </span>
                    <div>
                        <span className={styles.statValue}>{loading ? '...' : stats.approvedSalons}</span>
                        <span className={styles.statLabel}>Schválené salóny</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statIconSvg}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </span>
                    <div>
                        <span className={styles.statValue}>{loading ? '...' : stats.premiumSalons}</span>
                        <span className={styles.statLabel}>Premium salóny</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statIconSvg}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    </span>
                    <div>
                        <span className={styles.statValue}>{loading ? '...' : stats.thisMonthSalons}</span>
                        <span className={styles.statLabel}>Nové tento mesiac</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statIconSvg}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                        </svg>
                    </span>
                    <div>
                        <span className={styles.statValue}>{loading ? '...' : stats.rejectedSalons}</span>
                        <span className={styles.statLabel}>Zamietnuté</span>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            {stats.pendingSalons > 0 && (
                <div className={styles.alertCard}>
                    <div className={styles.alertContent}>
                        <span className={styles.alertIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </span>
                        <div>
                            <strong>{stats.pendingSalons} salóny čakajú na schválenie</strong>
                            <p>Skontrolujte a schváľte nové registrácie</p>
                        </div>
                    </div>
                    <Link href="/admin/salony?status=pending" className={styles.alertButton}>
                        Zobraziť
                    </Link>
                </div>
            )}
        </div>
    );
}
