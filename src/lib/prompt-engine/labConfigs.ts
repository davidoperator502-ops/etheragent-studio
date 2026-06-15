import { LabConfig, LabType } from './types';
import { LAB_PROMPT_CONTEXT } from './promptTemplates';

export const LAB_CONFIGS: Record<LabType, LabConfig> = {
  // social: assetDefaults idénticos a los de SocialLab.tsx:314-328 (NO cambiar → preserva comportamiento)
  social: {
    labType: 'social',
    surfaces: [
      { id: 'instagram', label: 'Instagram' },
      { id: 'tiktok', label: 'TikTok' },
      { id: 'youtube', label: 'YouTube' },
      { id: 'linkedin', label: 'LinkedIn' },
      { id: 'twitter', label: 'X' },
    ],
    defaultSurfaceId: 'instagram',
    assetDefaults: {
      assetTypeLabel: 'B2B Strategy',
      durationLabel: '30-60',
      music_background: 'Ambient Tech / Corporate Modern',
      sound_effects: 'UI Clicks, Digital Swish',
      emotional_tone: 'Professional & Innovative',
      pacing_notes: 'Dynamic & Precise',
    },
    promptContext: LAB_PROMPT_CONTEXT.social,
    storagePrefix: 'social',
  },

  ooh: {
    labType: 'ooh',
    surfaces: [
      { id: 'Times Square 8K Billboard', label: 'Times Square' },
      { id: 'Shibuya Crossing Tower', label: 'Shibuya' },
      { id: 'Piccadilly Lights', label: 'Piccadilly' },
      { id: 'Spatial / Metaverse', label: 'Metaverse' },
    ],
    defaultSurfaceId: 'Times Square 8K Billboard',
    assetDefaults: {
      assetTypeLabel: 'OOH Spatial',
      durationLabel: '10-30',
      music_background: 'Sin audio dependiente (entorno público)',
      sound_effects: 'N/A — lectura visual a distancia',
      emotional_tone: 'Bold & Monumental',
      pacing_notes: 'High-contrast loop · lectura en 1-3s',
    },
    promptContext: LAB_PROMPT_CONTEXT.ooh,
    storagePrefix: 'ooh',
  },

  commercial: {
    labType: 'commercial',
    surfaces: [
      { id: 'Streaming / OTT', label: 'Streaming/OTT' },
      { id: 'Connected TV', label: 'Connected TV' },
      { id: 'Cinema / DOOH', label: 'Cinema/DOOH' },
      { id: 'YouTube Masthead', label: 'YT Masthead' },
    ],
    defaultSurfaceId: 'Streaming / OTT',
    assetDefaults: {
      assetTypeLabel: 'Cinematic Spot',
      durationLabel: '30-60',
      music_background: 'Orquestal cinematográfico · audio espacial (Atmos)',
      sound_effects: 'Diálogo + SFX posicionados en campo sonoro 5.1',
      emotional_tone: 'Cinematic & Premium',
      pacing_notes: 'Narrativa de spot TV · color HDR 16:9',
    },
    promptContext: LAB_PROMPT_CONTEXT.commercial,
    storagePrefix: 'commercial',
  },
};

export function getLabConfig(labType: LabType): LabConfig {
  return LAB_CONFIGS[labType];
}
