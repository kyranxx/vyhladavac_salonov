'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import styles from './page.module.css';

interface Ad {
    id: string;
    name: string;
    placement: string;
    image_url: string;
    link_url: string;
    impressions: number;
    clicks: number;
    status: 'active' | 'paused' | 'expired';
    expires_at: string;
    created_at: string;
}

export default function AdminAdsPage() {
    const [showForm, setShowForm] = useState(false);
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [name, setName] = useState('');
    const [placement, setPlacement] = useState('sidebar');
    const [imageUrl, setImageUrl] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [expiresAt, setExpiresAt] = useState('');

    const supabase = createBrowserSupabaseClient();

    useEffect(() => {
        loadAds();
    }, []);

    const loadAds = async () => {
        if (!supabase) {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('banner_ads')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAds(data || []);
        } catch (error) {
            console.error('Error loading ads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) return;

        try {
            const { error } = await supabase.from('banner_ads').insert({
                name,
                placement,
                image_url: imageUrl,
                link_url: linkUrl,
                expires_at: expiresAt || null,
                status: 'active',
                impressions: 0,
                clicks: 0,
            });

            if (error) throw error;

            alert('Reklama bola vytvorená!');
            setShowForm(false);
            setName('');
            setPlacement('sidebar');
            setImageUrl('');
            setLinkUrl('');
            setExpiresAt('');
            loadAds();
        } catch (error) {
            console.error('Error creating ad:', error);
            alert('Chyba pri vytváraní reklamy.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!supabase) return;
        if (!confirm('Naozaj chcete odstrániť túto reklamu?')) return;

        try {
            const { error } = await supabase.from('banner_ads').delete().eq('id', id);
            if (error) throw error;
            loadAds();
        } catch (error) {
            console.error('Error deleting ad:', error);
        }
    };

    const toggleStatus = async (id: string, currentStatus: string) => {
        if (!supabase) return;
        const newStatus = currentStatus === 'active' ? 'paused' : 'active';

        try {
            const { error } = await supabase
                .from('banner_ads')
                .update({ status: newStatus })
                .eq('id', id);
            if (error) throw error;
            loadAds();
        } catch (error) {
            console.error('Error updating ad:', error);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('sk-SK');
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Načítavam reklamy...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Reklamy</h1>
                    <p className={styles.subtitle}>Správa bannerových reklám</p>
                </div>
                <button
                    className={styles.addButton}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? '✕ Zavrieť' : '+ Pridať reklamu'}
                </button>
            </div>

            {showForm && (
                <div className={styles.formCard}>
                    <h2 className={styles.formTitle}>Nová reklama</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Názov reklamy</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Interný názov reklamy"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="placement">Umiestnenie</label>
                            <select
                                id="placement"
                                value={placement}
                                onChange={(e) => setPlacement(e.target.value)}
                            >
                                <option value="sidebar">Bočný panel</option>
                                <option value="hero">Hero banner</option>
                                <option value="between_listings">Medzi výpismi</option>
                                <option value="footer">Pätička</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="imageUrl">URL obrázka</label>
                            <input
                                type="url"
                                id="imageUrl"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/banner.jpg"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="linkUrl">Cieľový odkaz</label>
                            <input
                                type="url"
                                id="linkUrl"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://example.com"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="expiresAt">Platnosť do (voliteľné)</label>
                            <input
                                type="date"
                                id="expiresAt"
                                value={expiresAt}
                                onChange={(e) => setExpiresAt(e.target.value)}
                            />
                        </div>

                        <div className={styles.formActions}>
                            <button type="button" onClick={() => setShowForm(false)} className={styles.cancelButton}>
                                Zrušiť
                            </button>
                            <button type="submit" className={styles.submitButton}>
                                Vytvoriť reklamu
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className={styles.content}>
                {ads.length > 0 ? (
                    <div className={styles.adsList}>
                        {ads.map((ad) => (
                            <div key={ad.id} className={styles.adCard}>
                                <div className={styles.adInfo}>
                                    <h3>{ad.name}</h3>
                                    <p>Umiestnenie: {ad.placement}</p>
                                    <p>Zobrazenia: {ad.impressions} | Kliky: {ad.clicks}</p>
                                    {ad.expires_at && <p>Platnosť do: {formatDate(ad.expires_at)}</p>}
                                </div>
                                <div className={styles.adActions}>
                                    <span className={`${styles.statusBadge} ${styles[ad.status]}`}>
                                        {ad.status === 'active' ? 'Aktívna' : ad.status === 'paused' ? 'Pozastavená' : 'Expirovaná'}
                                    </span>
                                    <button
                                        onClick={() => toggleStatus(ad.id, ad.status)}
                                        className={styles.actionButton}
                                    >
                                        {ad.status === 'active' ? '⏸️' : '▶️'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ad.id)}
                                        className={styles.deleteButton}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>📢</span>
                        <h3>Žiadne aktívne reklamy</h3>
                        <p>Pridajte bannerovú reklamu pre dodatočný príjem.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
