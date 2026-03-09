import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MonitorPlay, MapPin, Send, Activity, ShieldAlert } from 'lucide-react';
import { useOOHMetrics } from '@/hooks/useOOHMetrics';

interface VirtualOOHLabProps {
  isDemoMode?: boolean;
}

export default function VirtualOOHLab({ isDemoMode = false }: VirtualOOHLabProps) {
  const [prompt, setPrompt] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);

  // EXTRAEMOS LA DATA ESPACIAL DE SUPABASE
  const { oohData, isLoading } = useOOHMetrics();

  // LA LÓGICA DEL FANTASMA (Adaptada a la base de datos)
  useEffect(() => {
    if (isDemoMode) {
      setPrompt('');
      setIsDeployed(false);

      const ghostCommand = `Desplegar asset en ${oohData.location}. Forzar ${oohData.resolution} en formato ${oohData.format}. Iniciar inyección espacial.`;
      let i = 0;

      const typing = setInterval(() => {
        setPrompt(ghostCommand.slice(0, i));
        i++;
        if (i > ghostCommand.length) {
          clearInterval(typing);
          setTimeout(() => {
            setIsDeploying(true);
            setTimeout(() => {
              setIsDeploying(false);
              setIsDeployed(true);
            }, 2000);
          }, 500);
        }
      }, 30);

      return () => clearInterval(typing);
    }
  }, [isDemoMode, oohData]);

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setIsDeployed(true);
    }, 2000);
  };

  return (
    // CONTENEDOR RAÍZ: pb-32 crítico para el MobileTabBar de iOS
    <div className="w-full h-full bg-black flex flex-col md:flex-row overflow-y-auto md:overflow-hidden pb-32 md:pb-0 relative">

      {/* 1. PANEL DE CONTROL (Abajo en Móvil, Izquierda en PC) */}
      <div className="w-full md:w-5/12 p-4 md:p-8 flex flex-col gap-6 md:gap-8 order-2 md:order-1 border-t md:border-t-0 md:border-r border-white/5 bg-zinc-950/30">

        <div className="flex items-center gap-3 mb-2 md:mb-4">
          <MonitorPlay className="text-orange-500 w-6 h-6 md:w-8 md:h-8" />
          <h2 className="text-xl md:text-2xl font-black text-white tracking-widest">VIRTUAL OOH</h2>
        </div>

        {/* TELEMETRÍA ESPACIAL DINÁMICA */}
        <div className="flex flex-col gap-3">
          <h3 className="text-zinc-500 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
            <MapPin size={14} className="text-orange-500" /> Vector de Localización
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* UBICACIÓN */}
            <div className="bg-zinc-900 border border-white/5 p-4 rounded-xl col-span-2">
              <p className="text-zinc-500 text-[10px] md:text-xs font-mono mb-1">NODO PRINCIPAL</p>
              {isLoading ? <div className="h-5 w-32 bg-zinc-800 rounded animate-pulse" /> : <p className="text-white font-bold">{oohData.location}</p>}
            </div>

            {/* RESOLUCIÓN */}
            <div className="bg-zinc-900 border border-white/5 p-4 rounded-xl">
              <p className="text-zinc-500 text-[10px] md:text-xs font-mono mb-1">RESOLUCIÓN</p>
              {isLoading ? <div className="h-5 w-16 bg-zinc-800 rounded animate-pulse" /> : <p className="text-orange-400 font-bold">{oohData.resolution}</p>}
            </div>

            {/* FORMATO */}
            <div className="bg-zinc-900 border border-white/5 p-4 rounded-xl">
              <p className="text-zinc-500 text-[10px] md:text-xs font-mono mb-1">FORMATO</p>
              {isLoading ? <div className="h-5 w-20 bg-zinc-800 rounded animate-pulse" /> : <p className="text-white font-bold">{oohData.format}</p>}
            </div>
          </div>
        </div>

        {/* INPUT DE DESPLIEGUE */}
        <div className="mt-auto">
          <div className="relative bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <textarea
              value={prompt}
              readOnly={isDemoMode}
              onChange={(e) => !isDemoMode && setPrompt(e.target.value)}
              placeholder="Directiva de renderizado espacial..."
              className="w-full h-24 md:h-32 bg-transparent text-white p-4 outline-none resize-none text-sm md:text-base placeholder:text-zinc-600"
            />
            <div className="flex justify-between items-center p-2 bg-black/40 border-t border-white/5">
              <span className="text-[10px] md:text-xs text-zinc-500 font-mono flex items-center gap-1 pl-2">
                <ShieldAlert size={12} /> Cifrado E2E
              </span>
              <button
                onClick={!isDemoMode ? handleDeploy : undefined}
                disabled={isDeploying || !prompt}
                className={`px-4 md:px-6 py-2 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 ${isDeploying || !prompt ? 'bg-zinc-800 text-zinc-600' : 'bg-orange-500 text-black hover:bg-orange-400 active:scale-95'
                  }`}
              >
                {isDeploying ? <Activity size={16} className="animate-pulse" /> : <Send size={16} />}
                {isDeploying ? 'COMPILANDO...' : 'DESPLEGAR'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. EL VIEWPORT 21:9 (Arriba en Móvil, Derecha en PC) */}
      <div className="w-full md:w-7/12 p-4 md:p-10 flex items-center justify-center order-1 md:order-2 bg-black md:bg-zinc-950/30 min-h-[40vh] md:min-h-0 relative">

        <div className="w-full max-w-4xl aspect-[21/9] bg-zinc-900 border border-white/10 rounded-xl md:rounded-2xl relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">

          <AnimatePresence mode="wait">
            {!isDeployed ? (
              <motion.div
                key="standby"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
                <MonitorPlay className="text-zinc-700 w-10 h-10 md:w-16 md:h-16 mb-4 animate-pulse" />
                <p className="text-zinc-600 font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase">Esperando Inyección Espacial</p>
              </motion.div>
            ) : (
              <motion.div
                key="active"
                initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-50 mix-blend-luminosity" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-orange-500 tracking-[0.2em] relative z-10 drop-shadow-[0_0_30px_rgba(245,158,11,0.5)] text-center px-4 leading-tight uppercase">
                    {oohData.location}
                  </h2>
                  <p className="text-orange-400/80 font-mono text-[10px] md:text-sm mt-2 md:mt-4 tracking-widest relative z-10 bg-black/50 px-3 py-1 md:px-4 md:py-2 rounded-full border border-orange-500/30">
                    STATUS: LIVE {oohData.resolution}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

    </div>
  );
}
