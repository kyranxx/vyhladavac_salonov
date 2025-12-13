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
    },
};

export default function LocalizedLoginPage() {
    const router = useRouter();
    const params = useParams();
    const locale = (params.locale as string) || 'en';
    const texts = textsByLocale[locale] || textsByLocale.en;
    const t = getTranslation(locale);

    const { signIn } = useAuth();
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
                router.push('/dashboard');
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
