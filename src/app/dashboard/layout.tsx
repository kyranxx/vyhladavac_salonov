'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useEffect, useState } from 'react';
import { useDashboardTranslations } from '@/hooks/useTranslations';
import styles from './layout.module.css';

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
        { path: '/dashboard', label: t.title, icon: '🏠' },
        { path: '/dashboard/moj-salon', label: t.mySalons, icon: '💇' },
        { path: '/dashboard/statistiky', label: t.statistics, icon: '📊' },
        { path: '/dashboard/predplatne', label: t.subscription, icon: '⭐' },
        { path: '/dashboard/nastavenia', label: t.settings, icon: '⚙️' },
    ];

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
                            <span className={styles.navIcon}>{item.icon}</span>
                            <span className={styles.navLabel}>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.userInfo}>
                        <span className={styles.userAvatar}>👤</span>
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
