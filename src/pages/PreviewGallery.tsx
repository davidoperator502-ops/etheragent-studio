import React from 'react';
import {
  InstagramReelPreview,
  InstagramFeedPreview,
  InstagramStoryPreview,
  TikTokPreview,
  YouTubeShortPreview,
  LinkedInPreview,
  TwitterPreview,
} from '@/components/dashboard/previews/PlatformPreviews';

/* DEV-ONLY visual verification harness for the phone mockups.
   Renders every platform preview over a bright simulated "video" so we can
   stress-test scrim legibility and marker alignment. Not linked in nav. */

const mockAsset = {
  hook: 'Automatiza tu marketing con IA mientras duermes y escala sin equipo',
  call_to_action: 'Empieza gratis hoy',
  visual_description:
    'Dashboard futurista con métricas en tiempo real, transiciones suaves y un agente de IA orquestando campañas across múltiples canales con resultados medibles.',
  on_screen_text: ['+300% ROI'],
};

const PANELS: { label: string; node: React.ReactNode; light?: boolean }[] = [
  { label: 'Instagram · Reel', node: <InstagramReelPreview hasMedia asset={mockAsset} /> },
  { label: 'Instagram · Feed', node: <InstagramFeedPreview hasMedia asset={mockAsset} />, light: true },
  { label: 'Instagram · Story', node: <InstagramStoryPreview hasMedia asset={mockAsset} /> },
  { label: 'TikTok', node: <TikTokPreview hasMedia asset={mockAsset} /> },
  { label: 'YouTube · Short', node: <YouTubeShortPreview hasMedia asset={mockAsset} /> },
  { label: 'LinkedIn', node: <LinkedInPreview hasMedia asset={mockAsset} />, light: true },
  { label: 'X (Twitter)', node: <TwitterPreview hasMedia asset={mockAsset} />, light: true },
];

function Frame({ label, node, light }: { label: string; node: React.ReactNode; light?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">{label}</span>
      <div className="relative w-[300px] h-[640px] bg-black border-[8px] border-[#1c1c1e] rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] ring-1 ring-white/5 overflow-hidden">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-50" />
        {/* Simulated bright "video" base to stress legibility */}
        <div className={`absolute inset-0 ${light ? 'bg-zinc-200' : 'bg-gradient-to-br from-fuchsia-600 via-orange-400 to-cyan-400'}`}>
          {light && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,#fb923c,transparent_60%),radial-gradient(circle_at_70%_70%,#22d3ee,transparent_55%)]" />
          )}
        </div>
        <div className="absolute inset-0 z-20">{node}</div>
      </div>
    </div>
  );
}

export default function PreviewGallery() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-10">
      <h1 className="text-2xl font-bold mb-1">Preview Gallery <span className="text-emerald-500">·</span> verificación de mockups</h1>
      <p className="text-zinc-500 text-sm mb-10">Marcadores y chrome sobre fondo vívido (dev-only).</p>
      <div className="flex flex-wrap gap-12">
        {PANELS.map((p) => (
          <Frame key={p.label} {...p} />
        ))}
      </div>
    </div>
  );
}
