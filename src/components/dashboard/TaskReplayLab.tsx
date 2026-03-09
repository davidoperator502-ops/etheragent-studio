import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Mic, Sparkles, Loader2 } from 'lucide-react';

// IMPORTAMOS TU NUEVO HOOK DE SUPABASE
import { useAgents } from '@/hooks/useAgents';

// TUS MÓDULOS REALES
import EtherAgentWelcome from './EtherAgentWelcome';
import NexusDashboard from './NexusDashboard';
import SocialLab from './SocialLab';
import SonicLab from './SonicLab';
import VirtualOOHLab from './VirtualOOHLab';
import PerformanceAdsLab from './PerformanceAdsLab';
import CommercialVideoMatrix from './CommercialVideoMatrix';

// Transiciones más "Snappy" y fluidas
const fullscreenVariants = {
    enter: { opacity: 0, filter: 'blur(20px)', scale: 1.02 },
    center: {
        opacity: 1,
        filter: 'blur(0px)',
        scale: 1,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    },
    exit: { opacity: 0, filter: 'blur(15px)', scale: 0.98, transition: { duration: 0.5 } }
};

const BASE_TIMELINE = [
    { time: 0, id: 'welcome', agentName: 'Marcus', text: "Iniciando sistema. Ingresando directiva maestra..." },
    { time: 4000, id: 'nexus', agentName: 'Marcus', text: "Directiva recibida. Escaneando topología de la marca..." },
    { time: 10000, id: 'social', agentName: 'Valeria', text: "Vector social detectado. Compilando TikTok viral." },
    { time: 16000, id: 'sonic', agentName: 'Aria', text: "Sincronizando frecuencias. Cuña radial B2B inyectada." },
    { time: 22000, id: 'ooh', agentName: 'Viktor', text: "Desplegando valla panorámica en Neo-Shibuya 8K." },
    { time: 28000, id: 'ads', agentName: 'Kaelen', text: "Inyectando presupuesto de campaña. ROAS optimizado." },
    { time: 34000, id: 'commercial', agentName: 'Marcus', text: "Campaña omnicanal desplegada. Dominación completada." }
];

const COLOR_MAP: Record<string, {
    text: string;
    pillBorder: string;
    pillShadow: string;
    gradientFrom: string;
    avatarBorder: string;
    ping: string;
    oscillator: string;
    oscillatorShadow: string;
}> = {
    cyan: { text: 'text-cyan-400', pillBorder: 'border-cyan-500/30', pillShadow: 'shadow-[0_0_50px_rgba(6,182,212,0.15)]', gradientFrom: 'from-cyan-500/30', avatarBorder: 'border-cyan-500/50', ping: 'bg-cyan-500/20', oscillator: 'bg-cyan-400', oscillatorShadow: 'shadow-[0_0_8px_rgba(6,182,212,0.8)]' },
    emerald: { text: 'text-emerald-400', pillBorder: 'border-emerald-500/30', pillShadow: 'shadow-[0_0_50px_rgba(16,185,129,0.15)]', gradientFrom: 'from-emerald-500/30', avatarBorder: 'border-emerald-500/50', ping: 'bg-emerald-500/20', oscillator: 'bg-emerald-400', oscillatorShadow: 'shadow-[0_0_8px_rgba(16,185,129,0.8)]' },
    amber: { text: 'text-amber-400', pillBorder: 'border-amber-500/30', pillShadow: 'shadow-[0_0_50px_rgba(245,158,11,0.15)]', gradientFrom: 'from-amber-500/30', avatarBorder: 'border-amber-500/50', ping: 'bg-amber-500/20', oscillator: 'bg-amber-400', oscillatorShadow: 'shadow-[0_0_8px_rgba(245,158,11,0.8)]' },
    orange: { text: 'text-orange-400', pillBorder: 'border-orange-500/30', pillShadow: 'shadow-[0_0_50px_rgba(249,115,22,0.15)]', gradientFrom: 'from-orange-500/30', avatarBorder: 'border-orange-500/50', ping: 'bg-orange-500/20', oscillator: 'bg-orange-400', oscillatorShadow: 'shadow-[0_0_8px_rgba(249,115,22,0.8)]' },
    violet: { text: 'text-violet-400', pillBorder: 'border-violet-500/30', pillShadow: 'shadow-[0_0_50px_rgba(139,92,246,0.15)]', gradientFrom: 'from-violet-500/30', avatarBorder: 'border-violet-500/50', ping: 'bg-violet-500/20', oscillator: 'bg-violet-400', oscillatorShadow: 'shadow-[0_0_8px_rgba(139,92,246,0.8)]' },
    zinc: { text: 'text-zinc-400', pillBorder: 'border-zinc-500/30', pillShadow: 'shadow-[0_0_50px_rgba(161,161,170,0.15)]', gradientFrom: 'from-zinc-500/30', avatarBorder: 'border-zinc-500/50', ping: 'bg-zinc-500/20', oscillator: 'bg-zinc-400', oscillatorShadow: 'shadow-[0_0_8px_rgba(161,161,170,0.8)]' },
};

