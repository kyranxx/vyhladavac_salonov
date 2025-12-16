'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { PhoneInput } from '@/components/ui/PhoneInput';
import styles from './page.module.css';

export default function SettingsPage() {
    const { user } = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // Load user data on mount
    useEffect(() => {
        if (user?.user_metadata) {
            setFirstName(user.user_metadata.first_name || '');
            setLastName(user.user_metadata.last_name || '');
            setPhone(user.user_metadata.phone || '');
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const supabase = createBrowserSupabaseClient();
            if (!supabase) throw new Error('Supabase not configured');

            const { error } = await supabase.auth.updateUser({
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    phone: phone,
                }
            });

            if (error) throw error;
            setSuccess(true);
        } catch (_err) {
            setError('Nepodarilo sa uložiť zmeny. Skúste to znova.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!user?.email) return;

        try {
            const supabase = createBrowserSupabaseClient();
            if (!supabase) throw new Error('Supabase not configured');

            const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                redirectTo: `${window.location.origin}/reset-hesla`,
            });

            if (error) throw error;
            alert('Odkaz na zmenu hesla bol odoslaný na váš e-mail.');
        } catch (_err) {
            alert('Nepodarilo sa odoslať e-mail. Skúste to znova.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Nastavenia účtu</h1>
                <p className={styles.subtitle}>Spravujte svoje osobné údaje a preferencie</p>
            </div>

            <div className={styles.content}>
                {/* Profile Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Osobné údaje</h2>

                    {success && (
                        <div className={styles.success}>
                            ✅ Zmeny boli úspešne uložené.
                        </div>
                    )}

                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="firstName" className={styles.label}>Meno</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    className={styles.input}
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Vaše meno"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="lastName" className={styles.label}>Priezvisko</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    className={styles.input}
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Vaše priezvisko"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>E-mail</label>
                            <input
                                type="email"
                                id="email"
                                className={styles.input}
                                value={user?.email || ''}
                                disabled
                            />
                            <span className={styles.hint}>E-mail nie je možné zmeniť</span>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="phone" className={styles.label}>Telefón</label>
                            <PhoneInput
                                id="phone"
                                value={phone}
                                onChange={setPhone}
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Ukladám...' : 'Uložiť zmeny'}
                        </button>
                    </form>
                </section>

                {/* Password Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Zmena hesla</h2>
                    <p className={styles.sectionDescription}>
                        Pre zmenu hesla vám pošleme odkaz na e-mail.
                    </p>
                    <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={handlePasswordReset}
                    >
                        Zmeniť heslo
                    </button>
                </section>

                {/* Danger Zone */}
                <section className={`${styles.section} ${styles.dangerSection}`}>
                    <h2 className={styles.sectionTitle}>Nebezpečná zóna</h2>
                    <p className={styles.sectionDescription}>
                        Po zmazaní účtu stratíte prístup k všetkým údajom a salónom.
                        Kontaktujte nás na support@salonfinder.sk pre zmazanie účtu.
                    </p>
                </section>
            </div>
        </div>
    );
}
