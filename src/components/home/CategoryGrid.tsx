'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import styles from './CategoryGrid.module.css';

interface Category {
    slug: string;
    name: string;
    icon: string;
    count: number;
}

const defaultCategories = [
    { slug: 'damske-kadernictvo', name_sk: 'Dámske kaderníctvo', name_en: "Women's Hair Salon", name_hu: 'Női fodrászat', icon: '💇‍♀️' },
    { slug: 'panske-kadernictvo', name_sk: 'Pánske kaderníctvo', name_en: "Men's Hair Salon", name_hu: 'Férfi fodrászat', icon: '💇‍♂️' },
    { slug: 'kozmetika', name_sk: 'Kozmetika', name_en: 'Cosmetics', name_hu: 'Kozmetika', icon: '✨' },
    { slug: 'manikura', name_sk: 'Manikúra', name_en: 'Manicure', name_hu: 'Manikűr', icon: '💅' },
    { slug: 'pedikura', name_sk: 'Pedikúra', name_en: 'Pedicure', name_hu: 'Pedikűr', icon: '🦶' },
    { slug: 'masaze', name_sk: 'Masáže', name_en: 'Massage', name_hu: 'Masszázs', icon: '💆' },
    { slug: 'make-up', name_sk: 'Make-up', name_en: 'Make-up', name_hu: 'Smink', icon: '💄' },
    { slug: 'mihalnice', name_sk: 'Mihalnice', name_en: 'Eyelashes', name_hu: 'Szempillák', icon: '👁️' },
    { slug: 'tetovanie', name_sk: 'Tetovanie', name_en: 'Tattoo', name_hu: 'Tetoválás', icon: '🎨' },
    { slug: 'permanentny-make-up', name_sk: 'Permanentný make-up', name_en: 'Permanent Make-up', name_hu: 'Permanens smink', icon: '✏️' },
    { slug: 'wellness', name_sk: 'Wellness', name_en: 'Wellness', name_hu: 'Wellness', icon: '🧖' },
    { slug: 'solarium', name_sk: 'Solárium', name_en: 'Solarium', name_hu: 'Szolárium', icon: '☀️' },
];

const titlesByLocale: Record<string, { title: string; subtitle: string; viewAll: string; salonsText: string }> = {
    sk: { title: 'Prehľadávajte podľa kategórie', subtitle: 'Vyberte si službu, ktorú hľadáte', viewAll: 'Zobraziť všetky kategórie', salonsText: 'salónov' },
    en: { title: 'Browse by Category', subtitle: 'Choose the service you are looking for', viewAll: 'View all categories', salonsText: 'salons' },
    hu: { title: 'Böngéssz kategóriák szerint', subtitle: 'Válassza ki a keresett szolgáltatást', viewAll: 'Összes kategória', salonsText: 'szalon' },
};

interface CategoryGridProps {
    locale?: string;
}

export function CategoryGrid({ locale = 'sk' }: CategoryGridProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const texts = titlesByLocale[locale] || titlesByLocale.sk;
    const basePath = locale === 'sk' ? '' : `/${locale}`;

    useEffect(() => {
        loadCategories();
    }, [locale]);

    const loadCategories = async () => {
        const supabase = createBrowserSupabaseClient();

        // Start with default categories
        const cats: Category[] = defaultCategories.map(cat => ({
            slug: cat.slug,
            name: locale === 'en' ? cat.name_en : locale === 'hu' ? cat.name_hu : cat.name_sk,
            icon: cat.icon,
            count: 0,
        }));

        if (supabase) {
            try {
                // Try to get real categories from database
                const { data: dbCategories } = await supabase
                    .from('categories')
                    .select('*')
                    .eq('is_active', true)
                    .order('sort_order');

                if (dbCategories && dbCategories.length > 0) {
                    // Get salon counts per category
                    const { data: salonCounts } = await supabase
                        .from('salon_categories')
                        .select('category_id');

                    const countMap = new Map<number, number>();
                    if (salonCounts) {
                        salonCounts.forEach((sc: { category_id: number }) => {
                            countMap.set(sc.category_id, (countMap.get(sc.category_id) || 0) + 1);
                        });
                    }

                    const dbCats: Category[] = dbCategories.slice(0, 12).map((cat: any) => ({
                        slug: cat.slug,
                        name: locale === 'en' ? cat.name_en : locale === 'hu' ? cat.name_hu : cat.name_sk,
                        icon: cat.icon || '✨',
                        count: countMap.get(cat.id) || 0,
                    }));

                    setCategories(dbCats);
                    setLoading(false);
                    return;
                }
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        }

        // Fallback to defaults
        setCategories(cats);
        setLoading(false);
    };

    if (loading) {
        return (
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>{texts.title}</h2>
                        <p className={styles.subtitle}>{texts.subtitle}</p>
                    </div>
                    <div className={styles.grid}>
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className={styles.cardSkeleton}></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{texts.title}</h2>
                    <p className={styles.subtitle}>{texts.subtitle}</p>
                </div>

                <div className={styles.grid}>
                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            href={`${basePath}/kategoria/${category.slug}`}
                            className={styles.card}
                        >
                            <span className={styles.icon}>{category.icon}</span>
                            <span className={styles.name}>{category.name}</span>
                            <span className={styles.count}>
                                {category.count > 0 ? `${category.count} ${texts.salonsText}` : texts.salonsText}
                            </span>
                        </Link>
                    ))}
                </div>

                <div className={styles.footer}>
                    <Link href={`${basePath}/kategorie`} className={styles.viewAllButton}>
                        {texts.viewAll}
                        <span className={styles.arrow}>→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
