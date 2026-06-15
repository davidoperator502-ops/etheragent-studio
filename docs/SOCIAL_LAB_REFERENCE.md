# SOCIAL_LAB_REFERENCE — Disección técnica (referencia de paridad)

> **Fase 2.** Documento de implementación de `SocialLab` para poder replicarlo en Virtual OOH y Commercial Lab.
> Archivo principal: `src/components/dashboard/SocialLab.tsx` (1177 líneas).
> Generado 2026-06-15. Solo lectura — no se modificó código.

---

## 0. Visión de 30 segundos

```
NexusBrain (ingesta URL)
   └─ edge fn `nexus-brain` (Gemini/Groq)  →  nexus_youtube_ads.campaign_data (JSONB)
        └─ redirect → /dashboard/social?campaign={id}
              └─ SocialLab.useEffect → fetch nexus_youtube_ads → setCampaign + store.setWorkspace
                    ├─ Render del "Neural Strategy Engine" (hook, narrativa, visual, tono, pacing, audio, CTA)
                    ├─ [Generar 10s/30s/60s] → groqService.generateVideoPrompt() → Groq llama-3.3-70b
                    │       └─ INSERT campaign_assets (tipo='video_prompt')
                    ├─ [Sube tu video] → Storage(campaign_assets) → upsert visual_assets → store.setSelectedVideo
                    └─ [Guardar Campaña] → (opcional INSERT clients) → INSERT campaigns (RLS auth.uid)
```

**Punto clave:** SocialLab **NO genera la campaña base** — esa la produce Nexus Brain y la deja en `nexus_youtube_ads.campaign_data`. SocialLab **lee** esa campaña y, sobre ella, **genera guiones de video on-demand** (Groq), permite **subir el video propio** y **archivar la campaña** en la tabla `campaigns`.

---

## 1. Pipeline de generación de prompts

### 1.1 Carga de la campaña base (no es generación; es fetch)
`SocialLab.tsx:279-307` — `useEffect` que lee de `nexus_youtube_ads`:
- Si hay `?campaign={id}` → `.from('nexus_youtube_ads').select('*').eq('id', campaignId).single()` (`286`).
- Si no → último registro del usuario (`.eq('user_id', user.id).order('created_at', desc).limit(1).single()`) (`290`).
- Resultado → `setCampaign(data)` y `setWorkspace(data.campaign_data)` (Zustand, para otros módulos) (`296-298`).
- Sin campaña → empty state con CTA "Ir al Nexus Brain" (`508-528`).

### 1.2 Shape de `campaign_data` (lo que produce Nexus Brain)
Tipado en `SocialLab.tsx:38-48` (`CampaignDataPayload = CampaignWorkspace & {…}`).
Base `CampaignWorkspace` (`geminiService.ts:5-12`):
```ts
{ mission_id, hook, narrative_body, on_screen_text[], call_to_action, visual_description }
```
Campos extra que puede traer (`SocialLab.tsx:39-47`): `detected_sector`, `strategy_score`, `angles[]`, `creative_rationale`, `assets[]`, `audience`, `youtube_seo`, `thumbnail_idea`, `video_url`.

### 1.3 Normalización a `currentAsset` (modelo único de UI)
Dos formatos soportados (`SocialLab.tsx:309-336`):
- **Nuevo formato B2B** (`isNewFormat = !!campaignData?.hook`, `311`): se sintetiza un asset desde los campos top-level (`baseAsset`, `314-328`). Notas:
  - `voiceover_script` reutiliza `narrative_body` (`322`).
  - `music_background`, `sound_effects`, `emotional_tone`, `pacing_notes` tienen **valores por defecto fijos** ("Ambient Tech / Corporate Modern", etc., `323-326`) — no vienen de IA.
- **Formato legacy**: usa `campaignData.assets[activeAssetIndex]` (`329`).
- `currentAsset` aplica override del video subido desde el store (`selectedVideo`, `332-336`).

Interfaz canónica `CampaignAsset` (`SocialLab.tsx:21-36`) — **este es el modelo reutilizable** entre labs:
```ts
type, duration, hook, narrative_body?, voiceover_script, visual_description,
on_screen_text[], music_background, sound_effects, call_to_action,
emotional_tone, pacing_notes, video_url?, thumbnail_url?
```

