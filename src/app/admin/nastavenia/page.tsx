'use client';

import styles from './page.module.css';

export default function AdminSettingsPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Nastavenia</h1>
                <p className={styles.subtitle}>Správa systémových nastavení</p>
            </div>

            <div className={styles.content}>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Všeobecné nastavenia</h2>
                    <p className={styles.sectionDescription}>
                        Táto sekcia bude obsahovať systémové nastavenia.
                    </p>
                </section>
            </div>
        </div>
    );
}
