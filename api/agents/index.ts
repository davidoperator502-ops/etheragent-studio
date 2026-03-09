import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const runtime = 'nodejs';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(supabaseUrl, serviceKey);
}

const DEFAULT_SYSTEM_PROMPT = `You are {name}, an AI influencer in the {universe} universe. 
Your niche is: {niche}
Your tone is: {tone}
Language: {language}

Core identity:
{description}

Guidelines:
- Stay in character at all times
- Be authentic to your niche and universe
- Engage authentically with your audience
- Prioritize value over promotion
- Remember important details from past interactions (use your memory)`;

async function getAgentContext(supabase: ReturnType<typeof createClient>, agentId: string): Promise<string[]> {
  const { data: memories } = await supabase
    .from('agent_memories')
    .select('content, memory_type, importance_score')
    .eq('agent_id', agentId)
    .order('importance_score', { ascending: false })
    .limit(10);

  return memories?.map(m => m.content) || [];
}

async function chatWithAgent(
  agent: { id: string; name: string; system_prompt: string; tone: string; universe: string; niche: string; description?: string },
  userMessage: string,
  contextMemories: string[]
): Promise<{ response: string; tokens: { input: number; output: number } }> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('Google API key not configured');
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const enhancedPrompt = agent.system_prompt
    .replace(/{name}/g, agent.name)
    .replace(/{universe}/g, agent.universe)
    .replace(/{niche}/g, agent.niche)
    .replace(/{tone}/g, agent.tone)
    .replace(/{description}/g, agent.description || '');

  let fullPrompt = enhancedPrompt;
  
  if (contextMemories.length > 0) {
    fullPrompt += `\n\nRelevant memories from past interactions:\n${contextMemories.map(m => `- ${m}`).join('\n')}`;
  }
  
  fullPrompt += `\n\nUser says: ${userMessage}\n\nRespond as {name} would:`.replace(/{name}/g, agent.name);

  const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: fullPrompt,
  });

  const responseText = result.text || '';
  
  const inputTokens = fullPrompt.length / 4;
  const outputTokens = responseText.length / 4;

  return {
    response: responseText,
    tokens: { input: Math.round(inputTokens), output: Math.round(outputTokens) }
  };
}

async function saveConversation(
  supabase: ReturnType<typeof createClient>,
  agentId: string,
  userId: string | null,
  role: 'user' | 'assistant',
  message: string,
  tokens: { input: number; output: number }
) {
  await supabase.from('agent_conversations').insert({
    agent_id: agentId,
    user_id: userId,
    role,
    message,
    input_tokens: tokens.input,
    output_tokens: tokens.output,
  });
}

