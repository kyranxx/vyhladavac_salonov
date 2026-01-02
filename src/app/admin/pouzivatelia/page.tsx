'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface SalonInfo {
    id: string;
    name: string;
    status: string;
    tier: string;
    city: string;
}

interface User {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    role: string;
    created_at: string;
    salon_count: number;
    salons: SalonInfo[];
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

type SortField = 'full_name' | 'email' | 'created_at' | 'salon_count';
type SortOrder = 'asc' | 'desc';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0
    });

    // Filtering
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Sorting
    const [sortBy, setSortBy] = useState<SortField>('created_at');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    // Delete modal
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        user: User | null;
        step: 'confirm' | 'options';
        deleteSalons: boolean;
    }>({
        isOpen: false,
        user: null,
        step: 'confirm',
        deleteSalons: true
    });

    // Expanded rows (to show salon details)
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                sortBy,
                sortOrder,
                ...(debouncedSearch && { search: debouncedSearch })
            });

            const response = await fetch(`/api/admin/users?${params}`);
            const data = await response.json();

            if (data.users) {
                setUsers(data.users);
                setPagination(prev => ({ ...prev, ...data.pagination }));
            }
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, sortBy, sortOrder, debouncedSearch]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // Reset to first page when search changes
    useEffect(() => {
        setPagination(prev => ({ ...prev, page: 1 }));
    }, [debouncedSearch]);

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('sk-SK', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleSort = (field: SortField) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const getSortIcon = (field: SortField) => {
        if (sortBy !== field) return '↕️';
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const toggleExpandRow = (userId: string) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(userId)) {
                newSet.delete(userId);
            } else {
                newSet.add(userId);
            }
            return newSet;
        });
    };

    const handleDeleteClick = (user: User) => {
        setDeleteModal({
            isOpen: true,
            user,
            step: 'confirm',
            deleteSalons: true
        });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.user) return;

        if (deleteModal.step === 'confirm') {
            setDeleteModal(prev => ({ ...prev, step: 'options' }));
            return;
        }

        try {
            const response = await fetch('/api/admin/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: deleteModal.user.id,
                    deleteSalons: deleteModal.deleteSalons
                })
            });

            if (response.ok) {
                loadUsers();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            setDeleteModal({ isOpen: false, user: null, step: 'confirm', deleteSalons: true });
        }
    };

    const renderPagination = () => {
        const { page, totalPages, total } = pagination;
        const startItem = (page - 1) * pagination.limit + 1;
        const endItem = Math.min(page * pagination.limit, total);

        return (
            <div className={styles.pagination}>
                <div className={styles.paginationInfo}>
                    Zobrazujem {startItem}–{endItem} z {total} používateľov
                </div>
                <div className={styles.paginationControls}>
                    <button
                        className={styles.paginationButton}
                        onClick={() => setPagination(prev => ({ ...prev, page: 1 }))}
                        disabled={page === 1}
                    >
                        ««
                    </button>
                    <button
                        className={styles.paginationButton}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={page === 1}
                    >
                        «
                    </button>
                    <span className={styles.pageIndicator}>
                        Strana {page} z {totalPages}
                    </span>
                    <button
                        className={styles.paginationButton}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={page === totalPages}
                    >
                        »
                    </button>
                    <button
                        className={styles.paginationButton}
                        onClick={() => setPagination(prev => ({ ...prev, page: totalPages }))}
                        disabled={page === totalPages}
                    >
                        »»
                    </button>
                </div>
            </div>
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className={styles.badgeGreen}>Schválený</span>;
            case 'pending':
                return <span className={styles.badgeYellow}>Čaká</span>;
            case 'rejected':
                return <span className={styles.badgeRed}>Zamietnutý</span>;
            default:
                return <span className={styles.badgeGray}>—</span>;
        }
    };

    const getTierBadge = (tier: string) => {
        if (tier === 'premium') {
            return <span className={styles.badgePremium}>⭐ Premium</span>;
        }
        return <span className={styles.badgeGray}>Free</span>;
    };

    if (loading && users.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    Načítavam používateľov...
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Používatelia</h1>
            </div>

            {/* Search and filter bar */}
            <div className={styles.filterBar}>
                <div className={styles.searchWrapper}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Hľadať podľa mena, emailu, telefónu alebo názvu salónu..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            className={styles.clearSearch}
                            onClick={() => setSearchQuery('')}
                        >
                            ✕
                        </button>
                    )}
                </div>
                <div className={styles.filterInfo}>
                    {loading && <span className={styles.loadingDot}>●</span>}
                    <span className={styles.resultCount}>{pagination.total} používateľov</span>
                </div>
            </div>

            {/* Users table */}
            <div className={styles.content}>
                {users.length > 0 ? (
                    <>
                        {/* Mobile Card Layout */}
                        <div className={styles.cardList}>
                            {users.map((user) => (
                                <div key={user.id} className={styles.userCard}>
                                    <div className={styles.userInfo}>
                                        <div className={styles.avatar}>
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt="" />
                                            ) : (
                                                <span>{(user.full_name || user.email || '?')[0].toUpperCase()}</span>
                                            )}
                                        </div>
                                        <div className={styles.userDetails}>
                                            <span className={styles.userName}>
                                                {user.full_name || <em className={styles.noName}>Bez mena</em>}
                                            </span>
                                            <span className={styles.userEmail}>{user.email}</span>
                                        </div>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleDeleteClick(user)}
                                            title="Odstrániť"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                    <div className={styles.cardMeta}>
                                        <span className={styles.cardMetaItem}>
                                            📅 {formatDate(user.created_at)}
                                        </span>
                                        {user.salon_count > 0 && (
                                            <span className={styles.cardMetaItem}>
                                                💇 {user.salon_count} salón{user.salon_count > 1 ? 'y' : ''}
                                            </span>
                                        )}
                                    </div>
                                    {user.salon_count > 0 && (
                                        <>
                                            <button
                                                className={styles.salonCountButton}
                                                onClick={() => toggleExpandRow(user.id)}
                                                style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center' }}
                                            >
                                                <span className={styles.salonCount}>
                                                    {expandedRows.has(user.id) ? 'Skryť salóny' : 'Zobraziť salóny'}
                                                </span>
                                                <span className={styles.expandIcon}>
                                                    {expandedRows.has(user.id) ? '▲' : '▼'}
                                                </span>
                                            </button>
                                            {expandedRows.has(user.id) && (
                                                <div className={styles.salonsExpanded}>
                                                    <div className={styles.salonsListHeader}>Salóny:</div>
                                                    {user.salons.map(salon => (
                                                        <Link
                                                            key={salon.id}
                                                            href={`/admin/salony/${salon.id}`}
                                                            className={styles.salonItem}
                                                        >
                                                            <span className={styles.salonName}>{salon.name}</span>
                                                            <span className={styles.salonCity}>{salon.city}</span>
                                                            {getStatusBadge(salon.status)}
                                                            {getTierBadge(salon.tier)}
                                                            <span className={styles.salonArrow}>→</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table Layout */}
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th
                                            className={styles.sortableHeader}
                                            onClick={() => handleSort('full_name')}
                                        >
                                            Meno / Email {getSortIcon('full_name')}
                                        </th>
                                        <th
                                            className={styles.sortableHeader}
                                            onClick={() => handleSort('salon_count')}
                                        >
                                            Počet salónov {getSortIcon('salon_count')}
                                        </th>
                                        <th
                                            className={styles.sortableHeader}
                                            onClick={() => handleSort('created_at')}
                                        >
                                            Registrácia {getSortIcon('created_at')}
                                        </th>
                                        <th>Akcie</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <React.Fragment key={user.id}>
                                            <tr className={expandedRows.has(user.id) ? styles.expandedRow : ''}>
                                                <td>
                                                    <div className={styles.userInfo}>
                                                        <div className={styles.avatar}>
                                                            {user.avatar_url ? (
                                                                <img src={user.avatar_url} alt="" />
                                                            ) : (
                                                                <span>{(user.full_name || user.email || '?')[0].toUpperCase()}</span>
                                                            )}
                                                        </div>
                                                        <div className={styles.userDetails}>
                                                            <span className={styles.userName}>
                                                                {user.full_name || <em className={styles.noName}>Bez mena</em>}
                                                            </span>
                                                            <span className={styles.userEmail}>{user.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {user.salon_count > 0 ? (
                                                        <button
                                                            className={styles.salonCountButton}
                                                            onClick={() => toggleExpandRow(user.id)}
                                                        >
                                                            <span className={styles.salonCount}>{user.salon_count}</span>
                                                            <span className={styles.expandIcon}>
                                                                {expandedRows.has(user.id) ? '▼' : '▶'}
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <span className={styles.noSalons}>0</span>
                                                    )}
                                                </td>
                                                <td>{formatDate(user.created_at)}</td>
                                                <td>
                                                    <div className={styles.actions}>
                                                        <button
                                                            className={styles.deleteButton}
                                                            onClick={() => handleDeleteClick(user)}
                                                            title="Odstrániť používateľa"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Expanded row with salon details */}
                                            {expandedRows.has(user.id) && user.salons.length > 0 && (
                                                <tr className={styles.salonDetailsRow}>
                                                    <td colSpan={4}>
                                                        <div className={styles.salonsList}>
                                                            <div className={styles.salonsListHeader}>
                                                                Salóny používateľa:
                                                            </div>
                                                            {user.salons.map(salon => (
                                                                <Link
                                                                    key={salon.id}
                                                                    href={`/admin/salony/${salon.id}`}
                                                                    className={styles.salonItem}
                                                                >
                                                                    <span className={styles.salonName}>{salon.name}</span>
                                                                    <span className={styles.salonCity}>{salon.city}</span>
                                                                    {getStatusBadge(salon.status)}
                                                                    {getTierBadge(salon.tier)}
                                                                    <span className={styles.salonArrow}>→</span>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {renderPagination()}
                    </>
                ) : (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>👥</span>
                        <h3>{searchQuery ? 'Žiadne výsledky' : 'Žiadni používatelia'}</h3>
                        <p>
                            {searchQuery
                                ? 'Skúste zmeniť vyhľadávací výraz.'
                                : 'Zatiaľ sa nezaregistroval žiadny používateľ.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Delete confirmation modal */}
            {deleteModal.isOpen && deleteModal.user && (
                <div className={styles.modalOverlay} onClick={() => setDeleteModal({ isOpen: false, user: null, step: 'confirm', deleteSalons: true })}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>⚠️ Odstrániť používateľa</h3>
                            <button
                                className={styles.modalClose}
                                onClick={() => setDeleteModal({ isOpen: false, user: null, step: 'confirm', deleteSalons: true })}
                            >
                                ✕
                            </button>
                        </div>
                        <div className={styles.modalContent}>
                            {deleteModal.step === 'confirm' ? (
                                <>
                                    <p>Naozaj chcete odstrániť používateľa?</p>
                                    <div className={styles.userToDelete}>
                                        <strong>{deleteModal.user.full_name || 'Bez mena'}</strong>
                                        <span>{deleteModal.user.email}</span>
                                    </div>
                                    {deleteModal.user.salon_count > 0 && (
                                        <p className={styles.warning}>
                                            ⚠️ Tento používateľ má {deleteModal.user.salon_count} salón(ov).
                                        </p>
                                    )}
                                </>
                            ) : (
                                <>
                                    <p><strong>Potvrdenie odstránenia</strong></p>
                                    {deleteModal.user.salon_count > 0 && (
                                        <div className={styles.optionGroup}>
                                            <label className={styles.checkboxLabel}>
                                                <input
                                                    type="checkbox"
                                                    checked={deleteModal.deleteSalons}
                                                    onChange={(e) => setDeleteModal(prev => ({
                                                        ...prev,
                                                        deleteSalons: e.target.checked
                                                    }))}
                                                />
                                                Odstrániť aj všetky salóny používateľa ({deleteModal.user.salon_count})
                                            </label>
                                        </div>
                                    )}
                                    <p className={styles.finalWarning}>
                                        Táto akcia je <strong>nevratná</strong>. Ste si istí?
                                    </p>
                                </>
                            )}
                        </div>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setDeleteModal({ isOpen: false, user: null, step: 'confirm', deleteSalons: true })}
                            >
                                Zrušiť
                            </button>
                            <button
                                className={styles.confirmDeleteButton}
                                onClick={handleDeleteConfirm}
                            >
                                {deleteModal.step === 'confirm' ? 'Pokračovať' : 'Odstrániť'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
