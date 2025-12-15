'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import styles from './page.module.css';

interface Category {
    id: number;
    slug: string;
    name_sk: string;
    name_en?: string;
    name_hu?: string;
    icon: string;
    is_active: boolean;
    sort_order: number;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const supabase = createBrowserSupabaseClient();
        if (!supabase) {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('is_active', true)
                .order('sort_order');

            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>Kategórie salónov</h1>
                            <p className={styles.subtitle}>Načítavam...</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Kategórie salónov</h1>
                        <p className={styles.subtitle}>
                            {categories.length} kategórií služieb - vyberte si, čo hľadáte
                        </p>
                    </div>

                    <div className={styles.grid}>
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/kategoria/${category.slug}`}
                                className={styles.card}
                            >
                                <span className={styles.icon}>{category.icon || '✨'}</span>
                                <h2 className={styles.cardTitle}>{category.name_sk}</h2>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
