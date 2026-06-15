# AUDIT_REPORT — EtherAgent Studio (ETHEROS)

> **Fase 1 — Auditoría de solo lectura.** Generado el 2026-06-15.
> Stack: Vite + React 18 + TypeScript + TailwindCSS + Supabase (DB/Auth/Storage/Edge Functions). Build con `tsc -b && vite build`. Deploy en Vercel.
> Gestor real en uso: **npm** (existe `package-lock.json` actualizado; hay `bun.lockb` pero los scripts y CI usan npm).

---

## 1. Mapa del repositorio (resumido)

### `src/`
```
src/
├─ App.tsx                      # Router raíz (BrowserRouter, rutas top-level)
├─ main.tsx
├─ pages/
│  ├─ Index.tsx                 # Layout dashboard + sub-rutas /dashboard/*
│  ├─ Landing.tsx  Login.tsx  NotFound.tsx
│  ├─ ClientPortal.tsx          # Portal público /c/:slug
│  ├─ PreviewGallery.tsx (solo DEV)  Prototypes.tsx
├─ components/
│  ├─ dashboard/
│  │  ├─ SocialLab.tsx          # ★ Lab de referencia (motor completo)
│  │  ├─ VirtualOOHLab.tsx      # Lab OOH (incompleto)
│  │  ├─ CommercialLab.tsx      # Lab Commercial (incompleto)
│  │  ├─ PerformanceAdsLab.tsx  SonicLab.tsx  StudioLab.tsx
│  │  ├─ NexusBrain.tsx  NexusDashboard.tsx  NexusIntelligence.tsx
│  │  ├─ ExecutiveDemo.tsx (Task Replay)  SubscriptionPlans.tsx
│  │  ├─ TokenTelemetry.tsx     # ⚠ Widget con bug NaN%
│  │  ├─ previews/PlatformPreviews.tsx   # 7 previews de plataforma social
│  │  ├─ publisher/OmniPublisher.tsx  (admin)
│  │  └─ nodes/ (React Flow nodes)
│  ├─ layout/  (SpatialSidebar = menú THE LABS, MobileTabBar, OmniAgentOrb)
│  ├─ ui/      (shadcn/ui ~50 componentes)
│  ├─ wireframes/  CampaignArchive.tsx  AITokenManager.tsx
├─ hooks/      (useTokenBalance, useCampaignHistory, useOOHMetrics, useSocialMetrics, …)
├─ lib/        (geminiService.ts, groqService.ts, supabaseClient.ts, aiCache.ts)
├─ services/   (api.ts, emailApi.ts, pdfExport.ts, mockData.tsx)
├─ store/      (Zustand: useCampaignStore, useTokenStore, useRenderStore, …)
├─ context(s)/ (AuthContext, GlobalVoiceContext)
├─ constants/  types/  test/
```

### `supabase/`
```
supabase/
├─ schema.sql                   # Esquema consolidado (tablas + buckets + RLS)
├─ migrations/                  # 18 migraciones (4 SIN timestamp → riesgo de orden)
├─ functions/
│  ├─ nexus-brain/              # Análisis URL → campaña (Gemini/Groq)
│  ├─ marcus-orchestrator/      # Orquestador de agentes (Groq)
│  ├─ webhook-scrape/           # Webhook scraper → campaigns (Groq)
│  ├─ push-notifier/            # Notificaciones al pasar a 'deployed'
│  ├─ add-monetization-columns/ # ALTER TABLE utilitario
│  └─ _shared/ (apiKeyValidator.ts, rateLimiter.ts)
```

### `api/` (Vercel Serverless Functions — Node)
```
api/ generate.ts  render.ts  scrape.ts  agent.ts
     agents/  analyze/  auth/  avatars/  flows/  templates/
     publish/omnichannel.ts   webhooks/paypal.ts
```

### `scripts/`
```
scripts/ check_db.mjs  check_existing.mjs  check_storage.mjs  sync_db.mjs
         migrations/upload_tr_audios.mjs   tests/{test-admin-login.mjs, test-gemini.js}
```

---

## 2. Stack y dependencias

