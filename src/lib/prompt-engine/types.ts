import { CampaignWorkspace } from '@/lib/geminiService';

// ── Modelo canónico de un asset de campaña (extraído de SocialLab) ──
export interface CampaignAsset {
  type: string;
  duration: string;
  hook: string;
  narrative_body?: string;
  voiceover_script: string;
  visual_description: string;
  on_screen_text: string[];
  music_background: string;
  sound_effects: string;
  call_to_action: string;
  emotional_tone: string;
  pacing_notes: string;
  video_url?: string;
  thumbnail_url?: string;
}

export type CampaignDataPayload = CampaignWorkspace & {
  detected_sector?: string;
  strategy_score?: number;
  angles?: string[];
  creative_rationale?: string;
  assets?: CampaignAsset[];
  audience?: { persona: string; psychographics: string; pain_points: string; desires: string };
  youtube_seo?: { video_title: string; video_description: string; hashtags: string[] };
  thumbnail_idea?: string;
  video_url?: string;
};

export interface CampaignRecord {
  id: string;
  target_url: string;
  detected_sector: string;
  strategy_score: number;
  campaign_data: CampaignDataPayload;
  created_at: string;
}

// ── Tipos del motor compartido ──
export type LabType = 'social' | 'ooh' | 'commercial';
export type DurationId = '10s' | '30s' | '60s';

export interface LabSurface {
  id: string;
  label: string;
}

/** Defaults aplicados al sintetizar un asset desde el formato B2B (campos que no vienen de IA). */
export interface AssetDefaults {
  assetTypeLabel: string;
  durationLabel: string;
  music_background: string;
  sound_effects: string;
  emotional_tone: string;
  pacing_notes: string;
}

export interface LabConfig {
  labType: LabType;
  /** Plataformas / superficies / formatos del lab. La primera es la superficie por defecto. */
  surfaces: LabSurface[];
  defaultSurfaceId: string;
  assetDefaults: AssetDefaults;
  /** Bloque de contexto inyectado en el promptTemplate de generateVideoPrompt. Vacío = comportamiento social actual. */
  promptContext: string;
  /** Prefijo de ruta en Storage (p.ej. 'social' | 'ooh' | 'commercial'). */
  storagePrefix: string;
}
