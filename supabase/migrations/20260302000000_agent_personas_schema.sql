-- EtherAgent Autonomous Agents Schema
-- Extends existing schema with agent autonomy capabilities

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Agent Personas (the "brains" of each influencer)
CREATE TABLE public.agent_personas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  avatar_id UUID REFERENCES public.avatars(id),
  
  -- Core personality configuration
  system_prompt TEXT NOT NULL,
  tone TEXT DEFAULT 'professional' CHECK (tone IN ('professional', 'casual', 'authoritative', 'friendly', 'humorous')),
  language TEXT DEFAULT 'en',
  
  -- Multiverse settings
  universe TEXT DEFAULT 'metaverse' CHECK (universe IN ('metaverse', 'physical_indoor', 'physical_outdoor', 'space', 'virtual')),
  niche TEXT NOT NULL,
  
  -- Autonomous behavior settings
  auto_post BOOLEAN DEFAULT false,
  post_frequency_hours INTEGER DEFAULT 24,
  max_daily_posts INTEGER DEFAULT 5,
  
  -- Memory & learning
  memory_enabled BOOLEAN DEFAULT true,
  memory_importance_threshold INTEGER DEFAULT 7,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'training', 'archived')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Memories (long-term memory with importance scoring)
CREATE TABLE public.agent_memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agent_personas(id) ON DELETE CASCADE,
  
  -- Memory content
  content TEXT NOT NULL,
  memory_type TEXT CHECK (memory_type IN ('conversation', 'fact', 'preference', 'feedback', ' trend', 'context')),
  importance_score INTEGER DEFAULT 5 CHECK (importance_score BETWEEN 1 AND 10),
  
  -- Source tracking
  source_type TEXT,
  source_id TEXT,
  
  -- Vector embedding reference (for semantic search)
  embedding_model TEXT,
  embedding_version INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Conversations (short-term interaction history)
CREATE TABLE public.agent_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agent_personas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Interaction details
  role TEXT CHECK (role IN ('user', 'assistant', 'system')),
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  
  -- Token usage tracking
  input_tokens INTEGER,
  output_tokens INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Schedules (automated posting)
CREATE TABLE public.agent_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agent_personas(id) ON DELETE CASCADE,
  
  -- Schedule configuration
  cron_expression TEXT NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  
  -- Content to generate
  content_prompt TEXT NOT NULL,
  platforms TEXT[] DEFAULT '{}',
  
  -- Constraints
  max_runs_per_day INTEGER DEFAULT 3,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Content Generated (log of all generated content)
CREATE TABLE public.agent_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agent_personas(id) ON DELETE CASCADE,
  
  -- Content details
  content_type TEXT CHECK (content_type IN ('video', 'text', 'image', 'audio')),
  script TEXT,
  generated_text TEXT,
  video_url TEXT,
  image_url TEXT,
  
  -- Platform targeting
  platform TEXT,
  platform_post_id TEXT,
  
  -- Engagement tracking
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  
  -- Generation metadata
  model_used TEXT,
  generation_time_ms INTEGER,
  
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'published', 'failed')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Agent Analytics (performance metrics over time)
CREATE TABLE public.agent_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agent_personas(id) ON DELETE CASCADE,
  
  -- Time period
  date DATE NOT NULL,
  
  -- Metrics
  total_posts INTEGER DEFAULT 0,
  total_engagement INTEGER DEFAULT 0,
  total_reach INTEGER DEFAULT 0,
  avg_engagement_rate DECIMAL(5,4) DEFAULT 0,
  
  -- Platform breakdown
  platform_metrics JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_id, date)
);

-- Row Level Security for Agent Tables
ALTER TABLE public.agent_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_analytics ENABLE ROW LEVEL SECURITY;

-- Policies for agent_personas
CREATE POLICY "Users can view own agent personas" ON public.agent_personas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create agent personas" ON public.agent_personas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own agent personas" ON public.agent_personas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own agent personas" ON public.agent_personas
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for agent_memories
CREATE POLICY "Users can view own agent memories" ON public.agent_memories
  FOR SELECT USING (
    agent_id IN (SELECT id FROM agent_personas WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage own agent memories" ON public.agent_memories
  FOR ALL USING (
    agent_id IN (SELECT id FROM agent_personas WHERE user_id = auth.uid())
  );

-- Policies for agent_conversations
CREATE POLICY "Users can view own conversations" ON public.agent_conversations
  FOR SELECT USING (
    agent_id IN (SELECT id FROM agent_personas WHERE user_id = auth.uid())
    OR user_id = auth.uid()
  );

CREATE POLICY "Users can create conversations" ON public.agent_conversations
  FOR INSERT WITH CHECK (
    agent_id IN (SELECT id FROM agent_personas WHERE user_id = auth.uid())
    OR auth.uid() = user_id
  );

-- Policies for agent_schedules
CREATE POLICY "Users can manage own schedules" ON public.agent_schedules
  FOR ALL USING (
    agent_id IN (SELECT id FROM agent_personas WHERE user_id = auth.uid())
  );

-- Policies for agent_content
CREATE POLICY "Users can view own content" ON public.agent_content
  FOR SELECT USING (
    agent_id IN (SELECT id FROM agent_personas WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create content" ON public.agent_content
  FOR INSERT WITH CHECK (
    agent_id IN (SELECT id FROM agent_personas WHERE user_id = auth.uid())
  );

-- Policies for agent_analytics
CREATE POLICY "Users can view own analytics" ON public.agent_analytics
  FOR SELECT USING (
    agent_id IN (SELECT id FROM agent_personas WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create own analytics" ON public.agent_analytics
  FOR INSERT WITH CHECK (
    agent_id IN (SELECT id FROM agent_personas WHERE user_id = auth.uid())
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_agent_personas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_agent_personas_updated_at BEFORE UPDATE ON public.agent_personas
  FOR EACH ROW EXECUTE FUNCTION update_agent_personas_updated_at();

-- Indexes for performance
CREATE INDEX idx_agent_memories_agent_id ON public.agent_memories(agent_id);
CREATE INDEX idx_agent_memories_importance ON public.agent_memories(importance_score DESC);
CREATE INDEX idx_agent_conversations_agent_id ON public.agent_conversations(agent_id);
CREATE INDEX idx_agent_conversations_created ON public.agent_conversations(created_at DESC);
CREATE INDEX idx_agent_schedules_next_run ON public.agent_schedules(next_run_at) WHERE is_active = true;
CREATE INDEX idx_agent_content_agent_id ON public.agent_content(agent_id);
CREATE INDEX idx_agent_analytics_agent_date ON public.agent_analytics(agent_id, date);

-- Function to get context window for agent (recent memories)
CREATE OR REPLACE FUNCTION get_agent_context_window(p_agent_id UUID, p_max_memories INTEGER DEFAULT 10)
RETURNS TABLE(
  id UUID,
  content TEXT,
  memory_type TEXT,
  importance_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    am.id,
    am.content,
    am.memory_type,
    am.importance_score
  FROM public.agent_memories am
  WHERE am.agent_id = p_agent_id
  ORDER BY am.importance_score DESC, am.created_at DESC
  LIMIT p_max_memories;
END;
$$ LANGUAGE plpgsql;
