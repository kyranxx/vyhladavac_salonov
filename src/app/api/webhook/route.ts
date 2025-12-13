import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
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
            // TODO: Update subscription status in database
            break;
        }
        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
            const subscription = event.data.object as Stripe.Subscription;
            console.log('Subscription updated:', subscription.id);
            // TODO: Update subscription status in database
            break;
        }
        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            console.log('Subscription deleted:', subscription.id);
            // TODO: Cancel subscription in database
            break;
        }
        case 'invoice.paid': {
            const invoice = event.data.object as Stripe.Invoice;
            console.log('Invoice paid:', invoice.id);
            break;
        }
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
