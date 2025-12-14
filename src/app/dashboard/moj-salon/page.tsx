'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { PhoneInput } from '@/components/ui/PhoneInput';
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
        { value: 'solarium', label: 'Solárium' },
        { value: 'permanentny-makeup', label: 'Permanentný make-up' },
        { value: 'mihalnice', label: 'Mihalnice' },
        { value: 'obočie', label: 'Obočie' },
    ];

    // All Slovak cities and major towns
    const cities = [
        { value: '', label: 'Vyberte mesto...' },
        // Major cities
        { value: 'Bratislava', label: 'Bratislava' },
        { value: 'Košice', label: 'Košice' },
        { value: 'Prešov', label: 'Prešov' },
        { value: 'Žilina', label: 'Žilina' },
        { value: 'Nitra', label: 'Nitra' },
        { value: 'Banská Bystrica', label: 'Banská Bystrica' },
        { value: 'Trnava', label: 'Trnava' },
        { value: 'Trenčín', label: 'Trenčín' },
        // Other cities
        { value: 'Martin', label: 'Martin' },
        { value: 'Poprad', label: 'Poprad' },
        { value: 'Prievidza', label: 'Prievidza' },
        { value: 'Zvolen', label: 'Zvolen' },
        { value: 'Považská Bystrica', label: 'Považská Bystrica' },
        { value: 'Michalovce', label: 'Michalovce' },
        { value: 'Nové Zámky', label: 'Nové Zámky' },
        { value: 'Spišská Nová Ves', label: 'Spišská Nová Ves' },
        { value: 'Komárno', label: 'Komárno' },
        { value: 'Levice', label: 'Levice' },
        { value: 'Humenné', label: 'Humenné' },
        { value: 'Bardejov', label: 'Bardejov' },
        { value: 'Liptovský Mikuláš', label: 'Liptovský Mikuláš' },
        { value: 'Ružomberok', label: 'Ružomberok' },
        { value: 'Piešťany', label: 'Piešťany' },
        { value: 'Lučenec', label: 'Lučenec' },
        { value: 'Topoľčany', label: 'Topoľčany' },
        { value: 'Partizánske', label: 'Partizánske' },
        { value: 'Dunajská Streda', label: 'Dunajská Streda' },
        { value: 'Čadca', label: 'Čadca' },
        { value: 'Dolný Kubín', label: 'Dolný Kubín' },
        { value: 'Pezinok', label: 'Pezinok' },
        { value: 'Hlohovec', label: 'Hlohovec' },
        { value: 'Senica', label: 'Senica' },
        { value: 'Šaľa', label: 'Šaľa' },
        { value: 'Galanta', label: 'Galanta' },
        { value: 'Snina', label: 'Snina' },
        { value: 'Trebišov', label: 'Trebišov' },
        { value: 'Vranov nad Topľou', label: 'Vranov nad Topľou' },
        { value: 'Brezno', label: 'Brezno' },
        { value: 'Detva', label: 'Detva' },
        { value: 'Rimavská Sobota', label: 'Rimavská Sobota' },
        { value: 'Revúca', label: 'Revúca' },
        { value: 'Kežmarok', label: 'Kežmarok' },
        { value: 'Stará Ľubovňa', label: 'Stará Ľubovňa' },
        { value: 'Svidník', label: 'Svidník' },
        { value: 'Medzilaborce', label: 'Medzilaborce' },
        { value: 'Sabinov', label: 'Sabinov' },
        { value: 'Stropkov', label: 'Stropkov' },
        { value: 'Rožňava', label: 'Rožňava' },
        { value: 'Moldava nad Bodvou', label: 'Moldava nad Bodvou' },
        { value: 'Gelnica', label: 'Gelnica' },
        { value: 'Sobrance', label: 'Sobrance' },
        { value: 'Malacky', label: 'Malacky' },
        { value: 'Senec', label: 'Senec' },
        { value: 'Stupava', label: 'Stupava' },
        { value: 'Skalica', label: 'Skalica' },
        { value: 'Myjava', label: 'Myjava' },
        { value: 'Nové Mesto nad Váhom', label: 'Nové Mesto nad Váhom' },
        { value: 'Púchov', label: 'Púchov' },
        { value: 'Dubnica nad Váhom', label: 'Dubnica nad Váhom' },
        { value: 'Ilava', label: 'Ilava' },
        { value: 'Bánovce nad Bebravou', label: 'Bánovce nad Bebravou' },
        { value: 'Bojnice', label: 'Bojnice' },
        { value: 'Handlová', label: 'Handlová' },
        { value: 'Žiar nad Hronom', label: 'Žiar nad Hronom' },
        { value: 'Banská Štiavnica', label: 'Banská Štiavnica' },
        { value: 'Kremnica', label: 'Kremnica' },
        { value: 'Fiľakovo', label: 'Fiľakovo' },
        { value: 'Veľký Krtíš', label: 'Veľký Krtíš' },
        { value: 'Kysucké Nové Mesto', label: 'Kysucké Nové Mesto' },
        { value: 'Námestovo', label: 'Námestovo' },
        { value: 'Tvrdošín', label: 'Tvrdošín' },
        { value: 'Turčianske Teplice', label: 'Turčianske Teplice' },
        { value: 'Bytča', label: 'Bytča' },
        { value: 'Svit', label: 'Svit' },
        { value: 'Vysoké Tatry', label: 'Vysoké Tatry' },
        { value: 'Štúrovo', label: 'Štúrovo' },
        { value: 'Hurbanovo', label: 'Hurbanovo' },
        { value: 'Kolárovo', label: 'Kolárovo' },
        { value: 'Veľký Meder', label: 'Veľký Meder' },
        { value: 'Šamorín', label: 'Šamorín' },
        { value: 'Želiezovce', label: 'Želiezovce' },
        { value: 'Vráble', label: 'Vráble' },
        { value: 'Zlaté Moravce', label: 'Zlaté Moravce' },
        { value: 'Iné', label: 'Iné mesto...' },
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

            // Generate slug
            const slug = salonName.toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                + '-' +
                city.toLowerCase()
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '');

            // Create salon in database
            const { data: salon, error: dbError } = await supabase.from('salons').insert({
                owner_id: user?.id,
                name: salonName,
                phone: phone,
                address: address,
                city: city,
                description_sk: description,
                website: website || null,
                status: 'pending',
                tier: 'free',
                slug: slug,
            }).select().single();

            if (dbError) {
                console.error('DB Error:', dbError);
                throw new Error(dbError.message);
            }

            // Get category ID and create salon_categories link
            if (salon && category) {
                const { data: categoryData } = await supabase
                    .from('categories')
                    .select('id')
                    .eq('slug', category)
                    .single();

                if (categoryData) {
                    await supabase.from('salon_categories').insert({
                        salon_id: salon.id,
                        category_id: categoryData.id,
                    });
                }
            }

            setSuccess(true);
        } catch (err: unknown) {
            console.error('Error creating salon:', err);
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError('Nepodarilo sa vytvoriť salón: ' + errorMessage);
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
                            <PhoneInput
                                id="phone"
                                value={phone}
                                onChange={setPhone}
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
