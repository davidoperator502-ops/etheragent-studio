import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
    try {
        const { record, old_record } = await req.json()

        // SOLO DISPARAMOS SI EL STATUS CAMBIÓ A 'deployed' (o 'Success')
        // Ajusta la condición según los strings que uses en tu tabla campaigns
        if (record.status === 'deployed' && old_record?.status !== 'deployed') {

            console.log(`🚀 Notificando despliegue de: ${record.name || record.title || 'Campaña'}`);

            // Aquí llamaríamos a un servicio como OneSignal o WebPush nativo
            // O usando SendGrid/Twilio para enviar notificaciones fuera de la web
            // Por ahora, simulamos el payload que enviaríamos a la API Push:
            const payload = {
                title: "DESPLIEGUE EXITOSO 🦅",
                body: `La campaña '${record.name || record.title || 'en curso'}' ya está en vivo ${record.metrics?.ooh_location ? 'en ' + record.metrics.ooh_location : ''}.`,
                url: "/nexus"
            };

            console.log("Payload a enviar al Service Worker:", payload);
            // ... Lógica de envío de Push (usando tu llave de WebPush) ...
        }

        return new Response(JSON.stringify({ done: true }), { headers: { "Content-Type": "application/json" } })
    } catch (error) {
        console.error("Error procesando Webhook de Supabase:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
})
