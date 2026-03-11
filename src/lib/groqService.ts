const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export interface CampaignMatrix {
  valeria_chat: string;
  marcus_chat: string;
  viktor_chat: string;
  target_audience: string;
  brand_tone: string;
}

export async function generateCampaign(url: string, command: string): Promise<CampaignMatrix | null> {
  if (!GROQ_API_KEY) {
    console.error("Falta VITE_GROQ_API_KEY en el .env");
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
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: `Eres EtherAgent OS, el motor de IA de marketing más avanzado del mundo.
Tu misión es analizar la orden del CEO y la URL objetivo para generar respuestas de chat personalizadas para tus 3 agentes principales.

Reglas para los agentes:
- Valeria M. (Growth Hacker): Habla rápido, usa jerga de TikTok/retención, es irónica sobre las agencias tradicionales.
- Marcus V. (High-Ticket Closer): Habla de MRR, CPA, B2B y dolor corporativo. Muy formal.
- Viktor S. (Spatial Architect): Habla de hologramas, inventario digital y dominar la ciudad.

Debes responder ESTRICTAMENTE en este formato JSON exacto:
{
  "valeria_chat": "Texto que dirá Valeria en el Social Lab...",
  "marcus_chat": "Texto que dirá Marcus en el Social Lab...",
  "viktor_chat": "Texto que dirá Viktor en el Virtual OOH Lab...",
  "target_audience": "Breve descripción del público",
  "brand_tone": "Tono de la marca"
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
