'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useEffect } from 'react';
import styles from './layout.module.css';

const sidebarItems = [
    { path: '/dashboard', label: 'Prehľad', icon: '🏠' },
    { path: '/dashboard/moj-salon', label: 'Moje salóny', icon: '💇' },
    { path: '/dashboard/statistiky', label: 'Štatistiky', icon: '📊' },
    { path: '/dashboard/predplatne', label: 'Predplatné', icon: '⭐' },
    { path: '/dashboard/nastavenia', label: 'Nastavenia', icon: '⚙️' },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading, signOut } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/prihlasenie');
        }
    }, [user, loading, router]);

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <span className={styles.spinner}>⏳</span>
                <p>Načítavam...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className={styles.wrapper}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <Link href="/" className={styles.logo}>
                        💇 Salon Finder
                    </Link>
                </div>

                <nav className={styles.nav}>
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`${styles.navItem} ${pathname === item.path ? styles.active : ''
                                }`}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            {item.label}
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
