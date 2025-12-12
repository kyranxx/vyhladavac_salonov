import styles from './Skeleton.module.css';

export function Skeleton({ className = '', ...props }: { className?: string }) {
    return <div className={`${styles.skeleton} ${className}`} {...props} />;
}

export function SalonCardSkeleton() {
    return (
        <div className={styles.cardSkeleton}>
            <div className={`${styles.skeleton} ${styles.cardImage}`} />
            <div className={styles.cardContent}>
                <div className={`${styles.skeleton} ${styles.cardTitle}`} />
                <div className={`${styles.skeleton} ${styles.cardText}`} />
                <div className={`${styles.skeleton} ${styles.cardTextShort}`} />
            </div>
        </div>
    );
}

export function SalonGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className={styles.grid}>
            {Array.from({ length: count }).map((_, i) => (
                <SalonCardSkeleton key={i} />
            ))}
        </div>
    );
}
