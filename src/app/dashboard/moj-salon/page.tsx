'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import Link from 'next/link';
import styles from './page.module.css';

interface Salon {
    id: string;
    name: string;
    slug: string;
    phone: string;
    address: string;
    city: string;
    description_sk: string | null;
    website: string | null;
    status: string;
    tier: string;
    is_featured: boolean;
    is_verified: boolean;
    logo_url: string | null;
    created_at: string;
}

interface SalonPhoto {
    id: string;
    url: string;
    is_primary: boolean;
}

interface Service {
    id: string;
    name_sk: string;
    price: number | null;
    duration_minutes: number | null;
    is_active: boolean;
}

export default function MySalonsPage() {
    const { user } = useAuth();
    const [salons, setSalons] = useState<Salon[]>([]);
    const [loadingSalons, setLoadingSalons] = useState(true);
    const [editingSalon, setEditingSalon] = useState<Salon | null>(null);
    const [photos, setPhotos] = useState<SalonPhoto[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'info' | 'photos' | 'services'>('info');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Edit form state
    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        description_sk: '',
        website: '',
    });

    // New service form
    const [newService, setNewService] = useState({ name: '', price: '', duration: '30' });
    const [addingService, setAddingService] = useState(false);

    useEffect(() => {
        if (user) {
            loadSalons();
        }
    }, [user]);

    const loadSalons = async () => {
        const supabase = createBrowserSupabaseClient();
        if (!supabase || !user) return;

        try {
            const { data, error } = await supabase
                .from('salons')
                .select('*')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSalons(data || []);
        } catch (err) {
            console.error('Error loading salons:', err);
        } finally {
            setLoadingSalons(false);
        }
    };

    const loadSalonDetails = async (salon: Salon) => {
        const supabase = createBrowserSupabaseClient();
        if (!supabase) return;

        // Load photos
        const { data: photosData } = await supabase
            .from('photos')
            .select('id, url, is_primary')
            .eq('salon_id', salon.id)
            .order('is_primary', { ascending: false });

        setPhotos(photosData || []);

        // Load services
        const { data: servicesData } = await supabase
            .from('services')
            .select('*')
            .eq('salon_id', salon.id)
            .order('sort_order');

        setServices(servicesData || []);
    };

    const handleEditSalon = (salon: Salon) => {
        setEditingSalon(salon);
        setEditForm({
            name: salon.name,
            phone: salon.phone || '',
            address: salon.address || '',
            city: salon.city || '',
            description_sk: salon.description_sk || '',
            website: salon.website || '',
        });
        setActiveTab('info');
        loadSalonDetails(salon);
    };

    const handleSaveInfo = async () => {
        if (!editingSalon) return;
        const supabase = createBrowserSupabaseClient();
        if (!supabase) return;

        setSaving(true);
        try {
            const { error } = await supabase
                .from('salons')
                .update({
                    name: editForm.name,
                    phone: editForm.phone,
                    address: editForm.address,
                    city: editForm.city,
                    description_sk: editForm.description_sk,
                    website: editForm.website || null,
                })
                .eq('id', editingSalon.id);

            if (error) throw error;

            // Update local state
            setSalons(salons.map(s =>
                s.id === editingSalon.id
                    ? { ...s, ...editForm }
                    : s
            ));
            setEditingSalon({ ...editingSalon, ...editForm });
            alert('Zmeny boli uložené!');
        } catch (err) {
            console.error('Error saving salon:', err);
            alert('Chyba pri ukladaní.');
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length || !editingSalon) return;
        const supabase = createBrowserSupabaseClient();
        if (!supabase) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${editingSalon.id}/${Date.now()}.${fileExt}`;

        setSaving(true);
        try {
            // Upload to storage
            const { error: uploadError } = await supabase.storage
                .from('salon-images')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('salon-images')
                .getPublicUrl(fileName);

            // Save to photos table
            const { data: photoData, error: dbError } = await supabase
                .from('photos')
                .insert({
                    salon_id: editingSalon.id,
                    url: urlData.publicUrl,
                    is_primary: photos.length === 0,
                })
                .select()
                .single();

            if (dbError) throw dbError;

            if (photoData) {
                setPhotos([...photos, photoData]);
            }
        } catch (err) {
            console.error('Error uploading photo:', err);
            alert('Chyba pri nahrávaní fotografie.');
        } finally {
            setSaving(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDeletePhoto = async (photoId: string) => {
        if (!confirm('Naozaj chcete odstrániť túto fotografiu?')) return;
        const supabase = createBrowserSupabaseClient();
        if (!supabase) return;

        try {
            const { error } = await supabase
                .from('photos')
                .delete()
                .eq('id', photoId);

            if (error) throw error;
            setPhotos(photos.filter(p => p.id !== photoId));
        } catch (err) {
            console.error('Error deleting photo:', err);
        }
    };

    const handleAddService = async () => {
        if (!newService.name || !newService.price || !editingSalon) return;
        const supabase = createBrowserSupabaseClient();
        if (!supabase) return;

        setSaving(true);
        try {
            const { data, error } = await supabase
                .from('services')
                .insert({
                    salon_id: editingSalon.id,
                    name_sk: newService.name,
                    price: parseFloat(newService.price),
                    duration_minutes: parseInt(newService.duration),
                    is_active: true,
                    sort_order: services.length,
                })
                .select()
                .single();

            if (error) throw error;

            if (data) {
                setServices([...services, data]);
            }
            setNewService({ name: '', price: '', duration: '30' });
            setAddingService(false);
        } catch (err) {
            console.error('Error adding service:', err);
            alert('Chyba pri pridávaní služby.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteService = async (serviceId: string) => {
        if (!confirm('Naozaj chcete odstrániť túto službu?')) return;
        const supabase = createBrowserSupabaseClient();
        if (!supabase) return;

        try {
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', serviceId);

            if (error) throw error;
            setServices(services.filter(s => s.id !== serviceId));
        } catch (err) {
            console.error('Error deleting service:', err);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return { text: 'Schválený', class: styles.statusApproved };
            case 'pending': return { text: 'Čaká na schválenie', class: styles.statusPending };
            case 'rejected': return { text: 'Zamietnutý', class: styles.statusRejected };
            default: return { text: status, class: '' };
        }
    };

    // Show salon editor if editing
    if (editingSalon) {
        return (
            <div className={styles.container}>
                <div className={styles.editorHeader}>
                    <button onClick={() => setEditingSalon(null)} className={styles.backButton}>
                        ← Späť na zoznam
                    </button>
                    <h1 className={styles.title}>Upraviť: {editingSalon.name}</h1>
                </div>

                {/* Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'info' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('info')}
                    >
                        📝 Základné údaje
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'photos' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('photos')}
                    >
                        📷 Fotografie ({photos.length})
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'services' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('services')}
                    >
                        📋 Služby ({services.length})
                    </button>
                </div>

                {/* Tab Content */}
                <div className={styles.tabContent}>
                    {activeTab === 'info' && (
                        <div className={styles.infoForm}>
                            <div className={styles.formGroup}>
                                <label>Názov salónu</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                />
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Telefón</label>
                                    <input
                                        type="tel"
                                        value={editForm.phone}
                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Webová stránka</label>
                                    <input
                                        type="url"
                                        value={editForm.website}
                                        onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                                        placeholder="https://"
                                    />
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Ulica a číslo</label>
                                    <input
                                        type="text"
                                        value={editForm.address}
                                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Mesto</label>
                                    <input
                                        type="text"
                                        value={editForm.city}
                                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Popis salónu</label>
                                <textarea
                                    value={editForm.description_sk}
                                    onChange={(e) => setEditForm({ ...editForm, description_sk: e.target.value })}
                                    rows={5}
                                />
                            </div>
                            <button
                                className={styles.saveButton}
                                onClick={handleSaveInfo}
                                disabled={saving}
                            >
                                {saving ? 'Ukladám...' : '💾 Uložiť zmeny'}
                            </button>
                        </div>
                    )}

                    {activeTab === 'photos' && (
                        <div className={styles.photosSection}>
                            <div className={styles.uploadArea}>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    style={{ display: 'none' }}
                                />
                                <button
                                    className={styles.uploadButton}
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={saving}
                                >
                                    {saving ? 'Nahrávam...' : '📷 Pridať fotografiu'}
                                </button>
                                <p className={styles.uploadHint}>JPG, PNG, max 5MB</p>
                            </div>

                            <div className={styles.photosGrid}>
                                {photos.map((photo) => (
                                    <div key={photo.id} className={styles.photoCard}>
                                        <img src={photo.url} alt="Salon photo" />
                                        {photo.is_primary && (
                                            <span className={styles.primaryBadge}>Hlavná</span>
                                        )}
                                        <button
                                            className={styles.deletePhotoBtn}
                                            onClick={() => handleDeletePhoto(photo.id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                                {photos.length === 0 && (
                                    <p className={styles.emptyText}>Zatiaľ žiadne fotografie</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'services' && (
                        <div className={styles.servicesSection}>
                            <div className={styles.servicesList}>
                                {services.map((service) => (
                                    <div key={service.id} className={styles.serviceItem}>
                                        <div className={styles.serviceInfo}>
                                            <span className={styles.serviceName}>{service.name_sk}</span>
                                            <span className={styles.serviceMeta}>
                                                {service.duration_minutes} min
                                            </span>
                                        </div>
                                        <div className={styles.servicePrice}>{service.price}€</div>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleDeleteService(service.id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {addingService ? (
                                <div className={styles.addServiceForm}>
                                    <input
                                        type="text"
                                        placeholder="Názov služby"
                                        value={newService.name}
                                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Cena €"
                                        value={newService.price}
                                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                    />
                                    <select
                                        value={newService.duration}
                                        onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                                    >
                                        <option value="15">15 min</option>
                                        <option value="30">30 min</option>
                                        <option value="45">45 min</option>
                                        <option value="60">60 min</option>
                                        <option value="90">90 min</option>
                                        <option value="120">120 min</option>
                                    </select>
                                    <div className={styles.formActions}>
                                        <button onClick={() => setAddingService(false)}>Zrušiť</button>
                                        <button
                                            onClick={handleAddService}
                                            disabled={saving || !newService.name || !newService.price}
                                            className={styles.primaryBtn}
                                        >
                                            {saving ? 'Pridávam...' : 'Pridať'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    className={styles.addServiceBtn}
                                    onClick={() => setAddingService(true)}
                                >
                                    + Pridať službu
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Premium Features */}
                <div className={styles.premiumSection}>
                    <h2>🌟 Prémiové funkcie</h2>
                    <div className={styles.premiumCards}>
                        <div className={styles.premiumCard}>
                            <div className={styles.premiumIcon}>⭐</div>
                            <h3>Zvýraznený salón</h3>
                            <p>Váš salón bude zobrazený na vrchu výsledkov vyhľadávania</p>
                            {editingSalon.is_featured ? (
                                <span className={styles.activeBadge}>✅ Aktívne</span>
                            ) : (
                                <Link href="/dashboard/predplatne" className={styles.upgradeBtn}>
                                    Aktivovať
                                </Link>
                            )}
                        </div>
                        <div className={styles.premiumCard}>
                            <div className={styles.premiumIcon}>✓</div>
                            <h3>Overený salón</h3>
                            <p>Získajte odznaku overenia a zvýšte dôveru zákazníkov</p>
                            {editingSalon.is_verified ? (
                                <span className={styles.activeBadge}>✅ Aktívne</span>
                            ) : (
                                <Link href="/dashboard/predplatne" className={styles.upgradeBtn}>
                                    Aktivovať
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // List of salons
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Moje salóny</h1>
                <p className={styles.subtitle}>Spravujte svoje salóny a pridajte nový</p>
            </div>

            <div className={styles.content}>
                {loadingSalons ? (
                    <p>Načítavam...</p>
                ) : salons.length === 0 ? (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>🏪</span>
                        <h3>Zatiaľ nemáte žiadny salón</h3>
                        <p>Zaregistrujte svoj salón a získajte nových zákazníkov.</p>
                        <Link href="/dashboard/moj-salon/new" className={styles.primaryButton}>
                            + Pridať prvý salón
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className={styles.salonsList}>
                            {salons.map((salon) => {
                                const badge = getStatusBadge(salon.status);
                                return (
                                    <div key={salon.id} className={styles.salonCard}>
                                        <div className={styles.salonInfo}>
                                            <h3 className={styles.salonName}>{salon.name}</h3>
                                            <p className={styles.salonCity}>{salon.city}</p>
                                        </div>
                                        <div className={styles.salonMeta}>
                                            <span className={`${styles.statusBadge} ${badge.class}`}>
                                                {badge.text}
                                            </span>
                                            {salon.tier === 'premium' && (
                                                <span className={styles.premiumBadge}>⭐ Premium</span>
                                            )}
                                            {salon.is_verified && (
                                                <span className={styles.verifiedBadge}>✓ Overený</span>
                                            )}
                                        </div>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => handleEditSalon(salon)}
                                        >
                                            ✏️ Upraviť
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <Link href="/dashboard/moj-salon/new" className={styles.addButton}>
                            + Pridať ďalší salón
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
