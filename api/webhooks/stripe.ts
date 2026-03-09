import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Stripe-Signature',
};

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
      return new Response(
        JSON.stringify({ error: 'Webhook configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const rawBody = await request.text();

    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'Missing Stripe signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const { prompt, script, seed, imageUrl, type } = session.metadata || {};

      console.log('========================================');
      console.log('💰 PAGO RECIBIDO - ORDEN COMPLETADA');
      console.log('========================================');
      console.log('Session ID:', session.id);
      console.log('Customer Email:', session.customer_details?.email);
      console.log('Amount Paid:', session.amount_total ? session.amount_total / 100 : 0, session.currency?.toUpperCase());
      console.log('--- Metadata ---');
      console.log('Type:', type);
      console.log('Prompt:', prompt);
      console.log('Script:', script ? `${script.substring(0, 100)}...` : 'N/A');
      console.log('Seed:', seed);
      console.log('Image URL:', imageUrl);
      console.log('========================================');
      console.log('🎬 Listo para renderizar el video!');
      console.log('========================================');
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook handler failed' }),
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
