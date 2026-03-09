import { GoogleGenAI } from '@google/genai';

const MASTER_PROMPT = `You are creating a premium B2B professional avatar for a high-value digital product/service. 

Generate a photorealistic executive portrait with these requirements:
- Professional business attire (suit or smart business casual)
- Confident, approachable expression
- Modern corporate setting or clean gradient background
- High-end professional lighting
- Face clearly visible, head and shoulders composition
- Suitable for a SaaS founder, executive, or influencer marketing
- Style: premium, trustworthy, sophisticated

The niche/context is: `;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = 'imagen-3.0-generate-002';

    const enhancedPrompt = `${MASTER_PROMPT}${prompt}`;

    const result = await ai.models.generateImages({
      model,
      prompt: enhancedPrompt,
    });

    if (!result.generatedImages || result.generatedImages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate image' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const image = result.generatedImages[0];
    const base64 = image.image.imageBytes;
    const seed = image.generationMetadata?.seed || Math.floor(Math.random() * 1000000);

    return new Response(
      JSON.stringify({
        imageUrl: `data:image/png;base64,${base64}`,
        seed,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Avatar generation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate avatar' }),
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
