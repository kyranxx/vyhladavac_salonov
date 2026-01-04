'use client';

import Link from 'next/link';
import { StatusBadge } from '@/components/ui/StatusBadge';
import styles from './SalonList.module.css';

interface BaseSalon {
    id: string;
    name: string;
    city: string;
    status: string;
    tier: string;
    is_verified?: boolean;
}

interface SalonListProps {
    salons: BaseSalon[];
    onEdit: (salon: BaseSalon) => void;
    onAdd: () => void;
    loading: boolean;
}

export function SalonList({ salons, onEdit, onAdd, loading }: SalonListProps) {
    if (loading) {
        return <div className="p-8 text-center">Načítavam salóny...</div>;
    }

    if (salons.length === 0) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                </div>
                <h3>Zatiaľ nemáte žiadny salón</h3>
                <p>Zaregistrujte svoj salón a získajte nových zákazníkov.</p>
                <button onClick={onAdd} className={styles.addButton}>
                    + Pridať prvý salón
                </button>
            </div>
        );
    }

    return (
        <div className={styles.grid}>
            {salons.map((salon) => (
                <div key={salon.id} className={styles.card} onClick={() => onEdit(salon)} style={{ cursor: 'pointer' }}>
                    <div className={styles.header}>
                        <div className={styles.headerRow}>
                            <h3 className={styles.name}>{salon.name}</h3>
                            <span className={styles.editIcon} title="Kliknite pre úpravu">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                            </span>
                        </div>
                        <p className={styles.city}>{salon.city}</p>
                    </div>

                    <div className={styles.badges}>
                        <StatusBadge status={salon.status} size="sm" />
                        {salon.tier === 'premium' && (
                            <StatusBadge status="premium" size="sm" />
                        )}
                        {salon.is_verified && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Overený
                            </span>
                        )}
                    </div>

                    <div className={styles.footer}>
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(salon); }}
                            className={styles.editButton}
                        >
                            Upraviť salón
                        </button>
                    </div>
                </div>
            ))}

            <button onClick={onAdd} className={`${styles.card} ${styles.addCard}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', borderStyle: 'dashed', cursor: 'pointer' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary)' }}>+ Pridať ďalší salón</span>
            </button>
        </div>
    );
}
