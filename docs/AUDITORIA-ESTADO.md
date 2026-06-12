# Auditoría de Estado - EtherAgent OS Studio (Fase 0)

## 1. Arquitectura Real
- **Frontend Framework:** Vite, React 18, TypeScript, Tailwind CSS, shadcn/ui.
- **Routing:** Configurado mediante `react-router-dom` en `src/App.tsx`. Las rutas de la aplicación viven principalmente bajo `/dashboard/*`.
- **Estructura src/:** 
  - `components/`: UI agrupada por dominios (`dashboard/`, `ui/`, `layout/`).
  - `hooks/`: Custom hooks para métricas y queries.
  - `store/`: Estado global manejado por Zustand (e.j., `useCampaignStore.ts`).
  - `context/`: Proveedores de contexto como Auth y GlobalVoice.
- **Backend/API:**
  - Se emplean Serverless Functions (rutas Node en `api/` como `generate.ts`, `render.ts`) para procesamiento pesado o llamadas a LLMs y APIs externas (ej. Groq, FAL).
  - La ingestión de URLs se realiza en el módulo **Nexus Brain** según lo especifica la política estricta de `CONTEXT.md`.

## 2. Estado de Supabase (Base de Datos)
- **Tablas Base Existentes:** `profiles`, `avatars`, `templates`, `presets`, `render_jobs`, `analysis_history`, `visual_assets`.
- **Datos de Campaña Actuales:** Se persisten en la tabla `nexus_youtube_ads` (introducida en `20260608000001_create_nexus_youtube_ads.sql`). Esta tabla guarda todo en un campo `campaign_data` (JSONB) y está vinculada al `user_id`.
- **RLS (Row Level Security):** Configurado para restringir lecturas y escrituras de modo que cada usuario (`auth.uid()`) solo ve sus propios datos.
- **Dato Real vs Mock:** No hay hardcode de datos core. Las credenciales provienen del entorno (.env) y los registros de campañas se leen desde Supabase (`nexus_youtube_ads`).

## 3. Estado Específico del Social Lab
- **Renderizado del "Neural Strategy Engine":** Muestra un panel de detalles de campaña que toma la información del JSONB cargado (incluyendo "detect sector", scores y "assets"). 
- **Mockup Móvil:** Emplea un contenedor visual que aparenta ser un móvil pero de forma genérica. Tiene elementos absolutos (como el nombre del usuario y el CTA "Swipe up") que pueden desbordarse y no simulan la interfaz real de las distintas redes sociales (TikTok, IG Reels, YT Shorts).
- **Consumo de Datos:** En el `useEffect` de `SocialLab.tsx`, realiza un fetch a Supabase hacia `nexus_youtube_ads` (filtra por parámetro URL o agarra el último registro). Esto quiere decir que el Social Lab ya es 100% dinámico.

## 4. Deuda Técnica Identificada
- **Warnings de Build:** Ejecución de `npm run build` es limpia en general, pero advierte sobre `Browserslist: browsers data is 12 months old`.
- **Complejidad y Componentización:** `SocialLab.tsx` es muy voluminoso (>1000 líneas). Tiene mezclada lógica de fetching, el panel de Neural Engine y la UI del móvil. Sería prudente extraer la previsualización móvil a componentes dedicados.
- **Tipado Flexible:** Se usan algunas interfaces con propiedades opcionales masivas o `any` indirectamente en los payloads de JSON.
- **Tests:** Existen scripts en `scripts/tests/` pero no hay una cobertura de testing profundo sobre la UI específica de Social Lab, lo que requerirá validaciones manuales estrictas o nuevas pruebas unitarias post-refactor.

## 5. Gaps Funcionales (Brechas vs Objetivos)
- **FASE 1 (Pulido Social Lab):** 
  - Faltan componentes *Platform-specific* para simular la interfaz exacta de TikTok (botones a la derecha, captions abajo), Instagram Reel/Feed/Story, y YouTube Shorts.
  - La UI requiere una limpieza general en el "mockup" para evitar que los CTAs pisoteen otros textos (alineación de paleta oscura y verde, skeletons, etc.).
- **FASE 2 (Sistema de Campañas y Clientes):**
  - Faltan tablas y migraciones para `clients`, `campaigns` (con tipos y estados) y `campaign_assets`.
  - La arquitectura actual de `nexus_youtube_ads` es muy simple (sin clientes formales).
  - Falta la ruta pública `/c/:slug` para portales de clientes.
  - Falta un CRUD (crear, listar, duplicar, archivar).
- **FASE 3 (Generador de Prompts 10s/30s/60s):**
  - Actualmente, el sistema no tiene un mecanismo on-demand de generación estructurada (con la plantilla exigida) para 3 duraciones basado en el hook/narrativa. Solo pinta los `assets` que se hayan generado preliminarmente en el paso de Nexus Brain.

**Conclusión:** La base es sólida (TS, Vite, Supabase), pero la lógica del Social Lab requiere componentización profunda de las previews y el esquema de base de datos requiere una expansión significativa para el manejo robusto de Campañas y Clientes.