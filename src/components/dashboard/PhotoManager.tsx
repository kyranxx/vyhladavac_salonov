'use client';

import { useRef, useState } from 'react';
import styles from './PhotoManager.module.css';

interface Photo {
    id: string;
    url: string;
    is_primary: boolean;
}

interface PhotoManagerProps {
    photos: Photo[];
    onUpload: (file: File) => Promise<void>;
    onDelete: (photoId: string) => Promise<void>;
}

export function PhotoManager({ photos, onUpload, onDelete }: PhotoManagerProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            await onUpload(file);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.uploadArea}>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <button
                    className={styles.uploadButton}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                >
                    {uploading ? 'Nahrávam...' : '📷 Pridať fotografiu'}
                </button>
                <p className={styles.hint}>JPG, PNG, WebP do 5MB</p>
            </div>

            <div className={styles.grid}>
                {photos.map((photo) => (
                    <div key={photo.id} className={styles.photoCard}>
                        <img src={photo.url} alt="Salon view" className={styles.image} />
                        {photo.is_primary && (
                            <span className={styles.primaryBadge}>Hlavná</span>
                        )}
                        <button
                            className={styles.deleteButton}
                            onClick={() => onDelete(photo.id)}
                            title="Odstrániť"
                        >
                            🗑️
                        </button>
                    </div>
                ))}
            </div>

            {photos.length === 0 && (
                <p className={styles.empty}>Zatiaľ žiadne fotografie</p>
            )}
        </div>
    );
}
