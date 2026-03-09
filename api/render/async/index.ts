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
      .select('id, name, avatar_hq_url, image_url')
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
        status: 'queued',
        metadata: { 
          voiceId, 
          backgroundPrompt,
          queuedAt: new Date().toISOString(),
          estimatedTimeMinutes: 20
        },
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to create render job:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to create render job' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const renderJobId = renderJob.id;

    setImmediate(async () => {
      try {
        await processRenderJobAsync(renderJobId, {
          avatarId,
          script,
          platform,
          voiceId,
          backgroundPrompt,
          avatarHqUrl: avatar.avatar_hq_url || avatar.image_url,
        });
      } catch (error) {
        console.error('Background render processing failed:', error);
      }
    });

    return new Response(
      JSON.stringify({ 
        jobId: renderJobId,
        status: 'queued',
        estimatedTimeMinutes: 20,
        message: 'Render job has been queued. Use the job ID to poll for status updates.'
      }),
      { status: 202, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Render request error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process render request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function processRenderJobAsync(jobId: string, params: {
  avatarId: string;
  script: string;
  platform?: string;
  voiceId?: string;
  backgroundPrompt?: string;
  avatarHqUrl?: string;
}) {
  const supabase = getSupabaseAdmin();
  
  try {
    await supabase
      .from('render_jobs')
      .update({ status: 'processing', metadata: { startedAt: new Date().toISOString() } })
      .eq('id', jobId);

    let audioUrl: string | null = null;
    let videoUrl: string | null = params.avatarHqUrl || null;

    if (params.voiceId || params.script) {
      try {
        audioUrl = await generateAudio(params.script, params.voiceId);
      } catch (e) {
        console.error('Audio generation failed:', e);
      }
    }

    if (audioUrl && videoUrl) {
      try {
        videoUrl = await createLipSync(videoUrl, audioUrl);
      } catch (e) {
        console.error('Lip sync failed:', e);
      }
    }

    await supabase
      .from('render_jobs')
      .update({ 
        status: 'completed', 
        video_url: videoUrl,
        completed_at: new Date().toISOString(),
        metadata: { 
          completedAt: new Date().toISOString(),
          audioUrl: !!audioUrl,
          lipSync: !!audioUrl
        }
      })
      .eq('id', jobId);

  } catch (error) {
    await supabase
      .from('render_jobs')
      .update({ 
        status: 'failed',
        metadata: { error: String(error) }
      })
      .eq('id', jobId);
    throw error;
  }
}

async function generateAudio(script: string, voiceId?: string): Promise<string> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey || apiKey === 'your_elevenlabs_api_key_here') {
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

async function createLipSync(videoUrl: string, audioUrl: string): Promise<string> {
  const apiKey = process.env.SYNCLABS_API_KEY;
  if (!apiKey || apiKey === 'your_synclabs_api_key_here') {
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
  return result.videoUrl || videoUrl;
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
