-- Parity: distingue campañas por lab (social / ooh / commercial).
-- Antes solo se "etiquetaba" con `plataforma` (TEXT libre) (AUDIT §5.1).
-- Aditivo y retrocompatible: filas existentes quedan como 'social'. RLS sin cambios.

ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS lab_type TEXT NOT NULL DEFAULT 'social'
  CHECK (lab_type IN ('social', 'ooh', 'commercial'));

-- Índice para recuperar campañas filtradas por usuario + lab
CREATE INDEX IF NOT EXISTS idx_campaigns_user_lab
  ON public.campaigns (user_id, lab_type);
