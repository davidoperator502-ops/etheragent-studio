import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Loader2, Video, Image as ImageIcon, UserCircle2, Play, ArrowRight, Brain, Copy, Eye, Clapperboard, Instagram, Youtube, Linkedin, Twitter, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCampaignStudio } from '@/hooks/useCampaignStudio';
import { CampaignAsset } from '@/lib/prompt-engine/types';
import { VideoScriptGenerator } from '@/components/campaign-studio/VideoScriptGenerator';
import { CampaignUploader } from '@/components/campaign-studio/CampaignUploader';
import { SaveCampaignButton } from '@/components/campaign-studio/SaveCampaignButton';
import {
  InstagramReelPreview,
  InstagramFeedPreview,
  InstagramStoryPreview,
  TikTokPreview,
  YouTubeShortPreview,
  LinkedInPreview,
  TwitterPreview
} from './previews/PlatformPreviews';

function parseVisualSections(markdown: string) {
  const sections: { label: string; time: string; lines: string[] }[] = [];
  const lines = markdown.split('\n');
  let current: { label: string; time: string; lines: string[] } | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    const headerMatch = line.match(/^(HOOK|DESARROLLO|OUTRO\s*\/?\s*BUCLE)\s*\(([^)]+)\)/i);
    if (headerMatch) {
      if (current) sections.push(current);
      current = { label: headerMatch[1], time: headerMatch[2], lines: [] };
    } else if (current) {
      current.lines.push(line || ' ');
    }
  }
  if (current) sections.push(current);
  return sections;
}

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', Icon: Instagram },
  { id: 'tiktok', label: 'TikTok', Icon: Music2 },
  { id: 'youtube', label: 'YouTube', Icon: Youtube },
  { id: 'linkedin', label: 'LinkedIn', Icon: Linkedin },
  { id: 'twitter', label: 'X', Icon: Twitter },
] as const;

