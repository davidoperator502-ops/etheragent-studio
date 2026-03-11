import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Sparkles, Loader2, CheckCircle2, ArrowRight, Play, Activity, Globe, DollarSign, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MISSIONS = [
  { id: 'ecommerce', title: 'Shopify Viral Supremacy', niche: 'E-Commerce / DTC', budget: '$50k', target: '$1.2M MRR', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { id: 'saas', title: 'B2B Enterprise Scale', niche: 'SaaS / Tech', budget: '$120k', target: '$5M ARR', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { id: 'fintech', title: 'Neobank Acquisition', niche: 'Fintech', budget: '$250k', target: '100k Users', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { id: 'web3', title: 'Token Airdrop Hype', niche: 'Web3 / Crypto', budget: '$80k', target: 'Viral FOMO', icon: DollarSign, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30' }
];

const AGENTS_SEQUENCE = [
  { stepId: 'hub', agent: 'Marcus V.', role: 'SISTEMA OPERATIVO', color: 'text-blue-500', bg: 'bg-blue-500', chatContext: 'NODO CENTRAL', metrics: { roas: '0.0x', views: '0', cac: '$0.00' } },
  { stepId: 'social', agent: 'Valeria M.', role: 'LEAD GROWTH HACKER', color: 'text-emerald-500', bg: 'bg-emerald-500', chatContext: 'VIRAL DYNAMICS', metrics: { roas: '1.2x', views: '245k', cac: '$0.12' } },
  { stepId: 'ooh', agent: 'Viktor S.', role: 'SPATIAL ARCHITECT', color: 'text-orange-500', bg: 'bg-orange-500', chatContext: 'NODO: NEO-SHIBUYA (21:9)', metrics: { roas: '2.8x', views: '1.4M', cac: '$0.08' } },
  { stepId: 'commercial', agent: 'Kaelen R.', role: 'CONVERSION ARCHITECT', color: 'text-purple-500', bg: 'bg-purple-500', chatContext: 'CINEMATIC AD PREVIEW', metrics: { roas: '4.5x', views: '3.2M', cac: '$0.04' } }
];

export default function ExecutiveDemo() {
  const navigate = useNavigate();
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [missionVisuals, setMissionVisuals] = useState<Record<string, string>>({});
  const [currentText, setCurrentText] = useState("");
  const [typedText, setTypedText] = useState("");
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeAgent = AGENTS_SEQUENCE[currentStepIndex];

  useEffect(() => {
    if (!selectedMission) return;
    const fetchVisuals = async () => {
      const { data } = await supabase.from('visual_assets').select('id, url').like('id', `demo_${selectedMission}_%`);
      if (data) {
        const visualsMap: Record<string, string> = {};
        data.forEach(item => visualsMap[item.id] = item.url);
        setMissionVisuals(visualsMap);
      }
    };
    fetchVisuals();
  }, [selectedMission]);

  useEffect(() => {
    if (!currentText || isComplete) return;
    setTypedText("");
    let i = 0;
    const typingInterval = setInterval(() => {
      setTypedText(prev => prev + currentText.charAt(i));
      i++;
      if (i >= currentText.length) clearInterval(typingInterval);
    }, 35); 
    return () => clearInterval(typingInterval);
  }, [currentText, isComplete]);

  useEffect(() => {
    if (!selectedMission || isComplete) return;

    const playStepSequence = async (stepIndex: number) => {
      if (stepIndex >= AGENTS_SEQUENCE.length) {
        setIsComplete(true);
        return;
      }
      
      setIsPlaying(true);
      const stepName = AGENTS_SEQUENCE[stepIndex].stepId;
      const audioDbId = `tr_${selectedMission}_${stepName}`;

      try {
        const { data, error } = await supabase.from('system_scripts').select('audio_url, script_text').eq('id', audioDbId).single();
        
        if (data?.script_text) setCurrentText(data.script_text);
        else setCurrentText("Procesando vectores de la misión...");

        if (error || !data?.audio_url) throw new Error("Audio no encontrado");

        const audio = new Audio(data.audio_url);
        audioRef.current = audio;
        audio.onended = () => {
          setIsPlaying(false);
          setCurrentStepIndex(prev => prev + 1);
        };
        await audio.play();

      } catch (err) {
        console.warn(`Fallback ejecutado para: ${audioDbId}`);
        setTimeout(() => { setIsPlaying(false); setCurrentStepIndex(prev => prev + 1); }, 4000);
      }
    };

    playStepSequence(currentStepIndex);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [currentStepIndex, selectedMission, isComplete]);

  if (!selectedMission) {
    return (
      <div className="min-h-screen w-full bg-[#050505] text-white p-8 flex flex-col items-center justify-center">
        <div className="max-w-5xl w-full">
          <header className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              Task <span className="text-zinc-500">Replay</span> Gallery
            </h1>
            <p className="text-zinc-400 font-mono uppercase tracking-widest text-xs">
              Selecciona una topología de campaña para iniciar la demostración en tiempo real.
            </p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MISSIONS.map(mission => (
              <div key={mission.id} onClick={() => setSelectedMission(mission.id)} className="group bg-[#0a0a0c] border border-white/5 hover:border-white/20 p-8 rounded-3xl cursor-pointer transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.02)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex justify-between items-start mb-12 relative z-10">
                  <div className={`p-4 rounded-2xl ${mission.bg} ${mission.color} border ${mission.border}`}>
                    <mission.icon size={24} />
                  </div>
                  <div className="text-right">
                    <span className="block text-zinc-500 font-mono text-[10px] uppercase mb-1">Target</span>
                    <span className="font-bold text-white tracking-wider">{mission.target}</span>
                  </div>
                </div>
                <div className="relative z-10">
                  <span className={`font-mono text-[10px] tracking-widest uppercase mb-2 block ${mission.color}`}>{mission.niche}</span>
                  <h3 className="text-2xl font-bold mb-4">{mission.title}</h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 group-hover:text-white transition-colors">
                    <Play size={14} /> INICIAR SIMULACIÓN
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activeVisualId = `demo_${selectedMission}_${activeAgent?.stepId}`;
  const currentAssetUrl = missionVisuals[activeVisualId];
  const isVideoAsset = currentAssetUrl && (currentAssetUrl.includes('.mp4') || currentAssetUrl.includes('.webm') || currentAssetUrl.includes('.mov'));

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col overflow-hidden relative">
      
      <div className="h-16 border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur flex items-center justify-between px-8 z-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-400">Ejecución Automática • {selectedMission.toUpperCase()}</span>
        </div>
        {!isComplete && activeAgent && (
          <motion.div key={activeAgent.stepId} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-8 font-mono text-xs">
            <div className="flex flex-col items-end"><span className="text-zinc-500 uppercase text-[9px]">Est. ROAS</span><span className="text-emerald-500 font-bold">{activeAgent.metrics.roas}</span></div>
            <div className="flex flex-col items-end"><span className="text-zinc-500 uppercase text-[9px]">Views / Imp.</span><span className="text-white font-bold">{activeAgent.metrics.views}</span></div>
            <div className="flex flex-col items-end"><span className="text-zinc-500 uppercase text-[9px]">CAC Proyectado</span><span className="text-blue-500 font-bold">{activeAgent.metrics.cac}</span></div>
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!isComplete && activeAgent ? (
          <motion.div key={activeAgent.stepId} initial={{ opacity: 0, filter: 'blur(5px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(5px)' }} transition={{ duration: 0.8 }} className="flex-1 flex flex-col xl:flex-row p-4 md:p-8 gap-12 w-full max-w-[1400px] mx-auto items-center">
            
            <div className="flex-1 flex flex-col w-full">
              <div className="flex items-center gap-4 mb-8">
                <div className={`relative w-16 h-16 rounded-full border border-white/10 flex items-center justify-center bg-zinc-900`}>
                   <span className="font-black text-2xl text-white">{activeAgent.agent.charAt(0)}</span>
                   {isPlaying && <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full animate-pulse ${activeAgent.bg}`} />}
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight">{activeAgent.agent}</h2>
                  <p className={`${activeAgent.color} font-mono text-xs tracking-widest uppercase mt-1`}>{activeAgent.role}</p>
                </div>
              </div>

              <div className="bg-[#0a0a0c] border border-white/5 rounded-3xl p-8 shadow-2xl relative min-h-[250px] flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles size={14} className={activeAgent.color} />
                  <span className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase">{activeAgent.chatContext}</span>
                </div>
                <div className="bg-[#111] p-6 rounded-2xl border border-white/5 relative flex-1">
                  <div className={`absolute top-0 left-0 w-1 h-full ${activeAgent.bg} rounded-l-sm`} />
                  <p className="text-lg text-zinc-300 leading-relaxed">
                    {typedText}
                    {isPlaying && <span className={`inline-block w-2 h-5 ml-1 align-middle animate-pulse ${activeAgent.bg}`} />}
                  </p>
                </div>
                {isPlaying && (
                  <div className="absolute bottom-8 right-8 flex gap-1 items-end h-6">
                    {[1,2,3,4,5].map(i => <div key={i} className={`w-1 rounded-full animate-pulse ${activeAgent.bg}`} style={{ height: `${30 + Math.random() * 70}%`, animationDelay: `${i * 0.1}s` }} />)}
                  </div>
                )}
              </div>
            </div>

            <div className="w-[340px] shrink-0 flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-4 px-2">
                <h3 className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">Live Preview</h3>
              </div>

              <div className="relative w-[340px] h-[720px] bg-black border-[8px] border-[#1c1c1e] rounded-[3.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-50" />
                <div className="flex-1 relative bg-zinc-900 w-full h-full flex items-center justify-center">
                  
                  {currentAssetUrl ? (
                    isVideoAsset ? (
                      <video src={currentAssetUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-90" />
                    ) : (
                      <img src={currentAssetUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                    )
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                       <Loader2 className="animate-spin text-zinc-600" size={32} />
                       <span className="text-[10px] font-mono uppercase text-zinc-500">Esperando Asset</span>
                    </div>
                  )}

                  <motion.div 
                    initial={{ top: '0%' }} animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
                    className={`absolute left-0 w-full h-px ${activeAgent.bg} shadow-[0_0_15px_currentColor] opacity-50 z-30`}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex items-center justify-center p-8">
            <div className="border border-white/5 bg-[#0a0a0c] rounded-3xl p-16 text-center max-w-2xl w-full">
              <div className="w-20 h-20 mx-auto bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-500 mb-8"><CheckCircle2 size={40} /></div>
              <h2 className="text-3xl font-bold mb-4">Misión Completada</h2>
              <p className="text-zinc-500 text-sm mb-10">La campaña para {selectedMission.toUpperCase()} ha sido procesada por los 4 nodos. Lista para inyección en el mercado real.</p>
              <button onClick={() => { setIsComplete(false); setSelectedMission(null); setCurrentStepIndex(0); }} className="bg-white text-black hover:bg-zinc-200 px-8 py-3 rounded-xl font-bold text-sm transition-colors">Volver a la Galería</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
