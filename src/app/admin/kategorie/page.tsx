'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import styles from './page.module.css';

interface Category {
    id: number;
    slug: string;
    name_sk: string;
    name_en: string;
    name_hu: string;
    icon: string;
    category_type: string;
    sort_order: number;
    is_active: boolean;
}

export default function AdminKategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        slug: '',
        name_sk: '',
        name_en: '',
        name_hu: '',
        icon: '',
        category_type: 'primary',
        sort_order: 0,
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const supabase = createBrowserSupabaseClient();
        if (!supabase) return;

        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('sort_order');

        if (!error && data) {
            setCategories(data);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        const supabase = createBrowserSupabaseClient();
        if (!supabase) return;

        if (editingId) {
            await supabase
                .from('categories')
                .update(formData)
                .eq('id', editingId);
        } else {
            await supabase
                .from('categories')
                .insert(formData);
        }

        setEditingId(null);
        setShowAddForm(false);
        setFormData({ slug: '', name_sk: '', name_en: '', name_hu: '', icon: '', category_type: 'primary', sort_order: 0 });
        loadCategories();
    };

    const handleEdit = (category: Category) => {
        setEditingId(category.id);
        setFormData({
            slug: category.slug,
            name_sk: category.name_sk,
            name_en: category.name_en,
            name_hu: category.name_hu,
            icon: category.icon,
            category_type: category.category_type,
            sort_order: category.sort_order,
        });
    };

    const handleToggleActive = async (id: number, currentActive: boolean) => {
        const supabase = createBrowserSupabaseClient();
        if (!supabase) return;

        await supabase
            .from('categories')
            .update({ is_active: !currentActive })
            .eq('id', id);

        loadCategories();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Naozaj chcete odstrániť túto kategóriu?')) return;

        const supabase = createBrowserSupabaseClient();
        if (!supabase) return;

        await supabase.from('categories').delete().eq('id', id);
        loadCategories();
    };

    if (loading) {
        return <div className={styles.container}><p>Načítavam...</p></div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Kategórie</h1>
                    <p className={styles.subtitle}>Správa kategórií salónov ({categories.length} kategórií)</p>
                </div>
                <button className={styles.addButton} onClick={() => setShowAddForm(true)}>
                    + Pridať kategóriu
                </button>
            </div>

            {(showAddForm || editingId) && (
                <div className={styles.formCard}>
                    <h3>{editingId ? 'Upraviť kategóriu' : 'Nová kategória'}</h3>
                    <div className={styles.formGrid}>
                        <input
                            type="text"
                            placeholder="Slug (napr. damske-kadernictvo)"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Ikona (emoji)"
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Názov SK"
                            value={formData.name_sk}
                            onChange={(e) => setFormData({ ...formData, name_sk: e.target.value })}
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Názov EN"
                            value={formData.name_en}
                            onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Názov HU"
                            value={formData.name_hu}
                            onChange={(e) => setFormData({ ...formData, name_hu: e.target.value })}
                            className={styles.input}
                        />
                        <select
                            value={formData.category_type}
                            onChange={(e) => setFormData({ ...formData, category_type: e.target.value })}
                            className={styles.input}
                        >
                            <option value="primary">Primárna</option>
                            <option value="secondary">Sekundárna</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Poradie"
                            value={formData.sort_order}
                            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formActions}>
                        <button className={styles.cancelButton} onClick={() => { setEditingId(null); setShowAddForm(false); }}>
                            Zrušiť
                        </button>
                        <button className={styles.saveButton} onClick={handleSave}>
                            Uložiť
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.content}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Ikona</th>
                            <th>Názov (SK)</th>
                            <th>Slug</th>
                            <th>Typ</th>
                            <th>Poradie</th>
                            <th>Aktívna</th>
                            <th>Akcie</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id}>
                                <td className={styles.iconCell}>{cat.icon}</td>
                                <td>{cat.name_sk}</td>
                                <td><code>{cat.slug}</code></td>
                                <td>{cat.category_type === 'primary' ? 'Primárna' : 'Sekundárna'}</td>
                                <td>{cat.sort_order}</td>
                                <td>
                                    <button
                                        className={cat.is_active ? styles.activeBtn : styles.inactiveBtn}
                                        onClick={() => handleToggleActive(cat.id, cat.is_active)}
                                    >
                                        {cat.is_active ? '✓ Aktívna' : '✗ Neaktívna'}
                                    </button>
                                </td>
                                <td>
                                    <button className={styles.editBtn} onClick={() => handleEdit(cat)}>✏️</button>
                                    <button className={styles.deleteBtn} onClick={() => handleDelete(cat.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