| Área | Detalle |
|---|---|
| Build | `vite ^5.4.19`, `@vitejs/plugin-react-swc`, salida `tsc -b && vite build` |
| Framework | `react ^18.3.1`, `react-router-dom ^6.30.1` (lazy + Suspense) |
| Estilos | `tailwindcss ^3.4.17`, `tailwindcss-animate`, shadcn/ui (Radix) |
| Estado | `zustand ^5`, `@tanstack/react-query ^5` |
| Backend SDK | `@supabase/supabase-js ^2.99`, `@supabase/ssr ^0.8` |
| IA | `@google/genai ^1.0`, `@google/generative-ai ^0.24.1`, `groq-sdk ^0.37` |
| Pagos | `stripe ^20.3`, `@paypal/react-paypal-js ^9` |
| Video | `remotion`/`@remotion/player ^4.0.475` |
| Tests | `vitest ^3.2.4`, Testing Library |

**Scripts disponibles:** `dev` (vite :8080), `dev:api` (vercel dev :3000), `build`, `build:dev`, `lint`, `preview`, `test` (`vitest run`), `test:watch`.

**Observaciones de dependencias:**
- ⚠️ **Duplicación de SDK de Google**: coexisten `@google/genai` y `@google/generative-ai`. Conviene unificar.
- ⚠️ Coexisten `bun.lockb` y `package-lock.json`. Definir un único gestor (recomendado: npm, que ya está al día).
- `pg` + `postgres` (dos clientes Postgres) — solo usados por scripts; revisar si ambos hacen falta.
- Browserslist desactualizado (warning de build): "browsers data is 12 months old".

---

## 3. Rutas y módulos

Rutas top-level en `src/App.tsx`; sub-rutas en `src/pages/Index.tsx:219-246`. **Todas las sub-rutas envueltas en `<ProtectedRoute>`.**

| Ruta | Componente | Sidebar "THE LABS" | Estado |
|---|---|---|---|
| `/` | `Landing` | — | ✅ Funcional |
| `/login` | `Login` | — | ✅ Funcional |
| `/c/:slug` | `ClientPortal` | — | ✅ Portal público de cliente |
| `/dashboard` | `EtherAgentWelcome` | Hub | ✅ Landing del OS |
| `/dashboard/nexus-brain` | `NexusBrain` | **Nexus Brain** | ✅ Punto único de ingestión (Gemini/Groq) |
| `/dashboard/nexus` | `NexusDashboard` | — | ✅ Funcional |
| `/dashboard/social` | `SocialLab` | **Social Lab** | ✅ **Funcional completo (referencia)** |
| `/dashboard/ooh` | `VirtualOOHLab` | **Virtual OOH** | ⚠️ Parcial (sin motor, guardar=mock) |
| `/dashboard/commercial-lab` | `CommercialLab` | **Commercial Lab** | ⚠️ Parcial (sin motor, guardar=mock) |
| `/dashboard/executive-demo` | `ExecutiveDemo` | **Task Replay** | ✅ Demo animado funcional |
| `/dashboard/subscription` | `SubscriptionPlans` | **Subscription** (Premium) | ✅ Funcional |
| `/dashboard/campaigns` | `CampaignArchive` | — | ✅ Listado de campañas |
| `/dashboard/ads` | `PerformanceAdsLab` | — | ⚠️ Parcial |
| `/dashboard/community` | `CommunityLab` | (admin) | 🔒 Solo admin |
| `/dashboard/publisher` | `OmniPublisher` | Omnichannel (admin) | 🔒 Solo admin |
| `/dashboard/visual-matrix` | `VisualAssetMatrix` | Visual Matrix (admin) | 🔒 Solo admin |
| `/dashboard/{spaces,engine,intelligence,influencers,broadcaster,templates,telemetry,pricing,deployment,exchange,sonic,studio-lab}` | varios | — | Mixto (legacy/secundarios) |

> Nota: el `navItems` en `Index.tsx:60-64` es legacy (solo Hub/Nexus/Social); el menú real visible es **`SpatialSidebar.tsx:12-18`** (Nexus Brain, Social Lab, Virtual OOH, Commercial Lab, Task Replay + Subscription).

---

## 4. Análisis por módulo (lab)

### 4.1 Nexus Brain — `NexusBrain.tsx`  ✅ FUNCIONAL
- **Servicios**: invoca la edge function `nexus-brain` (`NexusBrain.tsx:357`), que llama a **Gemini** (`gemini-1.5-flash`) con fallback a **Groq** (`llama-3.3-70b-versatile`).
- **Persistencia**: escribe en `nexus_youtube_ads` (`campaign_data` JSONB) y redirige a `SocialLab?campaign={id}`.
- **Veredicto**: Funcional. Es el punto único de ingestión (según `CONTEXT.md`).

