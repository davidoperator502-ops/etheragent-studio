import { CampaignAsset } from './types';

// Ensambla el "Prompt Maestro" en cliente a partir de un CampaignAsset.
// Extraído sin cambios de lógica desde SocialLab.tsx:78-110.
export function buildMasterPrompt(asset: CampaignAsset): string {
  const lines = [
    `## ${asset.type} (${asset.duration}s)`,
    '',
    `### Hook`,
    asset.hook,
    '',
    `### Voiceover`,
    asset.voiceover_script,
    '',
    `### Visual Description`,
    asset.visual_description,
    '',
    `### Textos en pantalla`,
    asset.on_screen_text.map(t => `- "${t}"`).join('\n'),
    '',
    `### Background Music`,
    asset.music_background,
    '',
    `### Sound Effects`,
    asset.sound_effects,
    '',
    `### Call to Action`,
    asset.call_to_action,
    '',
    `### Emotional Tone`,
    asset.emotional_tone,
    '',
    `### Pacing`,
    asset.pacing_notes,
  ];
  return lines.join('\n');
}
