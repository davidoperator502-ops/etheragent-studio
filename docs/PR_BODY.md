# PR: Paridad funcional de los 3 Labs (Social / OOH / Commercial) vía motor compartido

> **Rama:** `audit/parity-work` → `main`
> **Crear PR en:** https://github.com/davidoperator502-ops/etheragent-studio/pull/new/audit/parity-work
> (no hay `gh` CLI en el entorno; abre el PR manualmente con este cuerpo)

---

## 🎯 Objetivo
Llevar **Virtual OOH** y **Commercial Lab** a la misma capacidad funcional que **Social Lab**: motor de ingeniería de prompts, generador de guiones 10/30/60s, upload de video propio, "Guardar Campaña" con persistencia real y todos los botones operativos — cada lab adaptado a su contexto.

## 🧭 Enfoque — RUTA A (una campaña, tres interpretaciones)
La Fase 2 reveló que Social Lab **no genera** la campaña base: la produce **Nexus Brain** (edge fn `nexus-brain`) en `nexus_youtube_ads.campaign_data`. Por eso los 3 labs **reutilizan la misma campaña base** (vía `?campaign={id}` o la última del usuario) y solo cambian **(a)** la adaptación contextual del prompt y **(b)** el preview. **No se tocó la ingesta ni la edge function `nexus-brain`** (respeta `CONTEXT.md`: Nexus Brain = punto único de ingestión).

## 🏗️ Cambios por capa

### Motor compartido (nuevo)
- `src/lib/prompt-engine/` — `types.ts` (`CampaignAsset`, `LabType`, `LabConfig`), `buildMasterPrompt.ts`, `promptTemplates.ts` (bloques contextuales por lab), `labConfigs.ts` (social / ooh / commercial).
- `src/hooks/useCampaignStudio.ts` — orquestador por `labType`: fetch campaña base + normalización + generar guiones + upload + guardar + deploy.
- `src/components/campaign-studio/` — `VideoScriptGenerator`, `CampaignUploader`, `SaveCampaignButton`, `HighlightedPrompt`, `SurfaceSelector`, `CampaignMasterPanel`.
- `src/lib/groqService.ts` — `generateVideoPrompt` gana 4º parámetro `labContext` **opcional** (sin él, salida social **idéntica**: retrocompatible).

### Labs
- **SocialLab** (`src/components/dashboard/SocialLab.tsx`) — refactorizado para consumir el motor; **comportamiento idéntico** (verificado en smoke test, sin regresión). De 1177 → ~600 líneas; chunk 35→21.6 KB.
- **VirtualOOHLab** — reescrito con el motor; contexto **gran formato espacial** (Times Square / Shibuya). Mantiene a Viktor y "Encender Valla". **Eliminado** el fallback BigBuckBunny (prohibido por `CONTEXT.md`) y el gate admin-only del upload.
- **CommercialLab** — reescrito con el motor; contexto **cinematic HDR 16:9 + audio espacial** (Streaming / CTV / Cinema / Masthead).

### Backend (migraciones)
- `supabase/migrations/20260615000000_storage_visual_assets_bucket.sql` — crea el bucket `visual-assets` + 4 políticas RLS (estaba referenciado en código pero nunca migrado).
- `supabase/migrations/20260615000001_add_lab_type_to_campaigns.sql` — `campaigns.lab_type ('social'|'ooh'|'commercial')` `NOT NULL DEFAULT 'social'` + índice `(user_id, lab_type)`. Aditivo, RLS sin cambios.

### Botones (cero placeholders)
- `[DEPLOY TO METAVERSE]` (OOH) y `[DEPLOY TO NETWORKS]` (Commercial) → `deployCampaign()` (INSERT `estado:'activa'`). *Nota: persiste estado, no distribuye a redes externas reales.*
- "Guardar Campaña" funcional en los 3 labs con `lab_type` correcto.

