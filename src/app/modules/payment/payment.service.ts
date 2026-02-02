import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-01-27.acacia' as any,
    typescript: true,
});

/**
 * Create a Payment Intent
 *
 * @param amount Amount in cents (or smallest currency unit)
 * @param currency Currency code (e.g., 'usd', 'bdt')
 * @param metadata Additional data to attach to the payment
 */
const createPaymentIntent = async (
    amount: number,
    currency: string = 'bdt',
    metadata: Record<string, string> = {}
) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        metadata,
        payment_method_types: ['card'],
    });

    return {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
    };
};

export const PaymentService = {
    createPaymentIntent,
};
