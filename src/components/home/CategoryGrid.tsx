import Link from 'next/link';
import styles from './CategoryGrid.module.css';

interface Category {
    slug: string;
    name: string;
    icon: string;
    count: string;
}

const categoriesSK: Category[] = [
    { slug: 'damske-kadernictvo', name: 'Dámske kaderníctvo', icon: '💇‍♀️', count: '450+' },
    { slug: 'panske-kadernictvo', name: 'Pánske kaderníctvo', icon: '💇‍♂️', count: '230+' },
    { slug: 'kozmetika', name: 'Kozmetika', icon: '✨', count: '180+' },
    { slug: 'manikura', name: 'Manikúra', icon: '💅', count: '320+' },
    { slug: 'pedikura', name: 'Pedikúra', icon: '🦶', count: '150+' },
    { slug: 'masaze', name: 'Masáže', icon: '💆', count: '200+' },
    { slug: 'make-up', name: 'Make-up', icon: '💄', count: '95+' },
    { slug: 'riasenky', name: 'Mihalnice', icon: '👁️', count: '140+' },
    { slug: 'tetovanie', name: 'Tetovanie', icon: '🎨', count: '75+' },
    { slug: 'permanentny-make-up', name: 'Permanentný make-up', icon: '✏️', count: '85+' },
    { slug: 'wellness', name: 'Wellness', icon: '🧖', count: '60+' },
    { slug: 'solarium', name: 'Solárium', icon: '☀️', count: '45+' },
];

const categoriesEN: Category[] = [
    { slug: 'damske-kadernictvo', name: "Women's Hair Salon", icon: '💇‍♀️', count: '450+' },
    { slug: 'panske-kadernictvo', name: "Men's Hair Salon", icon: '💇‍♂️', count: '230+' },
    { slug: 'kozmetika', name: 'Cosmetics', icon: '✨', count: '180+' },
    { slug: 'manikura', name: 'Manicure', icon: '💅', count: '320+' },
    { slug: 'pedikura', name: 'Pedicure', icon: '🦶', count: '150+' },
    { slug: 'masaze', name: 'Massage', icon: '💆', count: '200+' },
    { slug: 'make-up', name: 'Make-up', icon: '💄', count: '95+' },
    { slug: 'riasenky', name: 'Eyelashes', icon: '👁️', count: '140+' },
    { slug: 'tetovanie', name: 'Tattoo', icon: '🎨', count: '75+' },
    { slug: 'permanentny-make-up', name: 'Permanent Make-up', icon: '✏️', count: '85+' },
    { slug: 'wellness', name: 'Wellness', icon: '🧖', count: '60+' },
    { slug: 'solarium', name: 'Solarium', icon: '☀️', count: '45+' },
];

const categoriesHU: Category[] = [
    { slug: 'damske-kadernictvo', name: 'Női fodrászat', icon: '💇‍♀️', count: '450+' },
    { slug: 'panske-kadernictvo', name: 'Férfi fodrászat', icon: '💇‍♂️', count: '230+' },
    { slug: 'kozmetika', name: 'Kozmetika', icon: '✨', count: '180+' },
    { slug: 'manikura', name: 'Manikűr', icon: '💅', count: '320+' },
    { slug: 'pedikura', name: 'Pedikűr', icon: '🦶', count: '150+' },
    { slug: 'masaze', name: 'Masszázs', icon: '💆', count: '200+' },
    { slug: 'make-up', name: 'Smink', icon: '💄', count: '95+' },
    { slug: 'riasenky', name: 'Szempillák', icon: '👁️', count: '140+' },
    { slug: 'tetovanie', name: 'Tetoválás', icon: '🎨', count: '75+' },
    { slug: 'permanentny-make-up', name: 'Permanens smink', icon: '✏️', count: '85+' },
    { slug: 'wellness', name: 'Wellness', icon: '🧖', count: '60+' },
    { slug: 'solarium', name: 'Szolárium', icon: '☀️', count: '45+' },
];

const categoriesByLocale: Record<string, Category[]> = {
    sk: categoriesSK,
    en: categoriesEN,
    hu: categoriesHU,
};

const titlesByLocale: Record<string, { title: string; subtitle: string; viewAll: string; salonsText: string }> = {
    sk: { title: 'Prehľadávajte podľa kategórie', subtitle: 'Vyberte si službu, ktorú hľadáte', viewAll: 'Zobraziť všetky kategórie', salonsText: 'salónov' },
    en: { title: 'Browse by Category', subtitle: 'Choose the service you are looking for', viewAll: 'View all categories', salonsText: 'salons' },
    hu: { title: 'Böngéssz kategóriák szerint', subtitle: 'Válassza ki a keresett szolgáltatást', viewAll: 'Összes kategória', salonsText: 'szalon' },
};

interface CategoryGridProps {
    locale?: string;
}

export function CategoryGrid({ locale = 'sk' }: CategoryGridProps) {
    const categories = categoriesByLocale[locale] || categoriesByLocale.sk;
    const texts = titlesByLocale[locale] || titlesByLocale.sk;
    const basePath = locale === 'sk' ? '' : `/${locale}`;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{texts.title}</h2>
                    <p className={styles.subtitle}>
                        {texts.subtitle}
                    </p>
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
                            <span className={styles.count}>{category.count} {texts.salonsText}</span>
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
