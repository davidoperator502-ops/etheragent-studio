# PARITY_PLAN — Paridad funcional de los 3 Labs

> **Fase 3.** Plan de refactor para que **Virtual OOH** y **Commercial Lab** alcancen la paridad funcional de **Social Lab**.
> Basado en `AUDIT_REPORT.md` (Fase 1) y `SOCIAL_LAB_REFERENCE.md` (Fase 2). Generado 2026-06-15.
> **No se ha escrito código.** Este documento se detiene en checkpoint para tu aprobación.

---

## 0. Decisión de arquitectura — RUTA A vs RUTA B  ⚠️ REQUIERE TU CONFIRMACIÓN

La Fase 2 reveló que **Social Lab NO genera la campaña base**: la genera **Nexus Brain** (edge fn `nexus-brain`) y la deja en `nexus_youtube_ads.campaign_data`. Social Lab solo la **lee** y sobre ella genera guiones on-demand.

| | **RUTA A — Una campaña, tres interpretaciones** ✅ RECOMENDADA | **RUTA B — Cada lab genera su propia base** |
|---|---|---|
| Fuente de la campaña base | La misma de Nexus Brain (`?campaign={id}` o última del usuario) | Cada lab vuelve a llamar al motor de ingesta |
| Trabajo | Bajo: reutiliza fetch + normalización ya existentes | Alto: duplicar/parametrizar el flujo de `nexus-brain` |
| Riesgo | Bajo: no toca la ingesta ni Social Lab | Alto: toca edge function compartida (CORS, costos, RLS) |
| Coherencia | Total: una marca → OOH/Social/Commercial coherentes | Riesgo de divergencia entre labs |
| Lo que añade cada lab | Generador de guiones contextual + upload + Guardar Campaña | Lo mismo + su propia ingesta |

**Recomendación: RUTA A.** Cada lab consume la **misma** `campaign_data` (hook, narrativa, visual, audiencia) y solo cambia **(a)** la adaptación contextual del `promptTemplate` de guiones y **(b)** el preview. Esto respeta el principio de `CONTEXT.md` ("Nexus Brain = punto único de ingestión", deprecación de CommandHub) y minimiza el riesgo sobre Social Lab.

**Empty state contextual:** si no hay campaña base, cada lab muestra (igual que Social) un CTA "Ir al Nexus Brain" — NO se crea un segundo punto de ingesta.

> 🔲 **PUNTO DE CONFIRMACIÓN 1:** ¿Apruebas RUTA A? Si prefieres RUTA B, el alcance y el riesgo crecen y el plan de tareas cambia sustancialmente.

---

## 1. Bloqueantes de backend (deben ir ANTES de tocar los labs)

### 1.1 BLOQUEANTE — Bucket de Storage

**Problema (AUDIT §5.3 / REFERENCE §3.1):** `visual-assets` se referencia en 5 componentes y es el fallback de upload de Social Lab, pero **ninguna migración lo crea**. OOH y Commercial usan **solo** `visual-assets` → su upload depende de un bucket que puede no existir.

**Decisión de unificación — usar `campaign_assets` como bucket primario en los 3 labs** (justificación):
- Ya está **creado por migración** (`20260611000000_cms_assets_table.sql:59-93`) con políticas RLS y límite 100MB + MIME video/imagen.
- Social Lab ya lo usa como primario; alinear OOH/Commercial a él da consistencia.
- `visual-assets` se mantiene como fallback **pero se formaliza** con una migración nueva que lo cree con políticas equivalentes (para que el fallback de Social Lab deje de ser frágil y para no romper componentes legacy: `VirtualOOHLab`, `CommercialLab`, `StudioLab`, `VisualAssetMatrix`).

**Migración nueva** `supabase/migrations/20260615000000_storage_visual_assets_bucket.sql`:
- `INSERT INTO storage.buckets (id, name, public) VALUES ('visual-assets','visual-assets', true) ON CONFLICT DO NOTHING;`
- Políticas en `storage.objects` para `bucket_id = 'visual-assets'`:
  - `INSERT`/`UPDATE`/`DELETE`: `TO authenticated` (escritura solo autenticado).
  - `SELECT`: público (los assets se sirven en previews).