### 4.2 Social Lab — `SocialLab.tsx`  ✅ FUNCIONAL COMPLETO (REFERENCIA)
- **Motor de prompts**: `handleGeneratePrompt()` (`SocialLab.tsx:162-188`) → `groqService.generateVideoPrompt(duration, platform, context)` (`groqService.ts:71-160`), Groq `llama-3.3-70b-versatile`.
- **Guiones 10s/30s/60s**: parametrizados en `groqService.ts:80-86`; UI en `SocialLab.tsx:641-708`. **Funcional.**
- **Campos mapeados a UI**: hook (599), narrativa (604), estrategia visual/prompt maestro (636), tono emocional (812), pacing (816), background audio (826), textos destacados/on_screen_text (832), CTA (820).
- **Upload de video**: dropzone (`1024-1068`) → `supabase.storage.from('campaign_assets')` con fallback `'visual-assets'` (`349-444`); registra en `visual_assets` (`397-409`).
- **Guardar Campaña**: modal (`1100-1173`) → `handleSaveArchive()` (`218-259`) → `INSERT` real en tabla `campaigns`. **Funcional.**
- **Botones**: 14/14 funcionales (Copiar Prompt Maestro `847`, Copiar Visual `850`, Subir Activo `1028`, Generar 10/30/60s, Exportar `654`, Guardar Campaña `562`, Nueva Campaña→nexus-brain `1083`).
- **Veredicto**: Funcional completo. (Disección a fondo en Fase 2.)

### 4.3 Virtual OOH Lab — `VirtualOOHLab.tsx`  ⚠️ PARCIAL
- **Motor de prompts**: ❌ Ausente. No importa `groqService`/`geminiService`. Solo muestra `campaignData.hook`/`narrative_body` (estático/narrativo, `70-76`, `217-220`).
- **Guiones 10/30/60s**: ❌ Ausente.
- **Selector plataforma/formato**: ❌ Ausente (hardcodeado a "Spatial Preview").
- **Preview**: ✅ Funcional (mockup `286-372`).
- **Upload de video**: ✅ Funcional → bucket `'visual-assets'` + tabla `visual_assets` (`129-154`), pero **restringido a admin** (`275`: `user.email === 'davicho4522@gmail.com'`).
- **Guardar Campaña**: ❌ Mock. Botón "Crear Campaña Premium" (`376-395`) solo navega a subscription o hace `console.log("Iniciando creación de campaña OOH...")` (`380`). No persiste.
- **Botón "[ DEPLOY TO METAVERSE ]"** (`399`): ❌ Sin `onClick` (placeholder visual).
- **"Encender Valla"** (`260`/`handleCompile` `156-169`): animación demo (chat de "Viktor"), no genera nada real.
- **Veredicto**: Parcial / UI decorativa. Upload de assets real; resto mock/ausente.

### 4.4 Commercial Lab — `CommercialLab.tsx`  ⚠️ PARCIAL
- **Motor de prompts**: ❌ Ausente. Solo muestra `creative_rationale`/`hook` si existen (`145-157`, `170-182`).
- **Guiones 10/30/60s**: ❌ Ausente.
- **Selector plataforma/formato**: ❌ Ausente.
- **Preview**: ✅ Funcional (`211-267`).
- **Upload de video**: ✅ Funcional → bucket `'visual-assets'` + `visual_assets` (`83-108`). Sin restricción de admin.
- **Guardar Campaña**: ❌ Mock. "Crear Campaña Premium" (`271-289`) solo valida tokens/navega. No persiste.
- **Botón "[ DEPLOY TO NETWORKS ]"** (`293`): ❌ Sin función real.
- **Veredicto**: Parcial. Mismo patrón que OOH.

### 4.5 Otros
- **Task Replay / ExecutiveDemo**: ✅ Demo guiado funcional.
- **PerformanceAdsLab (Kaelen)**: ⚠️ Parcial (UI + voz, sin pipeline de guardado equivalente).
- **Subscription**: ✅ Funcional.

---

## 5. Supabase

