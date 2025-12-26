/**
 * Shared TypeScript types for the Register salónov application
 * Centralized type definitions to avoid duplication across pages
 */

// ============================================
// Database Types (matching Supabase schema)
// ============================================

export interface Salon {
    id: string;
    slug: string;
    name: string;
    description_sk: string | null;
    description_en?: string | null;
    description_hu?: string | null;
    address: string;
    city: string;
    postal_code: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    latitude: number | null;
    longitude: number | null;
    status: SalonStatus;
    tier: SalonTier;
    is_premium: boolean;
    is_verified: boolean;
    is_featured: boolean;
    rating_avg: number | null;
    rating_count: number;
    owner_id: string;
    created_at: string;
    updated_at?: string;
    categories?: Category[];
    services?: Service[];
    opening_hours?: OpeningHours[];
    photos?: Photo[];
}

export type SalonStatus = 'pending' | 'approved' | 'rejected';
export type SalonTier = 'free' | 'premium';

export interface Category {
    id: number;
    slug: string;
    name_sk: string;
    name_en?: string;
    name_hu?: string;
    icon: string | null;
    is_active: boolean;
    sort_order: number;
}

export interface Service {
    id: string;
    salon_id: string;
    name_sk: string;
    name_en?: string | null;
    description_sk?: string | null;
    price: number | null;
    price_to?: number | null;
    duration_minutes: number | null;
    category?: string;
}

export interface OpeningHours {
    id?: string;
    salon_id: string;
    day_of_week: number;
    open_time: string | null;
    close_time: string | null;
    is_closed: boolean;
}

export interface Photo {
    id: string;
    salon_id: string;
    url: string;
    alt_text: string | null;
    is_primary?: boolean;
    sort_order?: number;
}

export interface User {
    id: string;
    email: string;
    full_name?: string;
    is_admin: boolean;
    created_at: string;
}

export interface Subscription {
    id: string;
    salon_id: string;
    stripe_subscription_id?: string;
    stripe_customer_id?: string;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    current_period_start?: string;
    current_period_end?: string;
    created_at: string;
}

export type SubscriptionPlan = 'free' | 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'incomplete';

export interface Ad {
    id: string;
    title: string;
    image_url?: string;
    link_url?: string;
    position: AdPosition;
    is_active: boolean;
    start_date?: string;
    end_date?: string;
    clicks: number;
    impressions: number;
    created_at: string;
}

export type AdPosition = 'homepage' | 'sidebar' | 'category' | 'search';

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

// ============================================
// Component Props Types
// ============================================

export interface SalonCardProps {
    salon: Salon;
    locale?: string;
    showStatus?: boolean;
    compact?: boolean;
}

export interface FilterOptions {
    category?: string;
    city?: string;
    search?: string;
    status?: SalonStatus;
    tier?: SalonTier;
    sortBy?: 'name' | 'created_at' | 'rating';
    sortOrder?: 'asc' | 'desc';
}

// ============================================
// Form Types
// ============================================

export interface SalonFormData {
    name: string;
    description_sk: string;
    address: string;
    city: string;
    postal_code?: string;
    phone?: string;
    email?: string;
    website?: string;
    category?: string;
}

export interface ServiceFormData {
    name_sk: string;
    price?: number;
    price_to?: number;
    duration_minutes?: number;
    category?: string;
}

// ============================================
// Utility Types
// ============================================

export type Locale = 'sk' | 'en' | 'hu';

export interface LocalizedString {
    sk: string;
    en?: string;
    hu?: string;
}

export function getLocalizedValue(
    obj: LocalizedString | Record<string, string>,
    locale: Locale = 'sk'
): string {
    if ('sk' in obj) {
        return obj[locale] || obj.sk || '';
    }
    const key = `name_${locale}` as keyof typeof obj;
    const fallbackKey = 'name_sk' as keyof typeof obj;
    return (obj[key] || obj[fallbackKey] || '') as string;
}
