'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { useToast } from '@/components/ui/Toast';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { SalonList } from '@/components/dashboard/SalonList';
import { SalonForm } from '@/components/dashboard/SalonForm';
import { PhotoManager } from '@/components/dashboard/PhotoManager';
import { ServiceManager } from '@/components/dashboard/ServiceManager';
import Link from 'next/link';
import styles from './page.module.css';

// Types
interface Salon {
    id: string;
    name: string;
    slug: string;
    phone: string;
    address: string;
    city: string;
    description_sk: string;
    website: string;
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
    const { success, error: toastError } = useToast();
    const [salons, setSalons] = useState<Salon[]>([]);
    const [loadingSalons, setLoadingSalons] = useState(true);

    // Editor State
    const [editingSalon, setEditingSalon] = useState<Salon | null>(null);
    const [activeTab, setActiveTab] = useState<'info' | 'photos' | 'services'>('info');
    const [photos, setPhotos] = useState<SalonPhoto[]>([]);
    const [services, setServices] = useState<Service[]>([]);

    // Modal State
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        action: () => Promise<void>;
    }>({ isOpen: false, title: '', message: '', action: async () => { } });

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
            toastError('Nepodarilo sa načítať salóny');
        } finally {
            setLoadingSalons(false);
        }
    };

    const loadSalonDetails = async (salon: Salon) => {
        const supabase = createBrowserSupabaseClient();
        if (!supabase) return;

        try {
            const [photosResult, servicesResult] = await Promise.all([
                supabase
                    .from('photos')
                    .select('id, url, is_primary')
                    .eq('salon_id', salon.id)
                    .order('is_primary', { ascending: false }),
                supabase
                    .from('services')
                    .select('*')
                    .eq('salon_id', salon.id)
                    .order('sort_order')
            ]);

            setPhotos(photosResult.data || []);
            setServices(servicesResult.data || []);
        } catch (err) {
            console.error('Error loading details:', err);
            toastError('Nepodarilo sa načítať detaily salónu');
        }
    };

    const handleEditSalon = (salon: { id: string; name: string; city: string; status: string; tier: string }) => {
        // Find the full salon data from state
        const fullSalon = salons.find(s => s.id === salon.id);
        if (fullSalon) {
            setEditingSalon(fullSalon);
            setActiveTab('info');
            loadSalonDetails(fullSalon);
        }
    };

    const handleSaveInfo = async (data: any) => {
        if (!editingSalon) return;
        const supabase = createBrowserSupabaseClient();
        if (!supabase) return;

        try {
            const { error } = await supabase
                .from('salons')
                .update({
                    name: data.name,
                    phone: data.phone,
                    address: data.address,
                    city: data.city,
                    description_sk: data.description_sk,
                    website: data.website || null,
                })
                .eq('id', editingSalon.id);

            if (error) throw error;

            setSalons(salons.map(s =>
                s.id === editingSalon.id ? { ...s, ...data } : s
            ));
            setEditingSalon({ ...editingSalon, ...data });
            success('Zmeny boli uložené');
        } catch (err) {
            console.error('Error saving salon:', err);
            toastError('Chyba pri ukladaní');
        }
    };

    const handlePhotoUpload = async (file: File) => {
        if (!editingSalon) return;
        const supabase = createBrowserSupabaseClient();
        if (!supabase) return;

        const fileExt = file.name.split('.').pop();
        const fileName = `${editingSalon.id}/${Date.now()}.${fileExt}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('salon-images')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from('salon-images')
                .getPublicUrl(fileName);

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
                success('Fotografia bola pridaná');
            }
        } catch (err) {
            console.error('Error uploading photo:', err);
            toastError('Chyba pri nahrávaní fotografie');
        }
    };

    const handleDeletePhoto = async (photoId: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Odstrániť fotografiu?',
            message: 'Naozaj chcete odstrániť túto fotografiu? Táto akcia je nevratná.',
            action: async () => {
                const supabase = createBrowserSupabaseClient();
                if (!supabase) return;

                try {
                    const { error } = await supabase
                        .from('photos')
                        .delete()
                        .eq('id', photoId);

                    if (error) throw error;
                    setPhotos(photos.filter(p => p.id !== photoId));
                    success('Fotografia bola odstránená');
                } catch (err) {
                    console.error('Error deleting photo:', err);
                    toastError('Chyba pri odstraňovaní fotografie');
                }
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleAddService = async (serviceData: any) => {
        if (!editingSalon) return;
        const supabase = createBrowserSupabaseClient();
        if (!supabase) return;

        try {
            const { data, error } = await supabase
                .from('services')
                .insert({
                    salon_id: editingSalon.id,
                    ...serviceData,
                    is_active: true,
                    sort_order: services.length,
                })
                .select()
                .single();

            if (error) throw error;
            if (data) {
                setServices([...services, data]);
                success('Služba bola pridaná');
            }
        } catch (err) {
            console.error('Error adding service:', err);
            toastError('Chyba pri pridávaní služby');
        }
    };

    const handleDeleteService = async (serviceId: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Odstrániť službu?',
            message: 'Naozaj chcete odstrániť túto službu?',
            action: async () => {
                const supabase = createBrowserSupabaseClient();
                if (!supabase) return;

                try {
                    const { error } = await supabase
                        .from('services')
                        .delete()
                        .eq('id', serviceId);

                    if (error) throw error;
                    setServices(services.filter(s => s.id !== serviceId));
                    success('Služba bola odstránená');
                } catch (err) {
                    toastError('Chyba pri odstraňovaní služby');
                }
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    // Render Editor
    if (editingSalon) {
        return (
            <div className={styles.container}>
                <div className={styles.editorHeader}>
                    <button onClick={() => setEditingSalon(null)} className={styles.backButton}>
                        ← Späť na zoznam
                    </button>
                    <h1 className={styles.title}>Upraviť: {editingSalon.name}</h1>
                </div>

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

                <div className={styles.tabContent}>
                    {activeTab === 'info' && (
                        <SalonForm
                            initialData={{
                                name: editingSalon.name,
                                phone: editingSalon.phone || '',
                                website: editingSalon.website || '',
                                address: editingSalon.address || '',
                                city: editingSalon.city || '',
                                description_sk: editingSalon.description_sk || ''
                            }}
                            onSave={handleSaveInfo}
                        />
                    )}

                    {activeTab === 'photos' && (
                        <PhotoManager
                            photos={photos}
                            onUpload={handlePhotoUpload}
                            onDelete={handleDeletePhoto}
                        />
                    )}

                    {activeTab === 'services' && (
                        <ServiceManager
                            services={services}
                            onAdd={handleAddService}
                            onDelete={handleDeleteService}
                        />
                    )}
                </div>

                {/* Premium Banner */}
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

                <ConfirmationModal
                    isOpen={confirmModal.isOpen}
                    onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                    onConfirm={confirmModal.action}
                    title={confirmModal.title}
                    message={confirmModal.message}
                    isDanger={true}
                />
            </div>
        );
    }

    // Render List
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Moje salóny</h1>
                <p className={styles.subtitle}>Spravujte svoje salóny a pridajte nový</p>
            </div>

            <SalonList
                salons={salons}
                loading={loadingSalons}
                onEdit={handleEditSalon}
                onAdd={() => window.location.href = '/dashboard/moj-salon/new'} // Keep simple navigation for now
            />

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.action}
                title={confirmModal.title}
                message={confirmModal.message}
                isDanger={true}
            />
        </div>
    );
}
