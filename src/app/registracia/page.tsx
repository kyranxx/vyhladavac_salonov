'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/components/providers/AuthProvider';
import styles from './page.module.css';

export default function RegisterPage() {
    const router = useRouter();
    const { signUp, signInWithGoogle } = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

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

        if (!acceptTerms) {
            setError('Musíte súhlasiť s obchodnými podmienkami');
            return;
        }

        setLoading(true);

        const { error } = await signUp(email, password, { firstName, lastName });

        if (error) {
            setError('Registrácia zlyhala. Skúste to znova.');
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
                                <h1 className={styles.title}>Registrácia úspešná!</h1>
                                <p>Skontrolujte svoj e-mail a potvrďte registráciu kliknutím na odkaz v správe.</p>
                                <Link href="/prihlasenie" className={styles.submitButton}>
                                    Prejsť na prihlásenie
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
                            <h1 className={styles.title}>Registrácia</h1>
                            <p className={styles.subtitle}>
                                Vytvorte si účet a pridajte svoj salón zadarmo.
                            </p>
                        </div>

                        {error && <div className={styles.error}>{error}</div>}

                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="firstName" className={styles.label}>
                                        Meno
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        className={styles.input}
                                        placeholder="Ján"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="lastName" className={styles.label}>
                                        Priezvisko
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        className={styles.input}
                                        placeholder="Novák"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

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

                            <div className={styles.formGroup}>
                                <label htmlFor="password" className={styles.label}>
                                    Heslo
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

                            <div className={styles.checkboxGroup}>
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className={styles.checkbox}
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    required
                                />
                                <label htmlFor="terms" className={styles.checkboxLabel}>
                                    Súhlasím s{' '}
                                    <Link href="/obchodne-podmienky" className={styles.link}>
                                        obchodnými podmienkami
                                    </Link>{' '}
                                    a{' '}
                                    <Link href="/ochrana-sukromia" className={styles.link}>
                                        ochranou súkromia
                                    </Link>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={loading}
                            >
                                {loading ? 'Registrujem...' : 'Vytvoriť účet'}
                            </button>
                        </form>

                        <div className={styles.divider}>
                            <span>alebo</span>
                        </div>

                        <button
                            type="button"
                            className={styles.googleButton}
                            onClick={() => signInWithGoogle()}
                        >
                            <svg className={styles.googleIcon} viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Registrovať cez Google
                        </button>

                        <p className={styles.footer}>
                            Už máte účet?{' '}
                            <Link href="/prihlasenie" className={styles.link}>
                                Prihláste sa
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
