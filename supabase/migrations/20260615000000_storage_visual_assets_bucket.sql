-- Parity: formaliza el bucket 'visual-assets' usado como fallback de upload en los 3 labs.
-- El bucket primario sigue siendo 'campaign_assets' (20260611000000_cms_assets_table.sql).
-- Este bucket dejaba de existir en migraciones aunque se referenciaba en el código (AUDIT §5.3).

-- 1. Crear el bucket (idempotente)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'visual-assets',
  'visual-assets',
  true,
  104857600, -- 100 MB
  ARRAY['video/mp4','video/webm','video/quicktime','image/jpeg','image/png','image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Políticas de Storage para bucket_id = 'visual-assets'
--    Escritura solo autenticado; lectura pública (los assets se sirven en previews).
DROP POLICY IF EXISTS "visual_assets_insert_authenticated" ON storage.objects;
CREATE POLICY "visual_assets_insert_authenticated"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'visual-assets');

DROP POLICY IF EXISTS "visual_assets_update_authenticated" ON storage.objects;
CREATE POLICY "visual_assets_update_authenticated"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'visual-assets');

DROP POLICY IF EXISTS "visual_assets_delete_authenticated" ON storage.objects;
CREATE POLICY "visual_assets_delete_authenticated"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'visual-assets');

DROP POLICY IF EXISTS "visual_assets_select_public" ON storage.objects;
CREATE POLICY "visual_assets_select_public"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'visual-assets');
