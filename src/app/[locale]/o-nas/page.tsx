import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getTranslation } from '@/lib/translations';
import styles from '@/app/o-nas/page.module.css';

const textsByLocale: Record<string, {
    title: string; subtitle: string; mission: string; missionText: string;
    whatWeOffer: string; search: string; searchDesc: string; verified: string;
    verifiedDesc: string; contact: string; contactDesc: string; free: string;
    freeDesc: string; forOwners: string; forOwnersText: string; addFree: string;
    contactTitle: string; contactText: string;
}> = {
    en: {
        title: 'About Us',
        subtitle: 'Helping people find the right beauty salon',
        mission: 'Our Mission',
        missionText: 'Salon Finder SK was created with a simple goal - to make it easier for people to find beauty salons in Slovakia. We believe everyone deserves easy access to quality beauty and wellness services.',
        whatWeOffer: 'What We Offer',
        search: 'Easy Search',
        searchDesc: 'Find salons by city, category, or service. Compare ratings and reviews.',
        verified: 'Verified Salons',
        verifiedDesc: 'All salons go through verification to ensure quality.',
        contact: 'Direct Contact',
        contactDesc: 'Contact salons directly - phone, email, or online booking.',
        free: 'Free Registration',
        freeDesc: 'For salon owners, we offer free registration and basic profile.',
        forOwners: 'For Salon Owners',
        forOwnersText: 'Are you a salon owner? Join hundreds of salons already using Salon Finder SK to attract new customers. Registration is free and takes only 2 minutes.',
        addFree: 'Add Salon for Free',
        contactTitle: 'Contact',
        contactText: 'Have questions or suggestions? We are here for you!',
    },
    hu: {
        title: 'Rólunk',
        subtitle: 'Segítünk az embereknek megtalálni a megfelelő szépségszalont',
        mission: 'Küldetésünk',
        missionText: 'A Salon Finder SK egyszerű céllal jött létre - megkönnyíteni az embereknek a szépségszalonok keresését Szlovákiában. Hisszük, hogy mindenki megérdemli a könnyű hozzáférést a minőségi szépség- és wellness-szolgáltatásokhoz.',
        whatWeOffer: 'Mit kínálunk',
        search: 'Egyszerű keresés',
        searchDesc: 'Találjon szalonokat város, kategória vagy szolgáltatás szerint. Hasonlítsa össze az értékeléseket.',
        verified: 'Ellenőrzött szalonok',
        verifiedDesc: 'Minden szalon ellenőrzésen esik át a minőség biztosítása érdekében.',
        contact: 'Közvetlen kapcsolat',
        contactDesc: 'Lépjen kapcsolatba a szalonokkal közvetlenül - telefon, e-mail vagy online foglalás.',
        free: 'Ingyenes regisztráció',
        freeDesc: 'Szalontulajdonosoknak ingyenes regisztrációt és alap profilt kínálunk.',
        forOwners: 'Szalontulajdonosoknak',
        forOwnersText: 'Ön szalontulajdonos? Csatlakozzon a több száz szalonhoz, akik már a Salon Finder SK-t használják új ügyfelek szerzésére. A regisztráció ingyenes és csak 2 percet vesz igénybe.',
        addFree: 'Szalon hozzáadása ingyen',
        contactTitle: 'Kapcsolat',
        contactText: 'Kérdései vagy javaslatai vannak? Itt vagyunk Önnek!',
    },
};

interface PageProps {
    params: { locale: string };
}

export default function LocalizedAboutPage({ params }: PageProps) {
    const locale = params.locale || 'en';
    const texts = textsByLocale[locale] || textsByLocale.en;
    const t = getTranslation(locale);
    const basePath = `/${locale}`;

    return (
        <>
            <Header locale={locale} />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.hero}>
                        <h1 className={styles.title}>{texts.title}</h1>
                        <p className={styles.subtitle}>{texts.subtitle}</p>
                    </div>

                    <div className={styles.content}>
                        <section className={styles.section}>
                            <h2>{texts.mission}</h2>
                            <p>{texts.missionText}</p>
                        </section>

                        <section className={styles.section}>
                            <h2>{texts.whatWeOffer}</h2>
                            <div className={styles.features}>
                                <div className={styles.feature}>
                                    <span className={styles.featureIcon}>🔍</span>
                                    <h3>{texts.search}</h3>
                                    <p>{texts.searchDesc}</p>
                                </div>
                                <div className={styles.feature}>
                                    <span className={styles.featureIcon}>✅</span>
                                    <h3>{texts.verified}</h3>
                                    <p>{texts.verifiedDesc}</p>
                                </div>
                                <div className={styles.feature}>
                                    <span className={styles.featureIcon}>📞</span>
                                    <h3>{texts.contact}</h3>
                                    <p>{texts.contactDesc}</p>
                                </div>
                                <div className={styles.feature}>
                                    <span className={styles.featureIcon}>🆓</span>
                                    <h3>{texts.free}</h3>
                                    <p>{texts.freeDesc}</p>
                                </div>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h2>{texts.forOwners}</h2>
                            <p>{texts.forOwnersText}</p>
                            <a href={`${basePath}/registracia`} className={styles.ctaButton}>{texts.addFree}</a>
                        </section>

                        <section className={styles.section}>
                            <h2>{texts.contactTitle}</h2>
                            <p>{texts.contactText}</p>
                            <ul className={styles.contactList}>
                                <li>📧 E-mail: info@salonfinder.sk</li>
                                <li>📍 Apollo Tech s.r.o., Slovakia</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </main>
            <Footer locale={locale} translations={t} />
        </>
    );
}
