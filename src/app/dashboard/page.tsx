import styles from './page.module.css';

export default function DashboardPage() {
    return (
        <div className={styles.dashboard}>
            <h1 className={styles.title}>Prehľad</h1>
            <p className={styles.subtitle}>Vitajte v administrácii vášho salónu</p>

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
                    <a href="/dashboard/moj-salon" className={styles.actionCard}>
                        <span className={styles.actionIcon}>✏️</span>
                        <span className={styles.actionLabel}>Upraviť profil</span>
                    </a>
                    <a href="/dashboard/fotky" className={styles.actionCard}>
                        <span className={styles.actionIcon}>📷</span>
                        <span className={styles.actionLabel}>Pridať fotky</span>
                    </a>
                    <a href="/dashboard/sluzby" className={styles.actionCard}>
                        <span className={styles.actionIcon}>📋</span>
                        <span className={styles.actionLabel}>Spravovať služby</span>
                    </a>
                    <a href="/dashboard/predplatne" className={styles.actionCard}>
                        <span className={styles.actionIcon}>⭐</span>
                        <span className={styles.actionLabel}>Prejsť na Premium</span>
                    </a>
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
                    <p className={styles.statusHint}>
                        Vyplňte údaje o salóne a počkajte na schválenie prevádzkovateľom.
                    </p>
                </div>
            </div>
        </div>
    );
}
