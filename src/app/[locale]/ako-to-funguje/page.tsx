import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getTranslation } from '@/lib/translations';
import styles from '@/app/ako-to-funguje/page.module.css';

const textsByLocale: Record<string, {
    title: string; subtitle: string; forCustomers: string; forOwners: string;
    faq: string; registerFree: string;
    step1: string; step1Desc: string; step2: string; step2Desc: string;
    step3: string; step3Desc: string; step4: string; step4Desc: string;
    owner1: string; owner1Desc: string; owner2: string; owner2Desc: string;
    owner3: string; owner3Desc: string; owner4: string; owner4Desc: string;
    faq1: string; faq1A: string; faq2: string; faq2A: string; faq3: string; faq3A: string;
}> = {
    en: {
        title: 'How It Works',
        subtitle: 'Find the perfect salon in a few simple steps',
        forCustomers: 'For Customers',
        forOwners: 'For Salon Owners',
        faq: 'Frequently Asked Questions',
        registerFree: 'Add Salon for Free',
        step1: 'Search', step1Desc: 'Enter the city, category, or specific service you are looking for.',
        step2: 'Compare', step2Desc: 'Browse salon profiles, their services, prices, and photos. Read customer reviews.',
        step3: 'Contact', step3Desc: 'Call the salon directly, send a message, or use the online booking system.',
        step4: 'Enjoy', step4Desc: 'Visit your chosen salon and enjoy professional services.',
        owner1: 'Register', owner1Desc: 'Create a free account and fill in basic information about your salon.',
        owner2: 'Add Content', owner2Desc: 'Upload photos, add services with prices, and opening hours.',
        owner3: 'Get Approved', owner3Desc: 'Our team will review your profile and activate it within 24 hours.',
        owner4: 'Get Customers', owner4Desc: 'Your salon is visible to thousands of potential customers.',
        faq1: 'Is salon registration free?', faq1A: 'Yes, basic registration and salon profile are completely free. We also offer premium packages with extended features.',
        faq2: 'How long does profile approval take?', faq2A: 'Most profiles are approved within 24 hours on business days.',
        faq3: 'Can I edit my profile after registration?', faq3A: 'Of course! After logging in, you can edit all information, photos, and services at any time.',
    },
    hu: {
        title: 'Hogyan működik',
        subtitle: 'Találd meg a tökéletes szalont néhány egyszerű lépésben',
        forCustomers: 'Ügyfeleknek',
        forOwners: 'Szalontulajdonosoknak',
        faq: 'Gyakran ismételt kérdések',
        registerFree: 'Szalon hozzáadása ingyen',
        step1: 'Keresés', step1Desc: 'Írja be a keresett várost, kategóriát vagy szolgáltatást.',
        step2: 'Összehasonlítás', step2Desc: 'Böngéssze a szalonprofilokat, szolgáltatásaikat, áraikat és fényképeiket.',
        step3: 'Kapcsolat', step3Desc: 'Hívja fel a szalont közvetlenül, küldjön üzenetet, vagy használja az online foglalási rendszert.',
        step4: 'Élvezze', step4Desc: 'Látogassa meg a kiválasztott szalont és élvezze a professzionális szolgáltatásokat.',
        owner1: 'Regisztráció', owner1Desc: 'Hozzon létre ingyenes fiókot és töltse ki az alapvető adatokat szalonjáról.',
        owner2: 'Tartalom hozzáadása', owner2Desc: 'Töltsön fel fényképeket, adjon hozzá szolgáltatásokat árakkal és nyitvatartással.',
        owner3: 'Jóváhagyás', owner3Desc: 'Csapatunk ellenőrzi profilját és 24 órán belül aktiválja.',
        owner4: 'Ügyfelek szerzése', owner4Desc: 'Szalonja látható több ezer potenciális ügyfél számára.',
        faq1: 'Ingyenes a szalon regisztrációja?', faq1A: 'Igen, az alapvető regisztráció és szalonprofil teljesen ingyenes. Prémium csomagokat is kínálunk bővített funkciókkal.',
        faq2: 'Mennyi ideig tart a profil jóváhagyása?', faq2A: 'A legtöbb profilt 24 órán belül jóváhagyjuk munkanapokon.',
        faq3: 'Szerkeszthetem a profilomat a regisztráció után?', faq3A: 'Természetesen! Bejelentkezés után bármikor szerkesztheti az összes adatot, fényképet és szolgáltatást.',
    },
};

interface PageProps {
    params: { locale: string };
}

export default function LocalizedHowItWorksPage({ params }: PageProps) {
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

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>{texts.forCustomers}</h2>
                        <div className={styles.stepsGrid}>
                            <div className={styles.step}>
                                <span className={styles.stepNumber}>01</span>
                                <span className={styles.stepIcon}>🔍</span>
                                <h3 className={styles.stepTitle}>{texts.step1}</h3>
                                <p className={styles.stepDescription}>{texts.step1Desc}</p>
                            </div>
                            <div className={styles.step}>
                                <span className={styles.stepNumber}>02</span>
                                <span className={styles.stepIcon}>📋</span>
                                <h3 className={styles.stepTitle}>{texts.step2}</h3>
                                <p className={styles.stepDescription}>{texts.step2Desc}</p>
                            </div>
                            <div className={styles.step}>
                                <span className={styles.stepNumber}>03</span>
                                <span className={styles.stepIcon}>📞</span>
                                <h3 className={styles.stepTitle}>{texts.step3}</h3>
                                <p className={styles.stepDescription}>{texts.step3Desc}</p>
                            </div>
                            <div className={styles.step}>
                                <span className={styles.stepNumber}>04</span>
                                <span className={styles.stepIcon}>✨</span>
                                <h3 className={styles.stepTitle}>{texts.step4}</h3>
                                <p className={styles.stepDescription}>{texts.step4Desc}</p>
                            </div>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>{texts.forOwners}</h2>
                        <div className={styles.ownersGrid}>
                            <div className={styles.ownerStep}>
                                <span className={styles.ownerIcon}>📝</span>
                                <h3>{texts.owner1}</h3>
                                <p>{texts.owner1Desc}</p>
                            </div>
                            <div className={styles.ownerStep}>
                                <span className={styles.ownerIcon}>📸</span>
                                <h3>{texts.owner2}</h3>
                                <p>{texts.owner2Desc}</p>
                            </div>
                            <div className={styles.ownerStep}>
                                <span className={styles.ownerIcon}>✅</span>
                                <h3>{texts.owner3}</h3>
                                <p>{texts.owner3Desc}</p>
                            </div>
                            <div className={styles.ownerStep}>
                                <span className={styles.ownerIcon}>🚀</span>
                                <h3>{texts.owner4}</h3>
                                <p>{texts.owner4Desc}</p>
                            </div>
                        </div>
                        <div className={styles.ctaWrapper}>
                            <a href={`${basePath}/registracia`} className={styles.ctaButton}>{texts.registerFree}</a>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>{texts.faq}</h2>
                        <div className={styles.faqList}>
                            <div className={styles.faq}>
                                <h3>{texts.faq1}</h3>
                                <p>{texts.faq1A}</p>
                            </div>
                            <div className={styles.faq}>
                                <h3>{texts.faq2}</h3>
                                <p>{texts.faq2A}</p>
                            </div>
                            <div className={styles.faq}>
                                <h3>{texts.faq3}</h3>
                                <p>{texts.faq3A}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer locale={locale} translations={t} />
        </>
    );
}
