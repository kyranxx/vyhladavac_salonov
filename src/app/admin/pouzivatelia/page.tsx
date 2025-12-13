'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import styles from './page.module.css';

interface User {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string | null;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const supabase = createBrowserSupabaseClient();
        if (!supabase) {
            setLoading(false);
            return;
        }

        try {
            // Note: To list users, you typically need admin privileges
            // For now, we'll show the current authenticated user info
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setUsers([{
                    id: user.id,
                    email: user.email || '',
                    created_at: user.created_at,
                    last_sign_in_at: user.last_sign_in_at || null,
                }]);
            }
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('sk-SK', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Načítavam používateľov...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Používatelia</h1>
                    <p className={styles.subtitle}>Správa registrovaných používateľov</p>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.infoBox}>
                    <p>ℹ️ Pre kompletnú správu používateľov použite <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">Supabase Dashboard</a> → Authentication → Users</p>
                </div>

                {users.length > 0 ? (
                    <div className={styles.table}>
                        <div className={styles.tableHeader}>
                            <span>E-mail</span>
                            <span>Vytvorený</span>
                            <span>Posledné prihlásenie</span>
                        </div>
                        {users.map((user) => (
                            <div key={user.id} className={styles.tableRow}>
                                <span>{user.email}</span>
                                <span>{formatDate(user.created_at)}</span>
                                <span>{formatDate(user.last_sign_in_at)}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>👥</span>
                        <h3>Žiadni používatelia</h3>
                        <p>Zatiaľ sa nezaregistroval žiadny používateľ.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
