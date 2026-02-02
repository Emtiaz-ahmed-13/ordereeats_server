import * as dotenv from 'dotenv';
import Stripe from 'stripe';
dotenv.config();

async function checkStripe() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    console.log('Using secret key:', secretKey ? secretKey.substring(0, 7) + '...' : 'MISSING');

    if (!secretKey) {
        console.error('STRIPE_SECRET_KEY is missing in .env');
        process.exit(1);
    }

    try {
        const stripe = new Stripe(secretKey, {
            apiVersion: '2025-01-27.acacia' as any, // Using a more standard looking version for verification
        });

        // Try to retrieve account details to verify the key
        const account = await stripe.accounts.retrieve();
        console.log('Stripe connection successful!');
        console.log('Account Name:', account.business_profile?.name || 'N/A');
        console.log('Account ID:', account.id);
    } catch (error: any) {
        console.error('Stripe connection failed:', error.message);
        process.exit(1);
    }
}

checkStripe();
