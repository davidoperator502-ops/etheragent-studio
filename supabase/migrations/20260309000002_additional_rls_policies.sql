-- EtherAgent OS - Additional RLS Policies
-- Políticas de escritura para tablas que solo tenían SELECT

-- 1. Profiles: Políticas de INSERT/UPDATE completas
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view public profiles" ON public.profiles;

-- SELECT: Usuarios ven su propio perfil, admins ven todos
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- UPDATE: Usuarios actualizan su propio perfil
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- INSERT: Solo el trigger de auth puede insertar (usuarios no crean perfiles manualmente)

-- 2. Avatars: Políticas para admin management
-- Admin puede crear/actualizar avatares
CREATE POLICY "Admins can manage avatars" ON public.avatars
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 3. Templates: Políticas para admin management
CREATE POLICY "Admins can manage templates" ON public.templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. System Flows: Políticas para admin management
CREATE POLICY "Admins can manage system_flows" ON public.system_flows
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 5. Purchases: políticas de escritura
CREATE POLICY "Users can create purchases" ON public.purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own purchases" ON public.purchases
  FOR UPDATE USING (auth.uid() = user_id);

-- 6. Render Jobs: Políticas de escritura
CREATE POLICY "Users can update own render jobs" ON public.render_jobs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own render jobs" ON public.render_jobs
  FOR DELETE USING (auth.uid() = user_id);

-- 7. Analysis History: Políticas de escritura
CREATE POLICY "Users can update own analysis" ON public.analysis_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analysis" ON public.analysis_history
  FOR DELETE USING (auth.uid() = user_id);

-- 8. Función helper para verificar rol admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
