import Link from 'next/link';
import styles from './Footer.module.css';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Main Footer Content */}
                <div className={styles.grid}>
                    {/* Brand Column */}
                    <div className={styles.brandColumn}>
                        <Link href="/" className={styles.logo}>
                            <span className={styles.logoIcon}>💇</span>
                            <span className={styles.logoText}>Salon Finder SK</span>
                        </Link>
                        <p className={styles.description}>
                            Najväčší katalóg salónov krásy na Slovensku. Nájdite kaderníctva,
                            kozmetické salóny, manikúru a ďalšie služby vo vašom meste.
                        </p>
                    </div>

                    {/* Categories */}
                    <div className={styles.linkColumn}>
                        <h3 className={styles.columnTitle}>Kategórie</h3>
                        <nav className={styles.linkList}>
                            <Link href="/kategoria/damske-kadernictvo">Dámske kaderníctvo</Link>
                            <Link href="/kategoria/panske-kadernictvo">Pánske kaderníctvo</Link>
                            <Link href="/kategoria/kozmetika">Kozmetika</Link>
                            <Link href="/kategoria/manikura">Manikúra</Link>
                            <Link href="/kategoria/masaze">Masáže</Link>
                        </nav>
                    </div>

                    {/* Cities */}
                    <div className={styles.linkColumn}>
                        <h3 className={styles.columnTitle}>Mestá</h3>
                        <nav className={styles.linkList}>
                            <Link href="/salony/bratislava">Bratislava</Link>
                            <Link href="/salony/kosice">Košice</Link>
                            <Link href="/salony/zilina">Žilina</Link>
                            <Link href="/salony/nitra">Nitra</Link>
                            <Link href="/salony/presov">Prešov</Link>
                        </nav>
                    </div>

                    {/* Company */}
                    <div className={styles.linkColumn}>
                        <h3 className={styles.columnTitle}>Spoločnosť</h3>
                        <nav className={styles.linkList}>
                            <Link href="/o-nas">O nás</Link>
                            <Link href="/ako-to-funguje">Ako to funguje</Link>
                            <Link href="/pre-majitelov">Pre majiteľov</Link>
                            <Link href="/cennik">Cenník</Link>
                            <Link href="/kontakt">Kontakt</Link>
                        </nav>
                    </div>

                    {/* Legal */}
                    <div className={styles.linkColumn}>
                        <h3 className={styles.columnTitle}>Právne informácie</h3>
                        <nav className={styles.linkList}>
                            <Link href="/ochrana-sukromia">Ochrana súkromia</Link>
                            <Link href="/obchodne-podmienky">Obchodné podmienky</Link>
                            <Link href="/cookies">Cookies</Link>
                        </nav>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © {currentYear} Salon Finder SK. Všetky práva vyhradené.
                    </p>
                    <p className={styles.company}>
                        Vytvoril <a href="https://apollotech.sk" target="_blank" rel="noopener noreferrer">Apollo Tech s.r.o.</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
