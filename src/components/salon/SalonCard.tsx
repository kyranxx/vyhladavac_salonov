import Link from 'next/link';
import Image from 'next/image';
import styles from './SalonCard.module.css';

interface SalonCardProps {
    salon: {
        id: string;
        slug: string;
        name: string;
        description?: string;
        address: string;
        district: string;
        categories: string[];
        image?: string;
        rating?: number;
        reviewCount?: number;
        isPremium?: boolean;
        isVerified?: boolean;
        isFeatured?: boolean;
    };
}

export function SalonCard({ salon }: SalonCardProps) {
    return (
        <Link href={`/salon/${salon.slug}`} className={styles.card}>
            {/* Image */}
            <div className={styles.imageWrapper}>
                {salon.image ? (
                    <Image
                        src={salon.image}
                        alt={salon.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className={styles.image}
                    />
                ) : (
                    <Image
                        src={`https://picsum.photos/seed/${salon.id}/400/250`}
                        alt={salon.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className={styles.image}
                    />
                )}

                {/* Badges */}
                <div className={styles.badges}>
                    {salon.isFeatured && (
                        <span className={styles.featuredBadge}>⭐ Zvýraznený</span>
                    )}
                    {salon.isPremium && (
                        <span className={styles.premiumBadge}>Premium</span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.name}>
                        {salon.name}
                        {salon.isVerified && (
                            <span className={styles.verifiedBadge} title="Overený salón">✓</span>
                        )}
                    </h3>

                    {salon.rating && (
                        <div className={styles.rating}>
                            <span className={styles.ratingStars}>⭐</span>
                            <span className={styles.ratingValue}>{salon.rating.toFixed(1)}</span>
                            {salon.reviewCount && (
                                <span className={styles.reviewCount}>({salon.reviewCount})</span>
                            )}
                        </div>
                    )}
                </div>

                <p className={styles.address}>📍 {salon.address}, {salon.district}</p>

                {salon.categories.length > 0 && (
                    <div className={styles.categories}>
                        {salon.categories.slice(0, 3).map((category) => (
                            <span key={category} className={styles.category}>
                                {category}
                            </span>
                        ))}
                        {salon.categories.length > 3 && (
                            <span className={styles.moreCategories}>
                                +{salon.categories.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {salon.description && (
                    <p className={styles.description}>
                        {salon.description.length > 100
                            ? `${salon.description.substring(0, 100)}...`
                            : salon.description}
                    </p>
                )}
            </div>
        </Link>
    );
}
