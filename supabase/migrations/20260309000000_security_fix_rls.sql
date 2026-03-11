-- EtherAgent OS - Security Fix Migration
-- Fixes RLS críticos para producción

-- 1. ELIMINAR POLÍTICA PÚBLICA DE PROFILES (CRÍTICO - Datos de usuarios expuestos)
-- Esta política permitía que CUALQUIERA viera TODOS los perfiles de usuarios
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- 2. Crear política para que admins puedan ver todos los perfiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    role = 'admin' OR auth.uid() = id
  );

-- 3. Crear política para que users puedan ver otros profiles (para funcionalidades sociales)
-- Solo información pública, no datos sensibles
CREATE POLICY "Users can view public profiles" ON public.profiles
  FOR SELECT USING (
    -- Puedes ver tu propio perfil
    auth.uid() = id OR
    -- Los admins ven todos
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- 4. Habilitar RLS en agent_personas si no está
ALTER TABLE public.agent_personas ENABLE ROW LEVEL SECURITY;

-- 5. Agregar índice para mejor rendimiento en consultas de agents
CREATE INDEX IF NOT EXISTS idx_agents_is_active ON public.agents(is_active) WHERE is_active = true;

-- 6. Insertar agentes por defecto si no existen (para Task Replay)
INSERT INTO public.agents (name, role, color_theme, system_prompt, is_active) VALUES
  ('Marcus', 'Chief Orchestrator', 'cyan', 'You are Marcus, the AI Orchestrator of EtherAgent OS.', true),
  ('Valeria', 'Social Lab Director', 'emerald', 'You are Valeria, the Social Media Expert.', true),
  ('Aria', 'Sonic Lab Engineer', 'amber', 'You are Aria, the Audio Production Specialist.', true),
  ('Viktor', 'Virtual OOH Lead', 'orange', 'You are Viktor, the Virtual Billboard Designer.', true),
  ('Kaelen', 'Performance Ads Manager', 'violet', 'You are Kaelen, the Performance Marketing Expert.', true)
ON CONFLICT DO NOTHING;
