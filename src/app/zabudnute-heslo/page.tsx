'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import styles from '@/app/prihlasenie/page.module.css';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const supabase = createBrowserSupabaseClient();
        if (!supabase) {
            setError('Služba dočasne nedostupná');
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-hesla`,
        });

        if (error) {
            setError('Nastala chyba. Skúste to znova.');
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
                                <span className={styles.successIcon}>📧</span>
                                <h1 className={styles.title}>Skontrolujte e-mail</h1>
                                <p>
                                    Na adresu <strong>{email}</strong> sme poslali
                                    odkaz na obnovenie hesla. Skontrolujte aj priečinok spam.
                                </p>
                                <Link href="/prihlasenie" className={styles.submitButton}>
                                    Späť na prihlásenie
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
                            <h1 className={styles.title}>Zabudnuté heslo</h1>
                            <p className={styles.subtitle}>
                                Zadajte svoj e-mail a pošleme vám odkaz na obnovenie hesla.
                            </p>
                        </div>

                        {error && <div className={styles.error}>{error}</div>}

                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>
                                    E-mailová adresa
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className={styles.input}
                                    placeholder="vas@email.sk"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={loading}
                            >
                                {loading ? 'Odosielam...' : 'Obnoviť heslo'}
                            </button>
                        </form>

                        <p className={styles.footer}>
                            <Link href="/prihlasenie" className={styles.link}>
                                ← Späť na prihlásenie
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
