import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './page.module.css';

export const metadata = {
    title: 'O nás | Salon Finder SK',
    description: 'Spoznajte Salon Finder SK - najväčší online katalóg salónov krásy na Slovensku.',
};

export default function AboutPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.hero}>
                        <h1 className={styles.title}>O nás</h1>
                        <p className={styles.subtitle}>
                            Pomáhame ľuďom nájsť ten správny salón krásy
                        </p>
                    </div>

                    <div className={styles.content}>
                        <section className={styles.section}>
                            <h2>Naša misia</h2>
                            <p>
                                Salon Finder SK vznikol s jednoduchým cieľom - zjednodušiť ľuďom
                                hľadanie salónov krásy na Slovensku. Veríme, že každý si zaslúži
                                ľahký prístup ku kvalitným službám v oblasti krásy a wellness.
                            </p>
                        </section>

                        <section className={styles.section}>
                            <h2>Čo ponúkame</h2>
                            <div className={styles.features}>
                                <div className={styles.feature}>
                                    <span className={styles.featureIcon}>🔍</span>
                                    <h3>Jednoduché vyhľadávanie</h3>
                                    <p>Nájdite salóny podľa mesta, kategórie alebo služby. Porovnajte hodnotenia a recenzie.</p>
                                </div>
                                <div className={styles.feature}>
                                    <span className={styles.featureIcon}>✅</span>
                                    <h3>Overené salóny</h3>
                                    <p>Všetky salóny prechádzajú verifikáciou, aby ste mali istotu kvality.</p>
                                </div>
                                <div className={styles.feature}>
                                    <span className={styles.featureIcon}>📞</span>
                                    <h3>Priamy kontakt</h3>
                                    <p>Kontaktujte salóny priamo - telefón, e-mail alebo rezervácia online.</p>
                                </div>
                                <div className={styles.feature}>
                                    <span className={styles.featureIcon}>🆓</span>
                                    <h3>Bezplatná registrácia</h3>
                                    <p>Pre majiteľov salónov ponúkame bezplatnú registráciu a základný profil.</p>
                                </div>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h2>Pre majiteľov salónov</h2>
                            <p>
                                Ste majiteľom salónu? Pridajte sa k stovkám salónov, ktoré už využívajú
                                Salon Finder SK na získavanie nových zákazníkov. Registrácia je zadarmo
                                a trvá len 2 minúty.
                            </p>
                            <a href="/registracia" className={styles.ctaButton}>
                                Pridať salón zadarmo
                            </a>
                        </section>

                        <section className={styles.section}>
                            <h2>Kontakt</h2>
                            <p>
                                Máte otázky alebo návrhy? Sme tu pre vás!
                            </p>
                            <ul className={styles.contactList}>
                                <li>📧 E-mail: info@salonfinder.sk</li>
                                <li>📍 Apollo Tech s.r.o., Slovensko</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
