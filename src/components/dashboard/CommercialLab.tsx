import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaignStudio } from '@/hooks/useCampaignStudio';
import { CampaignMasterPanel } from '@/components/campaign-studio/CampaignMasterPanel';
import { CampaignUploader } from '@/components/campaign-studio/CampaignUploader';
import { SaveCampaignButton } from '@/components/campaign-studio/SaveCampaignButton';
import { SurfaceSelector } from '@/components/campaign-studio/SurfaceSelector';
import { Sparkles, Zap, Loader2, Film, Play, ArrowRight, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommercialLab() {
  const navigate = useNavigate();
  const studio = useCampaignStudio('commercial');
  const {
    config, loading, campaign, campaignData, currentAsset,
    videoStarted, setVideoStarted, mediaType, setMediaType,
    generatingDuration, generatedPrompts, generatePrompt, exportPrompts,
    uploading, uploadFile, copy, copyMaster, copyVisual,
    clients, fetchClients, savingCampaign, saveCampaign, deployCampaign,
  } = studio;

  const [surface, setSurface] = useState<string>(config.defaultSurfaceId);
  const [deploying, setDeploying] = useState(false);

  const handleDeploy = async () => {
    setDeploying(true);
    await deployCampaign(surface);
    setDeploying(false);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-16 h-16 text-emerald-400 animate-spin" />
        <p className="text-emerald-400/80 font-mono text-xs tracking-[0.3em] uppercase animate-pulse">Cargando Commercial Lab...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-8 text-center px-4">
        <div className="w-24 h-24 rounded-3xl bg-zinc-900/60 border border-white/10 flex items-center justify-center">
          <Film className="w-12 h-12 text-zinc-700" />
        </div>
        <div className="space-y-3 max-w-md">
          <h2 className="text-2xl font-black text-white tracking-tight">Sin Campaña Activa</h2>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Inicia una ingestión en el Nexus Brain. El pipeline masterizará tu campaña en formato cinematográfico HDR para Streaming / TV conectada.
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

  const hasMedia = !!currentAsset?.video_url;

  return (
    <div className="flex flex-col xl:flex-row min-h-screen w-full bg-[#050505] text-white p-3 sm:p-4 md:p-8 gap-4 sm:gap-8 pb-32 overflow-x-hidden overflow-y-auto">

      {/* LEFT PANEL: Commercial Studio + Motor */}
      <div className="flex-1 flex flex-col max-w-3xl">
        <header className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full border-2 border-emerald-500/50 flex items-center justify-center bg-zinc-900">
              <Film className="text-emerald-400" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Commercial Studio</h2>
              <p className="text-emerald-400 font-mono text-xs tracking-widest uppercase">Cinematic Asset Pipeline • Active Session</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <Brain size={12} className="text-zinc-500" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{new URL(campaign.target_url).hostname}</span>
          </div>
        </header>

        <div className="flex-1 bg-[#0a0a0c] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col relative shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-400" />
              <span className="text-emerald-400 text-[10px] font-mono tracking-widest uppercase">Nodo: Commercial Studio</span>
            </div>
            {currentAsset && (
              <SaveCampaignButton surface={surface} clients={clients} saving={savingCampaign} fetchClients={fetchClients} onSave={saveCampaign} />
            )}
          </div>

          {/* Hook + Narrativa (motor) */}
          {currentAsset && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 backdrop-blur-md border border-white/5 p-5 rounded-2xl w-full mb-5">
              <div className="space-y-4">
                <div>
                  <p className="text-emerald-500 text-[10px] font-mono tracking-widest uppercase mb-2 flex items-center gap-2">
                    <Zap size={12} /> Cinematic Hook
                  </p>
                  <blockquote className="border-l-2 border-emerald-500/30 pl-4 py-1 italic text-zinc-200 font-medium">"{currentAsset.hook}"</blockquote>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase mb-2">Narrativa de Campaña</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">{currentAsset.narrative_body}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Motor: estrategia + guiones + detalles + copiar */}
          {currentAsset && (
            <CampaignMasterPanel
              currentAsset={currentAsset}
              generatedPrompts={generatedPrompts}
              generatingDuration={generatingDuration}
              onGenerate={(dur) => generatePrompt(dur, surface)}
              onExport={() => exportPrompts(surface)}
              onCopy={copy}
              onCopyMaster={copyMaster}
              onCopyVisual={copyVisual}
            />
          )}

          {/* Pipeline info */}
          <div className="mt-5 glass-panel p-4 rounded-xl flex items-center gap-4 bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Zap size={18} className="text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Pipeline de Renderizado</p>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-tighter">HDR Cinema Master • Spatial Audio v4</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Preview + Upload + Acciones */}
      <div className="w-full xl:w-[420px] shrink-0 flex flex-col items-center pt-2">

        <div className="w-[280px] sm:w-[300px] md:w-[340px] flex justify-between items-center mb-3 px-2">
          <h3 className="text-sm font-mono tracking-widest uppercase text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Ad Preview
          </h3>
        </div>

        {/* Selector de canal/superficie */}
        <div className="w-[280px] sm:w-[300px] md:w-[340px] mb-4">
          <SurfaceSelector surfaces={config.surfaces} value={surface} onChange={setSurface} activeClass="bg-emerald-500 text-black" />
        </div>

        {/* Preview cinematográfico (340x720) */}
        <div className="relative w-[280px] sm:w-[300px] md:w-[340px] h-[560px] sm:h-[640px] md:h-[720px] bg-black border-[6px] sm:border-[8px] border-[#1c1c1e] rounded-[2.5rem] sm:rounded-[3.5rem] shadow-[0_0_50px_rgba(16,185,129,0.15)] overflow-hidden flex flex-col shrink-0">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-50" />
          <div className="flex-1 relative w-full h-full bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              {hasMedia ? (
                <motion.div key="media" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 w-full h-full">
                  {mediaType === 'video' ? (
                    <video key={currentAsset!.video_url} src={currentAsset!.video_url}
                      className="absolute inset-0 w-full h-full object-cover" controls={false}
                      autoPlay={videoStarted} onPlay={() => setVideoStarted(true)} loop playsInline muted />
                  ) : (
                    <img src={currentAsset!.video_url} className="absolute inset-0 w-full h-full object-cover" alt="commercial media" />
                  )}
                </motion.div>
              ) : (
                <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center px-7 text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-zinc-900 to-black" />
                  <div className="relative z-10 flex flex-col items-center gap-5 max-w-[88%]">
                    <Film size={40} className="text-emerald-500/40" />
                    <span className="text-emerald-400/80 text-[10px] font-mono tracking-[0.3em] uppercase">{config.surfaces.find(s => s.id === surface)?.label} · 16:9 HDR</span>
                    <p className="text-white font-black text-2xl leading-tight tracking-tight line-clamp-4 [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
                      {currentAsset?.on_screen_text?.[0] || currentAsset?.hook || 'Tu spot aquí'}
                    </p>
                    <p className="text-zinc-400/90 text-[11px] leading-relaxed">Sube tu activo cinematográfico para previsualizarlo</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {mediaType === 'video' && !videoStarted && hasMedia && (
              <div className="absolute inset-0 z-30 flex items-center justify-center">
                <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => setVideoStarted(true)}
                  className="w-16 h-16 rounded-full bg-black/35 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-lg" aria-label="Reproducir">
                  <Play size={26} className="ml-1" fill="currentColor" />
                </motion.button>
              </div>
            )}

            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-[8px] font-mono text-emerald-400 px-2 py-1 rounded z-20">NODE_ACTIVE_COMMERCIAL</div>
          </div>
        </div>

        {/* Uploader */}
        <CampaignUploader uploading={uploading} hasMedia={hasMedia} mediaType={mediaType} onFile={uploadFile} onMediaTypeDetected={setMediaType} className="mt-4 w-[280px] sm:w-[300px] md:w-[340px]" />

        {/* Deploy */}
        <button
          onClick={handleDeploy}
          disabled={!hasMedia || deploying}
          className={`mt-4 sm:mt-6 w-[280px] sm:w-[300px] md:w-[340px] py-3 sm:py-4 rounded-xl font-black font-mono text-xs sm:text-sm tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
            hasMedia ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-95' : 'bg-zinc-900 text-zinc-600 border border-white/5 cursor-not-allowed'
          }`}
        >
          {deploying ? <Loader2 size={16} className="animate-spin" /> : null}
          [ DEPLOY TO NETWORKS ]
        </button>

        <button
          onClick={() => navigate('/dashboard/nexus-brain')}
          className="mt-4 w-[280px] sm:w-[300px] md:w-[340px] relative group overflow-hidden rounded-xl p-[1px]"
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
