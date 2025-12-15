'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

function EmailConfirmedContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'success' | 'error' | 'loading'>('loading');

    useEffect(() => {
        // Check if there's an error in URL params
        const error = searchParams.get('error');

        if (error) {
            setStatus('error');
        } else {
            setStatus('success');
        }
    }, [searchParams]);

    if (status === 'loading') {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.loading}>Overujem...</div>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <span className={styles.iconError}>❌</span>
                    <h1 className={styles.titleError}>Overenie zlyhalo</h1>
                    <p className={styles.message}>
                        Odkaz na overenie e-mailu vypršal alebo je neplatný.
                    </p>
                    <div className={styles.actions}>
                        <Link href="/prihlasenie" className={styles.button}>
                            Prihlásiť sa
                        </Link>
                        <Link href="/registracia" className={styles.buttonSecondary}>
                            Registrovať znovu
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <span className={styles.icon}>✅</span>
                <h1 className={styles.title}>E-mail overený!</h1>
                <p className={styles.message}>
                    Váš e-mail bol úspešne overený. Teraz sa môžete prihlásiť a používať všetky funkcie.
                </p>
                <div className={styles.features}>
                    <div className={styles.feature}>
                        <span>🏪</span>
                        <span>Pridať salón</span>
                    </div>
                    <div className={styles.feature}>
                        <span>📸</span>
                        <span>Nahrať fotografie</span>
                    </div>
                    <div className={styles.feature}>
                        <span>⭐</span>
                        <span>Získať hodnotenia</span>
                    </div>
                </div>
                <div className={styles.actions}>
                    <Link href="/prihlasenie" className={styles.button}>
                        Prihlásiť sa
                    </Link>
                    <Link href="/" className={styles.buttonSecondary}>
                        Späť na hlavnú stránku
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function EmailConfirmedPage() {
    return (
        <Suspense fallback={
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.loading}>Overujem...</div>
                </div>
            </div>
        }>
            <EmailConfirmedContent />
        </Suspense>
    );
}

