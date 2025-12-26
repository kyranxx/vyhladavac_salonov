import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Kontakt | Register salónov',
    description: 'Kontaktujte nás s akýmikoľvek otázkami alebo pripomienkami.',
};

export default function ContactPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Kontaktujte nás</h1>
                        <p className={styles.subtitle}>
                            Máte otázky? Napíšte nám a radi vám odpovieme.
                        </p>
                    </div>

                    <div className={styles.grid}>
                        {/* Contact Form */}
                        <div className={styles.formCard}>
                            <form className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name" className={styles.label}>
                                        Vaše meno
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className={styles.input}
                                        placeholder="Ján Novák"
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="email" className={styles.label}>
                                        E-mail
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className={styles.input}
                                        placeholder="vas@email.sk"
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="subject" className={styles.label}>
                                        Predmet
                                    </label>
                                    <select id="subject" className={styles.select} required>
                                        <option value="">Vyberte predmet</option>
                                        <option value="general">Všeobecná otázka</option>
                                        <option value="salon">Môj salón</option>
                                        <option value="billing">Fakturácia</option>
                                        <option value="bug">Nahlásenie chyby</option>
                                        <option value="other">Iné</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="message" className={styles.label}>
                                        Správa
                                    </label>
                                    <textarea
                                        id="message"
                                        className={styles.textarea}
                                        placeholder="Vaša správa..."
                                        rows={5}
                                        required
                                    />
                                </div>

                                <button type="submit" className={styles.submitButton}>
                                    Odoslať správu
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className={styles.infoCard}>
                            <h2 className={styles.infoTitle}>Kontaktné údaje</h2>

                            <div className={styles.infoItem}>
                                <span className={styles.infoIcon}>📧</span>
                                <div>
                                    <h3>E-mail</h3>
                                    <a href="mailto:info@salonfinder.sk">info@salonfinder.sk</a>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <span className={styles.infoIcon}>🏢</span>
                                <div>
                                    <h3>Spoločnosť</h3>
                                    <p>Apollo Tech s.r.o.</p>
                                    <p>Bratislava, Slovensko</p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <span className={styles.infoIcon}>⏰</span>
                                <div>
                                    <h3>Odpoveď</h3>
                                    <p>Zvyčajne do 24 hodín</p>
                                </div>
                            </div>

                            <div className={styles.faq}>
                                <h3>Často kladené otázky</h3>
                                <p>
                                    Predtým, ako nás kontaktujete, skúste si prezrieť naše{' '}
                                    <a href="/cennik">cenník</a> alebo{' '}
                                    <a href="/obchodne-podmienky">obchodné podmienky</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
