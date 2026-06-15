import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildMasterPrompt } from '@/lib/prompt-engine/buildMasterPrompt';
import { LAB_CONFIGS, getLabConfig } from '@/lib/prompt-engine/labConfigs';
import { LAB_PROMPT_CONTEXT } from '@/lib/prompt-engine/promptTemplates';
import { CampaignAsset } from '@/lib/prompt-engine/types';

// El motor lee la key de Groq desde useTokenStore; lo mockeamos para no depender de env.
vi.mock('@/store/useTokenStore', () => ({
  useTokenStore: { getState: () => ({ tokens: { groq: 'test-groq-key' } }) },
}));
import { generateVideoPrompt } from '@/lib/groqService';

const sampleAsset: CampaignAsset = {
  type: 'B2B Strategy',
  duration: '30-60',
  hook: 'Gancho de prueba',
  narrative_body: 'Narrativa de prueba',
  voiceover_script: 'Narrativa de prueba',
  visual_description: 'Cinematic, 8k',
  on_screen_text: ['STOP', 'ROI x10'],
  music_background: 'Ambient Tech',
  sound_effects: 'UI Clicks',
  call_to_action: 'Solicita tu Demo',
  emotional_tone: 'Professional',
  pacing_notes: 'Dynamic',
};

describe('buildMasterPrompt', () => {
  it('incluye todas las secciones del asset', () => {
    const out = buildMasterPrompt(sampleAsset);
    expect(out).toContain('## B2B Strategy (30-60s)');
    expect(out).toContain('### Hook');
    expect(out).toContain('Gancho de prueba');
    expect(out).toContain('### Voiceover');
    expect(out).toContain('### Visual Description');
    expect(out).toContain('Cinematic, 8k');
    expect(out).toContain('### Call to Action');
    expect(out).toContain('Solicita tu Demo');
    expect(out).toContain('- "STOP"');
    expect(out).toContain('- "ROI x10"');
  });
});

describe('labConfigs', () => {
  it('expone los 3 labs con superficies y superficie por defecto válida', () => {
    (['social', 'ooh', 'commercial'] as const).forEach(lab => {
      const cfg = getLabConfig(lab);
      expect(cfg.labType).toBe(lab);
      expect(cfg.surfaces.length).toBeGreaterThan(0);
      expect(cfg.surfaces.some(s => s.id === cfg.defaultSurfaceId)).toBe(true);
      expect(cfg.storagePrefix).toBe(lab);
    });
  });

  it('social conserva los assetDefaults originales (retrocompatibilidad)', () => {
    expect(LAB_CONFIGS.social.assetDefaults.music_background).toBe('Ambient Tech / Corporate Modern');
    expect(LAB_CONFIGS.social.assetDefaults.emotional_tone).toBe('Professional & Innovative');
    expect(LAB_CONFIGS.social.assetDefaults.pacing_notes).toBe('Dynamic & Precise');
  });
});

describe('LAB_PROMPT_CONTEXT', () => {
  it('social es vacío (no altera el prompt original)', () => {
    expect(LAB_PROMPT_CONTEXT.social).toBe('');
  });
  it('ooh describe gran formato espacial', () => {
    expect(LAB_PROMPT_CONTEXT.ooh).toMatch(/GRAN FORMATO/i);
    expect(LAB_PROMPT_CONTEXT.ooh).toMatch(/Times Square|Shibuya/);
  });
  it('commercial describe cinematic HDR + audio espacial', () => {
    expect(LAB_PROMPT_CONTEXT.commercial).toMatch(/HDR/);
    expect(LAB_PROMPT_CONTEXT.commercial).toMatch(/AUDIO ESPACIAL/i);
    expect(LAB_PROMPT_CONTEXT.commercial).toMatch(/16:9/);
  });
});

describe('generateVideoPrompt (inyección de labContext)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: '== RESULT ==' } }] }),
    }) as unknown as typeof fetch;
  });

  function bodyOfLastFetch(): string {
    const mock = global.fetch as unknown as ReturnType<typeof vi.fn>;
    return mock.mock.calls[0][1].body as string;
  }

  it('inyecta el bloque de contexto cuando se pasa labContext', async () => {
    await generateVideoPrompt('30s', 'Times Square', { hook: 'h' }, 'MI_CONTEXTO_OOH');
    const body = bodyOfLastFetch();
    expect(body).toContain('CONTEXTO DEL FORMATO');
    expect(body).toContain('MI_CONTEXTO_OOH');
  });

  it('NO inyecta el bloque cuando labContext está vacío (comportamiento social)', async () => {
    await generateVideoPrompt('30s', 'instagram', { hook: 'h' }, '');
    const body = bodyOfLastFetch();
    expect(body).not.toContain('CONTEXTO DEL FORMATO');
  });

  it('devuelve el contenido del choice de Groq', async () => {
    const out = await generateVideoPrompt('10s', 'instagram', { hook: 'h' });
    expect(out).toBe('== RESULT ==');
  });
});
