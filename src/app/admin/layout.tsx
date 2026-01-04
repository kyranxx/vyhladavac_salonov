'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useEffect, useState } from 'react';
import styles from './layout.module.css';

const sidebarItems = [
    { path: '/admin', label: 'Prehľad', icon: 'dashboard' },
    { path: '/admin/salony', label: 'Salóny', icon: 'salon' },
    { path: '/admin/kategorie', label: 'Kategórie', icon: 'folder' },
    { path: '/admin/pouzivatelia', label: 'Používatelia', icon: 'users' },
    { path: '/admin/predplatne', label: 'Predplatné', icon: 'credit' },
    { path: '/admin/reklamy', label: 'Reklamy', icon: 'megaphone' },
    { path: '/admin/nastavenia', label: 'Nastavenia', icon: 'settings' },
];

// Admin email addresses
const ADMIN_EMAILS = ['admin@salonfinder.sk', 'admin@apollotech.sk', 'blanarikdaniel@gmail.com'];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading, signOut } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/prihlasenie');
            } else if (!ADMIN_EMAILS.includes(user.email || '')) {
                router.push('/dashboard');
            } else {
                setIsAdmin(true);
            }
        }
    }, [user, loading, router]);

    // Close sidebar when route changes (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    if (loading || !isAdmin) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Načítavam...</p>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {/* Mobile Header */}
            <header className={styles.mobileHeader}>
                <button
                    className={styles.menuButton}
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Otvoriť menu"
                >
                    <span className={styles.menuIcon}>☰</span>
                </button>
                <Link href="/admin" className={styles.mobileTitle}>
                    Admin Panel
                </Link>
                <div className={styles.mobileHeaderRight}>
                    <Link href="/" className={styles.mobileBackLink}>
                        ↩️
                    </Link>
                </div>
            </header>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <Link href="/admin" className={styles.logo}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        Admin Panel
                    </Link>
                    <button
                        className={styles.closeButton}
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Zavrieť menu"
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
                                {item.icon === 'dashboard' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>}
                                {item.icon === 'salon' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>}
                                {item.icon === 'folder' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>}
                                {item.icon === 'users' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                                {item.icon === 'credit' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>}
                                {item.icon === 'megaphone' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l18-5v12L3 13v-2z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>}
                                {item.icon === 'settings' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>}
                            </span>
                            <span className={styles.navLabel}>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <Link href="/dashboard" className={styles.dashboardLink}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                        Môj Dashboard
                    </Link>
                    <Link href="/" className={styles.backLink}>
                        ← Späť na web
                    </Link>
                    <button onClick={handleSignOut} className={styles.signOutButton}>
                        Odhlásiť sa
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
