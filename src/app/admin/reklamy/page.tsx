'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface Ad {
    id: string;
    name: string;
    placement: string;
    imageUrl: string;
    linkUrl: string;
    impressions: number;
    clicks: number;
    status: 'active' | 'paused' | 'expired';
    expiresAt: string;
}

export default function AdminAdsPage() {
    const [showForm, setShowForm] = useState(false);
    const [ads] = useState<Ad[]>([]);

    // Form state
    const [name, setName] = useState('');
    const [placement, setPlacement] = useState('sidebar');
    const [imageUrl, setImageUrl] = useState('');
    const [linkUrl, setLinkUrl] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Save to database
        console.log('Creating ad:', { name, placement, imageUrl, linkUrl });
        setShowForm(false);
        alert('Reklama bola vytvorená! (Demo - databáza nie je prepojená)');
    };

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
                                <h3>{ad.name}</h3>
                                <p>Umiestnenie: {ad.placement}</p>
                                <p>Zobrazenia: {ad.impressions} | Kliky: {ad.clicks}</p>
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
