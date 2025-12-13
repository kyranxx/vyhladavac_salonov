import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    try {
        const { priceId, salonId, successUrl, cancelUrl } = await request.json();

        if (!priceId) {
            return NextResponse.json(
                { error: 'Price ID is required' },
                { status: 400 }
            );
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: priceId.includes('featured') || priceId.includes('verified')
                ? 'payment'
                : 'subscription',
            success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/predplatne?success=true`,
            cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/predplatne?canceled=true`,
            metadata: {
                salonId: salonId || '',
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe checkout error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
