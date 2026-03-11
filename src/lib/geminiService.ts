import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface CampaignWorkspace {
    valeria_chat: string;
    marcus_chat: string;
    viktor_chat: string;
    visual_vectors: string; // El prompt para generar imágenes
}

export async function generateWorkspaceCampaign(brandOrUrl: string): Promise<CampaignWorkspace | null> {
    if (!GEMINI_API_KEY) {
        console.warn("⚠️ VITE_GEMINI_API_KEY no encontrada. Agrega la variable en tu .env.");
        // Retornamos un Mock para que la app no se rompa mientras pones la llave
        return {
            valeria_chat: "He detectado la esencia de la marca. El algoritmo predictivo indica que este gancho generará una retención del 87% en los primeros 3 segundos. ¿Autorizas la compilación del Bumper?",
            marcus_chat: "He procesado la gráfica de Autoridad. El copy ataca el dolor de las agencias. El A/B test marca un CPA un 40% más bajo. ¿Desplegamos?",
            viktor_chat: "Para esta marca, inyectaremos hologramas de alto impacto en el distrito financiero. Autoriza el despliegue urbano.",
            visual_vectors: "Cinematic, high-end corporate cyberpunk, glowing neon, hyper-realistic, 8k resolution --ar 16:9"
        };
    }

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        // Usamos gemini-2.5-flash porque es la versión más reciente y rápida disponible en tu API key
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Eres EtherAgent OS, una IA de marketing avanzado.
    Analiza la siguiente marca, empresa o nicho: "${brandOrUrl}".
    
    Tu tarea es crear la estrategia base para esta campaña.
    Responde ÚNICAMENTE en formato JSON válido con esta estructura exacta:
    {
      "valeria_chat": "Un diálogo corto, persuasivo y enérgico (como una Growth Hacker) proponiendo un video corto para TikTok sobre esta marca.",
      "marcus_chat": "Un diálogo corto, serio y corporativo proponiendo un anuncio de LinkedIn enfocado en B2B o ROI para esta marca.",
      "viktor_chat": "Un diálogo corto proponiendo una valla publicitaria 3D épica o en el metaverso para esta marca.",
      "visual_vectors": "Un prompt detallado en inglés (estilo Midjourney) para generar la estética visual de esta campaña."
    }`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Limpiamos el texto por si Gemini devuelve markdown (\`\`\`json ...)
        const cleanedText = responseText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();

        return JSON.parse(cleanedText) as CampaignWorkspace;

    } catch (error) {
        console.error("Gemini Engine Error:", error);
        return null;
    }
}
