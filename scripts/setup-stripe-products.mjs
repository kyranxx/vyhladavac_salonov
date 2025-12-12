// Script to create Stripe products for Salon Finder SK
// Run with: node scripts/setup-stripe-products.mjs

import Stripe from 'stripe';

const STRIPE_SECRET_KEY = 'sk_test_51SdXcTKD2JDE6csJWfYlR5BH0lMJBQC5TbxOoro02KqwmNEpJ8DeqVrqdDNtFxhZhOuBKeUMV5WW3bxHcvfU8jFG002sVRfqMV';

const stripe = new Stripe(STRIPE_SECRET_KEY);

async function createProducts() {
    console.log('🚀 Creating Stripe products for Salon Finder SK...\n');

    try {
        // 1. Premium Monthly Subscription
        console.log('Creating Premium Monthly...');
        const premiumMonthly = await stripe.products.create({
            name: 'Premium Mesačné',
            description: 'Prémiové funkcie pre váš salón - mesačné predplatné',
            metadata: {
                type: 'subscription',
                tier: 'premium',
            },
        });

        const premiumMonthlyPrice = await stripe.prices.create({
            product: premiumMonthly.id,
            unit_amount: 300, // €3.00 in cents
            currency: 'eur',
            recurring: {
                interval: 'month',
            },
            metadata: {
                product_key: 'PREMIUM_MONTHLY',
            },
        });
        console.log(`✅ Premium Monthly created: ${premiumMonthlyPrice.id}\n`);

        // 2. Premium Yearly Subscription
        console.log('Creating Premium Yearly...');
        const premiumYearly = await stripe.products.create({
            name: 'Premium Ročné',
            description: 'Prémiové funkcie pre váš salón - ročné predplatné (ušetríte 6€)',
            metadata: {
                type: 'subscription',
                tier: 'premium',
            },
        });

        const premiumYearlyPrice = await stripe.prices.create({
            product: premiumYearly.id,
            unit_amount: 3000, // €30.00 in cents
            currency: 'eur',
            recurring: {
                interval: 'year',
            },
            metadata: {
                product_key: 'PREMIUM_YEARLY',
            },
        });
        console.log(`✅ Premium Yearly created: ${premiumYearlyPrice.id}\n`);

        // 3. Featured Listing (7 days)
        console.log('Creating Featured Listing...');
        const featured = await stripe.products.create({
            name: 'Zvýraznenie na 7 dní',
            description: 'Váš salón bude zobrazený na vrchu výsledkov vyhľadávania',
            metadata: {
                type: 'one_time',
                duration_days: '7',
            },
        });

        const featuredPrice = await stripe.prices.create({
            product: featured.id,
            unit_amount: 500, // €5.00 in cents
            currency: 'eur',
            metadata: {
                product_key: 'FEATURED_7_DAYS',
            },
        });
        console.log(`✅ Featured Listing created: ${featuredPrice.id}\n`);

        // 4. Verified Badge (yearly)
        console.log('Creating Verified Badge...');
        const verified = await stripe.products.create({
            name: 'Overený salón',
            description: 'Ročná verifikácia - získajte odznák dôveryhodnosti',
            metadata: {
                type: 'subscription',
                tier: 'verified',
            },
        });

        const verifiedPrice = await stripe.prices.create({
            product: verified.id,
            unit_amount: 2000, // €20.00 in cents
            currency: 'eur',
            recurring: {
                interval: 'year',
            },
            metadata: {
                product_key: 'VERIFIED_BADGE',
            },
        });
        console.log(`✅ Verified Badge created: ${verifiedPrice.id}\n`);

        // Summary
        console.log('========================================');
        console.log('🎉 All products created successfully!\n');
        console.log('Add these to your .env file:\n');
        console.log(`STRIPE_PREMIUM_MONTHLY_PRICE_ID=${premiumMonthlyPrice.id}`);
        console.log(`STRIPE_PREMIUM_YEARLY_PRICE_ID=${premiumYearlyPrice.id}`);
        console.log(`STRIPE_FEATURED_PRICE_ID=${featuredPrice.id}`);
        console.log(`STRIPE_VERIFIED_PRICE_ID=${verifiedPrice.id}`);
        console.log('========================================');

    } catch (error) {
        console.error('Error creating products:', error);
        throw error;
    }
}

createProducts();