### 1.4 Generación de guiones (la llamada real al motor)
**Disparador:** botones de duración → `handleGeneratePrompt(duration)` (`SocialLab.tsx:162-188`).
**Motor:** `generateVideoPrompt(duration, platform, context)` (`groqService.ts:71-160`).

**Request** (`groqService.ts:130-150`):
```
POST https://api.groq.com/openai/v1/chat/completions
Authorization: Bearer <tokens.groq || VITE_GROQ_API_KEY>     // groqService.ts:72-73
{
  model: "llama-3.3-70b-versatile",
  messages: [
    { role: "system", content: "Eres un Video Prompt Engineer experto…" },   // :141
    { role: "user",   content: promptTemplate }                               // :145
  ],
  temperature: 0.7
}
```
`context` que envía SocialLab (`SocialLab.tsx:166-170`): `{ hook, narrative_body, call_to_action }` del `currentAsset`.
`promptTemplate` (`groqService.ts:88-127`) inyecta hook/narrativa/CTA + reglas de duración y **exige una estructura textual fija**.

**Response:** texto plano (NO JSON) en `data.choices[0].message.content.trim()` (`groqService.ts:155`), con esta plantilla (`groqService.ts:102-127`):
```
== {platform} {duration} ==
HOOK: …
VOICEOVER: …
VISUAL DESCRIPTION: (escenas numeradas con rangos de tiempo)
TEXT ON SCREEN: (timestamps + emojis)
MUSIC & AUDIO: (BPM, mood, justificación)
SFX: (timestamps)
CTA: …
PACING: (cortes, transiciones, beat-sync)
```
Se guarda en estado `generatedPrompts[duration]` (`SocialLab.tsx:171`) y, si hay campaña, se persiste como fila en `campaign_assets` (`tipo:'video_prompt'`, `duracion`, `contenido`) (`SocialLab.tsx:175-180`).

> Nota: existe además `generateCampaign(url, command)` en `groqService.ts:14-69` (devuelve JSON `CampaignMatrix`), usado por el flujo de ingesta (Gemini con fallback Groq, `geminiService.ts:25-65`). **SocialLab solo usa `generateVideoPrompt`.**

### 1.5 Mapeo campo → UI
| Campo lógico | Origen en `currentAsset` | Render (file:line) |
|---|---|---|
| Gancho de alto impacto | `hook` | `SocialLab.tsx:596-601` (blockquote) |
| Narrativa de campaña | `narrative_body` | `604-607` |
| Estrategia creativa / prompt maestro (visual) | `visual_description` | `623-639` (+ botón copiar `628-634`) |
| Tono emocional | `emotional_tone` | `811-813` |
| Pacing / ritmo | `pacing_notes` | `815-817` |
| CTA | `call_to_action` | `819-821` |
| Background audio | `music_background` | `825-827` |
| Textos destacados | `on_screen_text[]` | `829-837` (pills) |
| Guiones generados 10/30/60 | `generatedPrompts` | `692-707` (`HighlightedPrompt`, `128-145`) |
| Sector / score | `detected_sector`, `strategy_score` | header `548-551` |
| Audience persona | `data.audience` | `856-868` |
| YouTube SEO | `data.youtube_seo` | `1070-1081` |

**Prompt Maestro** (botón "Copiar Prompt Maestro") = ensamblado en cliente por `buildMasterPrompt(asset)` (`SocialLab.tsx:78-110`): markdown con Hook/Voiceover/Visual/Textos/Música/SFX/CTA/Tono/Pacing. → copiado vía `handleCopyMaster` (`343-347`) → `handleCopy` (`338-341`, `navigator.clipboard.writeText`).

---

## 2. Generador de guiones 10s / 30s / 60s

| Pieza | Ubicación |
|---|---|
| UI (3 botones + export + render) | `SocialLab.tsx:641-708` |
| Handler | `handleGeneratePrompt('10s'\|'30s'\|'60s')` `SocialLab.tsx:162-188` |
| Constante de duraciones | `DURATIONS` `SocialLab.tsx:120-124` (`{id, scenes}`) |
| Lógica de motor + parametrización | `groqService.ts:71-160` |
| Estado de carga por botón | `generatingDuration` `SocialLab.tsx:159,666,681-686` |
| Export a `.txt` | `handleExportPrompts` `SocialLab.tsx:190-201` |

