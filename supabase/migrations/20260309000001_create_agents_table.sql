-- EtherAgent OS - Create Agents Table for Task Replay
-- Esta tabla es usada por useAgents hook para el Task Replay Lab

-- Crear tabla agents si no existe
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  color_theme TEXT DEFAULT 'cyan' CHECK (color_theme IN ('cyan', 'emerald', 'amber', 'orange', 'violet', 'zinc')),
  system_prompt TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Política: cualquier persona puede ver agentes activos (para el Task Replay público)
CREATE POLICY "Anyone can view active agents" ON public.agents
  FOR SELECT USING (is_active = true);

-- Insertar agentes por defecto para Task Replay
INSERT INTO public.agents (name, role, color_theme, is_active) VALUES
  ('Marcus', 'Chief Orchestrator', 'cyan', true),
  ('Valeria', 'Social Lab Director', 'emerald', true),
  ('Aria', 'Sonic Lab Engineer', 'amber', true),
  ('Viktor', 'Virtual OOH Lead', 'orange', true),
  ('Kaelen', 'Performance Ads Manager', 'violet', true)
ON CONFLICT DO NOTHING;
