import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

        // Determine current active subscription
        const activeSubscription = subscriptions?.find(
            (s) => s.status === 'active' && (!s.end_date || new Date(s.end_date) > new Date())
        );

        return NextResponse.json({
            subscriptions: subscriptions || [],
            activeSubscription: activeSubscription || null,
            isPremium: activeSubscription?.type === 'premium',
            isFeatured: activeSubscription?.salons?.is_featured || false,
            isVerified: activeSubscription?.salons?.is_verified || false,
        });
    } catch (error) {
        console.error('Get subscription status error:', error);
        return NextResponse.json(
            { error: 'Failed to get subscription status' },
            { status: 500 }
        );
    }
}