**Parametrización de la duración** (`groqService.ts:79-86`): cada duración define `instructions` distintas (10s ≈ 5 escenas rápidas; 30s ≈ 8-10 escenas; 60s ≈ 12-15 escenas, story-telling). Se inyecta en `promptTemplate` (`:97`) con la nota clave "30s/60s NO son el de 10s estirado" (`:98`). Devuelve **string** (no JSON).

---

## 3. Flujo "Sube tu video" + "Guardar Campaña"

### 3.1 Upload — `uploadVideo(file)` (`SocialLab.tsx:349-444`)
- **Dropzone/UI**: `1023-1068` (drag&drop + `fileInputRef`), acepta `mp4/webm/quicktime/jpeg/png/webp` (`1040`).
- **Path**: `social/{campaign.id}/{safeType}_{timestamp}_{safeName}` (`357`).
- **Bucket primario**: `supabase.storage.from('campaign_assets').upload(...)` (`360-362`).
- **Fallback**: si el error menciona "bucket"/"not found" → `supabase.storage.from('visual-assets')` con path legacy (`365-377`). ⚠️ Este fallback depende de un bucket (`visual-assets`) **no creado por migración** (ver AUDIT §5.3).
- **publicUrl** vía `getPublicUrl` (`377`/`382`).
- **Persistencia en tabla** `visual_assets.upsert({...})` (`397-409`): `id` (= `social_{campaign.id}_{safeType}_{timestamp}`, `386`), `url`, `user_id`, `campaign_id`, `file_name/type/size`, `asset_type:'uploaded'`, `thumbnail_url`, `bucket_path`, `updated_at`.
- **Puente a Zustand**: `setSelectedVideo(meta)` (`412`) → el mockup del teléfono renderiza el video al instante (`currentAsset.video_url`, `332-336`).
- **Eco a la campaña**: `update nexus_youtube_ads.campaign_data.video_url` (`415-428`); si RLS bloquea, continúa con `console.warn` sin romper (`430-431`).
- **Estados**: `uploading` (`351/442`), toasts de éxito/error (`436-440`).

### 3.2 Guardar Campaña — `handleSaveArchive()` (`SocialLab.tsx:218-259`)
- **Trigger**: botón "Guardar Campaña" (`562-567`) abre modal (`isSaveModalOpen`, `204`); modal en `1100-1173`.
- **Carga de clientes** al abrir: `fetchClients()` (`212-216`, `useEffect 261-263`) → `.from('clients').select('*').eq('user_id', user.id)`.
- **Validación**: nombre de campaña requerido (`220`).
- **Cliente nuevo** (opcional): si `selectedClientId==='new'` → genera slug y hace `INSERT clients` (`227-238`).
- **INSERT principal** (`241-248`):
```ts
supabase.from('campaigns').insert({
  user_id: user.id,
  client_id: finalClientId,
  nombre: campaignName,
  plataforma: platform,                 // ← aquí se "etiqueta" (hoy = plataforma social)
  estado: 'draft',
  contenido: { ...campaign.campaign_data, assets: currentAsset ? [currentAsset] : [] }
})
```
- **Estados**: `savingCampaign` (`210/222/257`), toasts (`252-255`).

### 3.3 Asociación al usuario / RLS
Tabla `campaigns` (`20260613000000_clients_and_campaigns.sql:34-44`) con RLS:
- Policy `FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)` (`49-54`).
- Policy pública de lectura (para portal `/c/:slug`): `FOR SELECT TO public USING (true)` (`56-60`).
- `clients` y `campaign_assets` con RLS análogo (`17-31`, `72-96`; assets via EXISTS sobre la campaña del usuario `79-90`).

### 3.4 Reconstrucción de una campaña guardada
- Hook `useCampaignHistory()` (`src/hooks/useCampaignHistory.ts:18-67`): `.from('campaigns').select('*').order('created_at', desc)` — **RLS filtra automáticamente** por usuario (`35-38`); además suscripción realtime al canal `public:campaigns` (`55-59`).
- UI de listado: `src/components/CampaignArchive.tsx` (ruta `/dashboard/campaigns`).
- ⚠️ **Inconsistencia latente** a tener en cuenta al replicar: `CampaignRecord` en `useCampaignHistory.ts:5-16` declara `title/target_url/status/budget_allocated/metrics`, pero la tabla real expone `nombre/plataforma/estado/contenido`. La recuperación funciona (select *), pero el tipado no coincide con el esquema. No romper, pero conviene alinearlo.

