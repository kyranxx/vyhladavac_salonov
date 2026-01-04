import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { PopularCities } from '@/components/home/PopularCities';
import { ForOwners } from '@/components/home/ForOwners';
import styles from './page.module.css';

export default function Home() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <HeroSection />
                <PopularCities />
                <ForOwners />
            </main>
            <Footer />
        </>
    );
}
