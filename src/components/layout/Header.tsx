'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { getTranslation } from '@/lib/translations';
import styles from './Header.module.css';

interface HeaderProps {
    locale?: string;
}

export function Header({ locale = 'sk' }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const t = getTranslation(locale);

    // Base path for links (add locale prefix for non-default)
    const basePath = locale === 'sk' ? '' : `/${locale}`;

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href={basePath || '/'} className={styles.logo}>
                    <span className={styles.logoIcon}>💇</span>
                    <span className={styles.logoText}>Salon Finder</span>
                    <span className={styles.logoBadge}>SK</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className={styles.desktopNav}>
                    <Link href={`${basePath}/salony`} className={styles.navLink}>
                        {t.nav.allSalons}
                    </Link>
                    <Link href={`${basePath}/kategorie`} className={styles.navLink}>
                        {t.nav.categories}
                    </Link>
                    <Link href={`${basePath}/pre-majitelov`} className={styles.navLink}>
                        {t.nav.forOwners}
                    </Link>
                </nav>

                {/* Desktop Actions */}
                <div className={styles.actions}>
                    <LanguageSwitcher />
                    <Link href={`${basePath}/prihlasenie`} className={styles.loginButton}>
                        {t.nav.signIn}
                    </Link>
                    <Link href={`${basePath}/registracia`} className={styles.registerButton}>
                        {t.nav.addSalon}
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
                    <Link href={`${basePath}/salony`} className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                        {t.nav.allSalons}
                    </Link>
                    <Link href={`${basePath}/kategorie`} className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                        {t.nav.categories}
                    </Link>
                    <Link href={`${basePath}/pre-majitelov`} className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                        {t.nav.forOwners}
                    </Link>
                    <div className={styles.mobileActions}>
                        <Link href={`${basePath}/prihlasenie`} className={styles.mobileLoginButton} onClick={() => setMobileMenuOpen(false)}>
                            {t.nav.signIn}
                        </Link>
                        <Link href={`${basePath}/registracia`} className={styles.mobileRegisterButton} onClick={() => setMobileMenuOpen(false)}>
                            {t.nav.addSalon}
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}
