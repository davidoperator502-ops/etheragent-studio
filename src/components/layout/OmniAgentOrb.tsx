import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Activity, Brain, Ear } from 'lucide-react';
import { useVoice } from '@/context/GlobalVoiceContext';

export default function OmniAgentOrb() {
    const { isListening, isAwake, isProcessing, transcript, agentResponse, startListening, stopListening } = useVoice();

    return (
        <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end gap-4 pointer-events-none">

            {/* Subtítulos de la IA (Cuando el Agente habla) */}
            <AnimatePresence>
                {agentResponse && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="bg-zinc-900/90 backdrop-blur-xl border border-emerald-500/30 px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.2)] max-w-sm pointer-events-auto"
                    >
                        <p className="text-emerald-400 font-mono text-sm tracking-wide">
                            <Activity size={14} className="inline mr-2 animate-pulse" />
                            {agentResponse}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Indicador de procesamiento LLM */}
            <AnimatePresence>
                {isProcessing && !agentResponse && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-zinc-900/90 backdrop-blur-xl border border-cyan-500/30 px-5 py-2.5 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.15)] pointer-events-auto"
                    >
                        <p className="text-cyan-400 font-mono text-xs tracking-wide flex items-center gap-2">
                            <Brain size={14} className="animate-spin" />
                            Procesando sinapsis cognitiva...
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Indicador de Wake Word (Escucha Pasiva) */}
            <AnimatePresence>
                {isListening && !isAwake && !isProcessing && !agentResponse && !transcript && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 0.7, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-black/40 backdrop-blur-md border border-cyan-500/20 px-4 py-2 rounded-xl pointer-events-auto"
                    >
                        <p className="text-cyan-400/80 text-[10px] font-mono tracking-wider flex items-center gap-1.5">
                            <Ear size={10} className="opacity-60" />
                            Di "Ether" para activar...
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subtítulos del Usuario (Lo que tú estás diciendo) */}
            <AnimatePresence>
                {isListening && transcript && !agentResponse && !isProcessing && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`backdrop-blur-md border px-4 py-2 rounded-xl max-w-xs pointer-events-auto ${isAwake
                                ? 'bg-emerald-950/60 border-emerald-500/30'
                                : 'bg-black/60 border-white/10'
                            }`}
                    >
                        <p className={`text-xs italic ${isAwake ? 'text-emerald-300' : 'text-zinc-300'}`}>
                            "{transcript}"
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* El Botón Físico (Orbe) — 3 Estados: Off / Pasivo (Cyan) / Awake (Esmeralda) */}
            <button
                onClick={isListening || isProcessing ? stopListening : startListening}
                disabled={isProcessing}
                className={`pointer-events-auto relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 shadow-2xl ${isProcessing
                        ? 'bg-cyan-600 text-black shadow-[0_0_30px_rgba(6,182,212,0.4)] cursor-wait'
                        : isAwake
                            ? 'bg-emerald-500 text-black shadow-[0_0_50px_rgba(16,185,129,0.6)] scale-115'
                            : isListening
                                ? 'bg-cyan-700 text-white shadow-[0_0_30px_rgba(6,182,212,0.3)] scale-105'
                                : 'bg-zinc-800 border border-white/10 text-white hover:bg-zinc-700 hover:scale-105'
                    }`}
                aria-label={
                    isProcessing ? 'Procesando comando'
                        : isAwake ? 'Escucha activa — di tu comando'
                            : isListening ? 'Escucha pasiva — di "Ether"'
                                : 'Activar micrófono'
                }
            >
                {/* Anillos de pulsación: Esmeralda cuando Awake */}
                {isAwake && !isProcessing && (
                    <>
                        <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-60" />
                        <div className="absolute -inset-2 rounded-full border border-emerald-500/40 animate-pulse" />
                        <div className="absolute -inset-4 rounded-full border border-emerald-400/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
                    </>
                )}

                {/* Anillo sutil Cyan para escucha pasiva */}
                {isListening && !isAwake && !isProcessing && (
                    <div className="absolute -inset-1 rounded-full border border-cyan-500/30 animate-pulse" />
                )}

                {/* Anillo de procesamiento */}
                {isProcessing && (
                    <div className="absolute -inset-1 rounded-full border-2 border-cyan-400/50 border-t-transparent animate-spin" />
                )}

                {isProcessing
                    ? <Brain size={22} className="animate-pulse" />
                    : isAwake
                        ? <Mic size={24} className="animate-pulse" />
                        : isListening
                            ? <Ear size={20} className="opacity-70" />
                            : <MicOff size={20} className="opacity-50" />
                }
            </button>

        </div>
    );
}
