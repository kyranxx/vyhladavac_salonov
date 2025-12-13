// Translations dictionary
export const translations = {
    sk: {
        // Navigation
        nav: {
            allSalons: 'Všetky salóny',
            categories: 'Kategórie',
            forOwners: 'Pre majiteľov',
            signIn: 'Prihlásiť sa',
            addSalon: 'Pridať salón',
        },
        // Hero section
        hero: {
            title: 'Nájdite',
            titleHighlight: 'kaderníctvo',
            titleEnd: 'vo vašom meste',
            subtitle: 'Prehľadávajte tisíce salónov na Slovensku. Kaderníctva, kozmetika, manikúra, masáže a ďalšie služby na jednom mieste.',
            searchPlaceholder: 'Čo hľadáte? (napr. kaderníctvo)',
            allCities: 'Všetky mestá',
            search: 'Hľadať',
            popular: 'Populárne:',
        },
        // Stats
        stats: {
            salons: 'Salónov',
            districts: 'Okresov',
            categories: 'Kategórií',
        },
        // Footer
        footer: {
            description: 'Najväčší online katalóg salónov krásy na Slovensku.',
            navigation: 'Navigácia',
            forSalons: 'Pre salóny',
            contact: 'Kontakt',
            allSalons: 'Všetky salóny',
            categories: 'Kategórie',
            addSalon: 'Pridať salón',
            pricing: 'Cenník',
            termsOfService: 'Obchodné podmienky',
            privacyPolicy: 'Ochrana súkromia',
            cookies: 'Cookies',
            allRightsReserved: 'Všetky práva vyhradené.',
        },
        // Categories
        categories: {
            title: 'Kategórie salónov',
            subtitle: 'Vyberte si kategóriu služby, ktorú hľadáte',
        },
        // Common
        common: {
            loading: 'Načítavam...',
            error: 'Nastala chyba',
            save: 'Uložiť',
            cancel: 'Zrušiť',
            delete: 'Zmazať',
            edit: 'Upraviť',
            back: 'Späť',
        },
    },
    en: {
        nav: {
            allSalons: 'All Salons',
            categories: 'Categories',
            forOwners: 'For Owners',
            signIn: 'Sign In',
            addSalon: 'Add Salon',
        },
        hero: {
            title: 'Find',
            titleHighlight: 'hair salon',
            titleEnd: 'in your city',
            subtitle: 'Browse thousands of salons in Slovakia. Hair salons, beauty, manicure, massage and more in one place.',
            searchPlaceholder: 'What are you looking for? (e.g. hair salon)',
            allCities: 'All cities',
            search: 'Search',
            popular: 'Popular:',
        },
        stats: {
            salons: 'Salons',
            districts: 'Districts',
            categories: 'Categories',
        },
        footer: {
            description: 'The largest online directory of beauty salons in Slovakia.',
            navigation: 'Navigation',
            forSalons: 'For Salons',
            contact: 'Contact',
            allSalons: 'All Salons',
            categories: 'Categories',
            addSalon: 'Add Salon',
            pricing: 'Pricing',
            termsOfService: 'Terms of Service',
            privacyPolicy: 'Privacy Policy',
            cookies: 'Cookies',
            allRightsReserved: 'All rights reserved.',
        },
        categories: {
            title: 'Salon Categories',
            subtitle: 'Choose the service category you are looking for',
        },
        common: {
            loading: 'Loading...',
            error: 'An error occurred',
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            back: 'Back',
        },
    },
    hu: {
        nav: {
            allSalons: 'Összes szalon',
            categories: 'Kategóriák',
            forOwners: 'Tulajdonosoknak',
            signIn: 'Bejelentkezés',
            addSalon: 'Szalon hozzáadása',
        },
        hero: {
            title: 'Találd meg a',
            titleHighlight: 'fodrászatot',
            titleEnd: 'a városodban',
            subtitle: 'Böngéssz ezer szalon között Szlovákiában. Fodrászatok, kozmetika, manikűr, masszázs és még sok más egy helyen.',
            searchPlaceholder: 'Mit keresel? (pl. fodrászat)',
            allCities: 'Összes város',
            search: 'Keresés',
            popular: 'Népszerű:',
        },
        stats: {
            salons: 'Szalon',
            districts: 'Járás',
            categories: 'Kategória',
        },
        footer: {
            description: 'A legnagyobb online szépségszalon katalógus Szlovákiában.',
            navigation: 'Navigáció',
            forSalons: 'Szalonoknak',
            contact: 'Kapcsolat',
            allSalons: 'Összes szalon',
            categories: 'Kategóriák',
            addSalon: 'Szalon hozzáadása',
            pricing: 'Árazás',
            termsOfService: 'Általános Szerződési Feltételek',
            privacyPolicy: 'Adatvédelem',
            cookies: 'Sütik',
            allRightsReserved: 'Minden jog fenntartva.',
        },
        categories: {
            title: 'Szalon kategóriák',
            subtitle: 'Válassza ki a keresett szolgáltatás kategóriáját',
        },
        common: {
            loading: 'Betöltés...',
            error: 'Hiba történt',
            save: 'Mentés',
            cancel: 'Mégse',
            delete: 'Törlés',
            edit: 'Szerkesztés',
            back: 'Vissza',
        },
    },
};

export type Locale = keyof typeof translations;
export type TranslationKey = typeof translations.sk;

export function getTranslation(locale: string): TranslationKey {
    return translations[locale as Locale] || translations.sk;
}
