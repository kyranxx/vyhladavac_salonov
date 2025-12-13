'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import Link from 'next/link';
import styles from './page.module.css';

export default function MySalonPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [salonName, setSalonName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [description, setDescription] = useState('');
    const [website, setWebsite] = useState('');
    const [category, setCategory] = useState('');

    const categories = [
        { value: '', label: 'Vyberte kategóriu...' },
        { value: 'damske-kadernictvo', label: 'Dámske kaderníctvo' },
        { value: 'panske-kadernictvo', label: 'Pánske kaderníctvo' },
        { value: 'barbershop', label: 'Barbershop' },
        { value: 'kozmetika', label: 'Kozmetika' },
        { value: 'manikura', label: 'Manikúra' },
        { value: 'pedikura', label: 'Pedikúra' },
        { value: 'masaze', label: 'Masáže' },
        { value: 'wellness', label: 'Wellness & Spa' },
        { value: 'tetovacie-studio', label: 'Tetovacie štúdio' },
        { value: 'solárium', label: 'Solárium' },
    ];

    const cities = [
        { value: '', label: 'Vyberte mesto...' },
        { value: 'Bratislava', label: 'Bratislava' },
        { value: 'Košice', label: 'Košice' },
        { value: 'Žilina', label: 'Žilina' },
        { value: 'Nitra', label: 'Nitra' },
        { value: 'Prešov', label: 'Prešov' },
        { value: 'Banská Bystrica', label: 'Banská Bystrica' },
        { value: 'Trnava', label: 'Trnava' },
        { value: 'Trenčín', label: 'Trenčín' },
        { value: 'Martin', label: 'Martin' },
        { value: 'Poprad', label: 'Poprad' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!salonName || !phone || !address || !city || !category) {
            setError('Vyplňte všetky povinné polia.');
            setLoading(false);
            return;
        }

        try {
            const supabase = createBrowserSupabaseClient();
            if (!supabase) throw new Error('Database not configured');

            // Create salon in database
            const { error: dbError } = await supabase.from('salons').insert({
                owner_id: user?.id,
                name: salonName,
                phone: phone,
                address: address,
                district_id: null, // Will be linked properly in production
                description_sk: description,
                website: website,
                status: 'pending', // Needs admin approval
                tier: 'free',
                slug: salonName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + city.toLowerCase(),
            });

            if (dbError) throw dbError;

            setSuccess(true);
        } catch (err) {
            console.error('Error creating salon:', err);
            setError('Nepodarilo sa vytvoriť salón. Skúste to znova.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={styles.container}>
                <div className={styles.successMessage}>
                    <span className={styles.successIcon}>✅</span>
                    <h2>Salón bol úspešne zaregistrovaný!</h2>
                    <p>Váš salón čaká na schválenie administrátorom. Zvyčajne to trvá do 24 hodín.</p>
                    <p>Po schválení vám príde e-mail a váš salón bude viditeľný vo vyhľadávaní.</p>
                    <Link href="/dashboard" className={styles.backButton}>
                        Späť na prehľad
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Môj salón</h1>
                <p className={styles.subtitle}>Zaregistrujte váš salón a začnite získavať zákazníkov</p>
            </div>

            <div className={styles.content}>
                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Základné údaje</h2>

                        <div className={styles.formGroup}>
                            <label htmlFor="salonName" className={styles.label}>
                                Názov salónu <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                id="salonName"
                                className={styles.input}
                                value={salonName}
                                onChange={(e) => setSalonName(e.target.value)}
                                placeholder="Napr. Beauty Salon Milano"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="category" className={styles.label}>
                                Hlavná kategória <span className={styles.required}>*</span>
                            </label>
                            <select
                                id="category"
                                className={styles.select}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                {categories.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="phone" className={styles.label}>
                                Telefón <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                className={styles.input}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+421 9XX XXX XXX"
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Adresa</h2>

                        <div className={styles.formGroup}>
                            <label htmlFor="address" className={styles.label}>
                                Ulica a číslo <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                id="address"
                                className={styles.input}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Napr. Hlavná 25"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="city" className={styles.label}>
                                Mesto <span className={styles.required}>*</span>
                            </label>
                            <select
                                id="city"
                                className={styles.select}
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            >
                                {cities.map((c) => (
                                    <option key={c.value} value={c.value}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Voliteľné údaje</h2>

                        <div className={styles.formGroup}>
                            <label htmlFor="description" className={styles.label}>
                                Popis salónu
                            </label>
                            <textarea
                                id="description"
                                className={styles.textarea}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Popíšte váš salón, služby, špeciality..."
                                rows={4}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="website" className={styles.label}>
                                Webová stránka
                            </label>
                            <input
                                type="url"
                                id="website"
                                className={styles.input}
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder="https://www.vasa-stranka.sk"
                            />
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Odosielam...' : 'Zaregistrovať salón'}
                        </button>
                    </div>

                    <p className={styles.note}>
                        * Po odoslaní bude váš salón skontrolovaný administrátorom.
                        Schválenie zvyčajne trvá do 24 hodín.
                    </p>
                </form>
            </div>
        </div>
    );
}
