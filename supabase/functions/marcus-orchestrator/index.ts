// supabase/functions/marcus-orchestrator/index.ts
// Marcus - Neural Link para Orquestación de Agentes con Groq

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const runtime = 'edge';

interface AgentDecision {
  intent: string;
  target_brand: string;
  agents_to_activate: string[];
  parameters: {
    vibe: string;
    resolution: string;
  };
  marcus_confirmation_msg: string;
}

const SYSTEM_PROMPT = `Eres Marcus, el IA Orquestador Jefe de EtherAgent OS. 
Tu objetivo es analizar comandos de marketing y decidir qué agentes activar (viktor_ooh, aria_audio, valeria_social, kaelen_ads).
DEBES responder ÚNICAMENTE con un objeto JSON válido con la siguiente estructura, sin texto adicional:
{
  "intent": "campaña_global | solo_audio | solo_video | solo_social | solo_ooh | solo_ads",
  "target_brand": "nombre_de_la_marca_extraído_del_comando",
  "agents_to_activate": ["viktor", "aria", "valeria", "kaelen"],
  "parameters": {
    "vibe": "cyberpunk | corporativo | viral | luxury | tech",
    "resolution": "4K | 8K | HD"
  },
  "marcus_confirmation_msg": "Mensaje corto de confirmación en español."
}`;

async function callGroq(prompt: string, apiKey: string): Promise<AgentDecision> {
  const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    }),
  });

  if (!groqResponse.ok) {
    const error = await groqResponse.text();
    throw new Error(`Groq API error: ${error}`);
  }

  const data = await groqResponse.json();
  const content = data.choices[0].message.content;
  
  return JSON.parse(content);
}

async function saveOrchestrationLog(
  supabase: any, 
  userId: string | null, 
  prompt: string, 
  decision: AgentDecision
) {
  try {
    await supabase.from('analysis_history').insert({
      user_id: userId,
      url: 'marcus-orchestration',
      target_audience: { agents: decision.agents_to_activate, vibe: decision.parameters.vibe },
      financial_projection: { intent: decision.intent },
      executive_directive: { brand: decision.target_brand },
      strategic_hook: decision.marcus_confirmation_msg,
    });
  } catch (err) {
    console.error('Failed to save orchestration log:', err);
  }
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GROQ_API_KEY');
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Groq API key not configured. Set GROQ_API_KEY in Supabase secrets.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { prompt, userId } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('🧠 Marcus orquestando:', prompt.substring(0, 50) + '...');

    const decision = await callGroq(prompt, apiKey);

    // Guardar log de orquestación
    if (userId) {
      try {
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || Deno.env.get('VITE_SUPABASE_URL');
        const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        if (supabaseUrl && serviceKey) {
          const supabase = createClient(supabaseUrl, serviceKey);
          await saveOrchestrationLog(supabase, userId, prompt, decision);
        }
      } catch (err) {
        console.error('Failed to initialize Supabase for logging:', err);
      }
    }

    console.log('✅ Orquestación completada:', decision.agents_to_activate);

    return new Response(JSON.stringify(decision), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Marcus orchestration error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Orquestación fallida',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
