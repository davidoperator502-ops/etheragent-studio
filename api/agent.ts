// api/agent.ts (Vercel Serverless Function)
import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
    if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

    try {
        const { prompt, userId } = await req.json();

        console.log("--- INICIANDO PETICIÓN A MARCUS ---");
        console.log("Prompt recibido:", prompt);

        if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.GROQ_API_KEY) {
            throw new Error('Missing environment variables.');
        }

        // 1. Inicializamos clientes con variables de entorno SEGURAS (Backend)
        const supabase = createClient(
            process.env.VITE_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY // Llave con Modo Dios, segura aquí en el backend
        );
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        // 2. Extraemos el contexto en tiempo real del CEO
        const { data: campaigns } = await supabase
            .from('campaigns')
            .select('title, status, budget_allocated, metrics')
            .eq('owner_id', userId)
            .limit(5);

        // 3. Construimos el "System Prompt" inyectando los datos de Supabase
        const systemInstruction = `
      Eres Marcus, el CEO AI de EtherAgent OS.
      Hablas de forma concisa, militar, B2B y directa. Nada de saludos largos.
      Aquí están los datos EN TIEMPO REAL del usuario para que respondas a su orden:
      DATOS DE CAMPAÑAS: ${JSON.stringify(campaigns)}
      
      Responde a la directiva del usuario basándote EXCLUSIVAMENTE en estos datos si pregunta por su rendimiento o campañas.
    `;

        // 4. Inferencia Ultrarrápida con LLaMA-3 (Groq)
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemInstruction },
                { role: 'user', content: prompt }
            ],
            model: 'llama3-70b-8192',
            temperature: 0.2, // Baja temperatura para respuestas analíticas y precisas
        });

        console.log("Tokens usados:", chatCompletion.usage?.total_tokens);

        return new Response(JSON.stringify({ response: chatCompletion.choices[0]?.message?.content }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error("ERROR CRÍTICO DE RED:", error);
        if (error.status === 429) {
            console.error("ERROR DE GROQ (Rate Limit):", error.message);
        }
        return new Response(JSON.stringify({ error: error.message || "Fallo en el enlace neuronal" }), { status: error.status || 500 });
    }
}
