-- ============================================================================
-- APPLY_MIGRATIONS.sql — EtherAgent Studio · Paridad de Labs
-- ----------------------------------------------------------------------------
-- Combina, EN ORDEN, las dos migraciones bloqueantes de la rama audit/parity-work:
--   1) supabase/migrations/20260615000000_storage_visual_assets_bucket.sql
--   2) supabase/migrations/20260615000001_add_lab_type_to_campaigns.sql
--
-- USO: pégalo completo en el SQL Editor de Supabase (proyecto njhifpbnrbbhbmwgedtz
--      "EtherAgent OS") y ejecútalo UNA vez. Es idempotente: re-ejecutarlo no falla.
--
-- IDEMPOTENCIA (revisado contra el SQL real, no inventado):
--   ✅ Bucket: INSERT ... ON CONFLICT (id) DO NOTHING
--   ✅ Políticas Storage: DROP POLICY IF EXISTS + CREATE POLICY (patrón drop-then-create)
--   ✅ Columna: ALTER TABLE ... ADD COLUMN IF NOT EXISTS
--   ✅ Índice: CREATE INDEX IF NOT EXISTS
--   (No se detectó ninguna sentencia NO idempotente; no se omitió ni alteró SQL original.)
-- ============================================================================


-- ============================================================================
-- BLOQUE 1 — Bucket de Storage 'visual-assets'  (fallback de upload en los 3 labs)
-- Origen: 20260615000000_storage_visual_assets_bucket.sql  (copiado verbatim)
-- Qué hace: crea el bucket público 'visual-assets' (100MB, video+imagen) y sus
--           4 políticas RLS sobre storage.objects (escritura autenticada, lectura
--           pública). Resuelve que el bucket se usaba en código pero nunca se migró.
-- ============================================================================

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


-- ============================================================================
-- BLOQUE 2 — Columna campaigns.lab_type  (distingue social / ooh / commercial)
-- Origen: 20260615000001_add_lab_type_to_campaigns.sql  (copiado verbatim)
-- Qué hace: añade la columna lab_type (NOT NULL DEFAULT 'social', con CHECK) y un
--           índice (user_id, lab_type). Aditivo: filas existentes quedan 'social'.
--           RLS de campaigns SIN cambios.
-- ----------------------------------------------------------------------------
-- ⚠️ NOTA de idempotencia (no requiere cambiar el SQL, solo para que lo sepas):
--    'ADD COLUMN IF NOT EXISTS' con un CHECK inline. Si la columna NO existe, se
--    crea junto con un CHECK con nombre autogenerado (campaigns_lab_type_check).
--    Si la columna YA existe, Postgres OMITE toda la sentencia (no re-crea el CHECK).
--    Caso normal (primera aplicación) = correcto. Único edge case: si alguien creó
--    antes la columna SIN el CHECK, este script no lo añadiría. Verifícalo abajo.
-- ============================================================================

ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS lab_type TEXT NOT NULL DEFAULT 'social'
  CHECK (lab_type IN ('social', 'ooh', 'commercial'));

-- Índice para recuperar campañas filtradas por usuario + lab
CREATE INDEX IF NOT EXISTS idx_campaigns_user_lab
  ON public.campaigns (user_id, lab_type);


-- ============================================================================
-- VERIFICACIÓN (ejecutar DESPUÉS, por separado, para confirmar que se aplicó)
-- Descomenta y corre cada query. Resultado esperado indicado en cada una.
-- ============================================================================

-- (A) ¿Existe la columna campaigns.lab_type? → debe devolver 1 fila:
--     column_name=lab_type | data_type=text | column_default='social'::text
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_schema = 'public'
--   AND table_name   = 'campaigns'
--   AND column_name  = 'lab_type';

-- (B) ¿Existe el bucket 'visual-assets'? → debe devolver 1 fila:
--     id=visual-assets | public=true | file_size_limit=104857600
-- SELECT id, name, public, file_size_limit, allowed_mime_types
-- FROM storage.buckets
-- WHERE id = 'visual-assets';

-- (C) ¿Existen las 4 políticas RLS del bucket? → debe devolver 4 filas
--     (insert/update/delete authenticated + select public):
-- SELECT policyname, cmd, roles
-- FROM pg_policies
-- WHERE schemaname = 'storage'
--   AND tablename  = 'objects'
--   AND policyname LIKE 'visual_assets_%'
-- ORDER BY policyname;

-- (D) BONUS — ¿Se creó el CHECK de lab_type y el índice? (confirma el edge case de arriba)
-- SELECT conname FROM pg_constraint
-- WHERE conrelid = 'public.campaigns'::regclass AND contype = 'c'
--   AND pg_get_constraintdef(oid) ILIKE '%lab_type%';
-- SELECT indexname FROM pg_indexes
-- WHERE schemaname='public' AND tablename='campaigns' AND indexname='idx_campaigns_user_lab';
