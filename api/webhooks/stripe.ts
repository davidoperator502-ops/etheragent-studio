import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Stripe-Signature',
};

export const runtime = 'nodejs';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(supabaseUrl, serviceKey);
}

function mapStripePriceToTier(priceId: string): { tier: string; status: string } {
  const tierMap: Record<string, { tier: string; status: string }> = {
    'price_growth_monthly': { tier: 'growth', status: 'active' },
    'price_growth_annual': { tier: 'growth', status: 'active' },
    'price_csuite_monthly': { tier: 'c-suite', status: 'active' },
    'price_csuite_annual': { tier: 'c-suite', status: 'active' },
    'price_enterprise_monthly': { tier: 'enterprise', status: 'active' },
    'price_enterprise_annual': { tier: 'enterprise', status: 'active' },
  };
  
  return tierMap[priceId] || { tier: 'free', status: 'active' };
}

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

    const supabase = getSupabaseAdmin();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const { prompt, script, seed, imageUrl, type } = session.metadata || {};
        const customerEmail = session.customer_details?.email;
        const customerId = session.customer as string;

        console.log('========================================');
        console.log('💰 PAGO RECIBIDO - ORDEN COMPLETADA');
        console.log('========================================');
        console.log('Session ID:', session.id);
        console.log('Customer Email:', customerEmail);
        console.log('Customer ID:', customerId);
        console.log('Amount Paid:', session.amount_total ? session.amount_total / 100 : 0, session.currency?.toUpperCase());
        
        // ACTUALIZAR SUSCRIPCIÓN EN BASE DE DATOS
        if (customerEmail) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', customerEmail)
            .limit(1);

          if (profiles && profiles.length > 0) {
            const userId = profiles[0].id;
            
            // Determinar tier basado en priceId
            const priceId = session.metadata?.priceId || '';
            const { tier, status } = mapStripePriceToTier(priceId);

            // Actualizar perfil con información de suscripción
            await supabase
              .from('profiles')
              .update({
                subscription_tier: tier,
                subscription_status: status,
                stripe_customer_id: customerId,
                updated_at: new Date().toISOString()
              })
              .eq('id', userId);

            console.log(`✅ Suscripción actualizada: Tier=${tier}, Status=${status}`);
            console.log(`👤 Usuario ${userId} actualizado`);

            // Si es un pago de avatar/video, crear registro de compra
            if (type === 'avatar_video' && session.metadata?.prompt) {
              await supabase.from('purchases').insert({
                user_id: userId,
                item_id: session.metadata.avatarId || session.id,
                item_type: 'avatar',
                purchase_price: session.amount_total ? session.amount_total / 100 : 0,
                stripe_payment_id: session.payment_intent as string,
                status: 'completed'
              });
              console.log('📦 Compra registrada en historial');
            }
          } else {
            console.log('⚠️ No se encontró perfil para email:', customerEmail);
          }
        }
        
        console.log('--- Metadata ---');
        console.log('Type:', type);
        console.log('Prompt:', prompt);
        console.log('========================================');
        console.log('🎬 Listo para renderizar el video!');
        console.log('========================================');
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Buscar usuario por stripe_customer_id
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('stripe_customer_id', customerId)
          .limit(1);

        if (profiles && profiles.length > 0) {
          const userId = profiles[0].id;
          const status = subscription.status === 'active' ? 'active' : 
                        subscription.status === 'past_due' ? 'past_due' : 
                        subscription.status === 'canceled' ? 'cancelled' : 'active';

          await supabase
            .from('profiles')
            .update({
              subscription_status: status,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);

          console.log(`✅ Suscripción actualizada para ${profiles[0].email}: ${status}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .limit(1);

        if (profiles && profiles.length > 0) {
          await supabase
            .from('profiles')
            .update({
              subscription_tier: 'free',
              subscription_status: 'cancelled',
              updated_at: new Date().toISOString()
            })
            .eq('id', profiles[0].id);

          console.log(`❌ Suscripción cancelada para usuario ${profiles[0].id}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .limit(1);

        if (profiles && profiles.length > 0) {
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'past_due',
              updated_at: new Date().toISOString()
            })
            .eq('id', profiles[0].id);

          console.log(`⚠️ Pago fallido para usuario ${profiles[0].id} - Estado: past_due`);
        }
        break;
      }

      default:
        console.log(`Evento no manejado: ${event.type}`);
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
