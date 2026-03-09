import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const runtime = 'nodejs';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(supabaseUrl, serviceKey);
}

const ANALYSIS_PROMPT = `You are an expert B2B marketing analyst. Analyze the provided URL and extract strategic marketing intelligence.

Analyze the website and provide a detailed JSON response with:
1. targetAudience: Who are the ideal customers? Include description and tags.
2. financialProjection: What's the business model and growth potential? Include description and tags.
3. executiveDirective: What's the brand positioning and key message? Include description and tags.
4. strategicHook: Create one compelling headline that captures the core value proposition.

Return ONLY valid JSON, no other text.`;

export async function POST(request: Request) {
  try {
    const { url, userId } = await request.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
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
    
    const prompt = `${ANALYSIS_PROMPT}

Analyze this website: ${url}

Provide your analysis in this exact JSON format:
{
  "targetAudience": {
    "description": "...",
    "tags": ["...", "..."]
  },
  "financialProjection": {
    "description": "...",
    "tags": ["...", "..."]
  },
  "executiveDirective": {
    "description": "...",
    "tags": ["...", "..."]
  },
  "strategicHook": "..."
}`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const responseText = result.text || '';
    
    let analysisData;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return new Response(
        JSON.stringify({ error: 'Failed to parse analysis results' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (userId) {
      try {
        const supabase = getSupabaseAdmin();
        await supabase.from('analysis_history').insert({
          user_id: userId,
          url,
          target_audience: analysisData.targetAudience,
          financial_projection: analysisData.financialProjection,
          executive_directive: analysisData.executiveDirective,
          strategic_hook: analysisData.strategicHook,
        });
      } catch (dbError) {
        console.error('Failed to save analysis to database:', dbError);
      }
    }

    return new Response(
      JSON.stringify(analysisData),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to analyze URL' }),
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
