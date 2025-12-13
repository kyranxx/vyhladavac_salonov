import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getTranslation } from '@/lib/translations';
import Link from 'next/link';
import styles from '@/app/kategorie/page.module.css';

const textsByLocale: Record<string, { title: string; subtitle: string; salons: string }> = {
    en: { title: 'All Categories', subtitle: 'Browse salons by service type', salons: 'salons' },
    hu: { title: 'Összes kategória', subtitle: 'Böngésszen szalonokat szolgáltatástípus szerint', salons: 'szalon' },
};

const categoriesByLocale: Record<string, Array<{ slug: string; name: string; icon: string; count: string }>> = {
    en: [
        { slug: 'damske-kadernictvo', name: "Women's Hair Salon", icon: '💇‍♀️', count: '450+' },
        { slug: 'panske-kadernictvo', name: "Men's Hair Salon", icon: '💇‍♂️', count: '230+' },
        { slug: 'kozmetika', name: 'Cosmetics', icon: '✨', count: '180+' },
        { slug: 'manikura', name: 'Manicure', icon: '💅', count: '320+' },
        { slug: 'pedikura', name: 'Pedicure', icon: '🦶', count: '150+' },
        { slug: 'masaze', name: 'Massage', icon: '💆', count: '200+' },
        { slug: 'make-up', name: 'Make-up', icon: '💄', count: '95+' },
        { slug: 'mihalnice', name: 'Eyelashes', icon: '👁️', count: '140+' },
        { slug: 'tetovanie', name: 'Tattoo', icon: '🎨', count: '75+' },
        { slug: 'permanentny-make-up', name: 'Permanent Make-up', icon: '✏️', count: '85+' },
        { slug: 'wellness', name: 'Wellness', icon: '🧖', count: '60+' },
        { slug: 'barbershop', name: 'Barbershop', icon: '✂️', count: '120+' },
    ],
    hu: [
        { slug: 'damske-kadernictvo', name: 'Női fodrászat', icon: '💇‍♀️', count: '450+' },
        { slug: 'panske-kadernictvo', name: 'Férfi fodrászat', icon: '💇‍♂️', count: '230+' },
        { slug: 'kozmetika', name: 'Kozmetika', icon: '✨', count: '180+' },
        { slug: 'manikura', name: 'Manikűr', icon: '💅', count: '320+' },
        { slug: 'pedikura', name: 'Pedikűr', icon: '🦶', count: '150+' },
        { slug: 'masaze', name: 'Masszázs', icon: '💆', count: '200+' },
        { slug: 'make-up', name: 'Smink', icon: '💄', count: '95+' },
        { slug: 'mihalnice', name: 'Szempillák', icon: '👁️', count: '140+' },
        { slug: 'tetovanie', name: 'Tetoválás', icon: '🎨', count: '75+' },
        { slug: 'permanentny-make-up', name: 'Permanens smink', icon: '✏️', count: '85+' },
        { slug: 'wellness', name: 'Wellness', icon: '🧖', count: '60+' },
        { slug: 'barbershop', name: 'Borbély', icon: '✂️', count: '120+' },
    ],
};

interface PageProps {
    params: { locale: string };
}

export default function LocalizedCategoriesPage({ params }: PageProps) {
    const locale = params.locale || 'en';
    const texts = textsByLocale[locale] || textsByLocale.en;
    const categories = categoriesByLocale[locale] || categoriesByLocale.en;
    const t = getTranslation(locale);
    const basePath = `/${locale}`;

    return (
        <>
            <Header locale={locale} />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>{texts.title}</h1>
                        <p className={styles.subtitle}>{texts.subtitle}</p>
                    </div>

                    <div className={styles.grid}>
                        {categories.map((category) => (
                            <Link key={category.slug} href={`${basePath}/kategoria/${category.slug}`} className={styles.card}>
                                <span className={styles.icon}>{category.icon}</span>
                                <h2 className={styles.categoryName}>{category.name}</h2>
                                <span className={styles.count}>{category.count} {texts.salons}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            <Footer locale={locale} translations={t} />
        </>
    );
}
