import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './page.module.css';

export const metadata = {
    title: 'Ako to funguje | Register salónov',
    description: 'Zistite, ako nájsť perfektný salón krásy cez Register salónov v 4 jednoduchých krokoch.',
};

const steps = [
    {
        number: '01',
        icon: '🔍',
        title: 'Vyhľadajte salón',
        description: 'Zadajte mesto, kategóriu alebo konkrétnu službu, ktorú hľadáte. Naše vyhľadávanie vám ukáže všetky relevantné salóny vo vašom okolí.',
    },
    {
        number: '02',
        icon: '📋',
        title: 'Porovnajte možnosti',
        description: 'Prezrite si profily salónov, ich služby, cenníky a fotografie. Prečítajte si hodnotenia od ostatných zákazníkov.',
    },
    {
        number: '03',
        icon: '📞',
        title: 'Kontaktujte salón',
        description: 'Zavolajte priamo do salónu, pošlite správu alebo využite online rezervačný systém. Všetky kontaktné údaje nájdete na profile salónu.',
    },
    {
        number: '04',
        icon: '✨',
        title: 'Užite si služby',
        description: 'Navštívte vybraný salón a užite si profesionálne služby. Po návšteve môžete zanechať hodnotenie a pomôcť tak ostatným.',
    },
];

const forOwners = [
    {
        icon: '📝',
        title: 'Zaregistrujte sa',
        description: 'Vytvorte si bezplatný účet a vyplňte základné údaje o vašom salóne.',
    },
    {
        icon: '📸',
        title: 'Pridajte obsah',
        description: 'Nahrajte fotografie, pridajte služby s cenníkom a otváracie hodiny.',
    },
    {
        icon: '✅',
        title: 'Získajte schválenie',
        description: 'Náš tím skontroluje váš profil a do 24 hodín ho aktivuje.',
    },
    {
        icon: '🚀',
        title: 'Získavajte zákazníkov',
        description: 'Váš salón je viditeľný pre tisíce potenciálnych zákazníkov.',
    },
];

export default function HowItWorksPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.hero}>
                        <h1 className={styles.title}>Ako to funguje</h1>
                        <p className={styles.subtitle}>
                            Nájdite perfektný salón v niekoľkých jednoduchých krokoch
                        </p>
                    </div>

                    {/* For Customers */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Pre zákazníkov</h2>
                        <div className={styles.stepsGrid}>
                            {steps.map((step) => (
                                <div key={step.number} className={styles.step}>
                                    <span className={styles.stepNumber}>{step.number}</span>
                                    <span className={styles.stepIcon}>{step.icon}</span>
                                    <h3 className={styles.stepTitle}>{step.title}</h3>
                                    <p className={styles.stepDescription}>{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* For Owners */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Pre majiteľov salónov</h2>
                        <p className={styles.sectionSubtitle}>
                            Pridajte svoj salón a začnite získavať nových zákazníkov
                        </p>
                        <div className={styles.ownersGrid}>
                            {forOwners.map((item, index) => (
                                <div key={index} className={styles.ownerStep}>
                                    <span className={styles.ownerIcon}>{item.icon}</span>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                            ))}
                        </div>
                        <div className={styles.ctaWrapper}>
                            <a href="/registracia" className={styles.ctaButton}>
                                Pridať salón zadarmo
                            </a>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Často kladené otázky</h2>
                        <div className={styles.faqList}>
                            <div className={styles.faq}>
                                <h3>Je registrácia salónu zadarmo?</h3>
                                <p>Áno, základná registrácia a profil salónu sú úplne zadarmo. Ponúkame aj prémiové balíky s rozšírenými funkciami.</p>
                            </div>
                            <div className={styles.faq}>
                                <h3>Ako dlho trvá schválenie profilu?</h3>
                                <p>Väčšinu profilov schvaľujeme do 24 hodín v pracovných dňoch.</p>
                            </div>
                            <div className={styles.faq}>
                                <h3>Môžem upraviť svoj profil po registrácii?</h3>
                                <p>Samozrejme! Po prihlásení môžete kedykoľvek upraviť všetky údaje, fotografie a služby.</p>
                            </div>
                            <div className={styles.faq}>
                                <h3>Ako funguje prémiové predplatné?</h3>
                                <p>Prémiové predplatné vám umožňuje zobraziť neobmedzený počet fotografií, získať prioritné zobrazenie vo výsledkoch a využívať ďalšie marketingové nástroje.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
