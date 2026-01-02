'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';
import styles from './page.module.css';

interface Category {
    id: number;
    name_sk: string;
    name_en: string;
    icon: string | null;
}

interface Service {
    id: string;
    name_sk: string;
    name_en: string | null;
    price: number | null;
    price_to: number | null;
    duration_minutes: number | null;
}

interface OpeningHours {
    day_of_week: number;
    open_time: string | null;
    close_time: string | null;
    is_closed: boolean;
}

interface Photo {
    id: string;
    url: string;
    alt_text: string | null;
}

interface Owner {
    id: string;
    email: string;
    full_name: string | null;
}

interface Salon {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    address: string;
    city: string;
    postal_code: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    latitude: number | null;
    longitude: number | null;
    status: 'pending' | 'approved' | 'rejected';
    tier: string;
    is_premium: boolean;
    is_verified: boolean;
    is_featured: boolean;
    rating_avg: number | null;
    rating_count: number;
    created_at: string;
    owner_id: string;
    salon_categories?: { category: Category }[];
    services?: Service[];
    opening_hours?: OpeningHours[];
    photos?: Photo[];
    owner?: Owner | null;
}

const DAYS = ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota', 'Nedeľa'];

export default function SalonDetailPage() {
    const router = useRouter();
    const params = useParams();
    const salonId = params.id as string;
    const toast = useToast();

    const [salon, setSalon] = useState<Salon | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'info' | 'services' | 'hours' | 'photos'>('info');
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState<Partial<Salon>>({});
    const [deleteModal, setDeleteModal] = useState(false);

    useEffect(() => {
        loadSalon();
    }, [salonId]);

    const loadSalon = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/salons/${salonId}`);
            if (!response.ok) {
                throw new Error('Salon not found');
            }
            const data = await response.json();
            setSalon(data);
            setEditData(data);
        } catch (error) {
            console.error('Error loading salon:', error);
            toast.error('Nepodarilo sa načítať salón');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!salon) return;

        try {
            setSaving(true);
            const response = await fetch(`/api/admin/salons/${salonId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
            });

            if (response.ok) {
                const updated = await response.json();
                setSalon({ ...salon, ...updated });
                setEditMode(false);
                toast.success('Zmeny boli uložené');
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Nepodarilo sa uložiť zmeny');
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async (newStatus: 'approved' | 'pending' | 'rejected') => {
        if (!salon) return;

        try {
            setSaving(true);
            const response = await fetch(`/api/admin/salons/${salonId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                setSalon({ ...salon, status: newStatus });
                toast.success(`Stav zmenený na: ${newStatus === 'approved' ? 'Schválený' : newStatus === 'rejected' ? 'Zamietnutý' : 'Čakajúci'}`);
            }
        } catch (error) {
            toast.error('Nepodarilo sa zmeniť stav');
        } finally {
            setSaving(false);
        }
    };

    const handleTierChange = async (newTier: 'free' | 'premium') => {
        if (!salon) return;

        try {
            setSaving(true);
            const response = await fetch(`/api/admin/salons/${salonId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tier: newTier, is_premium: newTier === 'premium' })
            });

            if (response.ok) {
                setSalon({ ...salon, tier: newTier, is_premium: newTier === 'premium' });
                toast.success(`Plán zmenený na: ${newTier === 'premium' ? 'Premium' : 'Free'}`);
            }
        } catch (error) {
            toast.error('Nepodarilo sa zmeniť plán');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            setSaving(true);
            const response = await fetch(`/api/admin/salons/${salonId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success('Salón bol odstránený');
                router.push('/admin/salony');
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            toast.error('Nepodarilo sa odstrániť salón');
        } finally {
            setSaving(false);
            setDeleteModal(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('sk-SK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <span>Načítavam salón...</span>
                </div>
            </div>
        );
    }

    if (!salon) {
        return (
            <div className={styles.container}>
                <div className={styles.notFound}>
                    <span className={styles.notFoundIcon}>🔍</span>
                    <h2>Salón nebol nájdený</h2>
                    <p>Salón s týmto ID neexistuje alebo bol odstránený.</p>
                    <Link href="/admin/salony" className={styles.backLink}>
                        ← Späť na zoznam salónov
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Breadcrumbs - Mobile friendly */}
            <nav className={styles.breadcrumbs}>
                <Link href="/admin/salony" className={styles.breadcrumbLink}>
                    ← Salóny
                </Link>
                <span className={styles.breadcrumbSeparator}>/</span>
                <span className={styles.breadcrumbCurrent}>{salon.name}</span>
            </nav>

            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerMain}>
                    <h1 className={styles.title}>{salon.name}</h1>
                    <div className={styles.badges}>
                        <span className={`${styles.statusBadge} ${styles[`status_${salon.status}`]}`}>
                            {salon.status === 'approved' ? 'Schválený' : salon.status === 'pending' ? 'Čakajúci' : 'Zamietnutý'}
                        </span>
                        <span className={`${styles.tierBadge} ${salon.tier === 'premium' ? styles.premium : ''}`}>
                            {salon.tier === 'premium' ? '⭐ Premium' : 'Free'}
                        </span>
                    </div>
                </div>
                <p className={styles.subtitle}>
                    📍 {salon.city}{salon.address ? `, ${salon.address}` : ''}
                </p>
            </header>

            {/* Quick Actions - Mobile optimized */}
            <div className={styles.quickActions}>
                <div className={styles.actionGroup}>
                    <label className={styles.actionLabel}>Stav:</label>
                    <div className={styles.actionButtons}>
                        <button
                            className={`${styles.statusBtn} ${salon.status === 'approved' ? styles.active : ''}`}
                            onClick={() => handleStatusChange('approved')}
                            disabled={saving}
                        >
                            ✓ Schváliť
                        </button>
                        <button
                            className={`${styles.statusBtn} ${styles.reject} ${salon.status === 'rejected' ? styles.active : ''}`}
                            onClick={() => handleStatusChange('rejected')}
                            disabled={saving}
                        >
                            ✗ Zamietnuť
                        </button>
                    </div>
                </div>
                <div className={styles.actionGroup}>
                    <label className={styles.actionLabel}>Plán:</label>
                    <div className={styles.actionButtons}>
                        <button
                            className={`${styles.tierBtn} ${salon.tier === 'free' ? styles.active : ''}`}
                            onClick={() => handleTierChange('free')}
                            disabled={saving}
                        >
                            Free
                        </button>
                        <button
                            className={`${styles.tierBtn} ${styles.premiumBtn} ${salon.tier === 'premium' ? styles.active : ''}`}
                            onClick={() => handleTierChange('premium')}
                            disabled={saving}
                        >
                            ⭐ Premium
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs - Mobile scrollable */}
            <div className={styles.tabsWrapper}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'info' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('info')}
                    >
                        📋 Info
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'services' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('services')}
                    >
                        ✂️ Služby
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'hours' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('hours')}
                    >
                        🕐 Hodiny
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'photos' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('photos')}
                    >
                        📷 Fotky
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
                {/* Info Tab */}
                {activeTab === 'info' && (
                    <div className={styles.infoTab}>
                        {!editMode ? (
                            <>
                                <div className={styles.infoSection}>
                                    <h3 className={styles.sectionTitle}>Základné údaje</h3>
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Názov</span>
                                            <span className={styles.infoValue}>{salon.name}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Slug</span>
                                            <span className={styles.infoValue}>{salon.slug}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Mesto</span>
                                            <span className={styles.infoValue}>{salon.city || '—'}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Adresa</span>
                                            <span className={styles.infoValue}>{salon.address || '—'}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>PSČ</span>
                                            <span className={styles.infoValue}>{salon.postal_code || '—'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.infoSection}>
                                    <h3 className={styles.sectionTitle}>Kontakt</h3>
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Telefón</span>
                                            <span className={styles.infoValue}>
                                                {salon.phone ? (
                                                    <a href={`tel:${salon.phone}`}>{salon.phone}</a>
                                                ) : '—'}
                                            </span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Email</span>
                                            <span className={styles.infoValue}>
                                                {salon.email ? (
                                                    <a href={`mailto:${salon.email}`}>{salon.email}</a>
                                                ) : '—'}
                                            </span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Web</span>
                                            <span className={styles.infoValue}>
                                                {salon.website ? (
                                                    <a href={salon.website} target="_blank" rel="noopener noreferrer">
                                                        {salon.website}
                                                    </a>
                                                ) : '—'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.infoSection}>
                                    <h3 className={styles.sectionTitle}>Kategórie</h3>
                                    <div className={styles.categories}>
                                        {salon.salon_categories && salon.salon_categories.length > 0 ? (
                                            salon.salon_categories.map((sc, idx) => (
                                                <span key={idx} className={styles.categoryTag}>
                                                    {sc.category.icon} {sc.category.name_sk}
                                                </span>
                                            ))
                                        ) : (
                                            <span className={styles.noData}>Žiadne kategórie</span>
                                        )}
                                    </div>
                                </div>

                                {salon.description && (
                                    <div className={styles.infoSection}>
                                        <h3 className={styles.sectionTitle}>Popis</h3>
                                        <p className={styles.description}>{salon.description}</p>
                                    </div>
                                )}

                                <div className={styles.infoSection}>
                                    <h3 className={styles.sectionTitle}>Vlastník</h3>
                                    <div className={styles.ownerCard}>
                                        {salon.owner ? (
                                            <>
                                                <span className={styles.ownerName}>
                                                    {salon.owner.full_name || 'Bez mena'}
                                                </span>
                                                <span className={styles.ownerEmail}>{salon.owner.email}</span>
                                                <Link
                                                    href={`/admin/pouzivatelia?search=${encodeURIComponent(salon.owner.email)}`}
                                                    className={styles.ownerLink}
                                                >
                                                    Zobraziť používateľa →
                                                </Link>
                                            </>
                                        ) : (
                                            <span className={styles.noData}>Neznámy vlastník</span>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.infoSection}>
                                    <h3 className={styles.sectionTitle}>Štatistiky</h3>
                                    <div className={styles.statsGrid}>
                                        <div className={styles.statItem}>
                                            <span className={styles.statValue}>{salon.rating_avg?.toFixed(1) || '—'}</span>
                                            <span className={styles.statLabel}>Hodnotenie</span>
                                        </div>
                                        <div className={styles.statItem}>
                                            <span className={styles.statValue}>{salon.rating_count}</span>
                                            <span className={styles.statLabel}>Recenzií</span>
                                        </div>
                                        <div className={styles.statItem}>
                                            <span className={styles.statValue}>{salon.is_verified ? '✓' : '✗'}</span>
                                            <span className={styles.statLabel}>Overený</span>
                                        </div>
                                        <div className={styles.statItem}>
                                            <span className={styles.statValue}>{salon.is_featured ? '✓' : '✗'}</span>
                                            <span className={styles.statLabel}>Odporúčaný</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.infoSection}>
                                    <h3 className={styles.sectionTitle}>Metadáta</h3>
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>ID</span>
                                            <span className={styles.infoValueMono}>{salon.id}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Vytvorený</span>
                                            <span className={styles.infoValue}>{formatDate(salon.created_at)}</span>
                                        </div>
                                        {salon.latitude && salon.longitude && (
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>Súradnice</span>
                                                <span className={styles.infoValue}>
                                                    {salon.latitude.toFixed(6)}, {salon.longitude.toFixed(6)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.editActions}>
                                    <button
                                        className={styles.editButton}
                                        onClick={() => setEditMode(true)}
                                    >
                                        ✏️ Upraviť údaje
                                    </button>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => setDeleteModal(true)}
                                    >
                                        🗑️ Odstrániť salón
                                    </button>
                                </div>
                            </>
                        ) : (
                            /* Edit Mode */
                            <div className={styles.editForm}>
                                <div className={styles.formGroup}>
                                    <label>Názov</label>
                                    <input
                                        type="text"
                                        value={editData.name || ''}
                                        onChange={e => setEditData({ ...editData, name: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Slug</label>
                                    <input
                                        type="text"
                                        value={editData.slug || ''}
                                        onChange={e => setEditData({ ...editData, slug: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Mesto</label>
                                        <input
                                            type="text"
                                            value={editData.city || ''}
                                            onChange={e => setEditData({ ...editData, city: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>PSČ</label>
                                        <input
                                            type="text"
                                            value={editData.postal_code || ''}
                                            onChange={e => setEditData({ ...editData, postal_code: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Adresa</label>
                                    <input
                                        type="text"
                                        value={editData.address || ''}
                                        onChange={e => setEditData({ ...editData, address: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Telefón</label>
                                    <input
                                        type="tel"
                                        value={editData.phone || ''}
                                        onChange={e => setEditData({ ...editData, phone: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={editData.email || ''}
                                        onChange={e => setEditData({ ...editData, email: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Webstránka</label>
                                    <input
                                        type="url"
                                        value={editData.website || ''}
                                        onChange={e => setEditData({ ...editData, website: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Popis</label>
                                    <textarea
                                        rows={4}
                                        value={editData.description || ''}
                                        onChange={e => setEditData({ ...editData, description: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formActions}>
                                    <button
                                        className={styles.cancelButton}
                                        onClick={() => {
                                            setEditMode(false);
                                            setEditData(salon);
                                        }}
                                    >
                                        Zrušiť
                                    </button>
                                    <button
                                        className={styles.saveButton}
                                        onClick={handleSave}
                                        disabled={saving}
                                    >
                                        {saving ? 'Ukladám...' : 'Uložiť zmeny'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Services Tab */}
                {activeTab === 'services' && (
                    <div className={styles.servicesTab}>
                        <h3 className={styles.sectionTitle}>Služby ({salon.services?.length || 0})</h3>
                        {salon.services && salon.services.length > 0 ? (
                            <div className={styles.servicesList}>
                                {salon.services.map(service => (
                                    <div key={service.id} className={styles.serviceItem}>
                                        <div className={styles.serviceName}>{service.name_sk}</div>
                                        <div className={styles.serviceDetails}>
                                            {service.price !== null && (
                                                <span className={styles.servicePrice}>
                                                    {service.price}€
                                                    {service.price_to && ` - ${service.price_to}€`}
                                                </span>
                                            )}
                                            {service.duration_minutes && (
                                                <span className={styles.serviceDuration}>
                                                    {service.duration_minutes} min
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <span>✂️</span>
                                <p>Žiadne služby</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Opening Hours Tab */}
                {activeTab === 'hours' && (
                    <div className={styles.hoursTab}>
                        <h3 className={styles.sectionTitle}>Otváracie hodiny</h3>
                        {salon.opening_hours && salon.opening_hours.length > 0 ? (
                            <div className={styles.hoursList}>
                                {DAYS.map((day, idx) => {
                                    const hours = salon.opening_hours?.find(h => h.day_of_week === idx);
                                    return (
                                        <div key={idx} className={styles.hoursItem}>
                                            <span className={styles.dayName}>{day}</span>
                                            <span className={styles.hoursValue}>
                                                {hours?.is_closed ? (
                                                    <span className={styles.closed}>Zatvorené</span>
                                                ) : hours?.open_time && hours?.close_time ? (
                                                    `${hours.open_time} - ${hours.close_time}`
                                                ) : (
                                                    '—'
                                                )}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <span>🕐</span>
                                <p>Otváracie hodiny nie sú nastavené</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Photos Tab */}
                {activeTab === 'photos' && (
                    <div className={styles.photosTab}>
                        <h3 className={styles.sectionTitle}>Fotografie ({salon.photos?.length || 0})</h3>
                        {salon.photos && salon.photos.length > 0 ? (
                            <div className={styles.photosGrid}>
                                {salon.photos.map(photo => (
                                    <div key={photo.id} className={styles.photoItem}>
                                        <img src={photo.url} alt={photo.alt_text || salon.name} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <span>📷</span>
                                <p>Žiadne fotografie</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {deleteModal && (
                <div className={styles.modalOverlay} onClick={() => setDeleteModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <h3>⚠️ Odstrániť salón</h3>
                        <p>Naozaj chcete odstrániť salón <strong>{salon.name}</strong>?</p>
                        <p className={styles.warningText}>Táto akcia je nevratná. Budú odstránené aj všetky služby, fotografie a otváracie hodiny.</p>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setDeleteModal(false)}
                            >
                                Zrušiť
                            </button>
                            <button
                                className={styles.confirmDeleteButton}
                                onClick={handleDelete}
                                disabled={saving}
                            >
                                {saving ? 'Odstraňujem...' : 'Odstrániť'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
