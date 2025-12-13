'use client';

import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import styles from './page.module.css';

export default function DashboardPage() {
    const { user } = useAuth();

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
                        <span className={styles.actionLabel}>Upraviť profil</span>
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
                        <span className={styles.statusLabel}>Stav profilu</span>
                        <span className={styles.statusBadge}>Neaktívny</span>
                    </div>
                    <div className={styles.statusItem}>
                        <span className={styles.statusLabel}>Predplatné</span>
                        <span className={styles.statusBadgeBasic}>Základné (zadarmo)</span>
                    </div>
                    <div className={styles.statusHint}>
                        <p><strong>🔴 Neaktívny</strong> = Váš salón ešte nie je viditeľný pre verejnosť.</p>
                        <p>Pre aktiváciu:</p>
                        <ol>
                            <li>Vyplňte údaje o salóne v sekcii <Link href="/dashboard/moj-salon">&quot;Môj salón&quot;</Link></li>
                            <li>Počkajte na schválenie administrátorom (zvyčajne do 24 hodín)</li>
                            <li>Po schválení sa váš salón zobrazí vo vyhľadávaní</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}
