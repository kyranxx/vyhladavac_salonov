// Simple i18n configuration without next-intl
export const locales = ['sk', 'en', 'hu'] as const;
export const defaultLocale = 'sk';

export type Locale = (typeof locales)[number];

export function isValidLocale(locale: string): locale is Locale {
    return locales.includes(locale as Locale);
}

// Re-export translations for convenience
export { translations, getTranslation } from './lib/translations';
