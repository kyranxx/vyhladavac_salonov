'use client';

import { useState } from 'react';
import styles from './ServiceManager.module.css';

interface Service {
    id: string;
    name_sk: string;
    price: number | null;
    duration_minutes: number | null;
}

interface ServiceManagerProps {
    services: Service[];
    onAdd: (service: Omit<Service, 'id'>) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export function ServiceManager({ services, onAdd, onDelete }: ServiceManagerProps) {
    const [newItem, setNewItem] = useState({ name: '', price: '', duration: '30' });
    const [adding, setAdding] = useState(false);

    const handleAdd = async () => {
        if (!newItem.name || !newItem.price) return;
        setAdding(true);
        try {
            await onAdd({
                name_sk: newItem.name,
                price: parseFloat(newItem.price),
                duration_minutes: parseInt(newItem.duration),
            });
            setNewItem({ name: '', price: '', duration: '30' });
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.list}>
                {services.map((service) => (
                    <div key={service.id} className={styles.item}>
                        <div className={styles.itemInfo}>
                            <span className={styles.itemName}>{service.name_sk}</span>
                            <span className={styles.itemMeta}>
                                {service.duration_minutes} min
                            </span>
                        </div>
                        <div className={styles.itemRight}>
                            <span className={styles.price}>{service.price}€</span>
                            <button
                                className={styles.deleteButton}
                                onClick={() => onDelete(service.id)}
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.addForm}>
                <h4 className={styles.formTitle}>Pridať novú službu</h4>
                <div className={styles.formGrid}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Názov služby</label>
                        <input
                            className={styles.input}
                            placeholder="napr. Strihanie"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Cena (€)</label>
                        <input
                            className={styles.input}
                            type="number"
                            placeholder="0.00"
                            value={newItem.price}
                            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Trvanie</label>
                        <select
                            className={styles.input}
                            value={newItem.duration}
                            onChange={(e) => setNewItem({ ...newItem, duration: e.target.value })}
                        >
                            <option value="15">15 min</option>
                            <option value="30">30 min</option>
                            <option value="45">45 min</option>
                            <option value="60">60 min</option>
                            <option value="90">90 min</option>
                            <option value="120">120 min</option>
                        </select>
                    </div>
                    <button
                        className={styles.addButton}
                        onClick={handleAdd}
                        disabled={adding || !newItem.name || !newItem.price}
                    >
                        {adding ? '...' : '+ Pridať'}
                    </button>
                </div>
            </div>
        </div>
    );
}
