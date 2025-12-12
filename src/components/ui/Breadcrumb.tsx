import Link from 'next/link';
import styles from './Breadcrumb.module.css';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className={styles.breadcrumb} aria-label="Navigácia">
            <ol className={styles.list}>
                <li className={styles.item}>
                    <Link href="/" className={styles.link}>
                        Domov
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className={styles.item}>
                        <span className={styles.separator}>/</span>
                        {item.href ? (
                            <Link href={item.href} className={styles.link}>
                                {item.label}
                            </Link>
                        ) : (
                            <span className={styles.current}>{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
