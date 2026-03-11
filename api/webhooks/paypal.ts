import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const runtime = 'nodejs';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(supabaseUrl, serviceKey);
}

function mapPayPalPlanToTier(customId: string): { tier: string; status: string } {
  const planMap: Record<string, { tier: string; status: string }> = {
    'etheragent_growth': { tier: 'growth', status: 'active' },
    'etheragent_csuite': { tier: 'c-suite', status: 'active' },
    'etheragent_enterprise': { tier: 'enterprise', status: 'active' },
    'etheragent_premium': { tier: 'growth', status: 'active' },
  };
  
  return planMap[customId] || { tier: 'growth', status: 'active' };
}

export async function POST(request: Request) {
  try {
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed. Only POST.' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getSupabaseAdmin();
    const event = await request.json();

    console.log('========================================');
    console.log('[PayPal Webhook] Evento recibido:', event.event_type);
    console.log('========================================');

    if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const resource = event.resource;
      
      const orderId = resource.id;
      const amount = parseFloat(resource.amount?.value) || 0;
      const currency = resource.amount?.currency_code || 'USD';
      const customId = resource.custom_id || 'etheragent_premium';
      const payerEmail = resource.payer?.email_address || resource.subscriber?.email_address;
      const payerName = resource.payer?.name?.given_name || resource.subscriber?.name?.given_name || 'Cliente VIP';

      console.log('💰 PAGO PAYPAL RECIBIDO');
      console.log('Order ID:', orderId);
      console.log('Amount:', amount, currency);
      console.log('Plan:', customId);
      console.log('Payer Email:', payerEmail);

      const { tier, status } = mapPayPalPlanToTier(customId);

      if (payerEmail) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', payerEmail)
          .limit(1);

        if (profiles && profiles.length > 0) {
          const userId = profiles[0].id;
          
          await supabase
            .from('profiles')
            .update({
              subscription_tier: tier,
              subscription_status: status,
              paypal_payer_id: resource.payer?.payer_id || resource.subscriber?.payer_id,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);

          console.log(`✅ Suscripción actualizada: Tier=${tier}, Status=${status}`);
          console.log(`👤 Usuario ${userId} actualizado`);
        } else {
          console.log('⚠️ No se encontró perfil para email:', payerEmail);
        }
      }

      await supabase.from('subscriptions').insert({
        order_id: orderId,
        plan_id: customId,
        amount: amount,
        currency: currency,
        status: status,
        payer_name: payerName,
        payment_method: 'paypal_webhook'
      });

      console.log('📦 Registro de pago guardado en subscriptions');
      console.log('========================================');
    }

    if (event.event_type === 'BILLING.SUBSCRIPTION.ACTIVATED') {
      const resource = event.resource;
      
      const subscriptionId = resource.id;
      const planId = resource.plan_id || 'etheragent_premium';
      const subscriberEmail = resource.subscriber?.email_address;
      const subscriberName = resource.subscriber?.name?.given_name || 'Cliente VIP';

      console.log('🔄 SUSCRIPCIÓN PAYPAL ACTIVADA');
      console.log('Subscription ID:', subscriptionId);
      console.log('Plan ID:', planId);
      console.log('Subscriber Email:', subscriberEmail);

      const { tier, status } = mapPayPalPlanToTier(planId);

      if (subscriberEmail) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', subscriberEmail)
          .limit(1);

        if (profiles && profiles.length > 0) {
          const userId = profiles[0].id;
          
          await supabase
            .from('profiles')
            .update({
              subscription_tier: tier,
              subscription_status: status,
              paypal_subscription_id: subscriptionId,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);

          console.log(`✅ Suscripción activada: Tier=${tier}, Status=${status}`);
          console.log(`👤 Usuario ${userId} actualizado`);
        } else {
          console.log('⚠️ No se encontró perfil para email:', subscriberEmail);
        }
      }

      await supabase.from('subscriptions').insert({
        order_id: subscriptionId,
        plan_id: planId,
        amount: 0,
        currency: 'USD',
        status: status,
        payer_name: subscriberName,
        payment_method: 'paypal_subscription'
      });

      console.log('📦 Suscripción registrada');
      console.log('========================================');
    }

    if (event.event_type === 'BILLING.SUBSCRIPTION.CANCELLED' || event.event_type === 'BILLING.SUBSCRIPTION.EXPIRED') {
      const resource = event.resource;
      const subscriberEmail = resource.subscriber?.email_address;

      console.log('❌ SUSCRIPCIÓN CANCELADA/EXPIRADA');
      console.log('Subscription ID:', resource.id);

      if (subscriberEmail) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', subscriberEmail)
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
      }
      console.log('========================================');
    }

    return new Response(
      JSON.stringify({ received: true, status: 'success' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[PayPal Webhook Error]:', errorMessage);
    return new Response(
      JSON.stringify({ error: `Webhook Error: ${errorMessage}` }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
