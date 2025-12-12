import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.code}>404</h1>
                <h2 className={styles.title}>Stránka nenájdená</h2>
                <p className={styles.description}>
                    Ospravedlňujeme sa, ale stránka, ktorú hľadáte, neexistuje alebo bola presunutá.
                </p>
                <div className={styles.actions}>
                    <Link href="/" className={styles.homeButton}>
                        Späť na hlavnú stránku
                    </Link>
                    <Link href="/salony" className={styles.salonsButton}>
                        Prezrieť salóny
                    </Link>
                </div>
            </div>
        </div>
    );
}
