import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Ochrana súkromia | Salon Finder SK',
    description: 'Informácie o spracovaní osobných údajov na stránke Salon Finder SK.',
};

export default function PrivacyPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Ochrana súkromia</h1>
                    <p className={styles.updated}>Posledná aktualizácia: December 2024</p>

                    <section className={styles.section}>
                        <h2>1. Úvod</h2>
                        <p>
                            Spoločnosť Apollo Tech s.r.o. (ďalej len "my", "nás" alebo "naša spoločnosť")
                            prevádzkuje webovú stránku Salon Finder SK (ďalej len "služba"). Táto stránka
                            vás informuje o našich pravidlách týkajúcich sa zhromažďovania, používania a
                            zverejňovania osobných údajov pri používaní našej služby.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>2. Aké údaje zbierame</h2>
                        <p>Môžeme zhromažďovať nasledujúce typy údajov:</p>
                        <ul>
                            <li><strong>Osobné identifikačné údaje:</strong> Meno, e-mailová adresa, telefónne číslo</li>
                            <li><strong>Údaje o salóne:</strong> Názov salónu, adresa, poskytované služby, fotografie</li>
                            <li><strong>Technické údaje:</strong> IP adresa, typ prehliadača, operačný systém</li>
                            <li><strong>Údaje o používaní:</strong> Návštevnosť stránok, kliknutia, čas strávený na stránke</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>3. Ako používame vaše údaje</h2>
                        <p>Vaše údaje používame na:</p>
                        <ul>
                            <li>Poskytovanie a udržiavanie našej služby</li>
                            <li>Zobrazovanie profilov salónov verejnosti</li>
                            <li>Spracovanie platieb za prémiové služby</li>
                            <li>Odosielanie oznámení súvisiacich so službou</li>
                            <li>Zlepšovanie našej služby prostredníctvom analýzy</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>4. Cookies</h2>
                        <p>
                            Používame cookies na zlepšenie vašej skúsenosti. Cookies sú malé textové súbory
                            uložené vo vašom prehliadači. Používame:
                        </p>
                        <ul>
                            <li><strong>Nevyhnutné cookies:</strong> Potrebné pre fungovanie stránky</li>
                            <li><strong>Analytické cookies:</strong> Google Analytics a Microsoft Clarity</li>
                            <li><strong>Funkčné cookies:</strong> Zapamätanie vašich preferencií</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>5. Vaše práva</h2>
                        <p>V súlade s GDPR máte právo na:</p>
                        <ul>
                            <li>Prístup k vašim osobným údajom</li>
                            <li>Opravu nepresných údajov</li>
                            <li>Vymazanie vašich údajov ("právo byť zabudnutý")</li>
                            <li>Obmedzenie spracovania</li>
                            <li>Prenosnosť údajov</li>
                            <li>Namietanie proti spracovaniu</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>6. Kontakt</h2>
                        <p>
                            Ak máte akékoľvek otázky týkajúce sa ochrany osobných údajov, kontaktujte nás na:
                        </p>
                        <p>
                            <strong>E-mail:</strong> privacy@salonfinder.sk<br />
                            <strong>Adresa:</strong> Apollo Tech s.r.o., Bratislava, Slovensko
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
