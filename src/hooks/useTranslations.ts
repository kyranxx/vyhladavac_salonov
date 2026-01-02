'use client';

import { useState, useEffect } from 'react';
import { translations, type Locale } from '@/lib/translations';
import { getCurrentLocale } from '@/lib/utils';

/**
 * Hook to get current locale and translations
 */
export function useLocale() {
    const [locale, setLocale] = useState<Locale>('sk');

    useEffect(() => {
        setLocale(getCurrentLocale());
    }, []);

    return locale;
}

/**
 * Hook to get translations for current locale
 */
export function useTranslations() {
    const locale = useLocale();
    return translations[locale];
}

/**
 * Hook to get dashboard translations specifically
 */
export function useDashboardTranslations() {
    const t = useTranslations();
    return t.dashboard;
}
