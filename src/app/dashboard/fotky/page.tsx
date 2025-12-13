'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

interface Photo {
    id: string;
    url: string;
    name: string;
}

export default function PhotosPage() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setUploading(true);

        // Simulate upload - in production this would upload to Supabase Storage
        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newPhoto: Photo = {
                    id: Date.now().toString() + Math.random(),
                    url: event.target?.result as string,
                    name: file.name,
                };
                setPhotos((prev) => [...prev, newPhoto]);
            };
            reader.readAsDataURL(file);
        });

        setTimeout(() => setUploading(false), 500);

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Naozaj chcete odstrániť túto fotografiu?')) {
            setPhotos(photos.filter(p => p.id !== id));
        }
    };

    const handleSave = () => {
        alert('Fotografie boli uložené! (V produkcii sa uložia do Supabase Storage)');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Fotografie</h1>
                    <p className={styles.subtitle}>Galéria fotografií vášho salónu</p>
                </div>
                <button className={styles.saveButton} onClick={handleSave} disabled={photos.length === 0}>
                    Uložiť zmeny
                </button>
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
                    />
                    <label htmlFor="photo-upload" className={styles.uploadLabel}>
                        <span className={styles.uploadIcon}>📷</span>
                        <span className={styles.uploadText}>Kliknite pre nahratie fotografií</span>
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
                                        alt={photo.name}
                                        fill
                                        className={styles.photo}
                                    />
                                </div>
                                <button
                                    className={styles.deletePhoto}
                                    onClick={() => handleDelete(photo.id)}
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
