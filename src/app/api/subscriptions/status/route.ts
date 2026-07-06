import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface SalonData {
    id: string;
    name: string;
    tier: string;
    is_featured: boolean;
    is_verified: boolean;
    featured_until: string | null;
    verified_until: string | null;
}

interface SubscriptionWithSalon {
    id: string;
    type: string;
    status: string;
    start_date: string;
    end_date: string | null;
    amount_paid: number | null;
    stripe_subscription_id: string | null;
    created_at: string;
    salon_id: string;
    salons: SalonData | SalonData[] | null;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const salonId = searchParams.get('salonId');

        if (!userId && !salonId) {
            return NextResponse.json(
                { error: 'User ID or Salon ID is required' },
                { status: 400 }
            );
        }

        let query = supabase
            .from('subscriptions')
            .select(`
                id,
                type,
                status,
                start_date,
                end_date,
                amount_paid,
                stripe_subscription_id,
                created_at,
                salon_id,
                salons (
                    id,
                    name,
                    tier,
                    is_featured,
                    is_verified,
                    featured_until,
                    verified_until
                )
            `)
            .order('created_at', { ascending: false });

        if (userId) {
            query = query.eq('user_id', userId);
        }
        if (salonId) {
            query = query.eq('salon_id', salonId);
        }

        const { data: subscriptions, error } = await query;

        if (error) {
            console.error('Error fetching subscriptions:', error);
            return NextResponse.json(
                { error: 'Failed to fetch subscriptions' },
                { status: 500 }
            );
        }

        // Type the subscriptions properly
        const typedSubscriptions = subscriptions as SubscriptionWithSalon[] | null;

        // Determine current active subscription
        const activeSubscription = typedSubscriptions?.find(
            (s) => s.status === 'active' && (!s.end_date || new Date(s.end_date) > new Date())
        );

        // Get salon data (handle both single object and array cases)
        const getSalonData = (salon: SalonData | SalonData[] | null): SalonData | null => {
            if (!salon) return null;
            if (Array.isArray(salon)) return salon[0] || null;
            return salon;
        };

        const activeSalon = activeSubscription ? getSalonData(activeSubscription.salons) : null;

        return NextResponse.json({
            subscriptions: typedSubscriptions || [],
            activeSubscription: activeSubscription || null,
            isPremium: activeSubscription?.type === 'premium',
            isFeatured: activeSalon?.is_featured || false,
            isVerified: activeSalon?.is_verified || false,
        });
    } catch (error) {
        console.error('Get subscription status error:', error);
        return NextResponse.json(
            { error: 'Failed to get subscription status' },
            { status: 500 }
        );
    }
}
