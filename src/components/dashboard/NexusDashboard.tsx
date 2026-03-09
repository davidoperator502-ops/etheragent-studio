import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe, Scan, Cpu, Terminal, ArrowRight, Video,
  Smartphone, MonitorPlay, CheckCircle2, Zap, BrainCircuit,
  Heart, MessageCircle, Share2, Upload, Image
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

interface NexusDashboardProps {
  isDemoMode?: boolean;
}

export default function NexusDashboard({ isDemoMode = false }: NexusDashboardProps) {
  const { user } = useAuth();
  let navigate: ReturnType<typeof useNavigate> | null = null;
  try { navigate = useNavigate(); } catch { /* safe in demo context */ }

  const [url, setUrl] = useState('https://etheragent.studio');
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [selectedVector, setSelectedVector] = useState<{ id: string; text: string; platform: string; color: string } | null>(null);
  const [inputMode, setInputMode] = useState<'domain' | 'vision'>('domain');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveCampaignToSupabase = async (target: string, platform: string, budget: number) => {
    if (!user) {
      console.error("Acceso Denegado: No hay un token de sesión válido.");
      return;
    }

    try {
      const { error } = await supabase.from('campaigns').insert({
        owner_id: user.id, // <-- EL SELLO CRIPTOGRÁFICO MULTI-TENANT
        title: `Nexus Scan: ${target}`,
        status: 'deployed',
        budget_allocated: budget,
        metrics: {
          roas: `+${Math.floor(Math.random() * 300) + 200}%`,
          cpa: `-${Math.floor(Math.random() * 30) + 40}%`,
          platform: platform,
          video_duration: platform === 'TikTok' ? '15s' : '45s',
          expected_retention: `${Math.floor(Math.random() * 15) + 80}%`,
          hook_type: platform === 'TikTok' ? 'Pattern Interrupt' : 'B2B Authority'
        }
      });
      if (error) throw error;
      console.log("Campaña inyectada con éxito en la matriz.");
    } catch (e: any) {
      console.error("Error creating campaign:", e.message);
    }
  };

  // GHOST IN THE MACHINE: isDemoMode auto-pilot
  useEffect(() => {
    if (!isDemoMode) return;

    // Auto-trigger scan after mounting
    const startDelay = setTimeout(() => {
      setScanStatus('scanning');
      setScanLogs([]);

      const logs = [
        ">_ INITIATING SELF-ANALYSIS (DOGFOODING PROTOCOL)...",
        ">_ BYPASSING STANDARD FIREWALLS...",
        ">_ ANALYZING ETHERCLAW V3 TOPOLOGY...",
        ">_ EXTRACTING PRODUCT VALUE: SYNTHETIC ATTENTION EXCHANGE",
        ">_ TARGET AUDIENCE: MARKETING CEOS & FORTUNE 500 CMOs",
        ">_ COMPILING OMNICHANNEL VECTORS...",
        ">_ PROTOCOL COMPLETE."
      ];

      let currentLog = 0;
      const interval = setInterval(() => {
        if (currentLog < logs.length) {
          setScanLogs(prev => [...prev, logs[currentLog]]);
          currentLog++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setScanStatus('complete');
            saveCampaignToSupabase(url, 'TikTok', 350000);
            // Auto-select vector after results show
            setTimeout(() => {
              setSelectedVector({
                id: 'tiktok',
                text: "Tu agencia de video tradicional está muerta. Mientras pagas $5,000 por luces y actores que se cansan, tu competencia ya usa EtherAgent Studio para desplegar 100 instancias sintéticas al día.",
                platform: 'TikTok',
                color: 'from-cyan-400 to-pink-500'
              });
            }, 800);
          }, 500);
        }
      }, 350);

      return () => clearInterval(interval);
    }, 300);

    return () => clearTimeout(startDelay);
  }, [isDemoMode]);

  const triggerScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMode === 'domain' && !url) return;

    setScanStatus('scanning');
    setScanLogs([]);

    const logs = inputMode === 'vision' ? [
      ">_ INITIATING COMPUTER VISION PROTOCOL...",
      ">_ ANALYZING VISUAL ASSET...",
      ">_ EXTRACTING PRODUCT FEATURES VIA SIMULATED GPT-4V...",
      ">_ DETECTING NICHE: PREMIUM TECH INFRASTRUCTURE",
      ">_ INFERING BRAND IDENTITY FROM VISUAL ELEMENTS...",
      ">_ GENERATING VISION-BASED CAMPAIGN MATRIX...",
      ">_ PROTOCOL COMPLETE."
    ] : [
      ">_ INITIATING SELF-ANALYSIS (DOGFOODING PROTOCOL)...",
      ">_ BYPASSING STANDARD FIREWALLS...",
      ">_ ANALYZING ETHERCLAW V3 TOPOLOGY...",
      ">_ EXTRACTING PRODUCT VALUE: SYNTHETIC ATTENTION EXCHANGE",
      ">_ TARGET AUDIENCE: MARKETING CEOS & FORTUNE 500 CMOs",
      ">_ MATCHING NEURAL INSTANCES FOR HIGH-TICKET CLOSING...",
      ">_ COMPILING OMNICHANNEL VECTORS...",
      ">_ PROTOCOL COMPLETE."
    ];

    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < logs.length) {
        setScanLogs(prev => [...prev, logs[currentLog]]);
        currentLog++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setScanStatus('complete');
          saveCampaignToSupabase(url, inputMode === 'domain' ? 'LinkedIn' : 'IG Reels', 150000);
        }, 500);
      }
    }, 500);
  };

  const sendToForge = (avatarId: string, promptText: string) => {
    if (!navigate) return;
    const script = selectedVector ? `${selectedVector.text}` : promptText;
    navigate(`/spaces?avatar=${avatarId}&script=${encodeURIComponent(script)}&source=nexus&url=${encodeURIComponent(url)}`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerVisionScan = () => {
    setScanStatus('scanning');
    setScanLogs([]);

    const logs = [
      ">_ INITIATING COMPUTER VISION PROTOCOL...",
      ">_ ANALYZING VISUAL ASSET...",
      ">_ EXTRACTING PRODUCT FEATURES VIA SIMULATED GPT-4V...",
      ">_ DETECTING NICHE: PREMIUM TECH INFRASTRUCTURE",
      ">_ INFERING BRAND IDENTITY FROM VISUAL ELEMENTS...",
      ">_ GENERATING VISION-BASED CAMPAIGN MATRIX...",
      ">_ PROTOCOL COMPLETE."
    ];

    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < logs.length) {
        setScanLogs(prev => [...prev, logs[currentLog]]);
        currentLog++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setScanStatus('complete');
          saveCampaignToSupabase('Visual Asset', 'TikTok', 250000);
        }, 500);
      }
    }, 500);
  };

  return (
    // 1. CONTENEDOR RAÍZ: padding inferior (pb-32) para evitar que el MobileTabBar tape el contenido
    <div className="w-full h-full min-h-[calc(100vh-2rem)] bg-black flex flex-col p-4 md:p-8 relative pb-32 md:pb-8 overflow-y-auto font-sans text-zinc-300">

      {/* BACKGROUND MATRIX */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none opacity-50" />

      {/* HEADER */}
      <div className="relative z-10 mb-12 border-b border-zinc-800 pb-6 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">
            <BrainCircuit size={14} /> Nexus Intelligence
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase flex items-center gap-3">
            Brand Ingestion <span className="text-zinc-600 font-light">/ Protocol</span>
          </h1>
        </div>
        <div className="text-right font-mono text-xs text-zinc-500 flex items-center gap-2">
          <span className="text-emerald-500 animate-pulse">●</span> DOGFOODING MODE: ACTIVE
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ESTADO 1: IDLE */}
        {scanStatus === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full mt-10"
          >
            <div className="w-20 h-20 mb-8 rounded-full bg-zinc-900 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.15)]">
              {inputMode === 'domain' ? <Globe size={32} className="text-emerald-500" /> : <Image size={32} className="text-emerald-500" />}
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tighter text-center">Inyecte su Infraestructura</h2>
            <p className="text-zinc-500 text-center mb-8 font-mono">
              {inputMode === 'domain'
                ? "El sistema analizará su dominio y auto-generará la matriz publicitaria exacta para vender EtherAgent OS a corporaciones de élite."
                : "Arrastre la imagen del producto para análisis biométrico. El sistema extraerá características visuales y generará la campaña automáticamente."}
            </p>

            {/* TOGGLE DOMAIN / VISION */}
            <div className="flex bg-zinc-900/50 border border-zinc-800 rounded-xl p-1 mb-8 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setInputMode('domain')}
                className={`px-6 py-2 rounded-lg font-mono text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${inputMode === 'domain' ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
              >
                <Globe size={14} /> Domain Scan
              </button>
              <button
                type="button"
                onClick={() => setInputMode('vision')}
                className={`px-6 py-2 rounded-lg font-mono text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${inputMode === 'vision' ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
              >
                <Image size={14} /> Asset Vision
              </button>
            </div>

            {inputMode === 'domain' ? (
              <form onSubmit={triggerScan} className="w-full max-w-2xl px-2 md:px-0 relative group">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex flex-col sm:flex-row items-center bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 transition-colors rounded-2xl p-2 gap-2 sm:gap-0 sm:pl-6 w-full shadow-2xl">
                  <div className="flex items-center w-full px-2 sm:px-0 flex-1">
                    <span className="text-emerald-500 font-mono font-bold mr-4 shrink-0">{'>_'}</span>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://etheragent.io"
                      className="w-full bg-transparent text-white font-mono text-sm sm:text-lg focus:outline-none placeholder:text-zinc-700 py-3 sm:py-0"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full sm:w-auto px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-widest rounded-xl flex items-center gap-2 justify-center transition-all shrink-0">
                    ESCANEAR <Scan size={18} />
                  </button>
                </div>
              </form>
            ) : (
              /* ASSET VISION - ZONA DE DRAG & DROP */
              <div className="w-full">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer backdrop-blur-sm ${isDragging
                    ? 'border-emerald-500 bg-emerald-500/10 scale-[1.02]'
                    : uploadedImage
                      ? 'border-emerald-500/50 bg-zinc-900/50'
                      : 'border-zinc-700 hover:border-emerald-500/50 bg-zinc-950/30'
                    }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {uploadedImage ? (
                    <div className="relative">
                      <img src={uploadedImage} alt="Uploaded" className="max-h-48 mx-auto rounded-xl shadow-lg border border-emerald-500/30" />
                      <div className="absolute inset-0 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-emerald-400 font-mono text-sm">✓ Asset Detectado</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload size={48} className={`mx-auto mb-4 ${isDragging ? 'text-emerald-500' : 'text-zinc-600'}`} />
                      <p className="text-zinc-400 font-mono text-sm mb-2">
                        {isDragging ? 'Suelta la imagen para análisis' : 'Arrastra la imagen del producto para análisis biométrico'}
                      </p>
                      <p className="text-zinc-600 text-xs font-mono">o haz clic para seleccionar archivo</p>
                    </>
                  )}
                </div>

                <button
                  onClick={triggerVisionScan}
                  disabled={!uploadedImage}
                  className="w-full mt-6 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-black font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  ANALIZAR ASSET <Scan size={18} />
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ESTADO 2: SCANNING */}
        {scanStatus === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full mt-6 md:mt-0 px-2"
          >
            <div className="w-full bg-zinc-950 border border-emerald-500/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.1)] flex flex-col">
              <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center gap-2 shrink-0">
                <Terminal size={14} className="text-zinc-500 shrink-0" />
                <span className="text-xs font-mono text-zinc-500 truncate">EtherClaw_Scraper_v3.exe</span>
              </div>

              {/* Contenedor con Scroll Vertical y Salto de Línea Forzado */}
              <div className="p-4 md:p-6 font-mono text-[10px] sm:text-xs md:text-sm space-y-2 max-h-[30vh] md:max-h-[40vh] min-h-[200px] overflow-y-auto overflow-x-hidden break-words whitespace-pre-wrap hide-scrollbar flex flex-col justify-end">
                {scanLogs.filter(Boolean).map((log, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`leading-relaxed ${(log || '').includes("COMPLETE") ? "text-emerald-400 font-bold" : "text-zinc-400"}`}>
                    {log}
                  </motion.div>
                ))}
                <div className="flex items-center gap-2 mt-2 shrink-0">
                  <div className="w-2 h-3 md:h-4 bg-emerald-500 animate-pulse inline-block" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ESTADO 3: COMPLETE (LA CAMPAÑA DOGFOODING) */}
        {scanStatus === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="relative z-10 flex-1 flex flex-col w-full pb-20"
          >
            <div className="flex items-center justify-between mb-8 bg-emerald-950/20 border border-emerald-500/30 p-6 rounded-2xl backdrop-blur-sm">
              <div>
                <p className="text-emerald-500 font-mono text-xs uppercase mb-1">Target de Auto-Consumo</p>
                <h3 className="text-2xl font-bold text-white">{url}</h3>
              </div>
              <div className="text-right">
                <p className="text-zinc-400 font-mono text-xs uppercase mb-1">Arquetipo de Campaña</p>
                <div className="flex items-center gap-2">
                  <Cpu size={16} className="text-cyan-400" />
                  <span className="text-cyan-400 font-bold">DEEP-TECH / AI INFRASTRUCTURE</span>
                </div>
              </div>
            </div>

            {/* GRID DIVIDIDO: IZQUIERDA (INTELLIGENCE + VECTORES) / DERECHA (MOCKUP CELULAR) */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

              {/* COLUMNA IZQUIERDA (2/3) */}
              <div className="xl:col-span-2 space-y-6">
                <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" /> 1. Intelligence Match (La Instancia Perfecta)
                </h4>
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 mb-10 flex gap-6 items-center">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop" alt="Marcus" className="w-24 h-24 rounded-lg object-cover border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">Marcus V. <span className="text-xs font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded ml-2">High-Ticket Closer</span></h3>
                    <p className="text-sm text-zinc-400 mb-4">Para vender un software de $150k USD, necesitas autoridad absoluta. Marcus transmitirá la lógica fría, la escalabilidad y la dominación técnica que el CEO de Ogilvy o IBM necesita escuchar para firmar.</p>
                    <div className="flex gap-4">
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">Voz: ElevenLabs (Deep Baritone)</span>
                      <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded border border-cyan-500/20">Kinesia: Agresividad Corporativa</span>
                    </div>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Zap size={16} className="text-violet-500" /> 2. Social Lab (Seleccione un Vector)
                </h4>

                {/* TIKTOK/REELS - Micro-Vector */}
                <div
                  onClick={() => setSelectedVector({
                    id: 'tiktok',
                    text: "Tu agencia de video tradicional está muerta. Mientras pagas $5,000 por luces y actores que se cansan, tu competencia ya usa EtherAgent Studio para desplegar 100 instancias sintéticas al día. La atención ya no se graba, se compila.",
                    platform: 'TikTok',
                    color: 'from-cyan-400 to-pink-500'
                  })}
                  className={`bg-zinc-950/50 border rounded-xl p-4 mb-3 cursor-pointer transition-all hover:border-emerald-500/50 ${selectedVector?.id === 'tiktok' ? 'border-emerald-500 bg-emerald-950/20' : 'border-zinc-800'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center">
                      <Smartphone size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">TikTok/Reels</p>
                      <p className="text-zinc-500 text-xs">Micro-Vector • 6-15 segundos</p>
                    </div>
                  </div>
                  <p className="text-zinc-400 text-xs line-clamp-2">"Tu agencia de video tradicional está muerta..."</p>
                </div>

                {/* LINKEDIN - Standard Vector */}
                <div
                  onClick={() => setSelectedVector({
                    id: 'linkedin',
                    text: "Cómo cerramos $450k en MRR en el Q3 sin grabar un solo video. La era de la edición manual y los rodajes terminó. Los CEOs no editan, ejecutan Smart Contracts. Bienvenido a la compilación neuronal.",
                    platform: 'LinkedIn',
                    color: 'from-blue-600 to-blue-800'
                  })}
                  className={`bg-zinc-950/50 border rounded-xl p-4 mb-3 cursor-pointer transition-all hover:border-emerald-500/50 ${selectedVector?.id === 'linkedin' ? 'border-emerald-500 bg-emerald-950/20' : 'border-zinc-800'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                      <MonitorPlay size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">LinkedIn</p>
                      <p className="text-zinc-500 text-xs">Standard Vector • 30-60 segundos</p>
                    </div>
                  </div>
                  <p className="text-zinc-400 text-xs line-clamp-2">"Cómo cerramos $450k en MRR en el Q3..."</p>
                </div>

                {/* YOUTUBE - Extended VSL */}
                <div
                  onClick={() => setSelectedVector({
                    id: 'youtube',
                    text: "Lo que ven en pantalla no es un editor, es un motor de infraestructura. Ustedes me ven respirar y hablar, pero soy una instancia sintética generada a latencia cero. Hoy les mostraré por qué licenciar este sistema cuesta 150,000 dólares.",
                    platform: 'YouTube',
                    color: 'from-red-600 to-red-800'
                  })}
                  className={`bg-zinc-950/50 border rounded-xl p-4 cursor-pointer transition-all hover:border-emerald-500/50 ${selectedVector?.id === 'youtube' ? 'border-emerald-500 bg-emerald-950/20' : 'border-zinc-800'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                      <Video size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">YouTube</p>
                      <p className="text-zinc-500 text-xs">Extended VSL • 3-5 minutos</p>
                    </div>
                  </div>
                  <p className="text-zinc-400 text-xs line-clamp-2">"Lo que ven en pantalla no es un editor..."</p>
                </div>
              </div>

              {/* COLUMNA DERECHA (1/3) - MOCKUP CELULAR */}
              <div className="xl:col-span-1">
                <div className="sticky top-8">
                  <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Smartphone size={16} className="text-white" /> Preview
                  </h4>

                  {/* MOCKUP IPHONE */}
                  <div className="relative mx-auto" style={{ maxWidth: '280px' }}>
                    <div className="bg-zinc-900 rounded-[3rem] p-3 border-[12px] border-zinc-950 shadow-2xl">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-zinc-950 rounded-b-xl z-10" />

                      {/* PANTALLA */}
                      <div className="bg-black rounded-[2rem] aspect-[9/19] overflow-hidden relative">
                        {/* UI DEL TELEFONO - SIMULANDO RED SOCIAL */}
                        {selectedVector ? (
                          <div className="h-full flex flex-col">
                            {/* Header app */}
                            <div className="bg-zinc-900/80 backdrop-blur px-4 py-3 flex items-center justify-between border-b border-white/10">
                              <span className="text-white text-xs font-bold">{selectedVector.platform}</span>
                              <div className="flex gap-1">
                                <div className="w-4 h-4 rounded-full bg-emerald-500/20" />
                                <div className="w-4 h-4 rounded-full bg-cyan-500/20" />
                              </div>
                            </div>

                            {/* Avatar en pantalla */}
                            <div className="flex-1 flex items-center justify-center p-4">
                              <img
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop"
                                alt="Marcus"
                                className="w-full rounded-xl object-cover shadow-lg"
                              />
                            </div>

                            {/* Texto del post */}
                            <div className="bg-zinc-900 p-4 border-t border-white/10">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/30" />
                                <div>
                                  <p className="text-white text-xs font-bold">Marcus V.</p>
                                  <p className="text-white/40 text-[10px]">High-Ticket Closer</p>
                                </div>
                              </div>
                              <p className="text-white text-xs leading-relaxed">
                                {selectedVector.text}
                              </p>

                              {/* Acciones */}
                              <div className="flex gap-4 mt-3 pt-3 border-t border-white/10">
                                <div className="flex items-center gap-1">
                                  <Heart size={14} className="text-white/60" />
                                  <span className="text-white/40 text-[10px]">2.4K</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageCircle size={14} className="text-white/60" />
                                  <span className="text-white/40 text-[10px]">89</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Share2 size={14} className="text-white/60" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                            <Smartphone size={48} className="text-zinc-700 mb-4" />
                            <p className="text-zinc-500 text-sm">Seleccione un vector<br />para ver la preview</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* BOTON COMPILE TO FORGE */}
                  <button
                    onClick={() => sendToForge('f_marcus', selectedVector?.text || '')}
                    disabled={!selectedVector}
                    className="w-full mt-6 py-4 bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-600 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:scale-[1.02] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 text-white font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2"
                  >
                    [ COMPILE TO FORGE ] <ArrowRight size={16} />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
