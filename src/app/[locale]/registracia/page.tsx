'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/components/providers/AuthProvider';
import { getTranslation } from '@/lib/translations';
import styles from '@/app/registracia/page.module.css';

const textsByLocale: Record<string, {
    title: string; subtitle: string; firstName: string; lastName: string; email: string;
    password: string; confirmPassword: string; agreeTerms: string; termsLink: string;
    privacyLink: string; register: string; registering: string; haveAccount: string;
    signIn: string; success: string; successMsg: string; goToLogin: string;
    errorPasswordMatch: string; errorPasswordLength: string; errorTerms: string; errorGeneric: string;
    googleSignIn: string; or: string;
}> = {
    en: {
        title: 'Registration',
        subtitle: 'Create an account and add your salon for free.',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email address',
        password: 'Password',
        confirmPassword: 'Confirm password',
        agreeTerms: 'I agree to the',
        termsLink: 'Terms of Service',
        privacyLink: 'Privacy Policy',
        register: 'Register',
        registering: 'Registering...',
        haveAccount: 'Already have an account?',
        signIn: 'Sign In',
        success: 'Registration successful!',
        successMsg: 'Check your email and confirm registration by clicking the link in the message.',
        goToLogin: 'Go to login',
        errorPasswordMatch: 'Passwords do not match',
        errorPasswordLength: 'Password must be at least 8 characters',
        errorTerms: 'You must agree to the terms of service',
        errorGeneric: 'Registration failed. Please try again.',
        googleSignIn: 'Sign up with Google',
        or: 'or',
    },
    hu: {
        title: 'Regisztráció',
        subtitle: 'Hozzon létre fiókot és adja hozzá szalonját ingyen.',
        firstName: 'Keresztnév',
        lastName: 'Vezetéknév',
        email: 'E-mail cím',
        password: 'Jelszó',
        confirmPassword: 'Jelszó megerősítése',
        agreeTerms: 'Elfogadom a',
        termsLink: 'Felhasználási feltételeket',
        privacyLink: 'Adatvédelmi irányelveket',
        register: 'Regisztráció',
        registering: 'Regisztráció...',
        haveAccount: 'Már van fiókja?',
        signIn: 'Bejelentkezés',
        success: 'Sikeres regisztráció!',
        successMsg: 'Ellenőrizze e-mailjét, és erősítse meg a regisztrációt az üzenetben található linkre kattintva.',
        goToLogin: 'Tovább a bejelentkezéshez',
        errorPasswordMatch: 'A jelszavak nem egyeznek',
        errorPasswordLength: 'A jelszónak legalább 8 karakterből kell állnia',
        errorTerms: 'El kell fogadnia a felhasználási feltételeket',
        errorGeneric: 'A regisztráció sikertelen. Kérem próbálja újra.',
        googleSignIn: 'Regisztráció Google-lal',
        or: 'vagy',
    },
};

export default function LocalizedRegisterPage() {
    const router = useRouter();
    const params = useParams();
    const locale = (params.locale as string) || 'en';
    const texts = textsByLocale[locale] || textsByLocale.en;
    const t = getTranslation(locale);
    const basePath = `/${locale}`;

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
            setError(texts.errorPasswordMatch);
            return;
        }
        if (password.length < 8) {
            setError(texts.errorPasswordLength);
            return;
        }
        if (!acceptTerms) {
            setError(texts.errorTerms);
            return;
        }

        setLoading(true);
        const { error } = await signUp(email, password, { firstName, lastName });

        if (error) {
            setError(texts.errorGeneric);
            setLoading(false);
        } else {
            setSuccess(true);
        }
    };

    if (success) {
        return (
            <>
                <Header locale={locale} />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <div className={styles.card}>
                            <div className={styles.successMessage}>
                                <span className={styles.successIcon}>✅</span>
                                <h1 className={styles.title}>{texts.success}</h1>
                                <p>{texts.successMsg}</p>
                                <Link href={`${basePath}/prihlasenie`} className={styles.submitButton}>
                                    {texts.goToLogin}
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer locale={locale} translations={t} />
            </>
        );
    }

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
                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="firstName" className={styles.label}>{texts.firstName}</label>
                                    <input type="text" id="firstName" className={styles.input} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="lastName" className={styles.label}>{texts.lastName}</label>
                                    <input type="text" id="lastName" className={styles.input} value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>{texts.email}</label>
                                <input type="email" id="email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="password" className={styles.label}>{texts.password}</label>
                                <input type="password" id="password" className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="confirmPassword" className={styles.label}>{texts.confirmPassword}</label>
                                <input type="password" id="confirmPassword" className={styles.input} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            </div>

                            <div className={styles.checkboxGroup}>
                                <input type="checkbox" id="terms" className={styles.checkbox} checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
                                <label htmlFor="terms" className={styles.checkboxLabel}>
                                    {texts.agreeTerms} <Link href={`${basePath}/obchodne-podmienky`} className={styles.link}>{texts.termsLink}</Link> & <Link href={`${basePath}/ochrana-sukromia`} className={styles.link}>{texts.privacyLink}</Link>
                                </label>
                            </div>

                            <button type="submit" className={styles.submitButton} disabled={loading}>
                                {loading ? texts.registering : texts.register}
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
                            {texts.haveAccount}{' '}
                            <Link href={`${basePath}/prihlasenie`} className={styles.link}>{texts.signIn}</Link>
                        </p>
                    </div>
                </div>
            </main>
            <Footer locale={locale} translations={t} />
        </>
    );
}
