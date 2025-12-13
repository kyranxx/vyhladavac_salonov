'use client';

import styles from './page.module.css';

const mockUsers = [
    { id: '1', email: 'owner1@salon.sk', name: 'Ján Novák', role: 'salon_owner', created: '2024-12-01' },
    { id: '2', email: 'owner2@salon.sk', name: 'Mária Kováčová', role: 'salon_owner', created: '2024-12-05' },
    { id: '3', email: 'user1@email.sk', name: 'Peter Horváth', role: 'user', created: '2024-12-10' },
];

export default function AdminUsersPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Používatelia</h1>
                <p className={styles.subtitle}>Správa používateľských účtov</p>
            </div>

            <div className={styles.content}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Meno</th>
                                <th>E-mail</th>
                                <th>Rola</th>
                                <th>Registrovaný</th>
                                <th>Akcie</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`${styles.badge} ${user.role === 'salon_owner' ? styles.badgeOwner : styles.badgeUser}`}>
                                            {user.role === 'salon_owner' ? 'Majiteľ salónu' : 'Používateľ'}
                                        </span>
                                    </td>
                                    <td>{user.created}</td>
                                    <td>
                                        <button className={styles.actionButton}>Zobraziť</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
