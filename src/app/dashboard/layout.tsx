'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useEffect, useState } from 'react';
import { useDashboardTranslations } from '@/hooks/useTranslations';
import styles from './layout.module.css';

// Admin email addresses
const ADMIN_EMAILS = ['admin@salonfinder.sk', 'admin@apollotech.sk', 'blanarikdaniel@gmail.com'];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading, signOut } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const t = useDashboardTranslations();

    // Dynamic sidebar items based on translations
    const sidebarItems = [
        { path: '/dashboard', label: t.title, icon: 'home' },
        { path: '/dashboard/firmy', label: 'Moje firmy', icon: 'building' },
        { path: '/dashboard/moj-salon', label: t.mySalons, icon: 'salon' },
        { path: '/dashboard/statistiky', label: t.statistics, icon: 'stats' },
        { path: '/dashboard/predplatne', label: t.subscription, icon: 'star' },
        { path: '/dashboard/nastavenia', label: t.settings, icon: 'settings' },
    ];

    // Check if user is admin
    const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/prihlasenie');
        }
    }, [user, loading, router]);

    // Close sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>{t.title}...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className={styles.wrapper}>
            {/* Mobile Header */}
            <header className={styles.mobileHeader}>
                <button
                    className={styles.menuButton}
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open menu"
                >
                    <span className={styles.menuIcon}>☰</span>
                </button>
                <Link href="/dashboard" className={styles.mobileTitle}>
                    {t.title}
                </Link>
                <Link href="/" className={styles.mobileBackLink}>
                    ↩️
                </Link>
            </header>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <Link href="/" className={styles.logo}>
                        <img
                            src="/logo_register_salonov.png"
                            alt="Register salónov"
                            className={styles.logoImage}
                        />
                    </Link>
                    <button
                        className={styles.closeButton}
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close menu"
                    >
                        ✕
                    </button>
                </div>

                <nav className={styles.nav}>
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
                        >
                            <span className={styles.navIcon}>
                                {item.icon === 'home' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>}
                                {item.icon === 'building' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" /></svg>}
                                {item.icon === 'salon' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>}
                                {item.icon === 'stats' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>}
                                {item.icon === 'star' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>}
                                {item.icon === 'settings' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>}
                            </span>
                            <span className={styles.navLabel}>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    {isAdmin && (
                        <Link href="/admin" className={styles.adminLink}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            Admin Panel
                        </Link>
                    )}
                    <Link href="/" className={styles.backLink}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                        Späť na web
                    </Link>
                    <div className={styles.userInfo}>
                        <span className={styles.userAvatar}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        </span>
                        <span className={styles.userName}>
                            {user.email?.split('@')[0]}
                        </span>
                    </div>
                    <button onClick={handleSignOut} className={styles.signOutButton}>
                        {t.signOut}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
