# SMOKE_TEST — Paridad de Labs (guía manual en navegador)

> Rama `audit/parity-work`. App en `http://localhost:8081/` (o `npm run dev`).
> Cada fila: **[Qué tocar]** → **[Handler · file:line]** → **[Qué deberías ver]** → **[Qué significa si falla]**.

---

## ⚙️ Prerequisitos (leer antes de empezar)

- **(a)** Las 2 migraciones (`docs/APPLY_MIGRATIONS.sql`) deben estar **aplicadas ANTES** de probar **upload / Guardar / Deploy** en **OOH y Commercial** (necesitan el bucket `visual-assets` y la columna `campaigns.lab_type`).
- **(b)** **Social Lab debería funcionar incluso SIN las migraciones nuevas**, EXCEPTO el guardado: el `INSERT` ahora incluye `lab_type`, que sin la columna fallará. El upload de Social usa el bucket primario `campaign_assets` (ya existente), así que sube aunque `visual-assets` no exista.
- Necesitas: estar **logueado**, y tener **al menos una campaña en `nexus_youtube_ads`** (genera una en Nexus Brain si no la hay). Sin campaña base, los 3 labs muestran empty state (correcto).
- Para ver guiones reales generados por IA hace falta **GROQ_API_KEY** configurada (Token Manager o `.env`). Sin key, "Generar" mostrará un toast de error — eso es esperado, no es bug del lab.

---

## 🔴 LAB 1 — SOCIAL LAB · `/dashboard/social`  (TEST DE REGRESIÓN CRÍTICO)

> ⚠️ **Social Lab pasó de 1177 → ~600 líneas** (consume el motor compartido `useCampaignStudio('social')`).
> **Debe comportarse IDÉNTICO a antes del refactor.** Si algo aquí falla → es **REGRESIÓN del refactor, NO falta de migración**: **DETENTE y repórtalo** antes de seguir con OOH/Commercial.

| # | Qué tocar | Handler · file:line | Qué deberías ver (✅) | Si falla (❌) |
|---|---|---|---|---|
| 1a | Abrir `/dashboard/social?campaign={ID_REAL}` | fetch `useCampaignStudio` `useCampaignStudio.ts:56-80` (lee `nexus_youtube_ads`) | Carga la campaña: header "Neural Strategy Engine", sector, hook, narrativa, "Estrategia Creativa Procesada" | Regresión en el fetch/normalización del hook |
| 1b | Abrir `/dashboard/social` (sin `?campaign`) | mismo fetch (último registro del user) | Si tienes campañas: la última. Si no: empty state "Sin Campaña Activa" + botón "Ir al Nexus Brain" (`SocialLab.tsx:97,106`) | Empty state roto o crash |
| 2 | Click **10s / 30s / 60s** ("Generador de Guiones") | `generatePrompt(dur, platform)` `SocialLab.tsx:228` → `useCampaignStudio.ts:133` → `generateVideoPrompt(..., config.promptContext)` `:137-141` | Spinner en el botón → aparece el prompt con cabeceras HOOK/VOICEOVER/VISUAL/... Toast "Prompt de {dur} generado". **Contexto social = vertical 9:16** (`promptContext: ''`, `promptTemplates.ts:6` → comportamiento original) | Sin key Groq: toast de error (esperado). Otro error = regresión del generador |
| 3a | Click **"Copiar Prompt Maestro"** | `copyMaster` `SocialLab.tsx:370` → `useCampaignStudio.ts:122` → `buildMasterPrompt` | Toast "Prompt Maestro copiado". Pegar (Ctrl+V) = markdown con ## Hook/Voiceover/Visual/... | No copia / clipboard vacío |
| 3b | Hover en "Estrategia Creativa" + botón copiar / **"Copiar Visual"** | `copyVisual` / `copy` `useCampaignStudio.ts:127,116` | Toast "...copiado", portapapeles = `visual_description` | No copia |
| 4 | **Subir tu video** (dropzone "Sube tu video") | `CampaignUploader` `SocialLab.tsx:547` → `uploadFile` `useCampaignStudio.ts:175` → bucket **`campaign_assets`** `:185` (fallback `visual-assets` `:191`) → upsert `visual_assets` `:217` | "Subiendo…" → el video aparece en el mockup del teléfono y se reproduce. Toast de éxito | Error de permiso/bucket → revisar Storage. (Social usa `campaign_assets`, que ya existe) |
| 5 | **"Guardar Campaña"** → nombre + cliente → "Confirmar y Guardar" | `SaveCampaignButton` `SocialLab.tsx:144` → `saveCampaign` `useCampaignStudio.ts:268` → `INSERT campaigns {lab_type:'social'}` `:286-292` | Toast "Campaña guardada...". Modal se cierra | **Si error de columna `lab_type`** = falta migración (Bloque 2). Otro error = regresión |
| 7 | Ir a `/dashboard/campaigns` | `CampaignArchive` (query propia a `campaigns`) | La campaña aparece con su nombre/cliente/estado | No aparece → revisar RLS / `lab_type` |

