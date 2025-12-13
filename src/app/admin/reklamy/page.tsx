'use client';

import styles from './page.module.css';

export default function AdminAdsPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Reklamy</h1>
                    <p className={styles.subtitle}>Správa bannerových reklám</p>
                </div>
                <button className={styles.addButton}>+ Pridať reklamu</button>
            </div>

            <div className={styles.content}>
                <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>📢</span>
                    <h3>Žiadne aktívne reklamy</h3>
                    <p>Pridajte bannerovú reklamu pre dodatočný príjem.</p>
                </div>
            </div>
        </div>
    );
}
