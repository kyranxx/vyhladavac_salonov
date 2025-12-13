'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import styles from '@/app/prihlasenie/page.module.css';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Supabase handles the hash in the URL automatically
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Heslá sa nezhodujú');
            return;
        }

        if (password.length < 8) {
            setError('Heslo musí mať aspoň 8 znakov');
            return;
        }

        setLoading(true);

        const supabase = createBrowserSupabaseClient();
        if (!supabase) {
            setError('Služba dočasne nedostupná');
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            setError('Nastala chyba pri zmene hesla. Skúste to znova.');
            setLoading(false);
        } else {
            setSuccess(true);
        }
    };

    if (success) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <div className={styles.card}>
                            <div className={styles.successMessage}>
                                <span className={styles.successIcon}>✅</span>
                                <h1 className={styles.title}>Heslo bolo zmenené!</h1>
                                <p>
                                    Vaše heslo bolo úspešne zmenené.
                                    Teraz sa môžete prihlásiť s novým heslom.
                                </p>
                                <Link href="/prihlasenie" className={styles.submitButton}>
                                    Prihlásiť sa
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.card}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>Nové heslo</h1>
                            <p className={styles.subtitle}>
                                Zadajte svoje nové heslo.
                            </p>
                        </div>

                        {error && <div className={styles.error}>{error}</div>}

                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="password" className={styles.label}>
                                    Nové heslo
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className={styles.input}
                                    placeholder="Minimálne 8 znakov"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="confirmPassword" className={styles.label}>
                                    Potvrďte heslo
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    className={styles.input}
                                    placeholder="Zopakujte heslo"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={loading}
                            >
                                {loading ? 'Ukladám...' : 'Zmeniť heslo'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
