'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/components/providers/AuthProvider';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import styles from './page.module.css';

interface Photo {
    id: string;
    url: string;
    thumbnail_url?: string;
    salon_id: string;
}

export default function PhotosPage() {
    const { user } = useAuth();
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [salonId, setSalonId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const supabase = createBrowserSupabaseClient();

    // Load user's salon and photos
    useEffect(() => {
        if (user && supabase) {
            loadSalonAndPhotos();
        }
    }, [user]);

    const loadSalonAndPhotos = async () => {
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

                // Get photos for this salon
                const { data: photosData } = await supabase
                    .from('photos')
                    .select('*')
                    .eq('salon_id', salon.id)
                    .order('created_at');

                if (photosData) {
                    setPhotos(photosData);
                }
            }
        } catch (error) {
            console.error('Error loading salon/photos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !supabase || !salonId) return;

        setUploading(true);

        for (const file of Array.from(files)) {
            try {
                // Upload to Supabase Storage
                const fileExt = file.name.split('.').pop();
                const fileName = `${salonId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('photos')
                    .upload(fileName, file);

                if (uploadError) {
                    console.error('Upload error:', uploadError);
                    continue;
                }

                // Get public URL
                const { data: urlData } = supabase.storage
                    .from('photos')
                    .getPublicUrl(fileName);

                // Save to photos table
                const { data: photoRecord, error: dbError } = await supabase
                    .from('photos')
                    .insert({
                        salon_id: salonId,
                        url: urlData.publicUrl,
                        thumbnail_url: urlData.publicUrl,
                    })
                    .select()
                    .single();

                if (dbError) {
                    console.error('DB error:', dbError);
                    continue;
                }

                if (photoRecord) {
                    setPhotos(prev => [...prev, photoRecord]);
                }
            } catch (err) {
                console.error('Error uploading photo:', err);
            }
        }

        setUploading(false);

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (id: string, url: string) => {
        if (!confirm('Naozaj chcete odstrániť túto fotografiu?')) return;
        if (!supabase) return;

        try {
            // Delete from database
            await supabase.from('photos').delete().eq('id', id);

            // Try to delete from storage (extract path from URL)
            const urlParts = url.split('/photos/');
            if (urlParts[1]) {
                await supabase.storage.from('photos').remove([urlParts[1]]);
            }

            setPhotos(photos.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting photo:', error);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Načítavam...</div>
            </div>
        );
    }

    if (!salonId) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>🏪</span>
                    <h3>Najprv vytvorte salón</h3>
                    <p>Pred nahrávaním fotografií musíte zaregistrovať salón v sekcii &quot;Môj salón&quot;.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Fotografie</h1>
                    <p className={styles.subtitle}>Galéria fotografií vášho salónu ({photos.length} fotografií)</p>
                </div>
            </div>

            <div className={styles.content}>
                {/* Upload Section */}
                <div className={styles.uploadSection}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        multiple
                        className={styles.fileInput}
                        id="photo-upload"
                        disabled={uploading}
                    />
                    <label htmlFor="photo-upload" className={styles.uploadLabel}>
                        <span className={styles.uploadIcon}>📷</span>
                        <span className={styles.uploadText}>
                            {uploading ? 'Nahrávam...' : 'Kliknite pre nahratie fotografií'}
                        </span>
                        <span className={styles.uploadHint}>JPG, PNG, max. 5MB na fotografiu</span>
                    </label>
                </div>

                {uploading && (
                    <div className={styles.uploading}>Nahrávam fotografie...</div>
                )}

                {/* Photos Grid */}
                {photos.length > 0 ? (
                    <div className={styles.photosGrid}>
                        {photos.map((photo) => (
                            <div key={photo.id} className={styles.photoCard}>
                                <div className={styles.photoWrapper}>
                                    <Image
                                        src={photo.url}
                                        alt="Salon photo"
                                        fill
                                        className={styles.photo}
                                    />
                                </div>
                                <button
                                    className={styles.deletePhoto}
                                    onClick={() => handleDelete(photo.id, photo.url)}
                                    title="Odstrániť"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>🖼️</span>
                        <h3>Zatiaľ nemáte žiadne fotografie</h3>
                        <p>Pridajte fotografie vášho salónu, aby ste prilákali viac zákazníkov.</p>
                    </div>
                )}

                <div className={styles.tips}>
                    <h3>💡 Tipy pre kvalitné fotografie</h3>
                    <ul>
                        <li>Fotografujte za denného svetla</li>
                        <li>Ukážte interiér salónu, pracovisko a výsledky práce</li>
                        <li>Pridajte minimálne 5 fotografií pre lepšiu prezentáciu</li>
                        <li>Prvá fotografia sa zobrazí ako hlavný obrázok</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
