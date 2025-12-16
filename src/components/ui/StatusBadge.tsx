import React from 'react';
import styles from './StatusBadge.module.css';

export type StatusType =
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'active'
    | 'inactive'
    | 'premium'
    | 'free';

interface StatusBadgeProps {
    status: StatusType | string;
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
}

const statusConfig: Record<string, { label: string; icon: string; className: string }> = {
    pending: { label: 'Čaká', icon: '⏳', className: 'warning' },
    approved: { label: 'Schválený', icon: '✓', className: 'success' },
    rejected: { label: 'Zamietnutý', icon: '✗', className: 'error' },
    active: { label: 'Aktívny', icon: '✓', className: 'success' },
    inactive: { label: 'Neaktívny', icon: '○', className: 'neutral' },
    premium: { label: 'Premium', icon: '⭐', className: 'premium' },
    free: { label: 'Free', icon: '', className: 'neutral' },
};

export function StatusBadge({ status, size = 'md', showIcon = true }: StatusBadgeProps) {
    const config = statusConfig[status] || {
        label: status,
        icon: '',
        className: 'neutral'
    };

    return (
        <span className={`${styles.badge} ${styles[config.className]} ${styles[size]}`}>
            {showIcon && config.icon && <span className={styles.icon}>{config.icon}</span>}
            {config.label}
        </span>
    );
}

// Utility function for getting status class (for backward compatibility)
export function getStatusClassName(status: string): string {
    const config = statusConfig[status];
    return config?.className || 'neutral';
}

// Slovak translations for statuses
export const statusTranslations: Record<string, string> = {
    pending: 'Čaká na schválenie',
    approved: 'Schválený',
    rejected: 'Zamietnutý',
    active: 'Aktívny',
    inactive: 'Neaktívny',
    premium: 'Premium',
    free: 'Bezplatný',
};

export function getStatusLabel(status: string): string {
    return statusTranslations[status] || status;
}
