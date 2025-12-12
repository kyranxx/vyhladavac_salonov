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
const ADMIN_EMAILS = ['admin@salonfinder.sk', 'admin@apollotech.sk'];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading, signOut } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);

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

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    if (loading || !isAdmin) {
        return (
            <div className={styles.loading}>
                <span className={styles.spinner}>⏳</span>
                <p>Načítavam...</p>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <Link href="/admin" className={styles.logo}>
                        🔧 Admin Panel
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
