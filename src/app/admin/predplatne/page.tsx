'use client';

import styles from './page.module.css';

const mockSubscriptions = [
    { id: '1', salon: 'Beauty Salon Bratislava', type: 'Premium', status: 'active', expires: '2025-01-15', amount: '30€' },
    { id: '2', salon: 'Nail Studio Košice', type: 'Featured', status: 'active', expires: '2024-12-20', amount: '5€' },
    { id: '3', salon: 'Wellness Spa Žilina', type: 'Premium', status: 'expired', expires: '2024-12-01', amount: '3€' },
];

export default function AdminSubscriptionsPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Predplatné</h1>
                <p className={styles.subtitle}>Prehľad všetkých predplatných a platieb</p>
            </div>

            <div className={styles.content}>
                {/* Stats */}
                <div className={styles.stats}>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>45€</div>
                        <div className={styles.statLabel}>Príjem tento mesiac</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>2</div>
                        <div className={styles.statLabel}>Aktívne Premium</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>1</div>
                        <div className={styles.statLabel}>Zvýraznené salóny</div>
                    </div>
                </div>

                {/* Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Salón</th>
                                <th>Typ</th>
                                <th>Status</th>
                                <th>Platnosť do</th>
                                <th>Suma</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockSubscriptions.map((sub) => (
                                <tr key={sub.id}>
                                    <td>{sub.salon}</td>
                                    <td>{sub.type}</td>
                                    <td>
                                        <span className={`${styles.badge} ${sub.status === 'active' ? styles.badgeActive : styles.badgeExpired}`}>
                                            {sub.status === 'active' ? 'Aktívne' : 'Expirované'}
                                        </span>
                                    </td>
                                    <td>{sub.expires}</td>
                                    <td>{sub.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
