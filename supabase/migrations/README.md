# Migraciones Supabase — convención y deuda técnica

> Documenta el estado real de `supabase/migrations/` y la limpieza recomendada.
> **No se borra ni renombra nada aquí**: varias de estas migraciones probablemente
> ya corrieron en producción; renombrarlas/eliminarlas causaría re-ejecución o drift
> del historial. La limpieza, si se hace, debe ser controlada (ver §3).

## 1. Convención esperada
Supabase ejecuta las migraciones por orden lexicográfico del prefijo
`YYYYMMDDHHMMSS_nombre.sql`. Todo archivo nuevo DEBE seguir ese formato
(las dos de paridad lo hacen: `20260615000000_*`, `20260615000001_*`).

## 2. Deuda detectada (auditoría)

### 2.1 Archivos SIN timestamp (no siguen la convención)
Orden de ejecución NO garantizado respecto a los timestamped:
- `add_compute_tokens.sql`
- `add_monitization_columns.sql`  ⚠️ además typo: "monitization" (debería ser "monetization")
- `SUPABASE_MEMORY.sql`
- `SUPABASE_MIGRATION.sql`

### 2.2 Redundancia de columnas de monetización
`add_compute_tokens.sql`, `add_monitization_columns.sql` y la edge function
`functions/add-monetization-columns/` añaden columnas solapadas a `profiles`
(`plan_name`, `compute_tokens`, `total_tokens`). Todas usan `IF NOT EXISTS`, así
que no fallan, pero son redundantes.

### 2.3 Trigger `on_auth_user_created` redefinido en 3 lugares
`20260227000000_initial_schema.sql`, `20260316_user_usage.sql` y
`add_compute_tokens.sql` hacen `DROP TRIGGER IF EXISTS` + `CREATE`. No es fatal
(la última ejecución gana), pero conviene una única fuente de verdad.

### 2.4 Dos migraciones de `campaigns`
`20260310000000_add_campaigns_table.sql` y `20260613000000_clients_and_campaigns.sql`
ambas tocan `campaigns` (la segunda usa `CREATE TABLE IF NOT EXISTS`). La columna
`lab_type` (`20260615000001`) hace `ALTER ... ADD COLUMN IF NOT EXISTS`, compatible
con cualquiera de las dos.

## 3. Limpieza recomendada (controlada, NO automática)
1. **No** borrar archivos ya aplicados en remoto sin antes alinear el historial con
   `supabase migration list` y, si procede, `supabase migration repair`.
2. Renombrar los 4 sin timestamp a `YYYYMMDDHHMMSS_*` **solo** en un entorno donde
   el historial remoto se pueda reparar (evita que Supabase los trate como nuevos).
3. Consolidar las columnas de monetización en una sola migración canónica y
   deprecar `add_monitization_columns.sql` (typo).
4. Unificar el trigger `on_auth_user_created` en una única migración.

## 4. Migraciones de la paridad de Labs (esta rama)
- `20260615000000_storage_visual_assets_bucket.sql` — bucket `visual-assets` + RLS.
- `20260615000001_add_lab_type_to_campaigns.sql` — `campaigns.lab_type` + índice.
- Script combinado idempotente para aplicar manualmente: `docs/APPLY_MIGRATIONS.sql`.
