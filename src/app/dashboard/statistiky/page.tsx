'use client';

import styles from './page.module.css';

export default function StatisticsPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Štatistiky</h1>
                <p className={styles.subtitle}>Prehľad návštevnosti a interakcií vášho salónu</p>
            </div>

            <div className={styles.content}>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>👁️</span>
                        <div className={styles.statValue}>0</div>
                        <div className={styles.statLabel}>Zobrazenia profilu</div>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>📞</span>
                        <div className={styles.statValue}>0</div>
                        <div className={styles.statLabel}>Kliknutia na telefón</div>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>🌐</span>
                        <div className={styles.statValue}>0</div>
                        <div className={styles.statLabel}>Kliknutia na web</div>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>📅</span>
                        <div className={styles.statValue}>0</div>
                        <div className={styles.statLabel}>Rezervácie</div>
                    </div>
                </div>

                <div className={styles.notice}>
                    <p>📊 Štatistiky sa začnú zobrazovať po zaregistrovaní a schválení vášho salónu.</p>
                </div>
            </div>
        </div>
    );
}