- Límite de tamaño + MIME alineados con `campaign_assets` (100MB, video/* + image/*).

> Resultado: los 3 labs suben a **`campaign_assets`** (primario) con fallback **`visual-assets`** que ya existirá de verdad.

### 1.2 BLOQUEANTE — Columna `lab_type` en `campaigns`

**Problema (AUDIT §5.1 / REFERENCE §3.2):** hoy se "etiqueta" con `plataforma` (TEXT libre). No hay forma fiable de filtrar campañas por lab.

**Migración nueva** `supabase/migrations/20260615000001_add_lab_type_to_campaigns.sql`:
```sql
ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS lab_type TEXT NOT NULL DEFAULT 'social'
  CHECK (lab_type IN ('social','ooh','commercial'));

CREATE INDEX IF NOT EXISTS idx_campaigns_user_lab
  ON public.campaigns (user_id, lab_type);
```
- `DEFAULT 'social'` → filas existentes quedan como `social` (no rompe Social Lab ni el historial actual).
- **RLS intacto**: la columna no altera las policies `auth.uid() = user_id` (`20260613000000:49-60`). No se tocan políticas.
- **Filtrado al recuperar**: `useCampaignHistory` (y/o un selector) añadirá `.eq('lab_type', labType)` cuando se pida por lab; sin filtro = todas (compat).

> 🔲 **PUNTO DE CONFIRMACIÓN 2:** valores del enum `('social','ooh','commercial')` y `DEFAULT 'social'`. Si quieres otra taxonomía, decídelo aquí.

---

## 2. Motor compartido (extraído de Social Lab, sin romperlo)

Objetivo: extraer lo que la Fase 2 marcó como **genérico** a módulos reutilizables, y refactorizar `SocialLab` para que los consuma **sin cambiar su comportamiento**.

### 2.1 Estructura propuesta
```
src/lib/prompt-engine/
  ├─ types.ts              # CampaignAsset, LabType, LabConfig, CampaignDataPayload
  ├─ buildMasterPrompt.ts  # ← extraído de SocialLab.tsx:78-110 (puro)
  ├─ promptTemplates.ts    # plantillas contextuales por labType (§2.4)
  └─ labConfigs.ts         # config por lab: plataformas/formatos, labels, preview slot

src/hooks/
  └─ useCampaignStudio.ts  # orquestador: fetch campaña + normalizar + generar guiones
                           #   + upload + guardar, parametrizado por labType

src/components/campaign-studio/   (compartidos, "tontos"/presentacionales)
  ├─ VideoScriptGenerator.tsx   # ← UI guiones 10/30/60 (SocialLab.tsx:641-708)
  ├─ CampaignUploader.tsx       # ← dropzone + uploadVideo (SocialLab.tsx:349-444, 1023-1068)
  ├─ SaveCampaignButton.tsx     # ← botón + modal + handleSaveArchive (218-259, 1100-1173)
  └─ HighlightedPrompt.tsx      # ← SocialLab.tsx:128-145
```

### 2.2 Qué se mueve (con origen exacto)
| Pieza nueva | Origen en SocialLab/groqService | Cambio al extraer |
|---|---|---|
| `types.CampaignAsset` | `SocialLab.tsx:21-36` | Tal cual |
| `buildMasterPrompt()` | `SocialLab.tsx:78-110` | Puro, sin cambios de lógica |
| `generateVideoPrompt()` | `groqService.ts:71-160` | **Se mantiene donde está**; se le añade un parámetro de contexto `labType`/`formatHint` (ver §2.4) con default que reproduce el comportamiento actual |
| `useCampaignStudio()` | `SocialLab.tsx:162-444` (handlers) | Encapsula: `fetchCampaign`, normalización `baseAsset/currentAsset`, `handleGeneratePrompt`, `uploadVideo`, `handleSaveArchive`, estados (`loading`, `uploading`, `generatingDuration`, `generatedPrompts`, modal) |
| `VideoScriptGenerator` | `SocialLab.tsx:641-708` | Recibe props: `durations`, `generatedPrompts`, `onGenerate`, `onExport`, `busyDuration` |
| `CampaignUploader` | `SocialLab.tsx:349-468, 1023-1068` | Props: `accept`, `uploading`, `onFile`, `hasMedia` |
| `SaveCampaignButton` + modal | `SocialLab.tsx:218-263, 562-567, 1100-1173` | Props: `labType`, `platform`, `campaignData`, `currentAsset` |

### 2.3 Contrato del hook `useCampaignStudio(labType, opts)`
Devuelve (forma estable para los 3 labs):
```ts
{
  loading, campaign, campaignData, currentAsset,
  platform, setPlatform, formats, format, setFormat,
  mediaType, setMediaType,
  generatedPrompts, generatingDuration, handleGeneratePrompt, handleExportPrompts,
  uploading, uploadVideo, handleCopy, handleCopyMaster,
  saveModal: { open, setOpen, save, saving, clients, ... }
}
```
- `labType` decide: tabla/columna de guardado (`campaigns.lab_type`), bucket, plantilla de guion, set de plataformas/formatos.
- La fuente de la campaña base sigue siendo `nexus_youtube_ads` (RUTA A).

### 2.4 Adaptación contextual del `promptTemplate` (por lab)
Se parametriza `generateVideoPrompt` con un bloque de contexto según `labType` (nuevo en `promptTemplates.ts`, inyectado en `groqService.ts:88-127`):

| Lab | Formato/Aspecto | Bloque contextual a inyectar en el prompt |
|---|---|---|
| **social** (default) | Vertical **9:16** | Comportamiento ACTUAL (sin cambios): reel/feed/story, hook scroll-stopper, beat-sync, CTA "link in bio" |
| **ooh** | **Gran formato espacial** (Times Square / Shibuya) | Sin audio dependiente (entorno ruidoso): peso visual, lectura a distancia, loops cortos de alto impacto, texto mínimo legible, escala monumental, dayparting, dwell-time |
| **commercial** | **Cinematic HDR 16:9** | Calidad broadcast/Streaming/CTV, gradación de color HDR, **audio espacial** (5.1/Atmos), arco narrativo, duraciones tipo spot TV, sin elementos de UI social |

> El `platform` que hoy recibe `generateVideoPrompt` se generaliza a "surface/format" (p.ej. OOH: `Times Square 8K Billboard`; Commercial: `Connected TV / Streaming 4K HDR`). El default reproduce exactamente el texto social actual.

> 🔲 **PUNTO DE CONFIRMACIÓN 3:** ¿Las "plataformas/formatos" por lab? Propuesta:
> - OOH: `['Times Square','Shibuya Crossing','Piccadilly','Spatial/Metaverse']` (formato espacial).
> - Commercial: `['Streaming/OTT','Connected TV','Cinema/DOOH','YouTube Masthead']` (16:9 HDR).

---

## 3. Reglas explícitas — qué NO romper en Social Lab

1. **Comportamiento idéntico:** tras extraer el motor, `/dashboard/social` debe verse y funcionar **exactamente igual** (mismos botones, mismo flujo, mismos toasts).
2. **No cambiar la fuente de datos de Social:** sigue leyendo `nexus_youtube_ads` y sincronizando el store (`SocialLab.tsx:279-307`).
3. **No alterar el formato de `contenido` que ya guarda** (`{...campaign_data, assets:[currentAsset]}`, `241-247`); solo se **añade** `lab_type:'social'` al INSERT.
4. **Defaults retrocompatibles:** `generateVideoPrompt` sin `labType` = comportamiento social actual (texto del template `groqService.ts:88-127` sin tocar).
5. **No tocar `PlatformPreviews.tsx`** ni el mockup 9:16 social (son específicos de social).
6. **No modificar edge functions ni la ingesta** (`nexus-brain`) en esta fase.
7. **Migraciones aditivas** (`ADD COLUMN IF NOT EXISTS`, `DEFAULT 'social'`, `ON CONFLICT DO NOTHING`): cero `DROP`/`ALTER` destructivo; RLS sin cambios.
8. **Verificación obligatoria** tras extraer el motor (checkpoint intermedio): typecheck + build + smoke manual de Social Lab antes de tocar OOH/Commercial.

---

## 4. Tareas ordenadas (con archivos a tocar)

### FASE 4.0 — Preparación (antes de código)
- [ ] `git checkout -b audit/parity-work` + commit del estado actual (incluye limpiar/commitear `tsconfig.app.tsbuildinfo`).

### FASE 4.1 — Motor compartido (sin tocar labs aún)
- [ ] Crear `src/lib/prompt-engine/types.ts` (mover `CampaignAsset`, definir `LabType`, `LabConfig`).
- [ ] Crear `src/lib/prompt-engine/buildMasterPrompt.ts` (mover desde `SocialLab.tsx:78-110`).
- [ ] Crear `src/lib/prompt-engine/promptTemplates.ts` + `labConfigs.ts` (§2.4).
- [ ] Extender `src/lib/groqService.ts:71-160` con parámetro de contexto opcional (default = social actual).
- [ ] Crear `src/hooks/useCampaignStudio.ts` (orquestador, §2.3).
- [ ] Crear `src/components/campaign-studio/{VideoScriptGenerator,CampaignUploader,SaveCampaignButton,HighlightedPrompt}.tsx`.
- [ ] **Refactor `SocialLab.tsx`** para consumir el motor compartido, preservando UI/UX.
- [ ] ✅ **CHECKPOINT INTERMEDIO** (lo pide la Fase 4): typecheck + build + smoke de Social Lab. Detenerse para tu revisión.

### FASE 4.2 — Migraciones (bloqueantes)
- [ ] `supabase/migrations/20260615000000_storage_visual_assets_bucket.sql` (§1.1).
- [ ] `supabase/migrations/20260615000001_add_lab_type_to_campaigns.sql` (§1.2).
- [ ] Aplicar (orden por timestamp) y documentar comando de aplicación.

### FASE 4.3 — Virtual OOH Lab
Archivo: `src/components/dashboard/VirtualOOHLab.tsx`
- [ ] Integrar `useCampaignStudio('ooh')` (fetch campaña base RUTA A; empty state → Nexus Brain).
- [ ] Renderizar bloques del motor: hook/narrativa/visual/tono/pacing/audio/textos/CTA (hoy ausentes — AUDIT §4.3).
- [ ] Añadir `<VideoScriptGenerator>` con plantilla **OOH gran formato espacial**.
- [ ] Añadir "Copiar Prompt Maestro" + "Copiar Visual".
- [ ] `<CampaignUploader>` → bucket `campaign_assets` (quitar restricción admin-only de `:275` para el upload de campaña; mantener preview existente `286-372`).
- [ ] `<SaveCampaignButton labType="ooh">` (reemplaza el mock `console.log` de `:380`).

### FASE 4.4 — Commercial Lab
Archivo: `src/components/dashboard/CommercialLab.tsx`
- [ ] Integrar `useCampaignStudio('commercial')`.
- [ ] Renderizar bloques del motor (hoy ausentes — AUDIT §4.4).
- [ ] `<VideoScriptGenerator>` con plantilla **Commercial cinematic HDR 16:9 + audio espacial**.
- [ ] "Copiar Prompt Maestro" + "Copiar Visual".
- [ ] `<CampaignUploader>` → `campaign_assets`.
- [ ] `<SaveCampaignButton labType="commercial">` (reemplaza el mock `:271-289`).

### FASE 4.5 — Wiring de botones (cero onClick vacíos)
- [ ] OOH `[DEPLOY TO METAVERSE]` (`VirtualOOHLab.tsx:399`): handler real → marca campaña `estado:'activa'` (o `deployed`) + toast + (opcional) navegación. Sin stub.
- [ ] Commercial `[DEPLOY TO NETWORKS]` (`CommercialLab.tsx:293`): handler real análogo.
- [ ] "Encender Valla" (OOH `:260`) y demás controles: confirmar que todos hacen algo real o se eliminan.

### FASE 4.6 — Tareas secundarias (NO bloquean la paridad)
- [ ] **Fix NaN%**: `TokenTelemetry.tsx:13` → guardar contra `totalTokens === 0` (`percentage = totalTokens > 0 ? (used/total)*100 : 0`); revisar `:43` y `:51`.
- [ ] **Alinear tipado** `useCampaignHistory.ts:5-16` al esquema real (`nombre/plataforma/estado/contenido/lab_type`) — sin cambiar la query.
- [ ] (Opcional) Exponer `lab_type` en el filtro de `CampaignArchive`/`useCampaignHistory`.

---

## 5. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Romper Social Lab al extraer el motor | Checkpoint intermedio (4.1) con smoke test; reglas §3; refactor a "paridad de comportamiento", no rediseño |
| Bucket `visual-assets` inexistente en prod | Migración explícita (§1.1) + mantener `campaign_assets` como primario |
| `lab_type` rompe historial existente | `DEFAULT 'social'` + `ADD COLUMN IF NOT EXISTS`; RLS intacto |
| Divergencia de UX entre labs | Componentes compartidos presentacionales; solo cambian config + plantilla + preview |
| Edge function / ingesta | RUTA A no la toca |
| `generateVideoPrompt` cambia salida social | Parámetro de contexto **opcional con default = actual** |
| Migraciones sin timestamp ya existentes (deuda AUDIT §7) | No se tocan aquí; las nuevas usan timestamp correcto |

---

## 6. Definición de "hecho" (paridad)
Para OOH y Commercial, igual que Social:
1. Renderiza gancho + narrativa + estrategia/prompt maestro desde la campaña base.
2. Genera guiones 10s/30s/60s (contextualizados al lab) vía Groq.
3. "Copiar Prompt Maestro" y "Copiar Visual" funcionan (clipboard).
4. Sube video propio → Storage sin error (`campaign_assets`).
5. "Guardar Campaña" → `INSERT campaigns` con `lab_type` correcto; recuperable filtrado por lab.
6. Cero botones placeholder.
7. Social Lab sigue idéntico.

---

### 🔲 Resumen de puntos que requieren tu confirmación antes de la Fase 4
1. **RUTA A** (reutilizar campaña base de Nexus Brain) vs RUTA B.
2. Enum `lab_type = ('social','ooh','commercial')` + `DEFAULT 'social'`.
3. Listas de plataformas/formatos para OOH y Commercial (§2.4).
4. Bucket unificado: **`campaign_assets` primario + `visual-assets` formalizado como fallback** (§1.1).
5. ¿OK con quitar el `admin-only` del upload en OOH (`VirtualOOHLab.tsx:275`) para que cualquier usuario suba su video, como en Social/Commercial?
