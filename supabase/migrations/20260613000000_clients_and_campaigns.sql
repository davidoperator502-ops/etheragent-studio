-- Phase 2: Clients and Campaigns System

-- 1. Table: clients
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  brand_colors JSONB,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own clients"
  ON public.clients
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow public read access to clients for the /c/:slug portal
CREATE POLICY "Public can view clients"
  ON public.clients
  FOR SELECT
  TO public
  USING (true);

-- 2. Table: campaigns
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  plataforma TEXT,
  estado TEXT DEFAULT 'draft' CHECK (estado IN ('draft', 'activa', 'archivada')),
  contenido JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for campaigns
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own campaigns"
  ON public.campaigns
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view campaigns"
  ON public.campaigns
  FOR SELECT
  TO public
  USING (true);

-- 3. Table: campaign_assets
CREATE TABLE IF NOT EXISTS public.campaign_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  tipo TEXT CHECK (tipo IN ('video_prompt', 'visual', 'copy')),
  duracion TEXT,
  contenido TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for campaign_assets
ALTER TABLE public.campaign_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage assets of their campaigns"
  ON public.campaign_assets
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = campaign_assets.campaign_id AND c.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = campaign_assets.campaign_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view campaign_assets"
  ON public.campaign_assets
  FOR SELECT
  TO public
  USING (true);
