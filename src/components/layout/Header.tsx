'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import styles from './Header.module.css';

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>💇</span>
                    <span className={styles.logoText}>Salon Finder</span>
                    <span className={styles.logoBadge}>SK</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className={styles.desktopNav}>
                    <Link href="/salony" className={styles.navLink}>
                        Všetky salóny
                    </Link>
                    <Link href="/kategorie" className={styles.navLink}>
                        Kategórie
                    </Link>
                    <Link href="/pre-majitelov" className={styles.navLink}>
                        Pre majiteľov
                    </Link>
                </nav>

                {/* Desktop Actions */}
                <div className={styles.actions}>
                    <LanguageSwitcher />
                    <Link href="/prihlasenie" className={styles.loginButton}>
                        Prihlásiť sa
                    </Link>
                    <Link href="/registracia" className={styles.registerButton}>
                        Pridať salón
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={styles.mobileMenuButton}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Menu"
                >
                    <span className={`${styles.hamburger} ${mobileMenuOpen ? styles.open : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ''}`}>
                <nav className={styles.mobileNav}>
                    <Link href="/salony" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                        Všetky salóny
                    </Link>
                    <Link href="/kategorie" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                        Kategórie
                    </Link>
                    <Link href="/pre-majitelov" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                        Pre majiteľov
                    </Link>
                    <div className={styles.mobileActions}>
                        <Link href="/prihlasenie" className={styles.mobileLoginButton} onClick={() => setMobileMenuOpen(false)}>
                            Prihlásiť sa
                        </Link>
                        <Link href="/registracia" className={styles.mobileRegisterButton} onClick={() => setMobileMenuOpen(false)}>
                            Pridať salón zadarmo
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}
