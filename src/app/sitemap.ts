import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vyhladavac-salonov.vercel.app';

    // Static pages
    const staticPages = [
        '',
        '/salony',
        '/kategorie',
        '/pre-majitelov',
        '/cennik',
        '/kontakt',
        '/ochrana-sukromia',
        '/obchodne-podmienky',
        '/cookies',
    ];

    // Main categories
    const categories = [
        'damske-kadernictvo',
        'panske-kadernictvo',
        'detske-kadernictvo',
        'kozmetika',
        'manikura',
        'pedikura',
        'masaze',
        'make-up',
        'tetovanie',
        'permanentny-make-up',
        'riasenky',
        'solarium',
        'wellness',
        'fitness',
        'laserove-centrum',
        'svadobny-salon',
        'fotostudio',
    ];

    // Major cities
    const cities = [
        'bratislava',
        'kosice',
        'presov',
        'zilina',
        'nitra',
        'banska-bystrica',
        'trnava',
        'trencin',
        'poprad',
        'martin',
        'piestany',
        'nove-zamky',
        'komarno',
        'dunajska-streda',
        'levice',
        'lucenec',
        'ruzomberok',
        'liptovsky-mikulas',
        'zvolen',
        'prievidza',
        'michalovce',
        'humenne',
        'spisska-nova-ves',
        'bardejov',
        'senica',
        'skalica',
    ];

    const staticSitemap = staticPages.map((path) => ({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: path === '' ? 1 : 0.8,
    }));

    const categorySitemap = categories.map((category) => ({
        url: `${baseUrl}/kategoria/${category}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    const citySitemap = cities.map((city) => ({
        url: `${baseUrl}/salony/${city}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // TODO: Add dynamic salon pages from database
    // const salons = await getSalons();
    // const salonSitemap = salons.map(...)

    return [...staticSitemap, ...categorySitemap, ...citySitemap];
}
