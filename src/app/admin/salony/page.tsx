'use client';

import { useState } from 'react';
import styles from './page.module.css';

// Mock data
const mockSalons = [
    { id: '1', name: 'Beauty Salon Bratislava', city: 'Bratislava', status: 'approved', isPremium: true, createdAt: '2024-12-10' },
    { id: '2', name: 'Nail Studio Košice', city: 'Košice', status: 'approved', isPremium: true, createdAt: '2024-12-09' },
    { id: '3', name: 'Wellness & Spa Žilina', city: 'Žilina', status: 'approved', isPremium: false, createdAt: '2024-12-08' },
    { id: '4', name: 'Gentleman Barbershop Nitra', city: 'Nitra', status: 'pending', isPremium: false, createdAt: '2024-12-12' },
    { id: '5', name: 'Studio Kozmetika Prešov', city: 'Prešov', status: 'pending', isPremium: false, createdAt: '2024-12-11' },
];

export default function AdminSalonsPage() {
    const [filter, setFilter] = useState('all');

    const filteredSalons = filter === 'all'
        ? mockSalons
        : mockSalons.filter(s => s.status === filter);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className={styles.badgeApproved}>Schválený</span>;
            case 'pending':
                return <span className={styles.badgePending}>Čakajúci</span>;
            case 'rejected':
                return <span className={styles.badgeRejected}>Zamietnutý</span>;
            default:
                return null;
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Správa salónov</h1>
                <div className={styles.filters}>
                    <button
                        className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        Všetky ({mockSalons.length})
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'pending' ? styles.active : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        Čakajúce ({mockSalons.filter(s => s.status === 'pending').length})
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'approved' ? styles.active : ''}`}
                        onClick={() => setFilter('approved')}
                    >
                        Schválené ({mockSalons.filter(s => s.status === 'approved').length})
                    </button>
                </div>
            </div>

            <div className={styles.table}>
                <div className={styles.tableHeader}>
                    <span>Názov</span>
                    <span>Mesto</span>
                    <span>Stav</span>
                    <span>Premium</span>
                    <span>Dátum</span>
                    <span>Akcie</span>
                </div>
                {filteredSalons.map((salon) => (
                    <div key={salon.id} className={styles.tableRow}>
                        <span className={styles.salonName}>{salon.name}</span>
                        <span>{salon.city}</span>
                        <span>{getStatusBadge(salon.status)}</span>
                        <span>{salon.isPremium ? '⭐ Premium' : '—'}</span>
                        <span>{salon.createdAt}</span>
                        <span className={styles.actions}>
                            <button className={styles.actionBtn}>👁️</button>
                            <button className={styles.actionBtn}>✏️</button>
                            {salon.status === 'pending' && (
                                <>
                                    <button className={styles.approveBtn}>✓</button>
                                    <button className={styles.rejectBtn}>✗</button>
                                </>
                            )}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