export default function SocialLab() {
  const navigate = useNavigate();
  const studio = useCampaignStudio('social');
  const {
    loading, campaign, campaignData, isNewFormat, currentAsset,
    activeAssetIndex, setActiveAssetIndex, videoStarted, setVideoStarted,
    mediaType, setMediaType, generatingDuration, generatedPrompts,
    generatePrompt, exportPrompts, uploading, uploadFile,
    copy, copyMaster, copyVisual, clients, fetchClients, savingCampaign, saveCampaign,
  } = studio;

  // Estado específico de social (selección de red y formato para los previews)
  const [platform, setPlatform] = useState<'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'twitter'>('instagram');
  const [videoFormat, setVideoFormat] = useState<'reel' | 'feed' | 'story' | 'short'>('reel');

  const sections = currentAsset ? parseVisualSections(currentAsset.visual_description) : [];

  const sectionColors: Record<string, string> = {
    'HOOK': 'border-l-emerald-500 bg-emerald-500/5',
    'DESARROLLO': 'border-l-zinc-600 bg-zinc-500/5',
    'OUTRO': 'border-l-emerald-500/50 bg-emerald-500/5',
    'OUTRO / BUCLE': 'border-l-emerald-500/50 bg-emerald-500/5',
  };

  const sectionLabels: Record<string, string> = {
    'HOOK': 'HOOK',
    'DESARROLLO': 'DESARROLLO',
    'OUTRO': 'OUTRO / BUCLE',
    'OUTRO / BUCLE': 'OUTRO / BUCLE',
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
          <Loader2 className="w-16 h-16 text-emerald-400 animate-spin relative z-10" />
        </div>
        <p className="text-emerald-400/80 font-mono text-xs tracking-[0.3em] uppercase animate-pulse">Cargando Social Lab...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-8 text-center px-4">
        <div className="w-24 h-24 rounded-3xl bg-zinc-900/60 border border-white/10 flex items-center justify-center">
          <Brain className="w-12 h-12 text-zinc-700" />
        </div>
        <div className="space-y-3 max-w-md">
          <h2 className="text-2xl font-black text-white tracking-tight">Sin Campaña Activa</h2>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Inicia una ingestión en el Nexus Brain para generar tu primera campaña. Los datos fluirán automáticamente aquí.
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/nexus-brain')}
          className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center gap-3"
        >
          <Brain size={18} /> Ir al Nexus Brain <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  const data = campaign.campaign_data;

  return (
    <div className="flex flex-col xl:flex-row min-h-screen w-full bg-[#050505] text-white p-3 sm:p-4 md:p-8 gap-4 sm:gap-8 pb-32 overflow-x-hidden overflow-y-auto">

      {/* ── LEFT PANEL: Structured Prompt Display ── */}
      <div className="flex-1 flex flex-col max-w-3xl">
        <header className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full border-2 border-emerald-500/50 flex items-center justify-center bg-zinc-900">
              <span className="font-black text-2xl text-emerald-500">N</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Neural Strategy Engine</h2>
              <p className="text-emerald-500 font-mono text-xs tracking-widest uppercase">B2B Campaign Director • AI Core</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              {data.detected_sector}
            </span>
            <span className="text-zinc-500 font-mono text-xs">{data.strategy_score}/100</span>
          </div>
        </header>

        <div className="flex-1 bg-[#0a0a0c] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col relative shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-500" />
              <span className="text-emerald-500 text-[10px] font-mono tracking-widest uppercase">Campaña: {new URL(campaign.target_url).hostname}</span>
            </div>
            {currentAsset && (
              <SaveCampaignButton
                surface={platform}
                clients={clients}
                saving={savingCampaign}
                fetchClients={fetchClients}
                onSave={saveCampaign}
              />
            )}
          </div>

          {/* Format Tabs - Solo se muestran si no es el nuevo formato o si hay múltiples assets */}
          {!isNewFormat && data.assets && data.assets.length > 0 && (
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest shrink-0">Formatos:</span>
              {data.assets.map((asset: CampaignAsset, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveAssetIndex(i)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase transition-all active:scale-95 shrink-0 ${
                    activeAssetIndex === i
                      ? 'bg-emerald-500 text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700 border border-white/5'
                  }`}
                >
                  {asset.type} ({asset.duration}s)
                </button>
              ))}
            </div>
          )}

          {/* Hook & Narrative Body (New Format) or Marketing Angles (Legacy) */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 backdrop-blur-md border border-white/5 p-5 rounded-2xl w-full mb-5">
            {isNewFormat ? (
              <div className="space-y-4">
                <div>
                  <p className="text-emerald-500 text-[10px] font-mono tracking-widest uppercase mb-2 flex items-center gap-2">
                    <Zap size={12} /> Gancho de Alto Impacto
                  </p>
                  <blockquote className="border-l-2 border-emerald-500/30 pl-4 py-1 italic text-zinc-200 font-medium">
                    "{currentAsset?.hook}"
                  </blockquote>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase mb-2">Narrativa de Campaña</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {currentAsset?.narrative_body}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <p className="text-zinc-300 text-sm font-medium mb-3 flex items-center gap-2">
                  <Sparkles size={14} className="text-emerald-500" /> Ángulos de Marketing
                </p>
                <div className="p-3 bg-black/60 border border-emerald-500/20 rounded-lg font-mono text-xs text-emerald-400 leading-relaxed whitespace-pre-wrap">
                  {data.angles?.map((angle: string, i: number) => `${i + 1}. ${angle}`).join('\n') || 'Sin ángulos detectados'}
                </div>
              </>
            )}
          </motion.div>

          {/* Visual Description / Prompt Section */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl w-full mb-5 group relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-zinc-300 text-sm font-medium flex items-center gap-2">
                <Video size={14} className="text-emerald-500" /> Estrategia Creativa Procesada
              </p>
              <button
                onClick={() => currentAsset && copy(currentAsset.visual_description, 'Visual Description')}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white"
                title="Copiar Prompt"
              >
                <Copy size={14} />
              </button>
            </div>
            <div className="p-4 bg-black/40 border border-white/5 rounded-xl font-mono text-xs text-zinc-400 leading-relaxed max-h-[250px] overflow-y-auto custom-scrollbar">
              {currentAsset?.visual_description || 'Procesando prompt visual...'}
            </div>
          </motion.div>

          {/* Generador de Prompts Multi-Duración */}
          <VideoScriptGenerator
            generatedPrompts={generatedPrompts}
            generatingDuration={generatingDuration}
            onGenerate={(dur) => generatePrompt(dur, platform)}
            onExport={() => exportPrompts(platform)}
            onCopy={copy}
          />

          {/* Structured Visual Description (Only for Legacy if it matches the format) */}
          {!isNewFormat && currentAsset && sections.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mb-5">
              {sections.map((section, i) => (
                <div
                  key={i}
                  className={`border-l-4 ${sectionColors[sectionLabels[section.label]] || 'border-l-zinc-600 bg-zinc-900/30'} rounded-r-xl p-4`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${
                      section.label === 'HOOK' ? 'text-emerald-400' :
                      section.label === 'DESARROLLO' ? 'text-zinc-400' : 'text-emerald-400/70'
                    }`}>
                      {sectionLabels[section.label] || section.label}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-600">({section.time})</span>
                  </div>
                  {section.lines.map((line, j) => {
                    const visualMatch = line.match(/^-\s*(?:🎥\s*)?Visual:\s*(.+)/i);
                    const textMatch = line.match(/^-\s*(?:✏️\s*)?Texto(?:\s*en\s*pantalla)?:\s*(?:\[)?(.+?)(?:\])?$/i);
                    const sfxMatch = line.match(/^-\s*(?:🔊\s*)?SFX:\s*(.+)/i);
                    const voiceoverMatch = line.match(/^-\s*(?:🎙️\s*)?Voiceover:\s*"(.+)"\s*$/i);
                    const musicMatch = line.match(/^-\s*(?:🎵\s*)?Music:\s*(.+)/i);
                    const ctaMatch = line.match(/^-\s*(?:👉\s*)?CTA:\s*(.+)/i);
                    const hookMatch = line.match(/^-\s*Hook:\s*(.+)/i);

                    if (visualMatch) {
                      return (
                        <p key={j} className="text-xs text-zinc-200 leading-relaxed mb-1.5 pl-0">
                          <span className="text-emerald-500 font-mono text-[10px] uppercase tracking-wider mr-2">🎬 Visual:</span>
                          {visualMatch[1]}
                        </p>
                      );
                    }
                    if (textMatch) {
                      return (
                        <p key={j} className="text-xs text-zinc-200 leading-relaxed mb-1.5 pl-0">
                          <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider mr-2">📝 Texto:</span>
                          "{textMatch[1]}"
                        </p>
                      );
                    }
                    if (sfxMatch) {
                      return (
                        <p key={j} className="text-xs text-zinc-300/80 leading-relaxed mb-1.5 pl-0">
                          <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider mr-2">🔊 SFX:</span>
                          {sfxMatch[1]}
                        </p>
                      );
                    }
                    if (voiceoverMatch) {
                      return (
                        <p key={j} className="text-xs text-zinc-300 italic leading-relaxed mb-1.5 pl-0 border-l-2 border-zinc-700 pl-3 ml-1">
                          <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider block mb-0.5">🎙️ Voiceover</span>
                          "{voiceoverMatch[1]}"
                        </p>
                      );
                    }
                    if (ctaMatch) {
                      return (
                        <p key={j} className="text-xs text-emerald-300 font-bold leading-relaxed mb-1.5 pl-0">
                          <span className="text-emerald-400 font-mono text-[10px] uppercase tracking-wider mr-2">👉 CTA:</span>
                          {ctaMatch[1]}
                        </p>
                      );
                    }
                    if (musicMatch) {
                      return (
                        <p key={j} className="text-xs text-zinc-300/90 leading-relaxed mb-1.5 pl-0">
                          <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider mr-2">🎵 Música:</span>
                          {musicMatch[1]}
                        </p>
                      );
                    }
                    if (hookMatch) {
                      return (
                        <p key={j} className="text-xs text-emerald-300/90 font-medium leading-relaxed mb-1.5 pl-0">
                          <span className="text-emerald-400 font-mono text-[10px] uppercase tracking-wider mr-2">🪝 Hook:</span>
                          {hookMatch[1]}
                        </p>
                      );
                    }
                    if (line.trim()) {
                      return (
                        <p key={j} className="text-xs text-zinc-400 leading-relaxed mb-1 pl-0">
                          {line}
                        </p>
                      );
                    }
                    return <div key={j} className="h-1" />;
                  })}
                </div>
              ))}
            </motion.div>
          )}

          {/* Asset Details Grid */}
          {currentAsset && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-zinc-900/30 border border-white/5 p-5 rounded-2xl w-full mb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h5 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">Tono Emocional</h5>
                    <p className="text-xs text-zinc-300 capitalize">{currentAsset.emotional_tone}</p>
                  </div>
                  <div>
                    <h5 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">Pacing / Ritmo</h5>
                    <p className="text-xs text-zinc-300">{currentAsset.pacing_notes}</p>
                  </div>
                  <div>
                    <h5 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">Call to Action</h5>
                    <p className="text-xs text-emerald-400 font-bold">{currentAsset.call_to_action}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">Background Audio</h5>
                    <p className="text-xs text-zinc-300">{currentAsset.music_background}</p>
                  </div>
                  {currentAsset.on_screen_text?.length > 0 && (
                    <div>
                      <h5 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">Textos Destacados</h5>
                      <div className="flex flex-wrap gap-1.5">
                        {currentAsset.on_screen_text.map((t: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] text-emerald-300 font-mono">"{t}"</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Copy buttons */}
          {currentAsset && (
            <div className="flex gap-3">
              <button onClick={copyMaster} className="flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all active:scale-95">
                <Clapperboard size={14} /> Copiar Prompt Maestro
              </button>
              <button onClick={copyVisual} className="flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all active:scale-95">
                <Eye size={14} className="text-emerald-400" /> Copiar Visual
              </button>
            </div>
          )}

          {/* Audience Insights */}
          {data.audience && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl w-full mt-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <UserCircle2 size={16} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-zinc-200 text-sm font-semibold mb-1">Target Persona: {data.audience.persona}</p>
                  <p className="text-xs text-zinc-500 italic leading-relaxed">"{data.audience.psychographics}"</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL: Phone Preview + Upload ── */}
      <div className="w-full xl:w-[420px] shrink-0 flex flex-col items-center pt-2">

        <div className="w-[280px] sm:w-[300px] md:w-[340px] relative flex p-1 bg-[#111] rounded-xl border border-white/10 mb-3">
          {([
            { id: 'video' as const, label: 'VIDEO', Icon: Video },
            { id: 'image' as const, label: 'IMAGEN', Icon: ImageIcon },
          ]).map(({ id, label, Icon }) => {
            const active = mediaType === id;
            return (
              <button
                key={id}
                onClick={() => setMediaType(id)}
                className="relative flex-1 flex items-center justify-center gap-2 py-2.5 min-h-[44px] text-xs font-bold rounded-lg transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
              >
                {active && (
                  <motion.span
                    layoutId="mediaTypePill"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="absolute inset-0 bg-emerald-500/15 border border-emerald-500/40 rounded-lg"
                  />
                )}
                <span className={`relative z-10 flex items-center gap-2 transition-colors duration-200 ${active ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  <Icon size={14} /> {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Platform Selector — single horizontal row, scroll-x with hidden scrollbar */}
        <div className="w-[280px] sm:w-[300px] md:w-[340px] mb-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-1.5 w-max">
            {PLATFORMS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setPlatform(id)}
                className={`flex items-center gap-1.5 px-3 py-2 min-h-[36px] rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 ${
                  platform === id
                    ? 'bg-emerald-500 text-black'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                }`}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Format Selector (only platforms with multiple native formats) */}
        {platform === 'instagram' ? (
          <div className="w-[280px] sm:w-[300px] md:w-[340px] flex gap-1.5 mb-4">
            {(['reel', 'feed', 'story'] as const).map(fmt => (
              <button
                key={fmt}
                onClick={() => setVideoFormat(fmt)}
                className={`flex-1 py-2 min-h-[34px] rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all duration-200 active:scale-95 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 ${
                  videoFormat === fmt
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                    : 'bg-zinc-900 border-white/5 text-zinc-500 hover:bg-zinc-800'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        ) : (
          <div className="mb-4" />
        )}

        {/* Phone Frame with Video Player */}
        <div className="relative w-[280px] sm:w-[300px] md:w-[340px] h-[560px] sm:h-[640px] md:h-[720px] bg-black border-[6px] sm:border-[8px] border-[#1c1c1e] rounded-[2.5rem] sm:rounded-[3.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] ring-1 ring-white/5 overflow-hidden flex flex-col shrink-0">
          {/* Dynamic island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-50" />

          <div className="flex-1 relative w-full h-full bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              {currentAsset?.video_url ? (
                <motion.div key="media-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 w-full h-full">
                  {/* Media layer */}
                  {mediaType === 'video' ? (
                    <>
                      {!videoStarted && (currentAsset.thumbnail_url || currentAsset.video_url) && (
                        <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0 z-10">
                          <img src={currentAsset.thumbnail_url || currentAsset.video_url} className="w-full h-full object-cover" alt="thumbnail"
                            onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000')}
                          />
                        </motion.div>
                      )}
                      <video key={currentAsset.video_url} src={currentAsset.video_url}
                        className="absolute inset-0 w-full h-full object-cover z-0"
                        controls={false} autoPlay={videoStarted} onPlay={() => setVideoStarted(true)} loop playsInline muted
                      />
                    </>
                  ) : (
                    <img src={currentAsset.video_url} className="absolute inset-0 w-full h-full object-cover z-0" alt="campaign media" />
                  )}
                </motion.div>
              ) : (
                <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center px-7 text-center"
                >
                  {/* Subtle brand gradient */}
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 via-zinc-900 to-black" />
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-emerald-500/10 blur-3xl rounded-full" />
                  </div>
                  <div className="relative z-10 flex flex-col items-center gap-5 max-w-[88%]">
                    <span className="text-emerald-400/80 text-[10px] font-mono tracking-[0.3em] uppercase">EtherAgent · Preview</span>
                    <p className="text-white font-black text-2xl leading-tight tracking-tight line-clamp-4 [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
                      {currentAsset?.on_screen_text?.[0] || currentAsset?.hook || 'Tu campaña aquí'}
                    </p>
                    <p className="text-zinc-400/90 text-[11px] leading-relaxed line-clamp-2">
                      Sube tu {mediaType === 'video' ? 'video' : 'imagen'} para ver el preview real
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Format-specific overlay (always on top of media) */}
            <AnimatePresence mode="wait">
              <motion.div key={`${platform}-${videoFormat}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 z-20 pointer-events-none">
                {platform === 'instagram' && videoFormat === 'reel' && <InstagramReelPreview hasMedia={!!currentAsset?.video_url} asset={currentAsset} />}
                {platform === 'instagram' && videoFormat === 'feed' && <InstagramFeedPreview hasMedia={!!currentAsset?.video_url} asset={currentAsset} />}
                {platform === 'instagram' && videoFormat === 'story' && <InstagramStoryPreview hasMedia={!!currentAsset?.video_url} asset={currentAsset} />}
                {platform === 'tiktok' && <TikTokPreview hasMedia={!!currentAsset?.video_url} asset={currentAsset} />}
                {platform === 'youtube' && <YouTubeShortPreview hasMedia={!!currentAsset?.video_url} asset={currentAsset} />}
                {platform === 'linkedin' && <LinkedInPreview hasMedia={!!currentAsset?.video_url} asset={currentAsset} />}
                {platform === 'twitter' && <TwitterPreview hasMedia={!!currentAsset?.video_url} asset={currentAsset} />}
              </motion.div>
            </AnimatePresence>

            {/* Play button (on top of overlay) */}
            {mediaType === 'video' && !videoStarted && currentAsset?.video_url && (
              <div className="absolute inset-0 z-30 flex items-center justify-center">
                <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onClick={() => setVideoStarted(true)}
                  className="w-16 h-16 rounded-full bg-black/35 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
                  aria-label="Reproducir"
                >
                  <Play size={26} className="ml-1" fill="currentColor" />
                </motion.button>
              </div>
            )}

          </div>
        </div>

        {/* ── UPLOAD DROPZONE ── */}
        <CampaignUploader
          uploading={uploading}
          hasMedia={!!currentAsset?.video_url}
          mediaType={mediaType}
          onFile={uploadFile}
          onMediaTypeDetected={setMediaType}
          className="mt-4 w-[280px] sm:w-[300px] md:w-[340px]"
        />

        {/* SEO / Hashtags */}
        {data.youtube_seo && (
          <div className="mt-4 border-t border-white/10 pt-4 w-[280px] sm:w-[300px] md:w-[340px]">
            <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">YouTube SEO</h4>
            <p className="text-sm font-bold text-white mb-2 line-clamp-2">{data.youtube_seo.video_title}</p>
            <div className="flex flex-wrap gap-1.5">
              {data.youtube_seo.hashtags?.map((tag: string) => (
                <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] text-zinc-400">{tag}</span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/dashboard/nexus-brain')}
          className="mt-6 w-[280px] sm:w-[300px] md:w-[340px] relative group overflow-hidden rounded-xl p-[1px]"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity" />
          <div className="relative px-6 py-4 bg-zinc-950 rounded-xl flex items-center justify-between transition-all group-hover:bg-zinc-900">
            <div className="flex flex-col text-left">
              <span className="text-white font-bold text-sm">Nueva Campaña</span>
              <span className="text-zinc-500 text-[11px] font-mono">Volver al Nexus Brain</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
