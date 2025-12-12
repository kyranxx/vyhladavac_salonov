import Link from 'next/link';
import styles from './CategoryGrid.module.css';

const categories = [
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

export function CategoryGrid() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Prehľadávajte podľa kategórie</h2>
                    <p className={styles.subtitle}>
                        Vyberte si službu, ktorú hľadáte
                    </p>
                </div>

                <div className={styles.grid}>
                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            href={`/kategoria/${category.slug}`}
                            className={styles.card}
                        >
                            <span className={styles.icon}>{category.icon}</span>
                            <span className={styles.name}>{category.name}</span>
                            <span className={styles.count}>{category.count} salónov</span>
                        </Link>
                    ))}
                </div>

                <div className={styles.footer}>
                    <Link href="/kategorie" className={styles.viewAllButton}>
                        Zobraziť všetky kategórie
                        <span className={styles.arrow}>→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