---

## 4. Genérico/reutilizable vs específico de Social

### 4.1 GENÉRICO → candidato a motor compartido (Fase 3)
| Pieza | Ubicación | Por qué es genérico |
|---|---|---|
| Modelo `CampaignAsset` | `SocialLab.tsx:21-36` | Estructura neutra de campaña |
| `generateVideoPrompt()` | `groqService.ts:71-160` | Acepta `platform` y `context` arbitrarios; el "platform" es solo un string en el template |
| `buildMasterPrompt()` | `SocialLab.tsx:78-110` | Ensamblado puro de texto, sin nada social |
| `handleCopy()` / `handleCopyMaster()` | `SocialLab.tsx:338-347` | Clipboard genérico |
| `uploadVideo()` + dropzone | `SocialLab.tsx:349-468, 1023-1068` | Storage + `visual_assets`, agnóstico del lab |
| `handleSaveArchive()` + modal | `SocialLab.tsx:218-259, 1100-1173` | INSERT en `campaigns`; hoy fija `plataforma`, mañana añadiría `lab_type` |
| Generador de guiones (UI 3 botones + export) | `SocialLab.tsx:641-708` | Solo depende de `currentAsset` + `platform` |
| `DURATIONS` | `SocialLab.tsx:120-124` | Constante neutra |
| `HighlightedPrompt` | `SocialLab.tsx:128-145` | Render de texto |
| Carga de campaña (fetch + normalización) | `SocialLab.tsx:279-336` | Reutilizable cambiando la fuente |
| Zustand `useCampaignStore` | `store/useCampaignStore.ts` | Ya compartido |

### 4.2 ESPECÍFICO de Social → NO trasladar tal cual
| Pieza | Ubicación | Especificidad |
|---|---|---|
| `PLATFORMS` (IG/TikTok/YT/LinkedIn/X) | `SocialLab.tsx:112-118` | Redes sociales |
| Selector de formato `reel/feed/story` | `SocialLab.tsx:922-941` | Solo Instagram |
| `mediaType`/`platform`/`videoFormat` state | `SocialLab.tsx:269-271` | Ejes sociales |
| Componentes de preview | `previews/PlatformPreviews.tsx` (7 previews) | Mockups exactos por red |
| Render condicional de overlays | `SocialLab.tsx:993-1004` | Mapea plataforma→preview |
| Mockup tipo teléfono 9:16 + dynamic island | `SocialLab.tsx:943-1021` | Formato vertical móvil |
| Sección YouTube SEO | `SocialLab.tsx:1070-1081` | Específico YT |

### 4.3 Implicación para la paridad
El motor compartido debe exponer: **carga de campaña → normalización a `CampaignAsset` → generador de guiones (Groq) → upload → guardado (`campaigns` + `lab_type`)**, dejando como *slots* parametrizables: (a) la lista de "plataformas/formatos", (b) el componente de preview, y (c) la **adaptación contextual del `promptTemplate`** (social vertical 9:16 vs OOH gran formato espacial vs commercial cinematic HDR 16:9). Eso es exactamente lo que detallará el `PARITY_PLAN.md`.

---

### Anexo — Referencias rápidas (file:line)
- Motor de guiones: `src/lib/groqService.ts:71-160` (parametrización `79-86`, template `88-127`, request `130-150`)
- Disparo + persistencia guion: `SocialLab.tsx:162-188`
- Prompt maestro (cliente): `SocialLab.tsx:78-110` / copiar `343-347`
- Upload: `SocialLab.tsx:349-444` (bucket `360-377`, tabla `397-409`)
- Guardar campaña: `SocialLab.tsx:218-259` (INSERT `241-248`) + modal `1100-1173`
- Tabla/RLS campaigns: `supabase/migrations/20260613000000_clients_and_campaigns.sql:34-60`
- Reconstrucción: `src/hooks/useCampaignHistory.ts:18-67`, `src/components/CampaignArchive.tsx`
- Shape base: `src/lib/geminiService.ts:5-12`
