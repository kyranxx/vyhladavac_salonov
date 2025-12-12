import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from '../ochrana-sukromia/page.module.css';

export const metadata: Metadata = {
    title: 'Cookies | Salon Finder SK',
    description: 'Informácie o používaní cookies na stránke Salon Finder SK.',
};

export default function CookiesPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Pravidlá používania cookies</h1>
                    <p className={styles.updated}>Posledná aktualizácia: December 2024</p>

                    <section className={styles.section}>
                        <h2>Čo sú cookies?</h2>
                        <p>
                            Cookies sú malé textové súbory, ktoré sa ukladajú do vášho zariadenia
                            pri návšteve webových stránok. Pomáhajú nám zapamätať si vaše preferencie
                            a zlepšovať vaše používanie stránky.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>Typy cookies, ktoré používame</h2>

                        <h3>Nevyhnutné cookies</h3>
                        <p>
                            Tieto cookies sú potrebné pre základné fungovanie stránky. Bez nich by stránka
                            nefungovala správne. Patria sem cookies pre prihlásenie a bezpečnosť.
                        </p>

                        <h3>Analytické cookies</h3>
                        <p>
                            Používame Google Analytics a Microsoft Clarity na analýzu návštevnosti.
                            Tieto nástroje nám pomáhajú pochopiť, ako používate našu stránku, a zlepšovať ju.
                        </p>
                        <ul>
                            <li><strong>Google Analytics:</strong> Sledovanie návštevnosti a správania</li>
                            <li><strong>Microsoft Clarity:</strong> Nahrávanie relácií a heatmapy</li>
                        </ul>

                        <h3>Funkčné cookies</h3>
                        <p>
                            Tieto cookies si pamätajú vaše preferencie, napríklad zvolený jazyk
                            alebo súhlas s cookies.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>Ako spravovať cookies</h2>
                        <p>
                            Väčšina prehliadačov vám umožňuje spravovať cookies v nastaveniach.
                            Môžete cookies vymazať alebo zablokovať, ale niektoré funkcie stránky
                            potom nemusia fungovať správne.
                        </p>
                        <ul>
                            <li><strong>Chrome:</strong> Nastavenia → Súkromie a zabezpečenie → Cookies</li>
                            <li><strong>Firefox:</strong> Nastavenia → Súkromie a zabezpečenie</li>
                            <li><strong>Safari:</strong> Predvoľby → Súkromie</li>
                            <li><strong>Edge:</strong> Nastavenia → Cookies a povolenia stránok</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>Zmena nastavení</h2>
                        <p>
                            Svoj súhlas s cookies môžete kedykoľvek zmeniť vymazaním cookies vo vašom
                            prehliadači. Pri ďalšej návšteve sa vám znova zobrazí banner so súhlasom.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>Kontakt</h2>
                        <p>
                            Ak máte otázky ohľadom cookies, kontaktujte nás na:
                            <strong> privacy@salonfinder.sk</strong>
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
