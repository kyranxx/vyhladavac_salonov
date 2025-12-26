import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from '../ochrana-sukromia/page.module.css';

export const metadata: Metadata = {
    title: 'Obchodné podmienky | Register salónov',
    description: 'Obchodné podmienky používania služby Register salónov.',
};

export default function TermsPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Obchodné podmienky</h1>
                    <p className={styles.updated}>Posledná aktualizácia: December 2024</p>

                    <section className={styles.section}>
                        <h2>1. Úvodné ustanovenia</h2>
                        <p>
                            Tieto obchodné podmienky upravujú práva a povinnosti medzi prevádzkovateľom
                            služby Register salónov (Apollo Tech s.r.o.) a používateľmi služby.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>2. Definície</h2>
                        <ul>
                            <li><strong>Služba:</strong> Webová stránka Register salónov</li>
                            <li><strong>Používateľ:</strong> Každá osoba, ktorá využíva službu</li>
                            <li><strong>Majiteľ salónu:</strong> Registrovaný používateľ s profilom salónu</li>
                            <li><strong>Prémiové služby:</strong> Platené funkcie a predplatné</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>3. Registrácia a účet</h2>
                        <p>
                            Pri registrácii ste povinní poskytnúť pravdivé a úplné údaje. Za bezpečnosť
                            svojho účtu ste zodpovední vy. Zdieľanie prístupových údajov tretím stranám
                            je zakázané.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>4. Obsah salónov</h2>
                        <p>
                            Majitelia salónov sú zodpovední za presnosť informácií v profile. Zakazuje sa:
                        </p>
                        <ul>
                            <li>Uvádzanie nepravdivých informácií</li>
                            <li>Nahrávanie obsahu porušujúceho autorské práva</li>
                            <li>Zverejňovanie nevhodného alebo urážlivého obsahu</li>
                            <li>Spam alebo nevyžiadaná reklama</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>5. Platby a predplatné</h2>
                        <p>
                            Prémiové služby sú spoplatnené podľa aktuálneho cenníka. Platby sa spracovávajú
                            bezpečne cez platobnú bránu Stripe. Predplatné sa automaticky obnovuje,
                            pokiaľ nie je zrušené pred koncom obdobia.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>6. Zrušenie a vrátenie</h2>
                        <p>
                            Predplatné môžete kedykoľvek zrušiť. Po zrušení máte prístup k prémiovým
                            funkciám do konca zaplateného obdobia. Na prémiové predplatné poskytujeme
                            14-dňovú garanciu vrátenia peňazí.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>7. Obmedzenie zodpovednosti</h2>
                        <p>
                            Nezodpovedáme za kvalitu služieb poskytovaných salónmi uvedenými na našej
                            platforme. Spory medzi používateľmi a salónmi sa riešia priamo medzi stranami.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>8. Kontakt</h2>
                        <p>
                            <strong>E-mail:</strong> info@salonfinder.sk<br />
                            <strong>Spoločnosť:</strong> Apollo Tech s.r.o., Bratislava, Slovensko
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
