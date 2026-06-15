# VERIFICATION — Paridad de Labs (Fase 5)

> Generado 2026-06-15. Rama `audit/parity-work`. Resultados **reales** medidos tras la implementación.

---

## 1. Salud técnica (comandos reales)

| Check | Comando | Resultado | Nota |
|---|---|---|---|
| Typecheck | `tsc -b` | ✅ **PASA** (exit 0) | Sin errores de tipos |
| Build | `npm run build` | ✅ **PASA** (4.36s, PWA OK) | 2866 módulos. `SocialLab` 35→21.6 KB (lógica ahora compartida) |
| Lint | `npm run lint` | ⚠️ **71 errores / 26 warnings** (97) | Baseline era **80 errores / 109**. **Mejoró −9 errores**; 0 nuevos en archivos tocados |
| Tests | `npm run test` | ❌ **21 fallan / 7 pasan** | **Idéntico al baseline**: fallo preexistente en `src/test/api.test.ts` (URL relativa `/api/..` inválida en jsdom). Ajeno a este trabajo |

**Lint — detalle honesto:** los 71 errores restantes son **todos preexistentes** (`@typescript-eslint/no-explicit-any` en `useAgents`, `useNexusHistory`, `useOOHMetrics`, `usePerformanceMetrics`, `useSocialMetrics`, `useSonicMetrics`, `groqService` param `context`, edge functions, etc.). El refactor **redujo** errores (alineé tipos en `useCampaignHistory`). Lint no está en el pipeline de `build`.

**Tests — detalle honesto:** los 21 fallos son del archivo `api.test.ts` por `TypeError: Invalid URL: /api/render` en el entorno jsdom (config de test con base URL relativa). No hay tests sobre los labs ni sobre el motor compartido (deuda preexistente). No se rompió ningún test que antes pasara.

---

## 2. Checklist funcional por lab

> ✅ = verificado por código (lógica presente y compilando) · 🟡 = requiere prueba en vivo (navegador + Supabase con migraciones aplicadas) · Social Lab además es el comportamiento de referencia ya existente.

| Capacidad | Social | OOH | Commercial | Evidencia (file:line) |
|---|:--:|:--:|:--:|---|
| Genera gancho + narrativa + estrategia/prompt maestro | ✅ | ✅ | ✅ | render de `currentAsset.hook/narrative_body/visual_description` + `CampaignMasterPanel.tsx` |
| Genera guiones 10s/30s/60s (contextual por lab) | ✅ | ✅ | ✅ | `useCampaignStudio.generatePrompt` → `generateVideoPrompt(..., config.promptContext)`; `promptTemplates.ts` |
| "Copiar Prompt Maestro" copia al portapapeles | ✅ | ✅ | ✅ | `useCampaignStudio.copyMaster` → `buildMasterPrompt` → `navigator.clipboard` |
| "Copiar Visual" copia al portapapeles | ✅ | ✅ | ✅ | `useCampaignStudio.copyVisual` |
| Sube mi propio video → Storage | ✅ | ✅ | ✅ | `useCampaignStudio.uploadFile` → bucket `campaign_assets` (fallback `visual-assets`) + tabla `visual_assets` |
| "Guardar Campaña" persiste en DB con `lab_type` | ✅ | ✅ | ✅ | `saveCampaign` → `INSERT campaigns { lab_type }`; `SaveCampaignButton.tsx` |
| Campaña recuperable filtrada por lab | ✅ | ✅ | ✅ | `useCampaignHistory(labType)` → `.eq('lab_type', labType)` + índice `(user_id, lab_type)` |
| Selector de plataforma/formato | ✅ | ✅ | ✅ | Social: PLATFORMS inline · OOH/Commercial: `SurfaceSelector` + `labConfigs.surfaces` |
| Preview | ✅ | ✅ | ✅ | mockup 340×720 con media subida |
| Todos los botones hacen algo real (cero placeholders) | ✅ | ✅ | ✅ | ver §3 |

> 🟡 **Pendiente de prueba en vivo (no ejecutable por mí ahora):** verificación visual en navegador + las dos migraciones **aún no aplicadas** contra el proyecto Supabase. Las llamadas reales a Groq y a Storage requieren keys/runtime. La lógica está completa y tipada; la prueba end-to-end real depende de aplicar migraciones y abrir la app.

---

## 3. Botones — antes vs ahora