### 5.1 Tablas (columnas clave)
| Tabla | Columnas clave | Origen |
|---|---|---|
| `profiles` | id, email, role, subscription_tier, `compute_tokens`, `total_tokens`, `plan_name` | schema.sql + add_compute_tokens.sql |
| **`campaigns`** | id, **user_id**, **client_id**, `nombre`, **`plataforma`** (TEXT libre), `estado` (draft/activa/archivada), **`contenido`** (JSONB), source_url, brand_context, scraping_status | `20260613000000_clients_and_campaigns.sql:34-44` + add_scraping_fields |
| `clients` | id, user_id, nombre, `slug` (UNIQUE), logo_url, brand_colors, notas | `20260613000000:4-14` |
| `campaign_assets` | id, campaign_id, `tipo` (video_prompt/visual/copy), `duracion`, `contenido`, created_at | `20260613000000:63-70` |
| `nexus_youtube_ads` | id, user_id, target_url, detected_sector, strategy_score, **`campaign_data`** (JSONB) | `20260608000001` |
| `visual_assets` | id, url, user_id, campaign_id, file_name/type/size, **`asset_type`** (uploaded/ai_generated), `bucket_path`, thumbnail_url, width/height/duration | `20260611000000_cms_assets_table.sql` |
| `render_jobs` | id, user_id, avatar_id, script, platform, status, `video_url`, metadata | schema.sql:85-96 |
| otras | avatars, templates, presets, analysis_history, chat_messages, user_usage, agents, agent_* | varias |

> **Para la paridad de labs**: existe `campaigns` con columna `plataforma` (TEXT libre) pero **NO existe una columna `lab_type`** que distinga `social`/`ooh`/`commercial` formalmente. `visual_assets.asset_type` ya distingue "uploaded" vs "ai_generated".

### 5.2 RLS
- RLS **activado** en todas las tablas de usuario, restringidas por `auth.uid() = user_id` (campaigns, clients, nexus_youtube_ads, render_jobs, analysis_history, chat_messages, user_usage, presets, agent_*).
- `campaign_assets` restringida indirectamente (EXISTS sobre campaña del usuario).
- Tablas de catálogo (avatars, templates, system_flows, agents) → `SELECT` público por `is_active=true`.
- ⚠️ **`visual_assets` tiene `SELECT` público** (`USING (true)`, `20260611000000:39-41`) → cualquiera puede listar URLs de assets. Severidad media.

