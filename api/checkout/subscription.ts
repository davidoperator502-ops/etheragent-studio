import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const DOMAIN = process.env.DOMAIN || 'http://localhost:5173';

export const runtime = 'nodejs';

const PRICING_TIERS = {
  growth: {
    name: 'Growth',
    priceMonthly: 9700,
    priceAnnual: 97000,
    priceIdMonthly: 'price_growth_monthly',
    priceIdAnnual: 'price_growth_annual',
  },
  'c-suite': {
    name: 'C-Suite OS',
    priceMonthly: 29700,
    priceAnnual: 297000,
    priceIdMonthly: 'price_csuite_monthly',
    priceIdAnnual: 'price_csuite_annual',
  },
  enterprise: {
    name: 'Enterprise',
    priceMonthly: 99700,
    priceAnnual: 997000,
    priceIdMonthly: 'price_enterprise_monthly',
    priceIdAnnual: 'price_enterprise_annual',
  },
};

export async function POST(request: Request) {
  try {
    const { tierId, cycle, customerId, email } = await request.json();

    if (!process.env.STRIPE_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: 'Payment configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const tier = PRICING_TIERS[tierId as keyof typeof PRICING_TIERS];
    if (!tier) {
      return new Response(
        JSON.stringify({ error: 'Invalid pricing tier' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const priceId = cycle === 'annual' ? tier.priceIdAnnual : tier.priceIdMonthly;

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${DOMAIN}/?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${DOMAIN}/pricing`,
      metadata: {
        tierId,
        cycle,
      },
    };

    if (customerId) {
      sessionParams.customer = customerId;
    } else if (email) {
      sessionParams.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Subscription checkout error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create subscription' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
