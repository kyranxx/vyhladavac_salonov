import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Salon {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    address: string;
    city: string;
    postal_code: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    latitude: number | null;
    longitude: number | null;
    status: 'pending' | 'approved' | 'rejected';
    is_premium: boolean;
    is_verified: boolean;
    is_featured: boolean;
    rating_avg: number | null;
    rating_count: number;
    created_at: string;
    categories?: Category[];
    services?: Service[];
    opening_hours?: OpeningHours[];
    photos?: Photo[];
}

export interface Category {
    id: number;
    slug: string;
    name_sk: string;
    name_en: string;
    name_hu: string;
    icon: string | null;
}

export interface District {
    id: number;
    slug: string;
    name: string;
    region: string;
}

export interface Service {
    id: string;
    name_sk: string;
    name_en: string | null;
    price: number | null;
    price_to: number | null;
    duration_minutes: number | null;
}

export interface OpeningHours {
    day_of_week: number;
    open_time: string | null;
    close_time: string | null;
    is_closed: boolean;
}

export interface Photo {
    id: string;
    url: string;
    alt_text: string | null;
}

// Fetch functions
export async function getSalons(options?: {
    limit?: number;
    offset?: number;
    category?: string;
    city?: string;
    featured?: boolean;
    verified?: boolean;
    premium?: boolean;
}) {
    let query = supabase
        .from('salons')
        .select(`
      *,
      salon_categories!inner(category:categories(*)),
      photos(id, url, alt_text)
    `)
        .eq('status', 'approved')
        .order('is_featured', { ascending: false })
        .order('is_premium', { ascending: false })
        .order('created_at', { ascending: false });

    if (options?.limit) {
        query = query.limit(options.limit);
    }
    if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }
    if (options?.city) {
        query = query.ilike('city', `%${options.city}%`);
    }
    if (options?.featured) {
        query = query.eq('is_featured', true);
    }
    if (options?.premium) {
        query = query.eq('is_premium', true);
    }
    if (options?.verified) {
        query = query.eq('is_verified', true);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching salons:', error);
        return [];
    }

    return data;
}

export async function getSalonBySlug(slug: string) {
    const { data, error } = await supabase
        .from('salons')
        .select(`
      *,
      salon_categories(category:categories(*)),
      services(*),
      opening_hours(*),
      photos(id, url, alt_text)
    `)
        .eq('slug', slug)
        .eq('status', 'approved')
        .single();

    if (error) {
        console.error('Error fetching salon:', error);
        return null;
    }

    return data;
}

export async function getCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    return data;
}

export async function getDistricts() {
    const { data, error } = await supabase
        .from('districts')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching districts:', error);
        return [];
    }

    return data;
}

export async function searchSalons(query: string, options?: {
    category?: string;
    city?: string;
    limit?: number;
}) {
    let dbQuery = supabase
        .from('salons')
        .select(`
      *,
      salon_categories(category:categories(*)),
      photos(id, url, alt_text)
    `)
        .eq('status', 'approved')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('is_featured', { ascending: false })
        .order('is_premium', { ascending: false });

    if (options?.city) {
        dbQuery = dbQuery.ilike('city', `%${options.city}%`);
    }
    if (options?.limit) {
        dbQuery = dbQuery.limit(options.limit);
    }

    const { data, error } = await dbQuery;

    if (error) {
        console.error('Error searching salons:', error);
        return [];
    }

    return data;
}

export async function getSalonsByCategory(categorySlug: string, limit?: number) {
    const { data, error } = await supabase
        .from('salons')
        .select(`
      *,
      salon_categories!inner(category:categories!inner(*)),
      photos(id, url, alt_text)
    `)
        .eq('status', 'approved')
        .eq('salon_categories.category.slug', categorySlug)
        .order('is_featured', { ascending: false })
        .limit(limit || 20);

    if (error) {
        console.error('Error fetching salons by category:', error);
        return [];
    }

    return data;
}

export async function getSalonsByCity(city: string, limit?: number) {
    const { data, error } = await supabase
        .from('salons')
        .select(`
      *,
      salon_categories(category:categories(*)),
      photos(id, url, alt_text)
    `)
        .eq('status', 'approved')
        .ilike('city', `%${city}%`)
        .order('is_featured', { ascending: false })
        .limit(limit || 20);

    if (error) {
        console.error('Error fetching salons by city:', error);
        return [];
    }

    return data;
}

export async function getFeaturedSalons(limit: number = 6) {
    return getSalons({ featured: true, limit });
}

export async function getSalonCount() {
    const { count, error } = await supabase
        .from('salons')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

    if (error) {
        console.error('Error fetching salon count:', error);
        return 0;
    }

    return count || 0;
}
