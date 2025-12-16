'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/Toast';
import styles from './page.module.css';

interface Salon {
    id: string;
    name: string;
    city: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    description_sk?: string;
    category?: string;
    status: string;
    tier: string;
    created_at: string;
}

export default function AdminSalonsPage() {
    const [filter, setFilter] = useState('all');
    const [salons, setSalons] = useState<Salon[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSalon, setEditingSalon] = useState<Salon | null>(null);
    const [viewingSalon, setViewingSalon] = useState<Salon | null>(null);
    const toast = useToast();

    // Load salons from API
    useEffect(() => {
        loadSalons();
    }, []);

    const loadSalons = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/salons');
            const data = await response.json();

            if (Array.isArray(data)) {
                setSalons(data);
            } else {
                console.error('Error loading salons:', data.error);
                setSalons([]);
            }
        } catch (err) {
            console.error('Exception loading salons:', err);
            setSalons([]);
        } finally {
            setLoading(false);
        }
    };

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

    const handleApprove = async (id: string) => {
        if (!confirm('Naozaj chcete schváliť tento salón?')) return;

        try {
            const response = await fetch('/api/admin/salons', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: 'approved' }),
            });

            if (response.ok) {
                toast.success('Salón bol schválený');
                loadSalons();
            } else {
                const data = await response.json();
                toast.error('Chyba pri schvaľovaní: ' + data.error);
            }
        } catch (error) {
            toast.error('Chyba pri schvaľovaní');
        }
    };

    const handleReject = async (id: string) => {
        const reason = prompt('Zadajte dôvod zamietnutia:');
        if (!reason) return;

        try {
            const response = await fetch('/api/admin/salons', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: 'rejected' }),
            });

            if (response.ok) {
                toast.success('Salón bol zamietnutý');
                loadSalons();
            } else {
                const data = await response.json();
                toast.error('Chyba pri zamietnutí: ' + data.error);
            }
        } catch (error) {
            toast.error('Chyba pri zamietnutí');
        }
    };

    const handleView = (salon: Salon) => {
        setViewingSalon(salon);
    };

    const handleEdit = (salon: Salon) => {
        setEditingSalon(salon);
    };

    const handleSaveEdit = async () => {
        if (!editingSalon) return;

        try {
            const response = await fetch('/api/admin/salons', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingSalon.id,
                    name: editingSalon.name,
                    city: editingSalon.city,
                    tier: editingSalon.tier,
                }),
            });

            if (response.ok) {
                toast.success('Zmeny boli uložené');
                setEditingSalon(null);
                loadSalons();
            } else {
                const data = await response.json();
                toast.error('Chyba pri ukladaní: ' + data.error);
            }
        } catch (error) {
            toast.error('Chyba pri ukladaní');
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('sk-SK');
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.loading}>Načítavam salóny...</div>
            </div>
        );
    }

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

            {salons.length === 0 ? (
                <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>📋</span>
                    <h3>Žiadne salóny</h3>
                    <p>Zatiaľ neboli zaregistrované žiadne salóny.</p>
                </div>
            ) : (
                <div className={styles.table}>
                    <div className={styles.tableHeader}>
                        <span>Názov</span>
                        <span>Mesto</span>
                        <span>Stav</span>
                        <span>Tier</span>
                        <span>Dátum</span>
                        <span>Akcie</span>
                    </div>
                    {filteredSalons.map((salon) => (
                        <div key={salon.id} className={styles.tableRow}>
                            <span className={styles.salonName}>{salon.name}</span>
                            <span>{salon.city || '—'}</span>
                            <span>{getStatusBadge(salon.status)}</span>
                            <span>{salon.tier === 'premium' ? '⭐ Premium' : 'Free'}</span>
                            <span>{formatDate(salon.created_at)}</span>
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
                                {salon.status !== 'approved' && (
                                    <button
                                        className={styles.approveBtn}
                                        title="Schváliť"
                                        onClick={() => handleApprove(salon.id)}
                                    >
                                        ✓
                                    </button>
                                )}
                                {salon.status !== 'rejected' && (
                                    <button
                                        className={styles.rejectBtn}
                                        title="Zamietnuť"
                                        onClick={() => handleReject(salon.id)}
                                    >
                                        ✗
                                    </button>
                                )}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* View Modal */}
            {viewingSalon && (
                <div className={styles.modal} onClick={() => setViewingSalon(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2>Detail salónu</h2>
                        <div className={styles.modalBody}>
                            <div className={styles.detailGrid}>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Názov:</span>
                                    <span>{viewingSalon.name}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Kategória:</span>
                                    <span>{viewingSalon.category || '—'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Mesto:</span>
                                    <span>{viewingSalon.city || '—'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Adresa:</span>
                                    <span>{viewingSalon.address || '—'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Telefón:</span>
                                    <span>{viewingSalon.phone ? <a href={`tel:${viewingSalon.phone}`}>{viewingSalon.phone}</a> : '—'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Email:</span>
                                    <span>{viewingSalon.email ? <a href={`mailto:${viewingSalon.email}`}>{viewingSalon.email}</a> : '—'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Web:</span>
                                    <span>{viewingSalon.website ? <a href={viewingSalon.website} target="_blank" rel="noopener noreferrer">{viewingSalon.website}</a> : '—'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Stav:</span>
                                    <span>{getStatusBadge(viewingSalon.status)}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Tier:</span>
                                    <span>{viewingSalon.tier === 'premium' ? '⭐ Premium' : 'Free'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Vytvorený:</span>
                                    <span>{formatDate(viewingSalon.created_at)}</span>
                                </div>
                            </div>
                            {viewingSalon.description_sk && (
                                <div className={styles.detailDescription}>
                                    <span className={styles.detailLabel}>Popis:</span>
                                    <p>{viewingSalon.description_sk}</p>
                                </div>
                            )}
                        </div>
                        <div className={styles.modalActions}>
                            {viewingSalon.status !== 'approved' && (
                                <button className={styles.approveBtn} onClick={() => { handleApprove(viewingSalon.id); setViewingSalon(null); }}>
                                    ✓ Schváliť
                                </button>
                            )}
                            {viewingSalon.status !== 'rejected' && (
                                <button className={styles.rejectBtn} onClick={() => { handleReject(viewingSalon.id); setViewingSalon(null); }}>
                                    ✗ Zamietnuť
                                </button>
                            )}
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
                                    value={editingSalon.city || ''}
                                    onChange={e => setEditingSalon({ ...editingSalon, city: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Tier:</label>
                                <select
                                    value={editingSalon.tier}
                                    onChange={e => setEditingSalon({ ...editingSalon, tier: e.target.value })}
                                >
                                    <option value="free">Free</option>
                                    <option value="premium">Premium</option>
                                </select>
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
