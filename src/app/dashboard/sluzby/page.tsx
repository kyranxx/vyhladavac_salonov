'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import styles from './page.module.css';

interface Service {
    id: string;
    name_sk: string;
    price: number | null;
    duration_minutes: number | null;
    is_active: boolean;
}

export default function ServicesPage() {
    const { user } = useAuth();
    const [services, setServices] = useState<Service[]>([]);
    const [salonId, setSalonId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form state
    const [newName, setNewName] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newDuration, setNewDuration] = useState('30');

    // Edit form state
    const [editName, setEditName] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editDuration, setEditDuration] = useState('30');

    useEffect(() => {
        if (user) {
            loadServices();
        }
    }, [user]);

    const loadServices = async () => {
        const supabase = createBrowserSupabaseClient();
        if (!supabase || !user) return;

        try {
            // Get user's salon
            const { data: salon } = await supabase
                .from('salons')
                .select('id')
                .eq('owner_id', user.id)
                .single();

            if (salon) {
                setSalonId(salon.id);

                // Get services for this salon
                const { data: servicesData } = await supabase
                    .from('services')
                    .select('*')
                    .eq('salon_id', salon.id)
                    .order('sort_order');

                if (servicesData) {
                    setServices(servicesData);
                }
            }
        } catch (error) {
            console.error('Error loading services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newName || !newPrice || !salonId) return;

        const supabase = createBrowserSupabaseClient();
        if (!supabase) return;

        setSaving(true);
        try {
            const { data, error } = await supabase
                .from('services')
                .insert({
                    salon_id: salonId,
                    name_sk: newName,
                    price: parseFloat(newPrice),
                    duration_minutes: parseInt(newDuration),
                    is_active: true,
                    sort_order: services.length,
                })
                .select()
                .single();

            if (error) throw error;

            if (data) {
                setServices([...services, data]);
            }

            setNewName('');
            setNewPrice('');
            setNewDuration('30');
            setIsAdding(false);
        } catch (error) {
            console.error('Error adding service:', error);
            alert('Chyba pri pridávaní služby.');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (service: Service) => {
        setEditingId(service.id);
        setEditName(service.name_sk);
        setEditPrice(service.price?.toString() || '');
        setEditDuration(service.duration_minutes?.toString() || '30');
    };

    const handleUpdate = async () => {
        if (!editingId || !editName) return;

        const supabase = createBrowserSupabaseClient();
        if (!supabase) return;

        setSaving(true);
        try {
            const { error } = await supabase
                .from('services')
                .update({
                    name_sk: editName,
                    price: parseFloat(editPrice) || null,
                    duration_minutes: parseInt(editDuration) || null,
                })
                .eq('id', editingId);

            if (error) throw error;

            setServices(services.map(s =>
                s.id === editingId
                    ? { ...s, name_sk: editName, price: parseFloat(editPrice) || null, duration_minutes: parseInt(editDuration) || null }
                    : s
            ));

            setEditingId(null);
        } catch (error) {
            console.error('Error updating service:', error);
            alert('Chyba pri aktualizácii služby.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Naozaj chcete odstrániť túto službu?')) return;

        const supabase = createBrowserSupabaseClient();
        if (!supabase) return;

        try {
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setServices(services.filter(s => s.id !== id));
        } catch (error) {
            console.error('Error deleting service:', error);
            alert('Chyba pri mazaní služby.');
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <p>Načítavam...</p>
            </div>
        );
    }

    if (!salonId) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>🏪</span>
                    <h3>Najskôr vytvorte salón</h3>
                    <p>Pre správu služieb musíte mať zaregistrovaný salón.</p>
                    <a href="/dashboard/moj-salon" className={styles.primaryButton}>
                        Vytvoriť salón
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Služby</h1>
                    <p className={styles.subtitle}>Spravujte služby vášho salónu a ceník</p>
                </div>
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
                                    {editingId === service.id ? (
                                        <div className={styles.editForm}>
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className={styles.editInput}
                                            />
                                            <input
                                                type="number"
                                                value={editPrice}
                                                onChange={(e) => setEditPrice(e.target.value)}
                                                className={styles.editInput}
                                                placeholder="Cena"
                                            />
                                            <select
                                                value={editDuration}
                                                onChange={(e) => setEditDuration(e.target.value)}
                                                className={styles.editInput}
                                            >
                                                <option value="15">15 min</option>
                                                <option value="30">30 min</option>
                                                <option value="45">45 min</option>
                                                <option value="60">60 min</option>
                                                <option value="90">90 min</option>
                                                <option value="120">120 min</option>
                                            </select>
                                            <div className={styles.editActions}>
                                                <button onClick={() => setEditingId(null)} className={styles.cancelButton}>
                                                    Zrušiť
                                                </button>
                                                <button onClick={handleUpdate} disabled={saving} className={styles.primaryButton}>
                                                    {saving ? 'Ukladám...' : 'Uložiť'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className={styles.serviceInfo}>
                                                <h3 className={styles.serviceName}>{service.name_sk}</h3>
                                                <span className={styles.serviceDuration}>
                                                    {service.duration_minutes} min
                                                </span>
                                            </div>
                                            <div className={styles.servicePrice}>
                                                {service.price} €
                                            </div>
                                            <div className={styles.serviceActions}>
                                                <button
                                                    className={styles.editButton}
                                                    onClick={() => handleEdit(service)}
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
                                        </>
                                    )}
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
                                disabled={!newName || !newPrice || saving}
                            >
                                {saving ? 'Pridávam...' : 'Pridať'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
