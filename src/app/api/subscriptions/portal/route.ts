import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover',
});

// Use service role for server-side operations
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, returnUrl } = body;

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Get the user's subscription with customer ID
        const { data: subscription, error } = await supabase
            .from('subscriptions')
            .select('stripe_customer_id')
            .eq('user_id', userId)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error || !subscription?.stripe_customer_id) {
            return NextResponse.json(
                { error: 'No active subscription found' },
                { status: 404 }
            );
        }

        // Create Stripe billing portal session
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: subscription.stripe_customer_id,
            return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/predplatne`,
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (error) {
        console.error('Customer portal error:', error);
        return NextResponse.json(
            { error: 'Failed to create customer portal session' },
            { status: 500 }
        );
    }
}
