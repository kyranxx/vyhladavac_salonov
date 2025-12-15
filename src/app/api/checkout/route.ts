import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    try {
        const { priceId, salonId, userId, type, successUrl, cancelUrl } = await request.json();

        if (!priceId) {
            return NextResponse.json(
                { error: 'Price ID is required' },
                { status: 400 }
            );
        }

        // Determine mode based on price type
        const mode = type === 'featured' || type === 'verified'
            ? 'payment'
            : 'subscription';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode,
            success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/predplatne?success=true`,
            cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/predplatne?canceled=true`,
            metadata: {
                salonId: salonId || '',
                userId: userId || '',
                type: type || 'premium',
            },
        });

        console.log('Created checkout session:', session.id, 'for salon:', salonId, 'type:', type);

        return NextResponse.json({ url: session.url });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to create checkout session';
        console.error('Stripe checkout error:', message);
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
