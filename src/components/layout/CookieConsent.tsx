'use client';

import { useState, useEffect } from 'react';
import styles from './CookieConsent.module.css';

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Show after a small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptAll = () => {
        localStorage.setItem('cookie-consent', 'all');
        setIsVisible(false);
    };

    const acceptNecessary = () => {
        localStorage.setItem('cookie-consent', 'necessary');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.banner}>
                <div className={styles.content}>
                    <h3 className={styles.title}>🍪 Používame cookies</h3>
                    <p className={styles.description}>
                        Táto stránka používa cookies na zlepšenie vašej skúsenosti.
                        Analytické cookies nám pomáhajú pochopiť, ako používate našu stránku.{' '}
                        <a href="/cookies" className={styles.link}>
                            Viac informácií
                        </a>
                    </p>
                </div>
                <div className={styles.buttons}>
                    <button onClick={acceptNecessary} className={styles.secondaryButton}>
                        Len nevyhnutné
                    </button>
                    <button onClick={acceptAll} className={styles.primaryButton}>
                        Prijať všetky
                    </button>
                </div>
            </div>
        </div>
    );
}
