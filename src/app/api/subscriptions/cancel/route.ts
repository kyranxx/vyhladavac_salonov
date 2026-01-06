import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover',
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { subscriptionId, userId, cancelAtPeriodEnd = true } = body;

        if (!subscriptionId || !userId) {
            return NextResponse.json(
                { error: 'Subscription ID and User ID are required' },
                { status: 400 }
            );
        }

        // Verify the subscription belongs to this user
        const { data: sub, error } = await supabase
            .from('subscriptions')
            .select('stripe_subscription_id, salon_id')
            .eq('id', subscriptionId)
            .eq('user_id', userId)
            .single();

        if (error || !sub?.stripe_subscription_id) {
            return NextResponse.json(
                { error: 'Subscription not found or unauthorized' },
                { status: 404 }
            );
        }

        // Cancel the subscription in Stripe
        const canceledSubscription = await stripe.subscriptions.update(
            sub.stripe_subscription_id,
            {
                cancel_at_period_end: cancelAtPeriodEnd,
            }
        );

        // Update local database
        await supabase
            .from('subscriptions')
            .update({
                status: cancelAtPeriodEnd ? 'canceling' : 'cancelled',
                updated_at: new Date().toISOString(),
            })
            .eq('id', subscriptionId);

        return NextResponse.json({
            success: true,
            cancelAtPeriodEnd,
            currentPeriodEnd: canceledSubscription.current_period_end
                ? new Date(canceledSubscription.current_period_end * 1000).toISOString()
                : null,
        });
    } catch (error) {
        console.error('Cancel subscription error:', error);
        return NextResponse.json(
            { error: 'Failed to cancel subscription' },
            { status: 500 }
        );
    }
}
