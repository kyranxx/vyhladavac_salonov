import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

async function getSalons() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return [];
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
        .from('salons')
        .select('slug, updated_at')
        .eq('status', 'approved');

    if (error) {
        console.error('Sitemap: Error fetching salons:', error);
        return [];
    }

    return data || [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
        'mihalnice',
        'obočie',
        'solarium',
        'wellness',
        'fitness',
        'laserove-centrum',
        'svadobny-salon',
        'barbershop',
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

    // Dynamic salon pages from database
    const salons = await getSalons();
    const salonSitemap = salons.map((salon) => ({
        url: `${baseUrl}/salon/${salon.slug}`,
        lastModified: salon.updated_at ? new Date(salon.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Category + City combination pages (high SEO value!)
    const topCategories = ['damske-kadernictvo', 'kozmetika', 'manikura', 'masaze', 'barbershop'];
    const topCities = ['bratislava', 'kosice', 'presov', 'zilina', 'nitra', 'banska-bystrica', 'trnava', 'trencin'];

    const categoryCitySitemap = topCategories.flatMap((category) =>
        topCities.map((city) => ({
            url: `${baseUrl}/kategoria/${category}/${city}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.85,
        }))
    );

    return [...staticSitemap, ...categorySitemap, ...citySitemap, ...categoryCitySitemap, ...salonSitemap];
}
