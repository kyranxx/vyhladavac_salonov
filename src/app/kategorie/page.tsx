import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Kategórie salónov | Salon Finder SK',
    description: 'Prehľad všetkých kategórií salónov krásy na Slovensku.',
};

const categories = [
    { slug: 'damske-kadernictvo', name: 'Dámske kaderníctvo', icon: '💇‍♀️', count: 234 },
    { slug: 'panske-kadernictvo', name: 'Pánske kaderníctvo', icon: '💇‍♂️', count: 156 },
    { slug: 'detske-kadernictvo', name: 'Detské kaderníctvo', icon: '👶', count: 45 },
    { slug: 'barbershop', name: 'Barbershop', icon: '✂️', count: 89 },
    { slug: 'kozmetika', name: 'Kozmetika', icon: '💄', count: 312 },
    { slug: 'manikura', name: 'Manikúra', icon: '💅', count: 287 },
    { slug: 'pedikura', name: 'Pedikúra', icon: '🦶', count: 198 },
    { slug: 'nechtovy-dizajn', name: 'Nechtový dizajn', icon: '💎', count: 167 },
    { slug: 'masaze', name: 'Masáže', icon: '💆', count: 245 },
    { slug: 'licenie', name: 'Líčenie', icon: '🎨', count: 123 },
    { slug: 'uces-styling', name: 'Účes & Styling', icon: '💁', count: 178 },
    { slug: 'farbenie-vlasov', name: 'Farbenie vlasov', icon: '🌈', count: 234 },
    { slug: 'tetovanie', name: 'Tetovanie', icon: '🎭', count: 67 },
    { slug: 'piercing', name: 'Piercing', icon: '💠', count: 34 },
    { slug: 'permanentny-makeup', name: 'Permanentný make-up', icon: '✨', count: 89 },
    { slug: 'laser-estetika', name: 'Laser & Estetika', icon: '⚡', count: 56 },
    { slug: 'wellness', name: 'Wellness & Spa', icon: '🧖', count: 145 },
    { slug: 'solárium', name: 'Solárium', icon: '☀️', count: 78 },
];

export default function CategoriesPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Kategórie salónov</h1>
                        <p className={styles.subtitle}>
                            Vyberte si kategóriu služby, ktorú hľadáte
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
                                <h2 className={styles.cardTitle}>{category.name}</h2>
                                <p className={styles.count}>{category.count} salónov</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
