import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Use service role key for webhook (bypasses RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('Webhook signature verification failed:', message);
        return NextResponse.json(
            { error: 'Webhook signature verification failed' },
            { status: 400 }
        );
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            console.log('Checkout session completed:', session.id);

            // Get metadata
            const userId = session.metadata?.userId;
            const salonId = session.metadata?.salonId;

            if (salonId) {
                // Determine subscription type from line items
                const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
                const priceId = lineItems.data[0]?.price?.id;

                let subscriptionType: 'premium' | 'featured' | 'verified' = 'premium';
                let updateData: Record<string, unknown> = {};

                // Match price IDs from your Stripe products
                if (priceId?.includes('featured') || session.metadata?.type === 'featured') {
                    subscriptionType = 'featured';
                    const featuredUntil = new Date();
                    featuredUntil.setDate(featuredUntil.getDate() + 7);
                    updateData = { is_featured: true, featured_until: featuredUntil.toISOString() };
                } else if (priceId?.includes('verified') || session.metadata?.type === 'verified') {
                    subscriptionType = 'verified';
                    const verifiedUntil = new Date();
                    verifiedUntil.setFullYear(verifiedUntil.getFullYear() + 1);
                    updateData = { is_verified: true, verified_until: verifiedUntil.toISOString() };
                } else {
                    subscriptionType = 'premium';
                    updateData = { tier: 'premium' };
                }

                // Update salon
                const { error: salonError } = await supabaseAdmin
                    .from('salons')
                    .update(updateData)
                    .eq('id', salonId);

                if (salonError) {
                    console.error('Error updating salon:', salonError);
                }

                // Create subscription record
                const subscriptionId = typeof session.subscription === 'string'
                    ? session.subscription
                    : session.subscription?.id;
                const customerId = typeof session.customer === 'string'
                    ? session.customer
                    : session.customer?.id;

                const { error: subError } = await supabaseAdmin
                    .from('subscriptions')
                    .insert({
                        salon_id: salonId,
                        user_id: userId,
                        type: subscriptionType,
                        status: 'active',
                        stripe_subscription_id: subscriptionId || null,
                        stripe_customer_id: customerId || null,
                        amount_paid: (session.amount_total || 0) / 100,
                        start_date: new Date().toISOString(),
                        end_date: subscriptionType === 'featured'
                            ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                            : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                    });

                if (subError) {
                    console.error('Error creating subscription:', subError);
                }
            }
            break;
        }
        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
            const subscription = event.data.object as Stripe.Subscription;
            console.log('Subscription updated:', subscription.id);

            // Update subscription status in database
            const { error } = await supabaseAdmin
                .from('subscriptions')
                .update({
                    status: subscription.status === 'active' ? 'active' : 'cancelled',
                    updated_at: new Date().toISOString(),
                })
                .eq('stripe_subscription_id', subscription.id);

            if (error) {
                console.error('Error updating subscription:', error);
            }
            break;
        }
        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            console.log('Subscription deleted:', subscription.id);

            // Mark subscription as cancelled
            const { data: subData } = await supabaseAdmin
                .from('subscriptions')
                .update({ status: 'cancelled' })
                .eq('stripe_subscription_id', subscription.id)
                .select('salon_id, type')
                .single();

            // Reset salon tier if premium was cancelled
            if (subData) {
                const updateData: Record<string, unknown> = {};
                if (subData.type === 'premium') {
                    updateData.tier = 'free';
                } else if (subData.type === 'featured') {
                    updateData.is_featured = false;
                    updateData.featured_until = null;
                } else if (subData.type === 'verified') {
                    updateData.is_verified = false;
                    updateData.verified_until = null;
                }

                await supabaseAdmin
                    .from('salons')
                    .update(updateData)
                    .eq('id', subData.salon_id);
            }
            break;
        }
        case 'invoice.paid': {
            const invoice = event.data.object as Stripe.Invoice & { subscription?: string | { id: string } };
            console.log('Invoice paid:', invoice.id);

            // Get subscription ID from invoice
            const subscriptionId = typeof invoice.subscription === 'string'
                ? invoice.subscription
                : invoice.subscription?.id;

            // Extend subscription end date for recurring payments
            if (subscriptionId) {
                const { data: subData } = await supabaseAdmin
                    .from('subscriptions')
                    .select('end_date')
                    .eq('stripe_subscription_id', subscriptionId)
                    .single();

                if (subData) {
                    const newEndDate = new Date(subData.end_date);
                    newEndDate.setMonth(newEndDate.getMonth() + 1);

                    await supabaseAdmin
                        .from('subscriptions')
                        .update({
                            end_date: newEndDate.toISOString(),
                            status: 'active',
                        })
                        .eq('stripe_subscription_id', subscriptionId);
                }
            }
            break;
        }
        case 'invoice.payment_failed': {
            const invoice = event.data.object as Stripe.Invoice;
            console.error('Invoice payment failed:', invoice.id);
            // Optionally mark subscription as past_due
            break;
        }
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
