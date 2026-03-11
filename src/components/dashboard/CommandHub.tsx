import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaignStore } from '../../store/useCampaignStore';
import { useVoiceStore } from '../../store/useVoiceStore';
import { supabase } from '../../lib/supabaseClient';
import { Mic, Activity, Globe, Image as ImageIcon, PlayCircle, Cpu, Loader2, Sparkles, CheckCircle2, Target, X, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommandHub() {
  const navigate = useNavigate();
  const [command, setCommand] = useState('');
  const [isSystemSpeaking, setIsSystemSpeaking] = useState(false);
  const [systemAudioLoaded, setSystemAudioLoaded] = useState(false);
  const [showExecutiveDemo, setShowExecutiveDemo] = useState(false);

  const setInputs = useCampaignStore((state) => state.setInputs);
  const { stopSpeaking, isListening, setListening } = useVoiceStore();

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // FUNCIÓN MAESTRA DE REPRODUCCIÓN (Lee de Supabase)
  const playSystemAudio = async (scriptId: string, onEndCallback?: () => void) => {
    try {
      setIsSystemSpeaking(true);

      const { data, error } = await supabase
        .from('system_scripts')
        .select('audio_url')
        .eq('id', scriptId)
        .single();

      if (error || !data?.audio_url) {
        throw new Error("Audio no encontrado en BD");
      }

      const audio = new Audio(data.audio_url);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSystemSpeaking(false);
        if (onEndCallback) onEndCallback();
      };

      await audio.play();

    } catch (err) {
      console.warn(`[Command Hub] Error reproduciendo ${scriptId}. Ejecutando callback de todos modos.`, err);
      setIsSystemSpeaking(false);
      // Fallback: Si falla el audio, no bloqueamos la app, seguimos el flujo
      if (onEndCallback) setTimeout(onEndCallback, 1500);
    }
  };

  // 1. LA BIENVENIDA NEURONAL (Al montar el componente)
  useEffect(() => {
    // Evitar que hable dos veces en React Strict Mode
    if (systemAudioLoaded) return;
    setSystemAudioLoaded(true);

    // Cuando termine de hablar, prendemos el micro
    const onWelcomeEnd = () => {
      toggleListening(true);
    };

    // Lanzar la bienvenida de Marcus
    playSystemAudio('ch_welcome', onWelcomeEnd);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  // 2. CONFIGURACIÓN DEL MICRÓFONO
  const toggleListening = (forceStart = false) => {
    if (isListening && !forceStart) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Tu navegador no soporta comandos de voz. Usa Chrome.");

    // Detener cualquier audio que esté sonando si el usuario interrumpe
    if (audioRef.current) audioRef.current.pause();
    setIsSystemSpeaking(false);

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results).map((result: any) => result[0].transcript).join('');
      setCommand(currentTranscript);
    };

    recognition.onend = () => {
      setListening(false);
      if (command.length > 2) processVoiceCommand(command);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // 3. EL CEREBRO DE ENRUTAMIENTO (Con respuestas Premium)
  const processVoiceCommand = (text: string) => {
    const lowerText = text.toLowerCase();

    // CASO A: Demostración Ejecutiva (Opción 3)
    if (lowerText.includes('tres') || lowerText.includes('3') || lowerText.includes('demostración') || lowerText.includes('demo')) {
      playSystemAudio('ch_opt3_demo', () => {
        setShowExecutiveDemo(true);
      });
      return;
    }

    // CASO B: Inyección Visual (Opción 2)
    if (lowerText.includes('dos') || lowerText.includes('2') || lowerText.includes('visual')) {
      playSystemAudio('ch_opt2_visual', () => {
        navigate('/dashboard/visual-matrix');
      });
      return;
    }

    // CASO C: Creación de Campaña (Opción 1)
    setInputs('', text);
    playSystemAudio('ch_opt1_neural', () => {
      // Por ahora lo mandamos al Social Lab directo (el Nexus ya no existe)
      navigate('/dashboard/social');
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processVoiceCommand(command);
  };

  return (
    <div className="flex flex-col h-full min-h-screen w-full bg-[#050505] text-white p-4 md:p-8 pb-32">
      <div className="max-w-6xl mx-auto w-full mt-8 md:mt-12 text-center relative flex flex-col items-center">

        {/* Indicador de Voz Activa (Ondas) */}
        <div className="flex justify-center mb-6 h-12">
          {isSystemSpeaking ? (
            <div className="flex gap-1 items-end h-8">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-1.5 bg-blue-500 rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          ) : (
            <div className="h-8"></div> // Espaciador
          )}
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
          Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">Hub</span>
        </h1>
        <p className="text-zinc-500 font-mono uppercase tracking-widest text-sm mb-12 flex items-center justify-center gap-2">
          <Cpu size={16} className="text-blue-500" /> Marcus V. • Sistema Operativo Central
        </p>

        {/* Input con Botón de Micro Pulsante */}
        <form onSubmit={handleManualSubmit} className="relative w-full max-w-2xl mb-12">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Ej: Opción 3, o 'Crear campaña para Nike'..."
            className="w-full bg-[#111] border border-white/10 rounded-xl py-4 pl-6 pr-16 text-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50"
          />
          <button type="button" onClick={() => toggleListening(false)} className={`absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-lg transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'}`}>
            <Mic size={20} />
          </button>
        </form>

        {/* LAS 3 OPCIONES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
          <div onClick={() => processVoiceCommand("opcion 1")} className="bg-[#0a0a0c] border border-white/5 hover:border-blue-500/50 p-8 rounded-3xl transition-all duration-300 group text-left cursor-pointer">
            <Globe className="text-blue-500 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">1. Escaneo Neural</h3>
            <p className="text-sm text-zinc-400">Genera estrategia completa desde una URL.</p>
          </div>

          <div onClick={() => processVoiceCommand("opcion 2")} className="bg-[#0a0a0c] border border-white/5 hover:border-emerald-500/50 p-8 rounded-3xl transition-all duration-300 group text-left cursor-pointer">
            <ImageIcon className="text-emerald-500 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">2. Inyección Visual</h3>
            <p className="text-sm text-zinc-400">Sube assets para tus campañas.</p>
          </div>

          <div onClick={() => { playSystemAudio('ch_opt3_demo', () => setShowExecutiveDemo(true)); }} className="bg-gradient-to-b from-rose-900/20 to-[#0a0a0c] border border-rose-500/30 hover:border-rose-500 p-8 rounded-3xl transition-all duration-300 group text-left cursor-pointer">
            <PlayCircle className="text-rose-500 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">3. Demo Ejecutiva</h3>
            <p className="text-sm text-rose-200/70">Mira la sincronización Multi-Agente en tiempo real.</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showExecutiveDemo && (
          <ExecutiveDemoPanel onClose={() => setShowExecutiveDemo(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- COMPONENTE INTEGRADO: EXECUTIVE DEMO PANEL ---
const MISSIONS = [
  { id: 'ecommerce', title: 'Shopify Viral Supremacy', niche: 'E-Commerce / DTC', budget: '$50k', target: '$1.2M MRR', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { id: 'saas', title: 'B2B Enterprise Scale', niche: 'SaaS / Tech', budget: '$120k', target: '$5M ARR', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { id: 'fintech', title: 'Neobank Acquisition', niche: 'Fintech', budget: '$250k', target: '100k Users', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { id: 'web3', title: 'Token Airdrop Hype', niche: 'Web3 / Crypto', budget: '$80k', target: 'Viral FOMO', icon: DollarSign, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30' }
];

const DEMO_STEPS = [
  { 
    id: 'tr_hub', agent: 'Marcus V.', role: 'SISTEMA OPERATIVO',
    color: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-500/30',
    chatContext: 'NODO CENTRAL',
    systemPrompt: "Sistemas en línea. Bienvenido al motor de compilación neuronal de EtherAgent OS. La estrategia ha sido trazada y los vectores están listos. Transfiriendo el control a los laboratorios especializados.",
    imagePreview: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=340',
    metrics: { roas: '0.0x', views: '0', cac: '$0.00' }
  },
  { 
    id: 'tr_social', agent: 'Valeria M.', role: 'LEAD GROWTH HACKER',
    color: 'text-emerald-500', bg: 'bg-emerald-500', border: 'border-emerald-500/30',
    chatContext: 'VIRAL DYNAMICS',
    systemPrompt: "Vector de retención optimizado. He procesado la gráfica estática y el asset de video. El algoritmo predictivo indica un 87 por ciento de retención en los primeros tres segundos. El copy ataca directamente el dolor de las agencias tradicionales. Compilación lista.",
    imagePreview: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=340',
    metrics: { roas: '1.2x', views: '245k', cac: '$0.12' },
    isReel: true
  },
  { 
    id: 'tr_ooh', agent: 'Viktor S.', role: 'SPATIAL ARCHITECT',
    color: 'text-orange-500', bg: 'bg-orange-500', border: 'border-orange-500/30',
    chatContext: 'NODO: NEO-SHIBUYA (21:9)',
    systemPrompt: "Inventario digital asegurado en el nodo Neo-Shibuya. El asset panorámico está en caché. Desplegando holograma a escala urbana para dominar el espacio visual. Contraste al máximo.",
    imagePreview: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=340',
    metrics: { roas: '2.8x', views: '1.4M', cac: '$0.08' }
  },
  { 
    id: 'tr_commercial', agent: 'Kaelen R.', role: 'CONVERSION ARCHITECT',
    color: 'text-purple-500', bg: 'bg-purple-500', border: 'border-purple-500/30',
    chatContext: 'CINEMATIC AD PREVIEW',
    systemPrompt: "Video Sales Letter de treinta segundos compilado. Formato óptimo para Meta y LinkedIn. He construido una narrativa de valor que cierra con autoridad. El spot está listo para el despliegue masivo en la red.",
    imagePreview: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&q=80&w=340',
    metrics: { roas: '4.5x', views: '3.2M', cac: '$0.04' }
  }
];

function ExecutiveDemoPanel({ onClose }: { onClose: () => void }) {
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [typedText, setTypedText] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentStep = DEMO_STEPS[currentStepIndex];

  useEffect(() => {
    if (!selectedMission || isComplete || !currentStep) return;
    setTypedText("");
    const textToType = currentStep.systemPrompt;
    let i = 0;
    const typingInterval = setInterval(() => {
      setTypedText(prev => prev + textToType.charAt(i));
      i++;
      if (i >= textToType.length) clearInterval(typingInterval);
    }, 35);
    return () => clearInterval(typingInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex, selectedMission, isComplete]);

  useEffect(() => {
    if (!selectedMission || isComplete) return;

    const playStepAudio = async (stepIndex: number) => {
      if (stepIndex >= DEMO_STEPS.length) {
        setIsComplete(true);
        return;
      }
      setIsPlaying(true);
      const stepId = DEMO_STEPS[stepIndex].id;

      try {
        const { data } = await supabase.from('system_scripts').select('audio_url').eq('id', stepId).single();
        if (!data?.audio_url) throw new Error("Audio no inyectado");

        const audio = new Audio(data.audio_url);
        audioRef.current = audio;
        audio.onended = () => {
          setIsPlaying(false);
          setCurrentStepIndex(prev => prev + 1);
        };
        await audio.play();
      } catch {
        setTimeout(() => { setIsPlaying(false); setCurrentStepIndex(prev => prev + 1); }, 4000);
      }
    };

    playStepAudio(currentStepIndex);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [currentStepIndex, selectedMission, isComplete]);

  const handleReset = () => {
    setIsComplete(false);
    setSelectedMission(null);
    setCurrentStepIndex(0);
  };

  // Gallery View
  if (!selectedMission) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur flex items-center justify-center p-4"
      >
        <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black">Task <span className="text-zinc-500">Replay</span> Gallery</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MISSIONS.map(mission => (
              <div key={mission.id} 
                   onClick={() => setSelectedMission(mission.id)}
                   className="group bg-[#0a0a0c] border border-white/5 hover:border-white/20 p-6 rounded-2xl cursor-pointer transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-xl ${mission.bg} ${mission.color} border ${mission.border}`}>
                    <mission.icon size={20} />
                  </div>
                  <div className="text-right">
                    <span className="block text-zinc-500 font-mono text-[10px] uppercase">Target</span>
                    <span className="font-bold text-white text-sm">{mission.target}</span>
                  </div>
                </div>
                <span className={`font-mono text-[10px] tracking-widest uppercase block mb-2 ${mission.color}`}>{mission.niche}</span>
                <h3 className="text-lg font-bold mb-2">{mission.title}</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 group-hover:text-white transition-colors">
                  <PlayCircle size={14} /> INICIAR SIMULACIÓN
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // Replay View
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#050505] flex flex-col"
    >
      <div className="h-14 border-b border-white/5 bg-[#0a0a0c]/80 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-400">Ejecución Automática</span>
        </div>
        {currentStep && !isComplete && (
          <div className="flex gap-6 font-mono text-xs">
            <div className="flex flex-col items-end"><span className="text-zinc-500 uppercase text-[9px]">Est. ROAS</span><span className="text-emerald-500 font-bold">{currentStep.metrics.roas}</span></div>
            <div className="flex flex-col items-end"><span className="text-zinc-500 uppercase text-[9px]">Views</span><span className="text-white font-bold">{currentStep.metrics.views}</span></div>
            <div className="flex flex-col items-end"><span className="text-zinc-500 uppercase text-[9px]">CAC</span><span className="text-blue-500 font-bold">{currentStep.metrics.cac}</span></div>
          </div>
        )}
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {!isComplete && currentStep ? (
          <div className="flex-1 flex flex-col md:flex-row p-6 md:p-10 gap-10 items-center justify-center">
            {/* Left: Agent Chat */}
            <div className="flex-1 w-full max-w-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-zinc-900`}>
                   <span className="font-black text-xl text-white">{currentStep.agent.charAt(0)}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black">{currentStep.agent}</h2>
                  <p className={`${currentStep.color} font-mono text-[10px] tracking-widest uppercase`}>{currentStep.role}</p>
                </div>
              </div>
              <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={14} className={currentStep.color} />
                  <span className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase">{currentStep.chatContext}</span>
                </div>
                <div className="bg-[#111] p-4 rounded-xl border border-white/5">
                  <div className={`absolute top-0 left-0 w-1 h-full ${currentStep.bg} rounded-l-sm`} />
                  <p className="text-base text-zinc-300 leading-relaxed">
                    {typedText}
                    {isPlaying && <span className={`inline-block w-2 h-5 ml-1 align-middle animate-pulse ${currentStep.bg}`} />}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Phone Preview */}
            <div className="w-[280px] shrink-0">
              <div className="relative w-[280px] h-[600px] bg-black border-[6px] border-[#1c1c1e] rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-50" />
                <img src={currentStep.imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                {currentStep.isReel && (
                  <div className="absolute inset-0 z-20 flex flex-col justify-between p-3 bg-gradient-to-b from-black/40 via-transparent to-black/60 pt-8">
                    <div className="mt-2"><span className="text-white font-bold text-sm drop-shadow-md">Para ti</span></div>
                    <div className="flex justify-between items-end mb-4">
                      <div className="flex flex-col gap-1 max-w-[70%]">
                        <span className="text-white font-bold text-xs drop-shadow-md">@NeuroBoost</span>
                        <p className="text-white text-xs drop-shadow-md">La energía del futuro. ⚡️</p>
                      </div>
                    </div>
                  </div>
                )}
                <motion.div 
                  initial={{ top: '0%' }} animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
                  className={`absolute left-0 w-full h-px ${currentStep.bg} shadow-[0_0_15px_currentColor] opacity-50 z-30`}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="border border-white/5 bg-[#0a0a0c] rounded-2xl p-12 text-center max-w-md">
              <div className="w-16 h-16 mx-auto bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-500 mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-3">Compilación Exitosa</h2>
              <p className="text-zinc-500 text-sm mb-8">La topología de campaña ha sido sincronizada.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={handleReset} className="bg-white text-black px-6 py-2 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors">
                  Repetir
                </button>
                <button onClick={onClose} className="border border-white/20 px-6 py-2 rounded-xl font-bold text-sm hover:bg-white/5 transition-colors">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
