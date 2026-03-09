import { createClient } from '@supabase/supabase-js';

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

async function generateAudio(script: string, voiceId?: string): Promise<string> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error('ElevenLabs API key not configured');
  }

  const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + (voiceId || '21m00Tcm4TlvDq8ikWAM'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text: script,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate audio');
  }

  const audioBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(audioBuffer).toString('base64');
  return `data:audio/mp3;base64,${base64}`;
}

async function generateBackground(prompt: string): Promise<string> {
  const apiKey = process.env.FAL_API_KEY;
  if (!apiKey) {
    throw new Error('Fal.ai API key not configured');
  }

  const response = await fetch('https://queue.fal.run/fal-ai/flux/schnell', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Key ${apiKey}`,
    },
    body: JSON.stringify({
      prompt,
      image_size: { width: 1920, height: 1080 },
      num_inference_steps: 30,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate background');
  }

  const result = await response.json();
  return result.images?.[0]?.url || '';
}

async function createLipSync(videoUrl: string, audioUrl: string): Promise<string> {
  const apiKey = process.env.SYNCLABS_API_KEY;
  if (!apiKey) {
    throw new Error('SyncLabs API key not configured');
  }

  const response = await fetch('https://api.synclabs.so/video/lipsync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      videoUrl,
      audioUrl,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create lip sync');
  }

  const result = await response.json();
  return result.videoUrl || '';
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getSupabaseAdmin();
    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { avatarId, script, platform, voiceId, backgroundPrompt } = await request.json();

    if (!avatarId || !script) {
      return new Response(
        JSON.stringify({ error: 'Avatar ID and script are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: avatar, error: avatarError } = await supabase
      .from('avatars')
      .select('avatar_hq_url')
      .eq('id', avatarId)
      .single();

    if (avatarError || !avatar) {
      return new Response(
        JSON.stringify({ error: 'Avatar not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: renderJob, error: insertError } = await supabase
      .from('render_jobs')
      .insert({
        user_id: user.id,
        avatar_id: avatarId,
        script,
        platform,
        status: 'processing',
        metadata: { voiceId, backgroundPrompt },
      })
      .select()
      .single();

    if (insertError) {
      return new Response(
        JSON.stringify({ error: 'Failed to create render job' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      const [audioUrl] = await Promise.all([
        generateAudio(script, voiceId).catch(e => { console.error('Audio generation failed:', e); return null; }),
      ]);

      let finalVideoUrl = avatar.avatar_hq_url || '';
      
      if (audioUrl) {
        try {
          finalVideoUrl = await createLipSync(avatar.avatar_hq_url || '', audioUrl);
        } catch (lipSyncError) {
          console.error('Lip sync failed:', lipSyncError);
        }
      }

      await supabase
        .from('render_jobs')
        .update({ 
          status: 'completed', 
          video_url: finalVideoUrl,
          completed_at: new Date().toISOString(),
        })
        .eq('id', renderJob.id);

      return new Response(
        JSON.stringify({ 
          renderId: renderJob.id, 
          videoUrl: finalVideoUrl,
          status: 'completed',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (aiError) {
      await supabase
        .from('render_jobs')
        .update({ status: 'failed' })
        .eq('id', renderJob.id);

      return new Response(
        JSON.stringify({ error: 'AI generation failed', details: String(aiError) }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Render error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process render' }),
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
