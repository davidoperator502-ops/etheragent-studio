import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVoiceStore } from '@/store/useVoiceStore';
import { useCampaignStudio } from '@/hooks/useCampaignStudio';
import { CampaignMasterPanel } from '@/components/campaign-studio/CampaignMasterPanel';
import { CampaignUploader } from '@/components/campaign-studio/CampaignUploader';
import { SaveCampaignButton } from '@/components/campaign-studio/SaveCampaignButton';
import { SurfaceSelector } from '@/components/campaign-studio/SurfaceSelector';
import { Sparkles, Zap, Loader2, Play, ArrowRight, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VirtualOOHLab() {
  const location = useLocation();
  const navigate = useNavigate();
  const studio = useCampaignStudio('ooh');
  const {
    config, loading, campaign, campaignData, currentAsset,
    videoStarted, setVideoStarted, mediaType, setMediaType,
    generatingDuration, generatedPrompts, generatePrompt, exportPrompts,
    uploading, uploadFile, copy, copyMaster, copyVisual,
    clients, fetchClients, savingCampaign, saveCampaign, deployCampaign,
  } = studio;

  const isDemo = location.state?.isDemo === true;
  const isFullDemo = location.state?.isFullDemo === true;
  const nextStep = location.state?.nextStep;

  const [surface, setSurface] = useState<string>(config.defaultSurfaceId);
  const [isCompiling, setIsCompiling] = useState(false);
  const [chatStep, setChatStep] = useState(1);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string; typing?: boolean }[]>([]);
  const [deploying, setDeploying] = useState(false);

  const { speak, stopSpeaking, isSpeaking } = useVoiceStore();

  const valeriaMsg1 = campaignData?.hook
    ? `🏙️ Analizando hook neural: "${campaignData.hook}". Preparando adaptación para pantallas de gran formato (Times Square / Shibuya).`
    : "🏙️ Analizando geometría del activo publicitario. Preparando adaptación para pantallas de gran formato (Times Square / Shibuya).";
  const valeriaMsg2 = campaignData?.narrative_body
    ? `📐 Integrando narrativa B2B: "${campaignData.narrative_body.substring(0, 150)}...". Calculando perspectiva anamórfica 3D (Efecto 'Out of Box').`
    : "📐 Calculando perspectiva anamórfica 3D (Efecto 'Out of Box'). Extruyendo elementos de primer plano para ilusión de profundidad.";
  const valeriaMsg3 = "✅ Renderizado volumétrico completado. Simulando tráfico peatonal masivo. Impacto visual estimado: +450% de retención frente a vallas tradicionales. Presiona Play para visualizar.";

  // Demo mode voice
  useEffect(() => {
    if (isDemo) {
      const viktorWelcome = "Bienvenido al Virtual OOH Lab, CEO. Soy Viktor, tu arquitecto espacial. Desplegaremos tu marca en vallas panorámicas 8K y el Metaverso. ¿Preparado para dominar el mundo real?";
      window.speechSynthesis.onvoiceschanged = () => speak(viktorWelcome, "viktor");
      if (window.speechSynthesis.getVoices().length > 0) speak(viktorWelcome, "viktor");
      if (isFullDemo && nextStep === 3) {
        setTimeout(() => {
          speak("Último paso. Transfiriendo a Kaelen en Performance Ads. Optimizaremos el ROAS.", "viktor");
          setTimeout(() => navigate('/dashboard/ads', { state: { isDemo: true, isFullDemo: true } }), 4500);
        }, 6000);
      }
    }
    return () => stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo]);

  const handleCompile = () => {
    setIsCompiling(true);
    setChatMessages([{ role: 'assistant', content: valeriaMsg1, typing: true }]);
    setTimeout(() => {
      setChatMessages(prev => prev.map(m => m.typing ? { ...m, typing: false } : m));
      setChatMessages(prev => [...prev, { role: 'assistant', content: valeriaMsg2, typing: true }]);
    }, 2500);
    setTimeout(() => {
      setChatMessages(prev => prev.map(m => m.typing ? { ...m, typing: false } : m));
      setChatMessages(prev => [...prev, { role: 'assistant', content: valeriaMsg3, typing: false }]);
      setIsCompiling(false);
      setChatStep(2);
    }, 5500);
  };

  const handleDeploy = async () => {
    setDeploying(true);
    await deployCampaign(surface);
    setDeploying(false);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-16 h-16 text-orange-400 animate-spin" />
        <p className="text-orange-400/80 font-mono text-xs tracking-[0.3em] uppercase animate-pulse">Cargando Virtual OOH Lab...</p>
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
            Inicia una ingestión en el Nexus Brain. Viktor adaptará tu campaña a vallas de gran formato (Times Square / Shibuya).
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/nexus-brain')}
          className="px-8 py-4 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-xl transition-all active:scale-95 shadow-[0_0_30px_rgba(249,115,22,0.3)] flex items-center gap-3"
        >
          <Brain size={18} /> Ir al Nexus Brain <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  const hasMedia = !!currentAsset?.video_url;

  return (
    <div className="flex flex-col xl:flex-row min-h-screen w-full bg-[#050505] text-white p-3 sm:p-4 md:p-8 gap-4 sm:gap-8 pb-32 overflow-x-hidden overflow-y-auto">

      {/* PANEL IZQUIERDO: Viktor + Motor */}
      <div className="flex-1 flex flex-col max-w-3xl">
        <header className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full border-2 border-orange-500/50 flex items-center justify-center bg-zinc-900">
              <span className="font-black text-2xl text-white">V</span>
              {isDemo && isSpeaking && <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold">Viktor S.</h2>
              <p className="text-orange-500 font-mono text-xs tracking-widest uppercase">Spatial Architect • {isDemo ? 'Demo Activa' : 'Active Session'}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
            <Brain size={14} className="text-orange-500" />
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Context: {new URL(campaign.target_url).hostname}</span>
          </div>
        </header>

        <div className="flex-1 bg-[#0a0a0c] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col relative shadow-2xl">
          <div className="flex items-start gap-2 mb-6">
            <Sparkles size={16} className="text-orange-500 mt-0.5 shrink-0" />
            <span className="text-orange-500 text-[10px] font-mono tracking-widest uppercase break-words pr-4">
              {campaignData?.detected_sector ? `Sector: ${campaignData.detected_sector}` : "Nodo: Neo-Shibuya"}
            </span>
          </div>

          {/* Hook + Narrativa (motor) */}
          {currentAsset && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 backdrop-blur-md border border-white/5 p-5 rounded-2xl w-full mb-5">
              <div className="space-y-4">
                <div>
                  <p className="text-orange-500 text-[10px] font-mono tracking-widest uppercase mb-2 flex items-center gap-2">
                    <Zap size={12} /> Gancho de Alto Impacto
                  </p>
                  <blockquote className="border-l-2 border-orange-500/30 pl-4 py-1 italic text-zinc-200 font-medium">"{currentAsset.hook}"</blockquote>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase mb-2">Narrativa de Campaña</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">{currentAsset.narrative_body}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Chat de Viktor (animación Encender Valla) */}
          {chatMessages.map((msg, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`bg-zinc-900/50 border border-white/10 p-5 rounded-2xl rounded-tl-sm w-[95%] mb-4 ${msg.typing ? 'border-orange-500/30' : ''}`}>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {msg.content}{msg.typing && <span className="inline-flex ml-1"><span className="animate-pulse">▊</span></span>}
              </p>
            </motion.div>
          ))}

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

          <div className="mt-5">
            <button onClick={handleCompile} disabled={isCompiling || chatStep === 2} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-300 transition-all active:scale-95 shadow-xl disabled:opacity-50">
              {isCompiling ? <Loader2 size={18} className="text-orange-500 animate-spin" /> : <Zap size={18} className="text-orange-500" />} Encender Valla
            </button>
          </div>
        </div>
      </div>

      {/* PANEL DERECHO: Preview espacial + Upload + Acciones */}
      <div className="w-full xl:w-[420px] shrink-0 flex flex-col items-center pt-2">

        <div className="w-[280px] sm:w-[300px] md:w-[340px] flex justify-between items-center mb-3 px-2">
          <h3 className="text-sm font-mono tracking-widest uppercase text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Spatial Preview
          </h3>
          {currentAsset && (
            <SaveCampaignButton surface={surface} clients={clients} saving={savingCampaign} fetchClients={fetchClients} onSave={saveCampaign} />
          )}
        </div>

        {/* Selector de superficie OOH */}
        <div className="w-[280px] sm:w-[300px] md:w-[340px] mb-4">
          <SurfaceSelector surfaces={config.surfaces} value={surface} onChange={setSurface} activeClass="bg-orange-500 text-black" />
        </div>

        {/* Móvil / pantalla espacial (340x720) */}
        <div className="relative w-[280px] sm:w-[300px] md:w-[340px] h-[560px] sm:h-[640px] md:h-[720px] bg-black border-[6px] sm:border-[8px] border-[#1c1c1e] rounded-[2.5rem] sm:rounded-[3.5rem] shadow-[0_0_50px_rgba(249,115,22,0.15)] overflow-hidden flex flex-col shrink-0">
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
                    <img src={currentAsset!.video_url} className="absolute inset-0 w-full h-full object-cover" alt="campaign media" />
                  )}
                </motion.div>
              ) : (
                <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center px-7 text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/15 via-zinc-900 to-black" />
                  <div className="relative z-10 flex flex-col items-center gap-5 max-w-[88%]">
                    <span className="text-orange-400/80 text-[10px] font-mono tracking-[0.3em] uppercase">{config.surfaces.find(s => s.id === surface)?.label} · Preview</span>
                    <p className="text-white font-black text-2xl leading-tight tracking-tight line-clamp-4 [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
                      {currentAsset?.on_screen_text?.[0] || currentAsset?.hook || 'Tu valla aquí'}
                    </p>
                    <p className="text-zinc-400/90 text-[11px] leading-relaxed">Sube tu activo de gran formato para previsualizarlo</p>
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

            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur text-[8px] font-mono text-orange-500 px-2 py-1 rounded z-20">NODE_ACTIVE_OOH</div>
          </div>
        </div>

        {/* Uploader */}
        <CampaignUploader uploading={uploading} hasMedia={hasMedia} mediaType={mediaType} onFile={uploadFile} onMediaTypeDetected={setMediaType} className="mt-4 w-[280px] sm:w-[300px] md:w-[340px]" />

        {/* Deploy */}
        <button
          onClick={handleDeploy}
          disabled={!hasMedia || deploying}
          className={`mt-4 sm:mt-6 w-[280px] sm:w-[300px] md:w-[340px] py-3 sm:py-4 rounded-xl font-black font-mono text-xs sm:text-sm tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
            hasMedia ? 'bg-orange-500 hover:bg-orange-400 text-black shadow-[0_0_30px_rgba(249,115,22,0.3)]' : 'bg-zinc-900 text-zinc-600 border border-white/5 cursor-not-allowed'
          }`}
        >
          {deploying ? <Loader2 size={16} className="animate-spin" /> : null}
          [ DEPLOY TO METAVERSE ]
        </button>

        <button
          onClick={() => navigate('/dashboard/nexus-brain')}
          className="mt-4 w-[280px] sm:w-[300px] md:w-[340px] relative group overflow-hidden rounded-xl p-[1px]"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity" />
          <div className="relative px-6 py-4 bg-zinc-950 rounded-xl flex items-center justify-between transition-all group-hover:bg-zinc-900">
            <div className="flex flex-col text-left">
              <span className="text-white font-bold text-sm">Nueva Campaña</span>
              <span className="text-zinc-500 text-[11px] font-mono">Volver al Nexus Brain</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/50 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-4 h-4 text-orange-400" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
