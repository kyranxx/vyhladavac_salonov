import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['sk', 'en', 'hu'] as const;
export const defaultLocale = 'sk';

export type Locale = (typeof locales)[number];

export function isValidLocale(locale: string): locale is Locale {
    return locales.includes(locale as Locale);
}

export default getRequestConfig(async ({ locale }) => {
    if (!isValidLocale(locale)) notFound();

    return {
        messages: (await import(`./locales/${locale}.json`)).default,
    };
});
