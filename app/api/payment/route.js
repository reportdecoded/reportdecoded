// app/api/payment/route.js
// Creates a Stripe Checkout session for pay-per-report purchases

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICES = {
  single: { amount: 5900, label: 'Single Report — Report Decoded' },
  three:  { amount: 14900, label: '3-Report Pack — Report Decoded' },
  ten:    { amount: 39000, label: '10-Report Pack — Report Decoded' },
};

export async function POST(request) {
  try {
    const { pack = 'single', reportId, buyerEmail } = await request.json();

    const price = PRICES[pack];
    if (!price) {
      return Response.json({ error: 'Invalid pack type' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: buyerEmail,
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: { name: price.label },
            unit_amount: price.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/results?reportId=${reportId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      metadata: { reportId, pack },
    });

    return Response.json({ url: session.url });

  } catch (error) {
    console.error('Payment error:', error);
    return Response.json({ error: 'Payment setup failed' }, { status: 500 });
  }
}
