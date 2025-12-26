'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface Settings {
    site_name: string;
    site_description: string;
    contact_email: string;
    auto_approve: boolean;
    email_notifications: boolean;
    maintenance_mode: boolean;
}

const defaultSettings: Settings = {
    site_name: 'Register salónov',
    site_description: 'Nájdite najlepšie salóny krásy na Slovensku',
    contact_email: 'info@salonfinder.sk',
    auto_approve: false,
    email_notifications: true,
    maintenance_mode: false,
};

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        // Settings are stored in localStorage for now
        // In production, you'd want to store these in a database table
        const stored = localStorage.getItem('salon_finder_settings');
        if (stored) {
            try {
                setSettings(JSON.parse(stored));
            } catch {
                // Use defaults
            }
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Save to localStorage
        localStorage.setItem('salon_finder_settings', JSON.stringify(settings));

        // Also save maintenance mode to a cookie that middleware can read
        if (settings.maintenance_mode) {
            document.cookie = 'maintenance_mode=true; path=/';
        } else {
            document.cookie = 'maintenance_mode=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }

        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    if (loading) {
        return <div className={styles.container}><p>Načítavam...</p></div>;
    }

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
                            value={settings.site_name}
                            onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="siteDescription">Popis stránky</label>
                        <textarea
                            id="siteDescription"
                            value={settings.site_description}
                            onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="contactEmail">Kontaktný e-mail</label>
                        <input
                            type="email"
                            id="contactEmail"
                            value={settings.contact_email}
                            onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
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
                            className={`${styles.toggle} ${settings.auto_approve ? styles.toggleActive : ''}`}
                            onClick={() => setSettings({ ...settings, auto_approve: !settings.auto_approve })}
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
                            className={`${styles.toggle} ${settings.email_notifications ? styles.toggleActive : ''}`}
                            onClick={() => setSettings({ ...settings, email_notifications: !settings.email_notifications })}
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
                            <p>Stránka bude nedostupná pre verejnosť (okrem adminov).</p>
                        </div>
                        <button
                            type="button"
                            className={`${styles.toggle} ${settings.maintenance_mode ? styles.toggleActive : ''}`}
                            onClick={() => setSettings({ ...settings, maintenance_mode: !settings.maintenance_mode })}
                        >
                            <span className={styles.toggleHandle}></span>
                        </button>
                    </div>
                    {settings.maintenance_mode && (
                        <div className={styles.warningBox}>
                            ⚠️ Režim údržby je aktívny! Verejnosť nemôže pristupovať na stránku.
                        </div>
                    )}
                </div>

                <div className={styles.actions}>
                    <button type="submit" className={styles.saveButton} disabled={saving}>
                        {saving ? 'Ukladám...' : 'Uložiť nastavenia'}
                    </button>
                </div>
            </form>
        </div>
    );
}
