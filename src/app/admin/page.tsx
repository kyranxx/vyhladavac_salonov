import styles from './page.module.css';

export default function AdminDashboardPage() {
    return (
        <div className={styles.dashboard}>
            <h1 className={styles.title}>Admin Dashboard</h1>
            <p className={styles.subtitle}>Prehľad platformy Salon Finder SK</p>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>💇</span>
                    <div>
                        <span className={styles.statValue}>8</span>
                        <span className={styles.statLabel}>Celkom salónov</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>⏳</span>
                    <div>
                        <span className={styles.statValue}>0</span>
                        <span className={styles.statLabel}>Čakajúce na schválenie</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>👥</span>
                    <div>
                        <span className={styles.statValue}>0</span>
                        <span className={styles.statLabel}>Registrovaní používatelia</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>⭐</span>
                    <div>
                        <span className={styles.statValue}>0</span>
                        <span className={styles.statLabel}>Premium predplatné</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Rýchle akcie</h2>
                <div className={styles.actionsGrid}>
                    <a href="/admin/salony?status=pending" className={styles.actionCard}>
                        <span className={styles.actionIcon}>📋</span>
                        <span className={styles.actionLabel}>Schváliť salóny</span>
                    </a>
                    <a href="/admin/kategorie" className={styles.actionCard}>
                        <span className={styles.actionIcon}>📁</span>
                        <span className={styles.actionLabel}>Spravovať kategórie</span>
                    </a>
                    <a href="/admin/reklamy" className={styles.actionCard}>
                        <span className={styles.actionIcon}>📢</span>
                        <span className={styles.actionLabel}>Spravovať reklamy</span>
                    </a>
                    <a href="/admin/nastavenia" className={styles.actionCard}>
                        <span className={styles.actionIcon}>⚙️</span>
                        <span className={styles.actionLabel}>Nastavenia</span>
                    </a>
                </div>
            </div>

            {/* Recent Activity */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Posledná aktivita</h2>
                <div className={styles.emptyState}>
                    <span>📭</span>
                    <p>Zatiaľ žiadna aktivita</p>
                </div>
            </div>
        </div>
    );
}