### 5.3 Storage buckets
| Bucket | Definido en | Lectura | Límite | MIME |
|---|---|---|---|---|
| `campaign-videos` | schema.sql:249-257 | pública | 50MB | video/mp4, webm, quicktime |
| `campaign_assets` | 20260611000000:59-93 | pública | 100MB | video/* + image/* |
| **`visual-assets`** | ❌ **NO** en migraciones | usado en código (OOH, Commercial, Social fallback, StudioLab, VisualAssetMatrix) | ? | ? |

> ⚠️ **`visual-assets` se referencia en el frontend pero NO está creado por migración** → riesgo de fallo de upload si el bucket no existe en el proyecto. Social Lab usa `campaign_assets` (con fallback a `visual-assets`); OOH y Commercial usan **solo** `visual-assets`.

### 5.4 Edge Functions
| Función | Qué hace | API externa |
|---|---|---|
| `nexus-brain` | URL → campaña estructurada (sector, score, hook, narrativa, visual, CTA) | **Gemini** `gemini-1.5-flash` + fallback **Groq** `llama-3.3-70b-versatile` |
| `marcus-orchestrator` | Clasifica intención y decide agentes a activar; loguea en `analysis_history` | **Groq** |
| `webhook-scrape` | Recibe scrape (Apify/Firecrawl) → genera escenas y actualiza `campaigns` | **Groq** |
| `push-notifier` | Dispara notificación al pasar campaña a `deployed` | Ninguna (stub; OneSignal/SendGrid comentados) |
| `add-monetization-columns` | `ALTER TABLE profiles` (plan_name, compute_tokens) | Ninguna |
| `_shared/apiKeyValidator.ts` | Valida GROQ/GOOGLE keys | — |
| `_shared/rateLimiter.ts` | Rate limit en memoria por tier (no persistente) | — |

---

## 6. Estado de salud técnica

| Check | Comando | Resultado |
|---|---|---|
| Typecheck | `tsc -b` | ✅ **PASA** (exit 0) |
| Build | `npm run build` | ✅ **PASA** (built in 4.31s, PWA OK) |
| Lint | `npm run lint` | ❌ **109 problemas (80 errores, 29 warnings)** |
| Tests | `npm run test` | ❌ **21 fallan / 7 pasan** (28 total, 2 archivos fallan de 4) |

### 6.1 Errores de lint (muestra real)
La mayoría son `@typescript-eslint/no-explicit-any` y `react-refresh/only-export-components`:
```
src/hooks/useAgents.ts:36:27           error  Unexpected any
src/hooks/useCampaignHistory.ts:45:27  error  Unexpected any
src/hooks/useNexusHistory.ts:10:20     error  Unexpected any
src/hooks/useNexusHistory.ts:40:27     error  Unexpected any
src/hooks/useOOHMetrics.ts:54:27       error  Unexpected any
src/hooks/usePerformanceMetrics.ts:54:27 error Unexpected any
src/hooks/useSocialMetrics.ts:55:27    error  Unexpected any
src/hooks/useSonicMetrics.ts:55:27     error  Unexpected any
src/lib/groqService.ts:71:103          error  Unexpected any
src/pages/ClientPortal.tsx:15,16,43    error  Unexpected any (x3)
src/pages/Login.tsx:47:25              error  Unexpected any
src/services/mockData.tsx:113:18       error  Unexpected any
supabase/functions/marcus-orchestrator/index.ts:66:13  error  Unexpected any
supabase/functions/webhook-scrape/index.ts:23:37       error  Unexpected any
react-refresh/only-export-components (warnings): GlobalVoiceContext, AuthContext, Index.tsx, …
```
> Total: **80 errores** (mayoría `no-explicit-any` distribuidos en hooks/servicios) + 29 warnings. No bloquean el build (lint no está en el pipeline de `build`).

### 6.2 Fallos de tests (causa real)
Los 21 fallos se concentran en `src/test/api.test.ts` por **URL relativa inválida en entorno jsdom**:
```
TypeError: Invalid URL: /api/render        (src/services/api.ts:138)
TypeError: Failed to parse URL from /api/purchase   (src/services/api.ts:151)
```
`fetch(\`${API_BASE_URL}/render\`)` con `API_BASE_URL='/api'` falla porque jsdom/undici exige URL absoluta. Es un problema de **configuración de test (base URL relativa)**, no de la lógica de negocio de los labs. `IntelligenceEngine.test.tsx` y `ErrorBoundary.test.tsx` pasan.

---

## 7. Deuda técnica

| Ítem | Ubicación | Detalle |
|---|---|---|
| **Bug `NaN%` en widget de tokens** | `TokenTelemetry.tsx:13,43,51` | `percentage = (usedTokens / totalTokens) * 100`. Para usuario no-admin con `total_tokens=0` (default de `useTokenBalance.ts:16-21` y `54-55`) → `0/0 = NaN` → renderiza **"0 / 0" y "NaN%"** y `width: NaN%`. **Este es el widget "COMPUTE TOKENS 0/0 NaN%" reportado.** |
| Botones placeholder | `CommercialLab.tsx:293` ("DEPLOY TO NETWORKS"), `VirtualOOHLab.tsx:399` ("DEPLOY TO METAVERSE") | Sin handler / sin lógica real |
| `console.log` como acción | `VirtualOOHLab.tsx:380` | "Iniciando creación de campaña OOH..." en vez de persistir |
| Bucket no migrado | `visual-assets` | Referenciado en 5 componentes; no existe migración que lo cree |
| RLS débil | `visual_assets` SELECT público | `USING(true)` expone URLs |
| Migraciones sin timestamp | `add_compute_tokens.sql`, `add_monitization_columns.sql`, `SUPABASE_MEMORY.sql`, `SUPABASE_MIGRATION.sql` | No siguen `YYYYMMDDHHMMSS_*` → orden de ejecución no garantizado |
| Migración con typo duplicada | `add_monitization_columns.sql` (sic) vs `add-monetization-columns` edge fn | Redundante con `add_compute_tokens.sql` |
| Trigger redefinido | `on_auth_user_created` en 3 migraciones | "última gana"; consolidar |
| SDK duplicado | `@google/genai` + `@google/generative-ai` | Unificar |
| `any` indirecto | hooks de métricas (`use*Metrics.ts`) | Tipado flexible en payloads JSON |
| Admin hardcodeado | `davicho4522@gmail.com` en 7+ archivos | Es directiva intencional (CONTEXT.md §Bypass), pero centralizable en una constante única |
| Tests rotos | `api.test.ts` | Base URL relativa en jsdom |

> ✅ No se detectaron **secretos hardcodeados** (las API keys vienen de `import.meta.env` / `Deno.env`). Los `placeholder` encontrados en grep son `placeholder=""` de inputs HTML, no datos mock.

---

## 8. GAP ANALYSIS — Social Lab vs Virtual OOH vs Commercial Lab

Leyenda: ✅ presente/funcional · ⚠️ parcial · ❌ ausente

| Feature | Social Lab | Virtual OOH | Commercial Lab |
|---|:---:|:---:|:---:|
| **Motor de prompts** | | | |
| · Gancho (hook) | ✅ | ⚠️ (solo display estático) | ⚠️ (solo display) |
| · Narrativa de campaña | ✅ | ⚠️ (estático) | ⚠️ (creative_rationale) |
| · Estrategia visual / Prompt maestro | ✅ | ❌ | ❌ |
| · Tono emocional | ✅ | ❌ | ❌ |
| · Pacing / ritmo | ✅ | ❌ | ❌ |
| · Background audio | ✅ | ❌ | ❌ |
| · Textos destacados (on_screen) | ✅ | ❌ | ❌ |
| · CTA | ✅ | ❌ | ❌ |
| · Llamada real a IA (Groq/Gemini) | ✅ | ❌ | ❌ |
| **Generador de guiones 10s/30s/60s** | ✅ | ❌ | ❌ |
| **Selector de plataforma/formato** | ✅ | ❌ | ❌ |
| **Preview** | ✅ (7 plataformas) | ✅ (mockup) | ✅ (mockup) |
| **Upload de video propio** | ✅ (`campaign_assets`) | ✅ (`visual-assets`, solo admin) | ✅ (`visual-assets`) |
| **Guardar Campaña (persistencia real)** | ✅ (`INSERT campaigns` + modal) | ❌ (mock/console.log) | ❌ (mock) |
| **Copiar Prompt Maestro** | ✅ | ❌ | ❌ |
| **Copiar Visual** | ✅ | ❌ | ❌ |
| **Exportar prompts** | ✅ | ❌ | ❌ |
| **Botones sin placeholder** | ✅ 14/14 | ⚠️ ("Deploy to Metaverse" vacío, "Crear Campaña" mock) | ⚠️ ("Deploy to Networks" vacío, "Crear Campaña" mock) |

**Conclusión del gap:** Social Lab tiene el motor completo (generación IA + guiones + upload + guardado). **OOH y Commercial comparten una base de preview+upload funcional, pero carecen por completo del motor de prompts, del generador de guiones, del selector y del guardado real.** La paridad consiste en extraer el motor genérico de Social Lab y parametrizarlo por `labType`, más añadir la columna `lab_type` y crear/garantizar el bucket de Storage.

---

## 9. Recomendaciones inmediatas (no ejecutadas — esperan tu OK)
1. **Fase 2**: documentar a fondo el pipeline de Social Lab (referencia para replicar).
2. **Fase 3**: plan de extracción de motor compartido (`src/lib/prompt-engine/`, `useCampaignStudio`, `VideoScriptGenerator`, `CampaignUploader`, `SaveCampaignButton`) parametrizado por `labType`.
3. Backend mínimo: migración con `lab_type` en `campaigns` + creación explícita del bucket `visual-assets` (o unificar a `campaign_assets`).
4. Bug rápido aparte: proteger `TokenTelemetry` contra división por cero (NaN%).

---

### Anexo — Archivos clave (file:line)
- Router: `src/App.tsx:42-50`, `src/pages/Index.tsx:219-246`
- Menú THE LABS: `src/components/layout/SpatialSidebar.tsx:12-18`
- Motor de prompts: `src/lib/groqService.ts:71-160`
- Social Lab guardar: `src/components/dashboard/SocialLab.tsx:218-259, 1100-1173`
- Social Lab upload: `src/components/dashboard/SocialLab.tsx:349-444`
- OOH mock guardar: `src/components/dashboard/VirtualOOHLab.tsx:376-399`
- Commercial mock guardar: `src/components/dashboard/CommercialLab.tsx:271-293`
- Bug NaN%: `src/components/dashboard/TokenTelemetry.tsx:13,43,51`
- Tabla campaigns: `supabase/migrations/20260613000000_clients_and_campaigns.sql:34-44`
- Bucket no migrado: `visual-assets` (solo en código)
