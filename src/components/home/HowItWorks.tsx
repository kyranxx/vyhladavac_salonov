import styles from './HowItWorks.module.css';

const steps = [
    {
        number: '01',
        icon: '🔍',
        title: 'Vyhľadajte',
        description: 'Zadajte mesto alebo kategóriu služby, ktorú hľadáte.',
    },
    {
        number: '02',
        icon: '📋',
        title: 'Porovnajte',
        description: 'Prezrite si profily salónov, hodnotenia a služby.',
    },
    {
        number: '03',
        icon: '📞',
        title: 'Kontaktujte',
        description: 'Zavolajte alebo rezervujte termín priamo zo stránky.',
    },
    {
        number: '04',
        icon: '✨',
        title: 'Užívajte si',
        description: 'Navštívte salón a užite si profesionálne služby.',
    },
];

export function HowItWorks() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Ako to funguje</h2>
                    <p className={styles.subtitle}>
                        Nájdite perfektný salón v 4 jednoduchých krokoch
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
