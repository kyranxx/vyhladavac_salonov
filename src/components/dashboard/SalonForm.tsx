'use client';

import { useState } from 'react';
import styles from './SalonForm.module.css';

interface SalonData {
    name: string;
    phone: string;
    website: string;
    address: string;
    city: string;
    description_sk: string;
}

interface SalonFormProps {
    initialData: SalonData;
    onSave: (data: SalonData) => Promise<void>;
}

export function SalonForm({ initialData, onSave }: SalonFormProps) {
    const [formData, setFormData] = useState(initialData);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(formData);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.grid}>
                <div className={`${styles.group} ${styles.fullWidth}`}>
                    <label className={styles.label}>Názov salónu</label>
                    <input
                        className={styles.input}
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div className={styles.group}>
                    <label className={styles.label}>Telefón</label>
                    <input
                        className={styles.input}
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>

                <div className={styles.group}>
                    <label className={styles.label}>Webová stránka</label>
                    <input
                        className={styles.input}
                        type="url"
                        placeholder="https://"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                </div>

                <div className={styles.group}>
                    <label className={styles.label}>Ulica a číslo</label>
                    <input
                        className={styles.input}
                        required
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                </div>

                <div className={styles.group}>
                    <label className={styles.label}>Mesto</label>
                    <input
                        className={styles.input}
                        required
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                </div>

                <div className={`${styles.group} ${styles.fullWidth}`}>
                    <label className={styles.label}>Popis salónu</label>
                    <textarea
                        className={`${styles.input} ${styles.textarea}`}
                        rows={5}
                        value={formData.description_sk}
                        onChange={(e) => setFormData({ ...formData, description_sk: e.target.value })}
                    />
                </div>
            </div>

            <div className={styles.actions}>
                <button type="submit" className={styles.saveButton} disabled={saving}>
                    {saving ? 'Ukladám...' : '💾 Uložiť zmeny'}
                </button>
            </div>
        </form>
    );
}
