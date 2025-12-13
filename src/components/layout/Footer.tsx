import Link from 'next/link';
import { TranslationKey } from '@/lib/translations';
import styles from './Footer.module.css';

interface FooterProps {
    locale?: string;
    translations?: TranslationKey;
}

export function Footer({ locale = 'sk', translations: t }: FooterProps) {
    const currentYear = new Date().getFullYear();
    const basePath = locale === 'sk' ? '' : `/${locale}`;

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Main Footer Content */}
                <div className={styles.grid}>
                    {/* Brand Column */}
                    <div className={styles.brandColumn}>
                        <Link href={basePath || '/'} className={styles.logo}>
                            <span className={styles.logoIcon}>💇</span>
                            <span className={styles.logoText}>Salon Finder SK</span>
                        </Link>
                        <p className={styles.description}>
                            {t?.footer.description || 'Najväčší katalóg salónov krásy na Slovensku. Nájdite kaderníctva, kozmetické salóny, manikúru a ďalšie služby vo vašom meste.'}
                        </p>
                    </div>

                    {/* Categories */}
                    <div className={styles.linkColumn}>
                        <h3 className={styles.columnTitle}>{t?.footer.categories || 'Kategórie'}</h3>
                        <nav className={styles.linkList}>
                            <Link href={`${basePath}/kategoria/damske-kadernictvo`}>
                                {locale === 'en' ? "Women's Hair Salon" : locale === 'hu' ? 'Női fodrászat' : 'Dámske kaderníctvo'}
                            </Link>
                            <Link href={`${basePath}/kategoria/panske-kadernictvo`}>
                                {locale === 'en' ? "Men's Hair Salon" : locale === 'hu' ? 'Férfi fodrászat' : 'Pánske kaderníctvo'}
                            </Link>
                            <Link href={`${basePath}/kategoria/kozmetika`}>
                                {locale === 'en' ? 'Cosmetics' : locale === 'hu' ? 'Kozmetika' : 'Kozmetika'}
                            </Link>
                            <Link href={`${basePath}/kategoria/manikura`}>
                                {locale === 'en' ? 'Manicure' : locale === 'hu' ? 'Manikűr' : 'Manikúra'}
                            </Link>
                            <Link href={`${basePath}/kategoria/masaze`}>
                                {locale === 'en' ? 'Massage' : locale === 'hu' ? 'Masszázs' : 'Masáže'}
                            </Link>
                        </nav>
                    </div>

                    {/* Cities */}
                    <div className={styles.linkColumn}>
                        <h3 className={styles.columnTitle}>
                            {locale === 'en' ? 'Cities' : locale === 'hu' ? 'Városok' : 'Mestá'}
                        </h3>
                        <nav className={styles.linkList}>
                            <Link href={`${basePath}/salony/bratislava`}>Bratislava</Link>
                            <Link href={`${basePath}/salony/kosice`}>Košice</Link>
                            <Link href={`${basePath}/salony/zilina`}>Žilina</Link>
                            <Link href={`${basePath}/salony/nitra`}>Nitra</Link>
                            <Link href={`${basePath}/salony/presov`}>Prešov</Link>
                        </nav>
                    </div>

                    {/* Company */}
                    <div className={styles.linkColumn}>
                        <h3 className={styles.columnTitle}>
                            {locale === 'en' ? 'Company' : locale === 'hu' ? 'Cég' : 'Spoločnosť'}
                        </h3>
                        <nav className={styles.linkList}>
                            <Link href={`${basePath}/o-nas`}>
                                {locale === 'en' ? 'About Us' : locale === 'hu' ? 'Rólunk' : 'O nás'}
                            </Link>
                            <Link href={`${basePath}/ako-to-funguje`}>
                                {locale === 'en' ? 'How It Works' : locale === 'hu' ? 'Hogyan működik' : 'Ako to funguje'}
                            </Link>
                            <Link href={`${basePath}/pre-majitelov`}>
                                {t?.footer.forSalons || 'Pre majiteľov'}
                            </Link>
                            <Link href={`${basePath}/cennik`}>{t?.footer.pricing || 'Cenník'}</Link>
                            <Link href={`${basePath}/kontakt`}>{t?.footer.contact || 'Kontakt'}</Link>
                        </nav>
                    </div>

                    {/* Legal */}
                    <div className={styles.linkColumn}>
                        <h3 className={styles.columnTitle}>
                            {locale === 'en' ? 'Legal' : locale === 'hu' ? 'Jogi információk' : 'Právne informácie'}
                        </h3>
                        <nav className={styles.linkList}>
                            <Link href={`${basePath}/ochrana-sukromia`}>{t?.footer.privacyPolicy || 'Ochrana súkromia'}</Link>
                            <Link href={`${basePath}/obchodne-podmienky`}>{t?.footer.termsOfService || 'Obchodné podmienky'}</Link>
                            <Link href={`${basePath}/cookies`}>{t?.footer.cookies || 'Cookies'}</Link>
                        </nav>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © {currentYear} Salon Finder SK. {t?.footer.allRightsReserved || 'Všetky práva vyhradené.'}
                    </p>
                    <p className={styles.company}>
                        {locale === 'en' ? 'Created by' : locale === 'hu' ? 'Készítette' : 'Vytvoril'}{' '}
                        <a href="https://apollotech.sk" target="_blank" rel="noopener noreferrer">Apollo Tech s.r.o.</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
