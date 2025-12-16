'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/components/providers/AuthProvider';
import { getTranslation } from '@/lib/translations';
import styles from '@/app/prihlasenie/page.module.css';

const ADMIN_EMAILS = ['blanarikdaniel@gmail.com', 'admin@salonfinder.sk'];

const textsByLocale: Record<string, {
    title: string; subtitle: string; email: string; password: string; forgotPassword: string;
    signIn: string; signingIn: string; noAccount: string; register: string; error: string;
    googleSignIn: string; or: string;
}> = {
    en: {
        title: 'Sign In',
        subtitle: 'Welcome back! Sign in to your account.',
        email: 'Email address',
        password: 'Password',
        forgotPassword: 'Forgot password?',
        signIn: 'Sign In',
        signingIn: 'Signing in...',
        noAccount: "Don't have an account?",
        register: 'Register',
        error: 'Invalid email or password. Please try again.',
        googleSignIn: 'Sign in with Google',
        or: 'or',
    },
    hu: {
        title: 'Bejelentkezés',
        subtitle: 'Üdvözöljük! Jelentkezzen be fiókjába.',
        email: 'E-mail cím',
        password: 'Jelszó',
        forgotPassword: 'Elfelejtett jelszó?',
        signIn: 'Bejelentkezés',
        signingIn: 'Bejelentkezés...',
        noAccount: 'Nincs fiókja?',
        register: 'Regisztráció',
        error: 'Érvénytelen e-mail vagy jelszó. Próbálja újra.',
        googleSignIn: 'Bejelentkezés Google-lal',
        or: 'vagy',
    },
};

export default function LocalizedLoginPage() {
    const router = useRouter();
    const params = useParams();
    const locale = (params.locale as string) || 'en';
    const texts = textsByLocale[locale] || textsByLocale.en;
    const t = getTranslation(locale);

    const { signIn, signInWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const basePath = locale === 'sk' ? '' : `/${locale}`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error } = await signIn(email, password);

        if (error) {
            setError(texts.error);
            setLoading(false);
        } else {
            const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
            if (isAdmin) {
                router.push('/admin');
            } else {
                // Redirect to same locale home page
                router.push(basePath || '/');
            }
        }
    };

    return (
        <>
            <Header locale={locale} />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.card}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>{texts.title}</h1>
                            <p className={styles.subtitle}>{texts.subtitle}</p>
                        </div>

                        {error && <div className={styles.error}>{error}</div>}

                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>
                                    {texts.email}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className={styles.input}
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <div className={styles.labelRow}>
                                    <label htmlFor="password" className={styles.label}>
                                        {texts.password}
                                    </label>
                                    <Link href={`${basePath}/zabudnute-heslo`} className={styles.forgotLink}>
                                        {texts.forgotPassword}
                                    </Link>
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    className={styles.input}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={loading}
                            >
                                {loading ? texts.signingIn : texts.signIn}
                            </button>
                        </form>

                        <div className={styles.divider}><span>{texts.or}</span></div>

                        <button type="button" className={styles.googleButton} onClick={() => signInWithGoogle()}>
                            <svg className={styles.googleIcon} viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            {texts.googleSignIn}
                        </button>

                        <p className={styles.footer}>
                            {texts.noAccount}{' '}
                            <Link href={`${basePath}/registracia`} className={styles.link}>
                                {texts.register}
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
            <Footer locale={locale} translations={t} />
        </>
    );
}
