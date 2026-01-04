'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/Toast';
import styles from './page.module.css';

interface EmailSettings {
    enabled: boolean;
    recipient: string;
}

interface Settings {
    site_name: string;
    site_description: string;
    contact_email: string;
    auto_approve: boolean;
    maintenance_mode: boolean;
    email_new_salon: EmailSettings;
    email_salon_approved: EmailSettings;
    email_salon_rejected: EmailSettings;
    email_new_subscription: EmailSettings;
    email_contact_form: EmailSettings;
}

const defaultSettings: Settings = {
    site_name: 'Register salónov',
    site_description: 'Nájdite najlepšie salóny krásy na Slovensku',
    contact_email: 'info@salonfinder.sk',
    auto_approve: false,
    maintenance_mode: false,
    email_new_salon: { enabled: true, recipient: '' },
    email_salon_approved: { enabled: true, recipient: '' },
    email_salon_rejected: { enabled: true, recipient: '' },
    email_new_subscription: { enabled: true, recipient: '' },
    email_contact_form: { enabled: true, recipient: '' },
};

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const stored = localStorage.getItem('salon_finder_settings');
        if (stored) {
            try {
                const parsedSettings = { ...defaultSettings, ...JSON.parse(stored) };
                setSettings(parsedSettings);

                if (parsedSettings.maintenance_mode) {
                    document.cookie = 'maintenance_mode=true; path=/; max-age=31536000';
                    document.cookie = 'admin_bypass=true; path=/; max-age=86400';
                }
            } catch {
                // Use defaults
            }
        }
        setLoading(false);
    };

    const saveSettings = async (newSettings: Settings) => {
        localStorage.setItem('salon_finder_settings', JSON.stringify(newSettings));
        document.cookie = 'admin_bypass=true; path=/; max-age=86400';

        if (newSettings.maintenance_mode) {
            document.cookie = 'maintenance_mode=true; path=/; max-age=31536000';
            await fetch('/api/admin/maintenance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled: true })
            });
        } else {
            document.cookie = 'maintenance_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            await fetch('/api/admin/maintenance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled: false })
            });
        }
    };

    const handleToggle = async (field: keyof Settings) => {
        const newValue = !settings[field as keyof Settings];
        const newSettings = { ...settings, [field]: newValue };
        setSettings(newSettings);
        await saveSettings(newSettings);

        if (field === 'maintenance_mode') {
            toast.success(newValue ? 'Režim údržby aktivovaný' : 'Režim údržby deaktivovaný');
        } else if (field === 'auto_approve') {
            toast.success(newValue ? 'Automatické schvaľovanie zapnuté' : 'Automatické schvaľovanie vypnuté');
        }
    };

    const handleEmailToggle = (emailType: keyof Settings) => {
        const current = settings[emailType] as EmailSettings;
        const newSettings = {
            ...settings,
            [emailType]: { ...current, enabled: !current.enabled }
        };
        setSettings(newSettings);
        saveSettings(newSettings);
    };

    const handleEmailRecipientChange = (emailType: keyof Settings, value: string) => {
        const current = settings[emailType] as EmailSettings;
        const newSettings = {
            ...settings,
            [emailType]: { ...current, recipient: value }
        };
        setSettings(newSettings);
    };

    const handleSaveEmailRecipient = (emailType: keyof Settings) => {
        saveSettings(settings);
        toast.success('Email uložený');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        await saveSettings(settings);
        setSaving(false);
        toast.success('Nastavenia boli uložené!');
    };

    if (loading) {
        return <div className={styles.container}><p>Načítavam...</p></div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Nastavenia</h1>
                <p className={styles.subtitle}>Konfigurácia aplikácie a notifikácií</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* General Settings */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Všeobecné nastavenia</h2>

                    <div className={styles.formGroup}>
                        <label>Názov stránky</label>
                        <input
                            type="text"
                            value={settings.site_name}
                            onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Popis stránky</label>
                        <textarea
                            value={settings.site_description}
                            onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                            rows={2}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Kontaktný email</label>
                        <input
                            type="email"
                            value={settings.contact_email}
                            onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                        />
                    </div>
                </section>

                {/* Toggles */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Funkcie</h2>

                    <div className={styles.toggleItem}>
                        <div className={styles.toggleInfo}>
                            <span className={styles.toggleLabel}>Automatické schvaľovanie</span>
                            <span className={styles.toggleDesc}>Nové salóny budú automaticky schválené</span>
                        </div>
                        <button
                            type="button"
                            className={`${styles.toggle} ${settings.auto_approve ? styles.toggleActive : ''}`}
                            onClick={() => handleToggle('auto_approve')}
                        >
                            <span className={styles.toggleKnob}></span>
                        </button>
                    </div>

                    <div className={styles.toggleItem}>
                        <div className={styles.toggleInfo}>
                            <span className={styles.toggleLabel}>Režim údržby</span>
                            <span className={styles.toggleDesc}>Stránka bude nedostupná pre verejnosť</span>
                        </div>
                        <button
                            type="button"
                            className={`${styles.toggle} ${settings.maintenance_mode ? styles.toggleActive : ''}`}
                            onClick={() => handleToggle('maintenance_mode')}
                        >
                            <span className={styles.toggleKnob}></span>
                        </button>
                    </div>
                </section>

                {/* Email Notifications */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>E-mailové notifikácie</h2>
                    <p className={styles.sectionDesc}>Nastavte, ktoré notifikácie chcete dostávať a na akú adresu</p>

                    {/* New Salon Registration */}
                    <div className={styles.emailSetting}>
                        <div className={styles.emailHeader}>
                            <div className={styles.emailToggleRow}>
                                <span className={styles.emailLabel}>Nová registrácia salónu</span>
                                <button
                                    type="button"
                                    className={`${styles.toggleSmall} ${settings.email_new_salon.enabled ? styles.toggleActive : ''}`}
                                    onClick={() => handleEmailToggle('email_new_salon')}
                                >
                                    <span className={styles.toggleKnob}></span>
                                </button>
                            </div>
                        </div>
                        {settings.email_new_salon.enabled && (
                            <div className={styles.emailInput}>
                                <input
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={settings.email_new_salon.recipient}
                                    onChange={(e) => handleEmailRecipientChange('email_new_salon', e.target.value)}
                                />
                                <button type="button" onClick={() => handleSaveEmailRecipient('email_new_salon')} className={styles.saveBtn}>
                                    Uložiť
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Salon Approved */}
                    <div className={styles.emailSetting}>
                        <div className={styles.emailHeader}>
                            <div className={styles.emailToggleRow}>
                                <span className={styles.emailLabel}>Salón schválený (majiteľovi)</span>
                                <button
                                    type="button"
                                    className={`${styles.toggleSmall} ${settings.email_salon_approved.enabled ? styles.toggleActive : ''}`}
                                    onClick={() => handleEmailToggle('email_salon_approved')}
                                >
                                    <span className={styles.toggleKnob}></span>
                                </button>
                            </div>
                        </div>
                        {settings.email_salon_approved.enabled && (
                            <div className={styles.emailInput}>
                                <input
                                    type="email"
                                    placeholder="Prázdne = email majiteľa salónu"
                                    value={settings.email_salon_approved.recipient}
                                    onChange={(e) => handleEmailRecipientChange('email_salon_approved', e.target.value)}
                                />
                                <button type="button" onClick={() => handleSaveEmailRecipient('email_salon_approved')} className={styles.saveBtn}>
                                    Uložiť
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Salon Rejected */}
                    <div className={styles.emailSetting}>
                        <div className={styles.emailHeader}>
                            <div className={styles.emailToggleRow}>
                                <span className={styles.emailLabel}>Salón zamietnutý (majiteľovi)</span>
                                <button
                                    type="button"
                                    className={`${styles.toggleSmall} ${settings.email_salon_rejected.enabled ? styles.toggleActive : ''}`}
                                    onClick={() => handleEmailToggle('email_salon_rejected')}
                                >
                                    <span className={styles.toggleKnob}></span>
                                </button>
                            </div>
                        </div>
                        {settings.email_salon_rejected.enabled && (
                            <div className={styles.emailInput}>
                                <input
                                    type="email"
                                    placeholder="Prázdne = email majiteľa salónu"
                                    value={settings.email_salon_rejected.recipient}
                                    onChange={(e) => handleEmailRecipientChange('email_salon_rejected', e.target.value)}
                                />
                                <button type="button" onClick={() => handleSaveEmailRecipient('email_salon_rejected')} className={styles.saveBtn}>
                                    Uložiť
                                </button>
                            </div>
                        )}
                    </div>

                    {/* New Subscription */}
                    <div className={styles.emailSetting}>
                        <div className={styles.emailHeader}>
                            <div className={styles.emailToggleRow}>
                                <span className={styles.emailLabel}>Nové predplatné</span>
                                <button
                                    type="button"
                                    className={`${styles.toggleSmall} ${settings.email_new_subscription.enabled ? styles.toggleActive : ''}`}
                                    onClick={() => handleEmailToggle('email_new_subscription')}
                                >
                                    <span className={styles.toggleKnob}></span>
                                </button>
                            </div>
                        </div>
                        {settings.email_new_subscription.enabled && (
                            <div className={styles.emailInput}>
                                <input
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={settings.email_new_subscription.recipient}
                                    onChange={(e) => handleEmailRecipientChange('email_new_subscription', e.target.value)}
                                />
                                <button type="button" onClick={() => handleSaveEmailRecipient('email_new_subscription')} className={styles.saveBtn}>
                                    Uložiť
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Contact Form */}
                    <div className={styles.emailSetting}>
                        <div className={styles.emailHeader}>
                            <div className={styles.emailToggleRow}>
                                <span className={styles.emailLabel}>Kontaktný formulár</span>
                                <button
                                    type="button"
                                    className={`${styles.toggleSmall} ${settings.email_contact_form.enabled ? styles.toggleActive : ''}`}
                                    onClick={() => handleEmailToggle('email_contact_form')}
                                >
                                    <span className={styles.toggleKnob}></span>
                                </button>
                            </div>
                        </div>
                        {settings.email_contact_form.enabled && (
                            <div className={styles.emailInput}>
                                <input
                                    type="email"
                                    placeholder="support@example.com"
                                    value={settings.email_contact_form.recipient}
                                    onChange={(e) => handleEmailRecipientChange('email_contact_form', e.target.value)}
                                />
                                <button type="button" onClick={() => handleSaveEmailRecipient('email_contact_form')} className={styles.saveBtn}>
                                    Uložiť
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                <button type="submit" className={styles.submitButton} disabled={saving}>
                    {saving ? 'Ukladám...' : 'Uložiť všetky nastavenia'}
                </button>
            </form>
        </div>
    );
}
