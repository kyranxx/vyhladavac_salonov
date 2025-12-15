'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import styles from './page.module.css';

interface Salon {
    id: string;
    name: string;
    city: string;
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

    const supabase = createBrowserSupabaseClient();

    // Load salons from database
    useEffect(() => {
        loadSalons();
    }, []);

    const loadSalons = async () => {
        if (!supabase) {
            console.error('Supabase not configured');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            console.log('Loading salons...');

            const { data, error } = await supabase
                .from('salons')
                .select('*')
                .order('created_at', { ascending: false });

            console.log('Salons result:', { data, error });

            if (error) {
                console.error('Error loading salons:', error);
                // Try to show anything we can
                setSalons([]);
            } else {
                setSalons(data || []);
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
        if (!supabase) return;
        if (!confirm('Naozaj chcete schváliť tento salón?')) return;

        const { error } = await supabase
            .from('salons')
            .update({ status: 'approved' })
            .eq('id', id);

        if (error) {
            alert('Chyba pri schvaľovaní: ' + error.message);
        } else {
            alert('Salón bol schválený.');
            loadSalons(); // Reload from database
        }
    };

    const handleReject = async (id: string) => {
        if (!supabase) return;
        const reason = prompt('Zadajte dôvod zamietnutia:');
        if (!reason) return;

        const { error } = await supabase
            .from('salons')
            .update({ status: 'rejected' })
            .eq('id', id);

        if (error) {
            alert('Chyba pri zamietnutí: ' + error.message);
        } else {
            alert('Salón bol zamietnutý.');
            loadSalons();
        }
    };

    const handleView = (salon: Salon) => {
        setViewingSalon(salon);
    };

    const handleEdit = (salon: Salon) => {
        setEditingSalon(salon);
    };

    const handleSaveEdit = async () => {
        if (!editingSalon || !supabase) return;

        const { error } = await supabase
            .from('salons')
            .update({
                name: editingSalon.name,
                city: editingSalon.city,
                tier: editingSalon.tier,
            })
            .eq('id', editingSalon.id);

        if (error) {
            alert('Chyba pri ukladaní: ' + error.message);
        } else {
            alert('Zmeny boli uložené.');
            setEditingSalon(null);
            loadSalons();
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
            )}

            {/* View Modal */}
            {viewingSalon && (
                <div className={styles.modal} onClick={() => setViewingSalon(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2>Detail salónu</h2>
                        <div className={styles.modalBody}>
                            <p><strong>Názov:</strong> {viewingSalon.name}</p>
                            <p><strong>Mesto:</strong> {viewingSalon.city || '—'}</p>
                            <p><strong>Stav:</strong> {viewingSalon.status}</p>
                            <p><strong>Tier:</strong> {viewingSalon.tier}</p>
                            <p><strong>Vytvorený:</strong> {formatDate(viewingSalon.created_at)}</p>
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
