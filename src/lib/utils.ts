/**
 * Utility functions for Salon Finder SK
 * Common helper functions used across the application
 */

// ============================================
// Date/Time Utilities
// ============================================

/**
 * Format date to Slovak locale
 */
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('sk-SK', options || {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format date to short format (DD.MM.YYYY)
 */
export function formatDateShort(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('sk-SK');
}

/**
 * Format relative time (e.g., "pred 2 dňami")
 */
export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Dnes';
    if (diffDays === 1) return 'Včera';
    if (diffDays < 7) return `Pred ${diffDays} dňami`;
    if (diffDays < 30) return `Pred ${Math.floor(diffDays / 7)} týždňami`;
    return formatDateShort(dateString);
}

// ============================================
// String Utilities
// ============================================

/**
 * Create URL-friendly slug from string
 */
export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start
        .replace(/-+$/, ''); // Trim - from end
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// ============================================
// Number/Currency Utilities
// ============================================

/**
 * Format price in EUR
 */
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('sk-SK', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(price);
}

/**
 * Format price range (e.g., "15 € - 25 €")
 */
export function formatPriceRange(from: number, to?: number | null): string {
    if (!to || from === to) return formatPrice(from);
    return `${formatPrice(from)} - ${formatPrice(to)}`;
}

/**
 * Format duration in minutes to readable format
 */
export function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} hod`;
    return `${hours} hod ${mins} min`;
}

// ============================================
// Phone Utilities
// ============================================

/**
 * Format Slovak phone number
 */
export function formatPhone(phone: string): string {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');

    // Format based on length
    if (digits.length === 10 && digits.startsWith('0')) {
        return `+421 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
    }
    if (digits.length === 12 && digits.startsWith('421')) {
        return `+421 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
    }
    return phone;
}

/**
 * Create tel: link from phone number
 */
export function createPhoneLink(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('0')) {
        return `tel:+421${digits.slice(1)}`;
    }
    return `tel:+${digits}`;
}

// ============================================
// Validation Utilities
// ============================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate Slovak phone number
 */
export function isValidPhone(phone: string): boolean {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10 || digits.length === 12 || digits.length === 13;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// ============================================
// Array/Object Utilities
// ============================================

/**
 * Group array items by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((result, item) => {
        const groupKey = String(item[key]);
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {} as Record<string, T[]>);
}

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[], key?: keyof T): T[] {
    if (!key) {
        return [...new Set(array)];
    }
    const seen = new Set();
    return array.filter(item => {
        const value = item[key];
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
    });
}

// ============================================
// Browser Utilities
// ============================================

/**
 * Check if code is running on client
 */
export function isClient(): boolean {
    return typeof window !== 'undefined';
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    if (!isClient()) return false;
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
}

/**
 * Get current locale from URL
 */
export function getCurrentLocale(): 'sk' | 'en' | 'hu' {
    if (!isClient()) return 'sk';
    const path = window.location.pathname;
    if (path.startsWith('/en')) return 'en';
    if (path.startsWith('/hu')) return 'hu';
    return 'sk';
}
