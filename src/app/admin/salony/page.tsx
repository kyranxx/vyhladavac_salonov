'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { RejectionModal } from '@/components/admin/RejectionModal';
import { StatusBadge } from '@/components/ui/StatusBadge';
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

    // Modal States
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => Promise<void>;
    }>({ isOpen: false, title: '', message: '', onConfirm: async () => { } });

    const [rejectModal, setRejectModal] = useState<{
        isOpen: boolean;
        salonId: string;
        salonName: string;
    }>({ isOpen: false, salonId: '', salonName: '' });

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

    const handleApproveClick = (salon: Salon) => {
        setConfirmModal({
            isOpen: true,
            title: 'Schváliť salón?',
            message: `Naozaj chcete schváliť salón "${salon.name}"? Bude verejne viditeľný.`,
            onConfirm: async () => {
                try {
                    const response = await fetch('/api/admin/salons', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: salon.id, status: 'approved' }),
                    });

                    if (response.ok) {
                        toast.success('Salón bol schválený');
                        loadSalons();
                        if (viewingSalon?.id === salon.id) setViewingSalon(null);
                    } else {
                        const data = await response.json();
                        toast.error('Chyba pri schvaľovaní: ' + data.error);
                    }
                } catch (_error) {
                    toast.error('Chyba pri schvaľovaní');
                }
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleRejectClick = (salon: Salon) => {
        setRejectModal({
            isOpen: true,
            salonId: salon.id,
            salonName: salon.name
        });
    };

    const confirmReject = async (reason: string) => {
        try {
            const response = await fetch('/api/admin/salons', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: rejectModal.salonId,
                    status: 'rejected',
                    rejection_reason: reason
                }),
            });

            if (response.ok) {
                toast.success('Salón bol zamietnutý');
                loadSalons();
                if (viewingSalon?.id === rejectModal.salonId) setViewingSalon(null);
            } else {
                const data = await response.json();
                toast.error('Chyba pri zamietnutí: ' + data.error);
            }
        } catch (_error) {
            toast.error('Chyba pri zamietnutí');
        }
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
        } catch (_error) {
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
                <>
                    {/* Mobile Card Layout */}
                    <div className={styles.cardList}>
                        {filteredSalons.map((salon) => (
                            <div key={salon.id} className={styles.salonCard}>
                                <div className={styles.cardHeader}>
                                    <Link href={`/admin/salony/${salon.id}`} className={styles.salonName}>
                                        {salon.name}
                                    </Link>
                                    <div className={styles.cardBadges}>
                                        <StatusBadge status={salon.status} size="sm" />
                                    </div>
                                </div>
                                <div className={styles.cardDetails}>
                                    {salon.city && (
                                        <span className={styles.cardDetail}>📍 {salon.city}</span>
                                    )}
                                    <span className={styles.cardDetail}>
                                        {salon.tier === 'premium' ? '⭐ Premium' : '🆓 Free'}
                                    </span>
                                    <span className={styles.cardDetail}>📅 {formatDate(salon.created_at)}</span>
                                </div>
                                <div className={styles.cardActions}>
                                    <button className={styles.actionBtn} onClick={() => setViewingSalon(salon)}>
                                        👁️ Detail
                                    </button>
                                    <button className={styles.actionBtn} onClick={() => setEditingSalon(salon)}>
                                        ✏️ Upraviť
                                    </button>
                                    {salon.status !== 'approved' && (
                                        <button className={styles.approveBtn} onClick={() => handleApproveClick(salon)}>
                                            ✓ Schváliť
                                        </button>
                                    )}
                                    {salon.status !== 'rejected' && (
                                        <button className={styles.rejectBtn} onClick={() => handleRejectClick(salon)}>
                                            ✗ Zamietnuť
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table Layout */}
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
                                <div className={styles.salonName}>{salon.name}</div>
                                <span>{salon.city || '—'}</span>
                                <div><StatusBadge status={salon.status} size="sm" /></div>
                                <span>{salon.tier === 'premium' ? '⭐ Premium' : 'Free'}</span>
                                <span>{formatDate(salon.created_at)}</span>
                                <span className={styles.actions}>
                                    <button
                                        className={styles.actionBtn}
                                        title="Detail"
                                        onClick={() => setViewingSalon(salon)}
                                    >
                                        👁️
                                    </button>
                                    <button
                                        className={styles.actionBtn}
                                        title="Upraviť"
                                        onClick={() => setEditingSalon(salon)}
                                    >
                                        ✏️
                                    </button>
                                    {salon.status !== 'approved' && (
                                        <button
                                            className={styles.approveBtn}
                                            title="Schváliť"
                                            onClick={() => handleApproveClick(salon)}
                                        >
                                            ✓
                                        </button>
                                    )}
                                    {salon.status !== 'rejected' && (
                                        <button
                                            className={styles.rejectBtn}
                                            title="Zamietnuť"
                                            onClick={() => handleRejectClick(salon)}
                                        >
                                            ✗
                                        </button>
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                </>
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
                                    <StatusBadge status={viewingSalon.status} />
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
                                <button className={styles.approveBtn} onClick={() => handleApproveClick(viewingSalon)}>
                                    ✓ Schváliť
                                </button>
                            )}
                            {viewingSalon.status !== 'rejected' && (
                                <button className={styles.rejectBtn} onClick={() => handleRejectClick(viewingSalon)}>
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

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
            />

            <RejectionModal
                isOpen={rejectModal.isOpen}
                onClose={() => setRejectModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmReject}
                salonName={rejectModal.salonName}
            />
        </div>
    );
}
