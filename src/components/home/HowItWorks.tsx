import styles from './HowItWorks.module.css';

const stepsByLocale: Record<string, Array<{ number: string; icon: string; title: string; description: string }>> = {
    sk: [
        { number: '01', icon: '🔍', title: 'Vyhľadajte', description: 'Zadajte mesto alebo kategóriu služby, ktorú hľadáte.' },
        { number: '02', icon: '📋', title: 'Porovnajte', description: 'Prezrite si profily salónov, hodnotenia a služby.' },
        { number: '03', icon: '📞', title: 'Kontaktujte', description: 'Zavolajte alebo rezervujte termín priamo zo stránky.' },
        { number: '04', icon: '✨', title: 'Užívajte si', description: 'Navštívte salón a užite si profesionálne služby.' },
    ],
    en: [
        { number: '01', icon: '🔍', title: 'Search', description: 'Enter the city or service category you are looking for.' },
        { number: '02', icon: '📋', title: 'Compare', description: 'Browse salon profiles, ratings and services.' },
        { number: '03', icon: '📞', title: 'Contact', description: 'Call or book an appointment directly from the site.' },
        { number: '04', icon: '✨', title: 'Enjoy', description: 'Visit the salon and enjoy professional services.' },
    ],
    hu: [
        { number: '01', icon: '🔍', title: 'Keresés', description: 'Írja be a keresett várost vagy szolgáltatást.' },
        { number: '02', icon: '📋', title: 'Összehasonlítás', description: 'Böngésszen a szalonprofilok, értékelések és szolgáltatások között.' },
        { number: '03', icon: '📞', title: 'Kapcsolat', description: 'Hívjon vagy foglaljon időpontot közvetlenül az oldalról.' },
        { number: '04', icon: '✨', title: 'Élvezze', description: 'Látogassa meg a szalont és élvezze a professzionális szolgáltatásokat.' },
    ],
};

const textsByLocale: Record<string, { title: string; subtitle: string }> = {
    sk: { title: 'Ako to funguje', subtitle: 'Nájdite perfektný salón v 4 jednoduchých krokoch' },
    en: { title: 'How It Works', subtitle: 'Find the perfect salon in 4 easy steps' },
    hu: { title: 'Hogyan működik', subtitle: 'Találd meg a tökéletes szalont 4 egyszerű lépésben' },
};

interface HowItWorksProps {
    locale?: string;
}

export function HowItWorks({ locale = 'sk' }: HowItWorksProps) {
    const steps = stepsByLocale[locale] || stepsByLocale.sk;
    const texts = textsByLocale[locale] || textsByLocale.sk;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{texts.title}</h2>
                    <p className={styles.subtitle}>
                        {texts.subtitle}
                    </p>
                </div>

                <div className={styles.grid}>
                    {steps.map((step) => (
                        <div key={step.number} className={styles.step}>
                            <span className={styles.number}>{step.number}</span>
                            <span className={styles.icon}>{step.icon}</span>
                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepDescription}>{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

