import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Input validation helpers
const isValidUUID = (str: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
};

const isValidPriceId = (str: string): boolean => {
    // Stripe price IDs start with 'price_'
    return typeof str === 'string' && str.startsWith('price_') && str.length < 100;
};

const sanitizeString = (str: string): string => {
    return str.replace(/[<>\"'&]/g, '').trim().slice(0, 500);
};

export async function POST(request: Request) {
    try {
        const { priceId, salonId, userId, type, successUrl, cancelUrl } = await request.json();

        // Validate priceId
        if (!priceId || !isValidPriceId(priceId)) {
            return NextResponse.json(
                { error: 'Invalid price ID' },
                { status: 400 }
            );
        }

        // Validate salonId if provided
        if (salonId && !isValidUUID(salonId)) {
            return NextResponse.json(
                { error: 'Invalid salon ID' },
                { status: 400 }
            );
        }

        // Validate userId if provided
        if (userId && !isValidUUID(userId)) {
            return NextResponse.json(
                { error: 'Invalid user ID' },
                { status: 400 }
            );
        }

        // Validate and sanitize type
        const validTypes = ['premium', 'featured', 'verified'];
        const sanitizedType = type && validTypes.includes(type) ? type : 'premium';

        // Determine mode based on price type
        const mode = sanitizedType === 'featured' ? 'payment' : 'subscription';

        // Validate URLs
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vyhladavacsalonov.vercel.app';
        const validSuccessUrl = successUrl && successUrl.startsWith(appUrl)
            ? successUrl
            : `${appUrl}/dashboard/predplatne?success=true`;
        const validCancelUrl = cancelUrl && cancelUrl.startsWith(appUrl)
            ? cancelUrl
            : `${appUrl}/dashboard/predplatne?canceled=true`;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode,
            success_url: validSuccessUrl,
            cancel_url: validCancelUrl,
            metadata: {
                salonId: salonId ? sanitizeString(salonId) : '',
                userId: userId ? sanitizeString(userId) : '',
                type: sanitizedType,
            },
        });

        console.log('Created checkout session:', session.id, 'for salon:', salonId, 'type:', sanitizedType);

        return NextResponse.json({ url: session.url });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to create checkout session';
        console.error('Stripe checkout error:', message);
        return NextResponse.json(
            { error: 'Payment processing error' }, // Don't expose internal errors
            { status: 500 }
        );
    }
}
