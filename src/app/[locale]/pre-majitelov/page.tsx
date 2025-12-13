import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getTranslation } from '@/lib/translations';
import Link from 'next/link';
import styles from '@/app/pre-majitelov/page.module.css';

const textsByLocale: Record<string, {
    title: string; subtitle: string; freeTitle: string; freeDesc: string;
    premiumTitle: string; premiumDesc: string; registerFree: string;
    benefit1Title: string; benefit1Desc: string;
    benefit2Title: string; benefit2Desc: string;
    benefit3Title: string; benefit3Desc: string;
    benefit4Title: string; benefit4Desc: string;
}> = {
    en: {
        title: 'For Salon Owners',
        subtitle: 'Increase visibility of your salon and attract new customers',
        freeTitle: 'Free Profile',
        freeDesc: 'Basic listing with contact info and opening hours',
        premiumTitle: 'Premium Features',
        premiumDesc: 'Unlimited photos, priority placement, analytics',
        registerFree: 'Register for Free',
        benefit1Title: 'Thousands of Visitors',
        benefit1Desc: 'Our platform receives thousands of visitors looking for beauty services every month.',
        benefit2Title: 'Easy Management',
        benefit2Desc: 'Update your profile, services, and photos anytime through our simple dashboard.',
        benefit3Title: 'Customer Reviews',
        benefit3Desc: 'Build trust with verified customer reviews and ratings.',
        benefit4Title: 'Analytics',
        benefit4Desc: 'Track views, clicks, and customer interactions with detailed statistics.',
    },
    hu: {
        title: 'Szalontulajdonosoknak',
        subtitle: 'Növelje szalonja láthatóságát és vonzzon új ügyfeleket',
        freeTitle: 'Ingyenes profil',
        freeDesc: 'Alapvető felsorolás elérhetőségekkel és nyitvatartással',
        premiumTitle: 'Prémium funkciók',
        premiumDesc: 'Korlátlan fotók, prioritásos elhelyezés, analitika',
        registerFree: 'Ingyenes regisztráció',
        benefit1Title: 'Több ezer látogató',
        benefit1Desc: 'Platformunk havonta több ezer látogatót fogad, akik szépségszolgáltatásokat keresnek.',
        benefit2Title: 'Egyszerű kezelés',
        benefit2Desc: 'Frissítse profilját, szolgáltatásait és fényképeit bármikor az egyszerű irányítópulton keresztül.',
        benefit3Title: 'Ügyfélértékelések',
        benefit3Desc: 'Építsen bizalmat ellenőrzött ügyfélértékelésekkel és értékelésekkel.',
        benefit4Title: 'Analitika',
        benefit4Desc: 'Kövesse nyomon a megtekintéseket, kattintásokat és ügyfél-interakciókat részletes statisztikákkal.',
    },
};

interface PageProps {
    params: { locale: string };
}

export default function LocalizedForOwnersPage({ params }: PageProps) {
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
                        <Link href={`${basePath}/registracia`} className={styles.ctaButton}>
                            {texts.registerFree}
                        </Link>
                    </div>

                    <div className={styles.benefits}>
                        <div className={styles.benefit}>
                            <span className={styles.benefitIcon}>👥</span>
                            <h3>{texts.benefit1Title}</h3>
                            <p>{texts.benefit1Desc}</p>
                        </div>
                        <div className={styles.benefit}>
                            <span className={styles.benefitIcon}>⚙️</span>
                            <h3>{texts.benefit2Title}</h3>
                            <p>{texts.benefit2Desc}</p>
                        </div>
                        <div className={styles.benefit}>
                            <span className={styles.benefitIcon}>⭐</span>
                            <h3>{texts.benefit3Title}</h3>
                            <p>{texts.benefit3Desc}</p>
                        </div>
                        <div className={styles.benefit}>
                            <span className={styles.benefitIcon}>📊</span>
                            <h3>{texts.benefit4Title}</h3>
                            <p>{texts.benefit4Desc}</p>
                        </div>
                    </div>

                    <div className={styles.pricing}>
                        <div className={styles.plan}>
                            <h3>{texts.freeTitle}</h3>
                            <p className={styles.price}>€0</p>
                            <p>{texts.freeDesc}</p>
                        </div>
                        <div className={`${styles.plan} ${styles.planPremium}`}>
                            <h3>{texts.premiumTitle}</h3>
                            <p className={styles.price}>€3/month</p>
                            <p>{texts.premiumDesc}</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer locale={locale} translations={t} />
        </>
    );
}
