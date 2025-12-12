import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { PopularCities } from '@/components/home/PopularCities';
import { HowItWorks } from '@/components/home/HowItWorks';
import { ForOwners } from '@/components/home/ForOwners';
import styles from './page.module.css';

export default function Home() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <HeroSection />
                <CategoryGrid />
                <PopularCities />
                <HowItWorks />
                <ForOwners />
            </main>
            <Footer />
        </>
    );
}
