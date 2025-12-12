import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover',
    typescript: true,
});

// Product IDs - update these after creating products in Stripe Dashboard
export const STRIPE_PRODUCTS = {
    PREMIUM_MONTHLY: {
        priceId: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || '',
        name: 'Premium Mesačné',
        price: 3.00,
        interval: 'month' as const,
    },
    PREMIUM_YEARLY: {
        priceId: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID || '',
        name: 'Premium Ročné',
        price: 30.00,
        interval: 'year' as const,
    },
    FEATURED_7_DAYS: {
        priceId: process.env.STRIPE_FEATURED_PRICE_ID || '',
        name: 'Zvýraznenie na 7 dní',
        price: 5.00,
        interval: null, // One-time payment
    },
    VERIFIED_BADGE: {
        priceId: process.env.STRIPE_VERIFIED_PRICE_ID || '',
        name: 'Overený salón (ročne)',
        price: 20.00,
        interval: 'year' as const,
    },
} as const;

export type ProductKey = keyof typeof STRIPE_PRODUCTS;
