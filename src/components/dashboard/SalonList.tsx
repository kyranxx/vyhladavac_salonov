'use client';

import Link from 'next/link';
import { StatusBadge } from '@/components/ui/StatusBadge';
import styles from './SalonList.module.css';

interface Salon {
    id: string;
    name: string;
    city: string;
    status: string;
    tier: string;
    is_verified: boolean;
}

interface SalonListProps {
    salons: Salon[];
    onEdit: (salon: Salon) => void;
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
                <span className={styles.emptyIcon}>🏪</span>
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
                <div key={salon.id} className={styles.card}>
                    <div className={styles.header}>
                        <h3 className={styles.name}>{salon.name}</h3>
                        <p className={styles.city}>📍 {salon.city}</p>
                    </div>

                    <div className={styles.badges}>
                        <StatusBadge status={salon.status} size="sm" />
                        {salon.tier === 'premium' && (
                            <StatusBadge status="premium" size="sm" />
                        )}
                        {salon.is_verified && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                ✓ Overený
                            </span>
                        )}
                    </div>

                    <div className={styles.footer}>
                        <button
                            onClick={() => onEdit(salon)}
                            className={styles.editButton}
                        >
                            ✏️ Upraviť
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
