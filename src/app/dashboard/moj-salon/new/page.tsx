'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { PhoneInput } from '@/components/ui/PhoneInput';
import Link from 'next/link';
import styles from '../page.module.css';

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
    { value: 'solarium', label: 'Solárium' },
    { value: 'permanentny-makeup', label: 'Permanentný make-up' },
    { value: 'mihalnice', label: 'Mihalnice' },
    { value: 'obocie', label: 'Obočie' },
];

const cities = [
    { value: '', label: 'Vyberte mesto...' },
    { value: 'Bratislava', label: 'Bratislava' },
    { value: 'Košice', label: 'Košice' },
    { value: 'Prešov', label: 'Prešov' },
    { value: 'Žilina', label: 'Žilina' },
    { value: 'Nitra', label: 'Nitra' },
    { value: 'Banská Bystrica', label: 'Banská Bystrica' },
    { value: 'Trnava', label: 'Trnava' },
    { value: 'Trenčín', label: 'Trenčín' },
    { value: 'Martin', label: 'Martin' },
    { value: 'Poprad', label: 'Poprad' },
    { value: 'Prievidza', label: 'Prievidza' },
    { value: 'Zvolen', label: 'Zvolen' },
    { value: 'Iné', label: 'Iné mesto...' },
];

export default function NewSalonPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [form, setForm] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        description: '',
        website: '',
        category: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!form.name || !form.phone || !form.address || !form.city || !form.category) {
            setError('Vyplňte všetky povinné polia.');
            setLoading(false);
            return;
        }

        try {
            const supabase = createBrowserSupabaseClient();
            if (!supabase) throw new Error('Database not configured');

            // Check pending salon limit (max 2 pending salons per user)
            const { data: existingSalons } = await supabase
                .from('salons')
                .select('id, status')
                .eq('owner_id', user?.id);

            if (existingSalons) {
                const pendingSalons = existingSalons.filter(s => s.status === 'pending');
                if (pendingSalons.length >= 2) {
                    setError('Máte už 2 salóny čakajúce na schválenie. Pred vytvorením ďalšieho musí byť aspoň jeden schválený.');
                    setLoading(false);
                    return;
                }
            }

            // Generate slug
            const slug = form.name.toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                + '-' +
                form.city.toLowerCase()
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '');

            // Create salon
            const { data: salon, error: dbError } = await supabase.from('salons').insert({
                owner_id: user?.id,
                name: form.name,
                phone: form.phone,
                address: form.address,
                city: form.city,
                description_sk: form.description,
                website: form.website || null,
                status: 'pending',
                tier: 'free',
                slug: slug,
            }).select().single();

            if (dbError) throw new Error(dbError.message);

            // Link category
            if (salon && form.category) {
                const { data: categoryData } = await supabase
                    .from('categories')
                    .select('id')
                    .eq('slug', form.category)
                    .single();

                if (categoryData) {
                    await supabase.from('salon_categories').insert({
                        salon_id: salon.id,
                        category_id: categoryData.id,
                    });
                }
            }

            // Redirect to salons list
            router.push('/dashboard/moj-salon?created=true');
        } catch (err: unknown) {
            console.error('Error creating salon:', err);
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError('Nepodarilo sa vytvoriť salón: ' + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.editorHeader}>
                <Link href="/dashboard/moj-salon" className={styles.backButton}>
                    ← Späť na zoznam
                </Link>
                <h1 className={styles.title}>Pridať nový salón</h1>
            </div>

            <div className={styles.tabContent}>
                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.infoForm}>
                    <div className={styles.formGroup}>
                        <label>Názov salónu *</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Napr. Beauty Salon Milano"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Hlavná kategória *</label>
                        <select
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
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
                        <label>Telefón *</label>
                        <PhoneInput
                            id="phone"
                            value={form.phone}
                            onChange={(value) => setForm({ ...form, phone: value })}
                            required
                        />
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Ulica a číslo *</label>
                            <input
                                type="text"
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                placeholder="Napr. Hlavná 25"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Mesto *</label>
                            <select
                                value={form.city}
                                onChange={(e) => setForm({ ...form, city: e.target.value })}
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

                    <div className={styles.formGroup}>
                        <label>Webová stránka</label>
                        <input
                            type="url"
                            value={form.website}
                            onChange={(e) => setForm({ ...form, website: e.target.value })}
                            placeholder="https://www.vasa-stranka.sk"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Popis salónu</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Popíšte váš salón, služby, špeciality..."
                            rows={5}
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.saveButton}
                        disabled={loading}
                    >
                        {loading ? 'Vytváram...' : '✓ Vytvoriť salón'}
                    </button>

                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '1rem' }}>
                        * Po vytvorení bude váš salón skontrolovaný administrátorom.
                        Schválenie zvyčajne trvá do 24 hodín.
                    </p>
                </form>
            </div>
        </div>
    );
}
