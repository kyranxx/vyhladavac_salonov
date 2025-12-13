'use client';

import { useState } from 'react';
import styles from './page.module.css';

// Mock data - in production this would come from Supabase
const initialSalons = [
    { id: '1', name: 'Beauty Salon Bratislava', city: 'Bratislava', status: 'approved', isPremium: true, createdAt: '2024-12-10' },
    { id: '2', name: 'Nail Studio Košice', city: 'Košice', status: 'approved', isPremium: true, createdAt: '2024-12-09' },
    { id: '3', name: 'Wellness & Spa Žilina', city: 'Žilina', status: 'approved', isPremium: false, createdAt: '2024-12-08' },
    { id: '4', name: 'Gentleman Barbershop Nitra', city: 'Nitra', status: 'pending', isPremium: false, createdAt: '2024-12-12' },
    { id: '5', name: 'Studio Kozmetika Prešov', city: 'Prešov', status: 'pending', isPremium: false, createdAt: '2024-12-11' },
];

type SalonStatus = 'pending' | 'approved' | 'rejected';

interface Salon {
    id: string;
    name: string;
    city: string;
    status: string;
    isPremium: boolean;
    createdAt: string;
}

export default function AdminSalonsPage() {
    const [filter, setFilter] = useState('all');
    const [salons, setSalons] = useState<Salon[]>(initialSalons);
    const [editingSalon, setEditingSalon] = useState<Salon | null>(null);
    const [viewingSalon, setViewingSalon] = useState<Salon | null>(null);

    const filteredSalons = filter === 'all'
        ? salons
        : salons.filter(s => s.status === filter);

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

    const handleApprove = (id: string) => {
        if (confirm('Naozaj chcete schváliť tento salón?')) {
            setSalons(salons.map(s =>
                s.id === id ? { ...s, status: 'approved' } : s
            ));
            alert('Salón bol schválený.');
        }
    };

    const handleReject = (id: string) => {
        const reason = prompt('Zadajte dôvod zamietnutia:');
        if (reason) {
            setSalons(salons.map(s =>
                s.id === id ? { ...s, status: 'rejected' } : s
            ));
            alert('Salón bol zamietnutý.');
        }
    };

    const handleView = (salon: Salon) => {
        setViewingSalon(salon);
    };

    const handleEdit = (salon: Salon) => {
        setEditingSalon(salon);
    };

    const handleSaveEdit = () => {
        if (editingSalon) {
            setSalons(salons.map(s =>
                s.id === editingSalon.id ? editingSalon : s
            ));
            setEditingSalon(null);
            alert('Zmeny boli uložené.');
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
                        Všetky ({salons.length})
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'pending' ? styles.active : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        Čakajúce ({salons.filter(s => s.status === 'pending').length})
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'approved' ? styles.active : ''}`}
                        onClick={() => setFilter('approved')}
                    >
                        Schválené ({salons.filter(s => s.status === 'approved').length})
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
                            <button
                                className={styles.actionBtn}
                                title="Zobraziť"
                                onClick={() => handleView(salon)}
                            >
                                👁️
                            </button>
                            <button
                                className={styles.actionBtn}
                                title="Upraviť"
                                onClick={() => handleEdit(salon)}
                            >
                                ✏️
                            </button>
                            {salon.status === 'pending' && (
                                <>
                                    <button
                                        className={styles.approveBtn}
                                        title="Schváliť"
                                        onClick={() => handleApprove(salon.id)}
                                    >
                                        ✓
                                    </button>
                                    <button
                                        className={styles.rejectBtn}
                                        title="Zamietnuť"
                                        onClick={() => handleReject(salon.id)}
                                    >
                                        ✗
                                    </button>
                                </>
                            )}
                        </span>
                    </div>
                ))}
            </div>

            {/* View Modal */}
            {viewingSalon && (
                <div className={styles.modal} onClick={() => setViewingSalon(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2>Detail salónu</h2>
                        <div className={styles.modalBody}>
                            <p><strong>Názov:</strong> {viewingSalon.name}</p>
                            <p><strong>Mesto:</strong> {viewingSalon.city}</p>
                            <p><strong>Stav:</strong> {viewingSalon.status}</p>
                            <p><strong>Premium:</strong> {viewingSalon.isPremium ? 'Áno' : 'Nie'}</p>
                            <p><strong>Vytvorený:</strong> {viewingSalon.createdAt}</p>
                        </div>
                        <div className={styles.modalActions}>
                            <button onClick={() => setViewingSalon(null)}>Zavrieť</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingSalon && (
                <div className={styles.modal} onClick={() => setEditingSalon(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2>Upraviť salón</h2>
                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label>Názov:</label>
                                <input
                                    type="text"
                                    value={editingSalon.name}
                                    onChange={e => setEditingSalon({ ...editingSalon, name: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Mesto:</label>
                                <input
                                    type="text"
                                    value={editingSalon.city}
                                    onChange={e => setEditingSalon({ ...editingSalon, city: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={editingSalon.isPremium}
                                        onChange={e => setEditingSalon({ ...editingSalon, isPremium: e.target.checked })}
                                    />
                                    {' '}Premium salón
                                </label>
                            </div>
                        </div>
                        <div className={styles.modalActions}>
                            <button className={styles.cancelBtn} onClick={() => setEditingSalon(null)}>Zrušiť</button>
                            <button className={styles.saveBtn} onClick={handleSaveEdit}>Uložiť</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