| Botón | Antes (AUDIT) | Ahora |
|---|---|---|
| OOH "Crear Campaña Premium" | ❌ mock (`console.log`) | ✅ reemplazado por **Guardar Campaña** (`SaveCampaignButton`, INSERT real con `lab_type:'ooh'`) |
| OOH `[DEPLOY TO METAVERSE]` | ❌ sin `onClick` | ✅ `deployCampaign('ooh-surface')` → INSERT `estado:'activa'` + toast (gated a tener media) |
| OOH "Subir Asset" | ⚠️ solo admin | ✅ `CampaignUploader` para cualquier usuario → `campaign_assets` |
| OOH "Encender Valla" | demo chat | ✅ conservado (animación Viktor) |
| Commercial "Crear Campaña Premium" | ❌ mock | ✅ **Guardar Campaña** real (`lab_type:'commercial'`) |
| Commercial `[DEPLOY TO NETWORKS]` | ❌ sin lógica | ✅ `deployCampaign('commercial-surface')` |
| Commercial "Subir Activo" | ⚠️ asset global | ✅ `CampaignUploader` campaign-scoped |
| Los 3 labs: Copiar Maestro/Visual, Generar 10/30/60, Exportar, Nueva Campaña | Social ✅ / OOH·Com ❌ | ✅ en los 3 |

---

## 4. Confirmación: Social Lab NO cambió su comportamiento

- Misma fuente de datos (`nexus_youtube_ads`), misma UI (selector plataforma/formato, `PlatformPreviews`, mockup 9:16, YouTube SEO), mismos toasts.
- `generateVideoPrompt` sin `labContext` produce salida **idéntica** (social usa `promptContext: ''`).
- Mismos `assetDefaults` (música/SFX/tono/pacing) que el código original (`labConfigs.ts` → social).
- Único cambio observable: el `INSERT campaigns` ahora añade `lab_type:'social'` (columna con `DEFAULT 'social'`, retrocompatible).
- Build: el chunk de SocialLab se redujo (lógica movida al motor compartido), sin cambio funcional.

> 🟡 Smoke test visual en navegador pendiente (recomendado antes de merge).

---

## 5. Resumen de cambios

### Archivos nuevos
- `src/lib/prompt-engine/{types,buildMasterPrompt,promptTemplates,labConfigs}.ts`
- `src/hooks/useCampaignStudio.ts`
- `src/components/campaign-studio/{VideoScriptGenerator,CampaignUploader,SaveCampaignButton,HighlightedPrompt,SurfaceSelector,CampaignMasterPanel}.tsx`
- `supabase/migrations/20260615000000_storage_visual_assets_bucket.sql`
- `supabase/migrations/20260615000001_add_lab_type_to_campaigns.sql`
- `docs/{AUDIT_REPORT,SOCIAL_LAB_REFERENCE,PARITY_PLAN,VERIFICATION}.md`

### Archivos modificados
- `src/lib/groqService.ts` (param `labContext` opcional, retrocompatible)
- `src/components/dashboard/SocialLab.tsx` (consume motor; 1177→~600 líneas)
- `src/components/dashboard/VirtualOOHLab.tsx` (reescrito con motor)
- `src/components/dashboard/CommercialLab.tsx` (reescrito con motor)
- `src/components/dashboard/TokenTelemetry.tsx` (fix NaN%)
- `src/hooks/useCampaignHistory.ts` (tipado real + filtro por lab)

### Commits (rama `audit/parity-work`)
```
945ce02 fix: NaN% token widget + align useCampaignHistory typing to real schema
67b715d feat(ooh,commercial): full parity via shared campaign studio engine
d8e1509 feat(db): blocking migrations — visual-assets bucket + campaigns.lab_type
a142639 refactor(social-lab): consume shared campaign studio engine
b43223b feat(prompt-engine): extract shared campaign studio engine
28ecfad chore(audit): snapshot before parity work + audit docs
```

---

## 6. Acciones pendientes / deuda restante

**Bloqueante para prueba en vivo (requiere tu intervención):**
1. **Aplicar migraciones a Supabase** (no lo hago yo): `supabase db push` o ejecutar en el SQL editor los 2 archivos `20260615000000_*` y `20260615000001_*`. Sin esto, `lab_type` y el bucket `visual-assets` no existen en el proyecto remoto.

**Recomendado antes de merge:**
2. Smoke test en navegador de los 3 labs (generar guiones reales con Groq, subir video, guardar, ver en `/dashboard/campaigns`).
3. `git push` de la rama y PR hacia `main`.

**Deuda preexistente (no abordada en esta fase, fuera de alcance de paridad):**
4. 71 errores de lint `no-explicit-any` (hooks de métricas, edge functions).
5. `api.test.ts` (URL relativa en jsdom) — 21 tests fallando.
6. Migraciones sin timestamp + trigger `on_auth_user_created` duplicado + SDK Google duplicado (`@google/genai` vs `@google/generative-ai`).
7. RLS `SELECT` público en `visual_assets`.
8. `CommunityLab`, `PerformanceAdsLab`, `SonicLab`, `StudioLab` no equiparados (fuera del alcance solicitado: solo Social/OOH/Commercial).