> Nota: Social Lab **no tiene** botón Deploy propio (su flujo es "Nueva Campaña" → Nexus Brain, `SocialLab.tsx` botón inferior). El paso 6 (Deploy) aplica solo a OOH/Commercial.

---

## 🟠 LAB 2 — VIRTUAL OOH · `/dashboard/ooh`

> Requiere migraciones aplicadas para upload/guardar/deploy. Identidad: Viktor (naranja), gran formato espacial.

| # | Qué tocar | Handler · file:line | Qué deberías ver (✅) | Si falla (❌) |
|---|---|---|---|---|
| 1a | `/dashboard/ooh?campaign={ID}` | `useCampaignStudio('ooh')` `VirtualOOHLab.tsx:15` → fetch `useCampaignStudio.ts:56-80` | Header "Viktor S. · Spatial Architect", hook/narrativa, sector | Fetch roto |
| 1b | `/dashboard/ooh` sin campaña | mismo fetch | Empty state "Sin Campaña Activa" + "Ir al Nexus Brain" (`VirtualOOHLab.tsx:98,107`) | Empty state roto |
| 2 | Click **10s/30s/60s** | `onGenerate` `VirtualOOHLab.tsx:179` → `generatePrompt(dur, surface)` → `generateVideoPrompt(..., promptContext OOH)` | Prompt generado. **Contexto OOH = gran formato espacial** (lee `promptTemplates.ts:8`: "PUBLICIDAD EXTERIOR DIGITAL DE GRAN FORMATO... Times Square / Shibuya... NO dependas del audio"). Verifica que el texto refleje ese enfoque | Sin key Groq: toast error (esperado) |
| 2b | Cambiar **superficie** (Times Square / Shibuya / Piccadilly / Metaverse) | `SurfaceSelector` `VirtualOOHLab.tsx` (selector) → `surface` state | El `surface` elegido entra en el prompt (`== {surface} {dur} ==`) y en `plataforma` al guardar | Selector no cambia |
| 3 | **Copiar Prompt Maestro / Visual** | `onCopyMaster`/`onCopyVisual` `VirtualOOHLab.tsx:182` → `CampaignMasterPanel` → hook | Toast + portapapeles con el contenido | No copia |
| 4 | **Subir tu video** (dropzone) | `CampaignUploader` `VirtualOOHLab.tsx:256` → `uploadFile` `useCampaignStudio.ts:175` (prefix `ooh/`) | Video en el preview espacial (sin el viejo BigBuckBunny). Toast éxito | **Error bucket `visual-assets`** = falta Bloque 1 de migración |
| 5 | **"Guardar Campaña"** | `SaveCampaignButton` `VirtualOOHLab.tsx:203` → `saveCampaign` → `INSERT {lab_type:'ooh'}` `useCampaignStudio.ts:291` | Toast "Campaña guardada..." | Error `lab_type` = falta Bloque 2 |
| 6 | **`[ DEPLOY TO METAVERSE ]`** (habilitado solo con video subido) | `handleDeploy` `VirtualOOHLab.tsx:76,260` → `deployCampaign(surface)` `useCampaignStudio.ts:309` → `INSERT campaigns {estado:'activa', lab_type:'ooh'}` `:316-321` | Toast "Campaña desplegada y registrada como activa". **NO distribuye a redes externas/Metaverso real** — solo persiste una fila `campaigns` con `estado:'activa'** | Botón deshabilitado si no hay video (esperado). Error = revisar migración/RLS |
| 7 | `/dashboard/campaigns` | `CampaignArchive` | Aparecen las campañas OOH guardadas/desplegadas | No aparece |

---

## 🟢 LAB 3 — COMMERCIAL LAB · `/dashboard/commercial-lab`

> Requiere migraciones. Identidad: Commercial Studio (Film, emerald), cinematic HDR 16:9 + audio espacial.

| # | Qué tocar | Handler · file:line | Qué deberías ver (✅) | Si falla (❌) |
|---|---|---|---|---|
| 1a | `/dashboard/commercial-lab?campaign={ID}` | `useCampaignStudio('commercial')` `CommercialLab.tsx:13` → fetch `useCampaignStudio.ts:56-80` | Header "Commercial Studio", Cinematic Hook, narrativa | Fetch roto |
| 1b | `/dashboard/commercial-lab` sin campaña | mismo fetch | Empty state "Sin Campaña Activa" + "Ir al Nexus Brain" (`CommercialLab.tsx:47,56`) | Empty state roto |
| 2 | Click **10s/30s/60s** | `onGenerate` `CommercialLab.tsx:120` → `generatePrompt(dur, surface)` → `generateVideoPrompt(..., promptContext commercial)` | Prompt generado. **Contexto commercial = cinematic HDR 16:9 + audio espacial** (lee `promptTemplates.ts:14-15`: "ACTIVO CINEMATOGRÁFICO... 16:9, HDR... AUDIO ESPACIAL 5.1/Atmos"). Verifica que aparezca color HDR / audio espacial | Sin key Groq: toast error (esperado) |
| 2b | Cambiar **canal** (Streaming/OTT, Connected TV, Cinema/DOOH, YT Masthead) | `SurfaceSelector` `CommercialLab.tsx` | El canal entra en el prompt y en `plataforma` | Selector no cambia |
| 3 | **Copiar Prompt Maestro / Visual** | `onCopyMaster`/`onCopyVisual` `CommercialLab.tsx:123` → `CampaignMasterPanel` → hook | Toast + portapapeles | No copia |
| 4 | **Subir tu video** | `CampaignUploader` `CommercialLab.tsx:200` → `uploadFile` (prefix `commercial/`) | Video en el preview cinematográfico. Toast éxito | Error bucket = falta Bloque 1 |
| 5 | **"Guardar Campaña"** | `SaveCampaignButton` `CommercialLab.tsx:92` → `saveCampaign` → `INSERT {lab_type:'commercial'}` | Toast éxito | Error `lab_type` = falta Bloque 2 |
| 6 | **`[ DEPLOY TO NETWORKS ]`** (habilitado solo con video) | `handleDeploy` `CommercialLab.tsx:25,204` → `deployCampaign(surface)` `useCampaignStudio.ts:309` → `INSERT {estado:'activa', lab_type:'commercial'}` | Toast "Campaña desplegada...". **NO distribuye a redes/CTV reales** — solo persiste `estado:'activa'` | Deshabilitado sin video (esperado). Error = migración/RLS |
| 7 | `/dashboard/campaigns` | `CampaignArchive` | Aparecen las campañas Commercial | No aparece |

---

## 📊 Verificación cruzada de `lab_type` (tras pasos 5/6 de los 3 labs)

Tras guardar/desplegar en los 3 labs, corre en el SQL Editor:
```sql
SELECT lab_type, estado, count(*) FROM public.campaigns
WHERE user_id = auth.uid()  -- o tu user_id
GROUP BY lab_type, estado ORDER BY lab_type;
```
Esperado: filas con `lab_type` = `social`, `ooh`, `commercial` según lo que probaste, y `estado` = `draft` (Guardar) o `activa` (Deploy). Esto confirma el filtrado por lab (`useCampaignHistory(labType)` → `.eq('lab_type', labType)`).

---

## 🧭 Interpretación rápida de fallos

| Síntoma | Causa probable | Acción |
|---|---|---|
| Social Lab falla en pasos 1-4 | **Regresión del refactor** | **DETENER** y reportar (no es migración) |
| "column lab_type does not exist" al Guardar | Falta Bloque 2 de migración | Aplicar `APPLY_MIGRATIONS.sql` |
| Error de bucket al subir en OOH/Commercial | Falta Bloque 1 (bucket `visual-assets`) | Aplicar `APPLY_MIGRATIONS.sql` |
| "Generar" da toast de error | Falta `GROQ_API_KEY` | Configurar key (no es bug del lab) |
| Deploy deshabilitado | No has subido video aún | Subir activo primero (comportamiento intencional) |