### Fixes secundarios
- `TokenTelemetry.tsx` — fix bug `NaN%` (guarda división por cero cuando `totalTokens = 0`).
- `useCampaignHistory.ts` — tipado alineado al esquema real (`nombre/estado/plataforma/lab_type`) + filtro opcional por `lab_type` (elimina un `any`).

## ✅ Verificación
- `tsc -b` typecheck ✅ · `npm run build` ✅ · dev server arranca ✅
- **Tests: 35 passing / 0 failing** (suite arreglada: antes 21 fallaban por `VITE_USE_MOCK=false` en `.env` + bloque `define` mal anidado en vitest). Incluye cobertura nueva del motor compartido (`promptEngine.test.ts`).
- **Lint: 80 → 62 errores** (−18; los restantes son preexistentes en `api/*`, edge functions Deno y nodos React Flow, ajenos a la paridad — ver §debt).
- **Smoke test manual en navegador: PASÓ en los 3 labs** (Social sin regresión; OOH y Commercial funcionales; `lab_type` correcto visible en `/dashboard/campaigns`).
- Detalle en `docs/VERIFICATION.md` y `docs/SMOKE_TEST.md`.

### Calidad adicional incluida en este PR
- Suite de tests verde + tests del motor compartido (`buildMasterPrompt`, `labConfigs`, inyección de `labContext`).
- `.env.test` (sin secretos, `VITE_USE_MOCK=true`) versionado para CI en modo mock.
- Reducción de `no-explicit-any` en hooks de métricas, `groqService` y `PlatformPreviews`.
- `supabase/migrations/README.md` documentando la deuda de migraciones legacy (no destructivo).

## 🗄️ Migraciones — ESTADO
> ✅ **Las 2 migraciones YA fueron aplicadas a producción** (Supabase, proyecto "EtherAgent OS") antes/durante el smoke test, que validó upload, Guardar y Deploy en OOH y Commercial con `lab_type` persistido correctamente. El script combinado quedó documentado en `docs/APPLY_MIGRATIONS.sql` con sus queries de verificación.

## 📚 Documentación incluida
`docs/AUDIT_REPORT.md`, `docs/SOCIAL_LAB_REFERENCE.md`, `docs/PARITY_PLAN.md`, `docs/VERIFICATION.md`, `docs/APPLY_MIGRATIONS.sql`, `docs/SMOKE_TEST.md`, `docs/PR_BODY.md`.

## 📌 Deuda preexistente (fuera del alcance de este PR)
- 62 errores de lint `no-explicit-any` restantes en `api/*` (Vercel), edge functions Deno y nodos React Flow (no tocados por riesgo/poco valor).
- Migraciones legacy sin timestamp + trigger `on_auth_user_created` duplicado → documentado en `supabase/migrations/README.md` (limpieza controlada, no destructiva).
- SDK Google duplicado (`@google/genai` vs `@google/generative-ai`); RLS `SELECT` público en `visual_assets`.
- **Labs no equiparados** (PerformanceAds/Sonic/Studio): no encajan con el motor de guiones de video (Ads = métricas, Sonic = audio, Studio = otro flujo). Fuera del alcance Social/OOH/Commercial; se dejan como follow-up dedicado para no entregar integraciones a medias.

## Commits
```
6792b8e docs: combined migration SQL + code-mapped smoke test checklist
232a9d4 docs(verification): Phase 5 verification report
945ce02 fix: NaN% token widget + align useCampaignHistory typing to real schema
67b715d feat(ooh,commercial): full parity via shared campaign studio engine
d8e1509 feat(db): blocking migrations — visual-assets bucket + campaigns.lab_type
a142639 refactor(social-lab): consume shared campaign studio engine
b43223b feat(prompt-engine): extract shared campaign studio engine
28ecfad chore(audit): snapshot before parity work + audit docs
```

🤖 Generated with [Claude Code](https://claude.com/claude-code)
