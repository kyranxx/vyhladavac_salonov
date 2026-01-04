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
                        <span className={styles.statIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        </span>
                        <div className={styles.statValue}>0</div>
                        <div className={styles.statLabel}>Zobrazenia profilu</div>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                        </span>
                        <div className={styles.statValue}>0</div>
                        <div className={styles.statLabel}>Kliknutia na telefón</div>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                        </span>
                        <div className={styles.statValue}>0</div>
                        <div className={styles.statLabel}>Kliknutia na web</div>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        </span>
                        <div className={styles.statValue}>0</div>
                        <div className={styles.statLabel}>Rezervácie</div>
                    </div>
                </div>

                <div className={styles.notice}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                    <p>Štatistiky sa začnú zobrazovať po zaregistrovaní a schválení vášho salónu.</p>
                </div>
            </div>
        </div>
    );
}
