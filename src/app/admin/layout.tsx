'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useEffect, useState } from 'react';
import styles from './layout.module.css';

const sidebarItems = [
    { path: '/admin', label: 'Prehľad', icon: '📊' },
    { path: '/admin/salony', label: 'Salóny', icon: '💇' },
    { path: '/admin/kategorie', label: 'Kategórie', icon: '📁' },
    { path: '/admin/pouzivatelia', label: 'Používatelia', icon: '👥' },
    { path: '/admin/predplatne', label: 'Predplatné', icon: '💳' },
    { path: '/admin/reklamy', label: 'Reklamy', icon: '📢' },
    { path: '/admin/nastavenia', label: 'Nastavenia', icon: '⚙️' },
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
                        🔧 Admin Panel
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
                            <span className={styles.navIcon}>{item.icon}</span>
                            <span className={styles.navLabel}>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
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
