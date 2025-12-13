'use client';

import styles from './page.module.css';

export default function AdminKategoriesPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Kategórie</h1>
                    <p className={styles.subtitle}>Správa kategórií salónov</p>
                </div>
                <button className={styles.addButton}>+ Pridať kategóriu</button>
            </div>

            <div className={styles.content}>
                <p>Stránka kategórií je v príprave.</p>
            </div>
        </div>
    );
}
