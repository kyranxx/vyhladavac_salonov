'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface Service {
    id: string;
    name: string;
    price: string;
    duration: string;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form state
    const [newName, setNewName] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newDuration, setNewDuration] = useState('30');

    const handleAdd = () => {
        if (!newName || !newPrice) return;

        const newService: Service = {
            id: Date.now().toString(),
            name: newName,
            price: newPrice,
            duration: newDuration,
        };

        setServices([...services, newService]);
        setNewName('');
        setNewPrice('');
        setNewDuration('30');
        setIsAdding(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Naozaj chcete odstrániť túto službu?')) {
            setServices(services.filter(s => s.id !== id));
        }
    };

    const handleSave = () => {
        alert('Služby boli uložené! (V produkcii sa uložia do databázy)');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Služby</h1>
                    <p className={styles.subtitle}>Spravujte služby vášho salónu a ceník</p>
                </div>
                <button className={styles.saveButton} onClick={handleSave} disabled={services.length === 0}>
                    Uložiť zmeny
                </button>
            </div>

            <div className={styles.content}>
                {services.length === 0 && !isAdding ? (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>📋</span>
                        <h3>Zatiaľ nemáte žiadne služby</h3>
                        <p>Pridajte služby vášho salónu, aby si ich zákazníci mohli prezerať.</p>
                        <button className={styles.primaryButton} onClick={() => setIsAdding(true)}>
                            + Pridať službu
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={styles.servicesList}>
                            {services.map((service) => (
                                <div key={service.id} className={styles.serviceCard}>
                                    <div className={styles.serviceInfo}>
                                        <h3 className={styles.serviceName}>{service.name}</h3>
                                        <span className={styles.serviceDuration}>{service.duration} min</span>
                                    </div>
                                    <div className={styles.servicePrice}>{service.price} €</div>
                                    <div className={styles.serviceActions}>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => setEditingId(service.id)}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleDelete(service.id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            className={styles.addServiceButton}
                            onClick={() => setIsAdding(true)}
                        >
                            + Pridať ďalšiu službu
                        </button>
                    </>
                )}

                {/* Add Service Form */}
                {isAdding && (
                    <div className={styles.addForm}>
                        <h3>Nová služba</h3>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Názov služby</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Napr. Strihanie dámske"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Cena (€)</label>
                                <input
                                    type="number"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                    placeholder="25"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Trvanie (min)</label>
                                <select
                                    value={newDuration}
                                    onChange={(e) => setNewDuration(e.target.value)}
                                >
                                    <option value="15">15 min</option>
                                    <option value="30">30 min</option>
                                    <option value="45">45 min</option>
                                    <option value="60">60 min</option>
                                    <option value="90">90 min</option>
                                    <option value="120">120 min</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.formActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setIsAdding(false)}
                            >
                                Zrušiť
                            </button>
                            <button
                                className={styles.primaryButton}
                                onClick={handleAdd}
                                disabled={!newName || !newPrice}
                            >
                                Pridať
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
