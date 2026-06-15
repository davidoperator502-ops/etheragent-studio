import { useTokenStore } from "@/store/useTokenStore";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export interface CampaignMatrix {
  mission_id: string;
  hook: string;
  narrative_body: string;
  on_screen_text: string[];
  call_to_action: string;
  visual_description: string;
}

export async function generateCampaign(url: string, command: string): Promise<CampaignMatrix | null> {
  const { tokens } = useTokenStore.getState();
  const GROQ_API_KEY = tokens.groq || import.meta.env.VITE_GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    console.error("Falta GROQ_API_KEY en el Token Manager");
    return null;
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Eres el Director Creativo de EtherAgent OS.
Tu misión es analizar la orden del CEO y generar una narrativa de campaña B2B para videos nativos.
YA NO generamos audio separado. Debes estructurar el mensaje que el asset visual proyectará.

Debes responder ESTRICTAMENTE en este formato JSON exacto:
{
  "mission_id": "Un ID único alfanumérico",
  "hook": "Un gancho narrativo de 3 segundos",
  "narrative_body": "Cuerpo persuasivo enfocado en resultados",
  "on_screen_text": ["TEXTO 1", "TEXTO 2"],
  "call_to_action": "Instrucción final",
  "visual_description": "Prompt detallado en inglés para generar o elegir el asset visual"
}`
          },
          {
            role: "user",
            content: `URL a analizar: ${url}
Comando del CEO: "${command}"`
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) throw new Error("Error en Groq API");
    
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content) as CampaignMatrix;

  } catch (error) {
    console.error("Groq Engine Error:", error);
    return null;
  }
}

export async function generateVideoPrompt(duration: '10s' | '30s' | '60s', platform: string, context: any, labContext?: string): Promise<string> {
  const { tokens } = useTokenStore.getState();
  const GROQ_API_KEY = tokens.groq || import.meta.env.VITE_GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    throw new Error("Falta GROQ_API_KEY en el Token Manager");
  }

  let instructions = "";
  if (duration === '10s') {
    instructions = "Crea un script dinámico, muy rápido, directo al grano. Solo hay tiempo para el gancho, el valor core y el CTA. Unas ~5 escenas rápidas.";
  } else if (duration === '30s') {
    instructions = "Crea un script balanceado que desarrolle la narrativa sin perder ritmo. Mayor profundidad en el voiceover, ~8-10 escenas, el mismo gancho pero con más contexto en el desarrollo.";
  } else if (duration === '60s') {
    instructions = "Crea un script profundo y narrativo. El ritmo permite story-telling. Voiceover amplio y persuasivo. Unas ~12-15 escenas detalladas.";
  }

  const promptTemplate = `
Genera el prompt de video para la duración de ${duration} en ${platform}.

Base de la campaña:
Hook Original: ${context.hook || 'N/A'}
Narrativa Core: ${context.narrative_body || 'N/A'}
Estrategia / CTA: ${context.call_to_action || 'N/A'}

REGLAS DE DURACIÓN:
${instructions}
NOTA CLAVE: El de 30s y 60s NO son el de 10s estirado. Deben desarrollar más la narrativa de forma natural.
${labContext ? `\nCONTEXTO DEL FORMATO:\n${labContext}\n` : ''}

DEBES responder EXACTAMENTE con esta estructura (sin backticks extra de markdown al inicio/fin, solo texto crudo):

== ${platform} ${duration} ==

HOOK:
{gancho de 1 línea adaptado}

VOICEOVER:
{guion de voz completo, ritmo adaptado a la duración}

VISUAL DESCRIPTION:
{escenas numeradas con rangos de tiempo: ESCENA 1 (0-2s): ... - la cantidad de escenas escala con la duración}

TEXT ON SCREEN:
{timestamps con textos en pantalla, con emojis}

MUSIC & AUDIO:
{referencia de sonido, BPM, mood y justificación}

SFX:
{timestamps con efectos de sonido puntuales}

CTA:
{call to action final}

PACING:
{frecuencia de cortes, transiciones, zooms, beat-sync}
`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Eres un Video Prompt Engineer experto. Tu única tarea es generar la plantilla solicitada sin agregar texto adicional antes o después."
          },
          {
            role: "user",
            content: promptTemplate
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) throw new Error("Error en Groq API");
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating video prompt:", error);
    throw error;
  }
}

