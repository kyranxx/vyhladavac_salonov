'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function AdminSettingsPage() {
    const [siteName, setSiteName] = useState('Salon Finder SK');
    const [siteDescription, setSiteDescription] = useState('Nájdite najlepšie salóny krásy na Slovensku');
    const [contactEmail, setContactEmail] = useState('info@salonfinder.sk');
    const [autoApprove, setAutoApprove] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Všeobecné nastavenia</h1>
                <p className={styles.subtitle}>Konfigurácia stránky a systémové nastavenia</p>
            </div>

            {saved && (
                <div className={styles.successMessage}>
                    ✅ Nastavenia boli uložené!
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Základné informácie</h2>

                    <div className={styles.formGroup}>
                        <label htmlFor="siteName">Názov stránky</label>
                        <input
                            type="text"
                            id="siteName"
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="siteDescription">Popis stránky</label>
                        <textarea
                            id="siteDescription"
                            value={siteDescription}
                            onChange={(e) => setSiteDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="contactEmail">Kontaktný e-mail</label>
                        <input
                            type="email"
                            id="contactEmail"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Schvaľovanie salónov</h2>

                    <div className={styles.toggleGroup}>
                        <div className={styles.toggleInfo}>
                            <span className={styles.toggleLabel}>Automatické schvaľovanie</span>
                            <p>Nové salóny budú automaticky schválené bez nutnosti manuálneho schválenia.</p>
                        </div>
                        <button
                            type="button"
                            className={`${styles.toggle} ${autoApprove ? styles.toggleActive : ''}`}
                            onClick={() => setAutoApprove(!autoApprove)}
                        >
                            <span className={styles.toggleHandle}></span>
                        </button>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Notifikácie</h2>

                    <div className={styles.toggleGroup}>
                        <div className={styles.toggleInfo}>
                            <span className={styles.toggleLabel}>E-mailové notifikácie</span>
                            <p>Dostávať e-maily o nových registráciách a platbách.</p>
                        </div>
                        <button
                            type="button"
                            className={`${styles.toggle} ${emailNotifications ? styles.toggleActive : ''}`}
                            onClick={() => setEmailNotifications(!emailNotifications)}
                        >
                            <span className={styles.toggleHandle}></span>
                        </button>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Údržba</h2>

                    <div className={styles.toggleGroup}>
                        <div className={styles.toggleInfo}>
                            <span className={styles.toggleLabel}>Režim údržby</span>
                            <p>Stránka bude nedostupná pre verejnosť.</p>
                        </div>
                        <button
                            type="button"
                            className={`${styles.toggle} ${maintenanceMode ? styles.toggleActive : ''}`}
                            onClick={() => setMaintenanceMode(!maintenanceMode)}
                        >
                            <span className={styles.toggleHandle}></span>
                        </button>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="submit" className={styles.saveButton}>
                        Uložiť nastavenia
                    </button>
                </div>
            </form>
        </div>
    );
}