async function learnFromConversation(
  supabase: ReturnType<typeof createClient>,
  agentId: string,
  userMessage: string,
  agentResponse: string,
  importanceThreshold: number
) {
  const memoriesToSave = [];
  
  if (userMessage.includes('remember') || userMessage.includes('recuerda')) {
    const keyInfo = userMessage.replace(/.*(remember|recuerda)\s*/i, '').trim();
    if (keyInfo) {
      memoriesToSave.push({ content: keyInfo, type: 'fact', importance: 9 });
    }
  }
  
  if (agentResponse.includes('I remember') || agentResponse.includes('Recuerdo')) {
    const parts = agentResponse.split('.');
    for (const part of parts.slice(0, 2)) {
      if (part.length > 20 && part.length < 200) {
        memoriesToSave.push({ content: part.trim(), type: 'conversation', importance: 6 });
      }
    }
  }
  
  memoriesToSave.push({
    content: `User asked: ${userMessage.substring(0, 100)}`,
    type: 'conversation',
    importance: 3
  });

  for (const memory of memoriesToSave) {
    if (memory.importance >= importanceThreshold) {
      await supabase.from('agent_memories').insert({
        agent_id: agentId,
        content: memory.content,
        memory_type: memory.type,
        importance_score: memory.importance,
        source_type: 'conversation',
      });
    }
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const supabase = getSupabaseAdmin();
    
    let userId: string | null = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    const { action, agentId, name, description, tone, universe, niche, systemPrompt, message, avatarId } = await request.json();

    switch (action) {
      case 'create': {
        if (!userId) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        if (!name || !niche || !systemPrompt) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), {
            status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const { data: agent, error } = await supabase
          .from('agent_personas')
          .insert({
            user_id: userId,
            name,
            description: description || '',
            system_prompt: systemPrompt,
            tone: tone || 'professional',
            universe: universe || 'metaverse',
            niche,
            avatar_id: avatarId || null,
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ agent }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'chat': {
        if (!agentId || !message) {
          return new Response(JSON.stringify({ error: 'Missing agentId or message' }), {
            status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const { data: agent, error: agentError } = await supabase
          .from('agent_personas')
          .select('*')
          .eq('id', agentId)
          .single();

        if (agentError || !agent) {
          return new Response(JSON.stringify({ error: 'Agent not found' }), {
            status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const contextMemories = await getAgentContext(supabase, agentId);
        
        const { response, tokens } = await chatWithAgent(agent, message, contextMemories);
        
        await saveConversation(supabase, agentId, userId, 'user', message, tokens);
        await saveConversation(supabase, agentId, null, 'assistant', response, tokens);
        
        await learnFromConversation(supabase, agentId, message, response, agent.memory_importance_threshold);

        return new Response(JSON.stringify({ 
          response,
          tokens,
          agentName: agent.name
        }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'list': {
        const query = supabase
          .from('agent_personas')
          .select('*')
          .order('created_at', { ascending: false });

        if (userId) {
          query.eq('user_id', userId);
        }

        const { data: agents, error } = await query;

        if (error) throw error;

        return new Response(JSON.stringify({ agents }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'get': {
        if (!agentId) {
          return new Response(JSON.stringify({ error: 'Missing agentId' }), {
            status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const { data: agent, error } = await supabase
          .from('agent_personas')
          .select('*')
          .eq('id', agentId)
          .single();

        if (error || !agent) {
          return new Response(JSON.stringify({ error: 'Agent not found' }), {
            status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const { data: memories } = await supabase
          .from('agent_memories')
          .select('*')
          .eq('agent_id', agentId)
          .order('importance_score', { ascending: false })
          .limit(20);

        return new Response(JSON.stringify({ agent, memories }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'update': {
        if (!userId || !agentId) {
          return new Response(JSON.stringify({ error: 'Unauthorized or missing agentId' }), {
            status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const updateData: Record<string, unknown> = {};
        if (name) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (tone) updateData.tone = tone;
        if (universe) updateData.universe = universe;
        if (niche) updateData.niche = niche;
        if (systemPrompt) updateData.system_prompt = systemPrompt;

        const { data: agent, error } = await supabase
          .from('agent_personas')
          .update(updateData)
          .eq('id', agentId)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ agent }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'delete': {
        if (!userId || !agentId) {
          return new Response(JSON.stringify({ error: 'Unauthorized or missing agentId' }), {
            status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const { error } = await supabase
          .from('agent_personas')
          .delete()
          .eq('id', agentId)
          .eq('user_id', userId);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'generateContent': {
        if (!agentId) {
          return new Response(JSON.stringify({ error: 'Missing agentId' }), {
            status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const { data: agent, error: agentError } = await supabase
          .from('agent_personas')
          .select('*')
          .eq('id', agentId)
          .single();

        if (agentError || !agent) {
          return new Response(JSON.stringify({ error: 'Agent not found' }), {
            status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const { prompt, contentType = 'text', platform } = await request.json();

        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: 'AI not configured' }), {
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const ai = new GoogleGenAI({ apiKey });
        
        const contentPrompt = `As ${agent.name}, generate a ${contentType} for ${platform || 'general'} platform.
        
Persona: ${agent.description || agent.niche}
Tone: ${agent.tone}
Universe: ${agent.universe}

Content request: ${prompt}

Generate compelling, in-character content.`;

        const startTime = Date.now();
        
        let generatedContent = '';
        if (contentType === 'text') {
          const result = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: contentPrompt,
          });
          generatedContent = result.text || '';
        }

        const generationTime = Date.now() - startTime;

        const { data: content, error: contentError } = await supabase
          .from('agent_content')
          .insert({
            agent_id: agentId,
            content_type: contentType,
            generated_text: generatedContent,
            platform,
            model_used: 'gemini-2.0-flash',
            generation_time_ms: generationTime,
            status: 'draft',
          })
          .select()
          .single();

        if (contentError) throw contentError;

        return new Response(JSON.stringify({ content }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Agent API error:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