export default function TaskReplayLab() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // EXTRAEMOS LOS AGENTES DE LA BASE DE DATOS
    const { agents, isLoading, error } = useAgents();

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            audioRef.current?.play().catch(e => console.error("Audio play failed", e));
            setIsPlaying(true);
        }
    };

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        const currentTimeMs = audioRef.current.currentTime * 1000;
        const currentStepIndex = [...BASE_TIMELINE].reverse().findIndex(step => currentTimeMs >= step.time);
        const actualIndex = currentStepIndex >= 0 ? BASE_TIMELINE.length - 1 - currentStepIndex : 0;
        if (actualIndex !== activeStepIndex) {
            setActiveStepIndex(actualIndex);
        }
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
        setActiveStepIndex(0);
        if (audioRef.current) audioRef.current.currentTime = 0;
    };

    const activeStep = BASE_TIMELINE[activeStepIndex];

    // Buscamos al agente en la base de datos usando el nombre
    const dbAgent = agents.find(a => a.name === activeStep.agentName);

    // Construimos las variables dinámicas
    const colorTheme = dbAgent?.color_theme || 'cyan';
    const agentDisplayName = dbAgent?.name || activeStep.agentName;
    const colors = COLOR_MAP[colorTheme] || COLOR_MAP.cyan;

    // PANTALLA DE CARGA CINEMÁTICA
    if (isLoading) {
        return (
            <div className="w-full h-[100dvh] bg-black flex flex-col items-center justify-center">
                <Loader2 className="text-emerald-500 w-12 h-12 animate-spin mb-4" />
                <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase animate-pulse">
                    Sincronizando Nodos Cognitivos...
                </p>
            </div>
        );
    }

    // Si hay error en la DB, mostramos alerta B2B
    if (error) {
        return (
            <div className="w-full h-[100dvh] bg-black flex items-center justify-center text-red-500 font-mono text-sm tracking-widest">
                FATAL ERROR: CONEXIÓN A LA NEURAL MATRIX PERDIDA.
            </div>
        );
    }

    return (
        // CONTENEDOR RAÍZ: Color base puro, sin scrollbars molestos.
        <div className="relative w-full h-[100dvh] bg-[#030303] overflow-hidden flex flex-col selection:bg-emerald-500/30">

            {/* EL AUDIO: Integrado y funcional */}
            <audio
                ref={audioRef}
                src="/audio/master-replay.mp3"
                preload="auto"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleAudioEnded}
                className="hidden"
            />

            {/* 1. EL MARCO CINEMÁTICO (Top Safe Area & LIVE Badge) */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/90 via-black/40 to-transparent z-40 pointer-events-none flex justify-center pt-safe pt-4 md:pt-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-2xl h-fit"
                >
                    <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-zinc-600'}`} />
                    <span className="text-white font-mono text-[9px] md:text-xs tracking-[0.2em] uppercase opacity-90 font-semibold">
                        {isPlaying ? 'LIVE ORCHESTRATION' : 'SYSTEM STANDBY'}
                    </span>
                </motion.div>
            </div>

            {/* 2. EL LIENZO (Viñeteado de profundidad) */}
            <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] pointer-events-none" />

            {/* RENDERIZADO DE MÓDULOS */}
            <div className="absolute inset-0 z-0 pb-20 md:pb-0">
                <AnimatePresence mode="wait">

                    {activeStep.id === 'welcome' && (
                        <motion.div key="welcome" variants={fullscreenVariants} initial="enter" animate="center" exit="exit" className="w-full h-full">
                            <EtherAgentWelcome isDemoMode={true} />
                        </motion.div>
                    )}

                    {activeStep.id === 'nexus' && (
                        <motion.div key="nexus" variants={fullscreenVariants} initial="enter" animate="center" exit="exit" className="w-full h-full">
                            <NexusDashboard isDemoMode={true} />
                        </motion.div>
                    )}

                    {activeStep.id === 'social' && (
                        <motion.div key="social" variants={fullscreenVariants} initial="enter" animate="center" exit="exit" className="w-full h-full">
                            <SocialLab isDemoMode={true} />
                        </motion.div>
                    )}

                    {activeStep.id === 'sonic' && (
                        <motion.div key="sonic" variants={fullscreenVariants} initial="enter" animate="center" exit="exit" className="w-full h-full">
                            <SonicLab isDemoMode={true} />
                        </motion.div>
                    )}

                    {activeStep.id === 'ooh' && (
                        <motion.div key="ooh" variants={fullscreenVariants} initial="enter" animate="center" exit="exit" className="w-full h-full">
                            <VirtualOOHLab isDemoMode={true} />
                        </motion.div>
                    )}

                    {activeStep.id === 'ads' && (
                        <motion.div key="ads" variants={fullscreenVariants} initial="enter" animate="center" exit="exit" className="w-full h-full">
                            <PerformanceAdsLab isDemoMode={true} />
                        </motion.div>
                    )}

                    {activeStep.id === 'commercial' && (
                        <motion.div key="commercial" variants={fullscreenVariants} initial="enter" animate="center" exit="exit" className="w-full h-full">
                            <CommercialVideoMatrix isDemoMode={true} />
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* BLOQUEADOR INVISIBLE */}
            {isPlaying && <div className="absolute inset-0 z-40 bg-transparent cursor-not-allowed" />}

            {/* 3. LA PÍLDORA FLOTANTE (HYPER-GLASSMORPHISM) */}
            <div className="absolute bottom-[90px] md:bottom-12 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">

                <div className={`pointer-events-auto w-full max-w-2xl bg-zinc-900/60 backdrop-blur-[30px] p-2 rounded-[2rem] flex items-center gap-3 transition-all duration-700 shadow-[0_30px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] border ${isPlaying ? `${colors.pillBorder} ${colors.pillShadow}` : 'border-white/10 hover:border-white/20'
                    }`}>

                    {/* Botón Play (Táctil extremo: active:scale-90) */}
                    <button
                        onClick={togglePlay}
                        className="w-12 h-12 md:w-14 md:h-14 shrink-0 flex items-center justify-center bg-white text-black rounded-full shadow-[0_2px_15px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-90 transition-all relative overflow-hidden group"
                    >
                        {!isPlaying && (
                            <span className="absolute inset-0 rounded-full border-[3px] border-white/50 animate-ping opacity-50" />
                        )}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {isPlaying ? <Pause size={20} className="fill-black relative z-10" /> : <Play size={20} className="fill-black ml-1 relative z-10" />}
                    </button>

                    {/* Área de Textos y Ondas */}
                    <div className="flex-1 flex items-center gap-3 overflow-hidden pr-3">

                        {/* Avatar Elegante (Gradiente de fondo) */}
                        <motion.div
                            key={agentDisplayName}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`hidden sm:flex w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-full items-center justify-center bg-gradient-to-br ${colors.gradientFrom} to-black border ${colors.avatarBorder} ${colors.text} relative shadow-inner`}
                        >
                            {isPlaying && <div className={`absolute inset-0 rounded-full ${colors.ping} animate-pulse`} />}
                            <Mic size={14} className="md:w-5 md:h-5 relative z-10" />
                        </motion.div>

                        {/* Subtítulos de Alta Legibilidad */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            {isPlaying ? (
                                <motion.div key={activeStep.text} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="truncate">
                                    <span className={`${colors.text} font-bold text-[11px] md:text-sm mr-2 uppercase tracking-wider drop-shadow-md`}>
                                        {agentDisplayName}
                                    </span>
                                    <span className="text-white/90 font-medium text-[12px] md:text-sm truncate drop-shadow-sm">
                                        {activeStep.text}
                                    </span>
                                </motion.div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Sparkles size={14} className="text-white/50" />
                                    <p className="text-white/70 font-semibold text-[11px] md:text-sm uppercase tracking-widest truncate">
                                        PRESIONE PLAY PARA INICIAR
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Ondas de Audio Nativas */}
                        <div className="shrink-0 flex items-center gap-[2px] h-5 md:h-6">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        height: isPlaying ? [`${Math.random() * 50 + 20}%`, `${Math.random() * 100}%`, `${Math.random() * 50 + 20}%`] : '10%',
                                        opacity: isPlaying ? 1 : 0.3
                                    }}
                                    transition={{ duration: 0.3 + Math.random() * 0.2, repeat: Infinity, ease: "easeInOut" }}
                                    className={`w-[2px] md:w-[3px] rounded-full ${isPlaying ? `${colors.oscillator} ${colors.oscillatorShadow}` : 'bg-zinc-600'}`}
                                />
                            ))}
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}
