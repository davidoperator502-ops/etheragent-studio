import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_placeholder';
const DOMAIN = process.env.DOMAIN || 'http://localhost:5173';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { prompt, script, seed, imageUrl } = await request.json();

    if (!process.env.STRIPE_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: 'Payment configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${DOMAIN}/broadcaster?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${DOMAIN}/engine`,
      metadata: {
        prompt: prompt || '',
        script: script || '',
        seed: String(seed || ''),
        imageUrl: imageUrl || '',
        type: 'avatar_video',
      },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Checkout session error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create checkout session' }),
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
