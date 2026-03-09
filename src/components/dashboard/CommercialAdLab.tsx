import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, Sparkles, CheckCircle2, ChevronRight,
    Play, Pause, Rocket, Megaphone, Tv, Clock,
    BarChart3, Target, TrendingUp, Zap, X
} from 'lucide-react';

/* ─────────────────────────── TYPES ─────────────────────────── */

type AdLength = '6s' | '15s' | '30s' | '60s';

interface AgentConfig {
    name: string;
    role: string;
    avatar: string;
    status: string;
}

interface AdFormatConfig {
    id: AdLength;
    label: string;
    icon: string;
    tag: string;
    objective: string;
    visualPrompt: string;
    voiceScript: string;
    chatMessages: Message[];
    quickPrompts: string[];
    duration: number; // seconds
}

type Message = { id: string; sender: 'ai' | 'user'; text: string; hasWidget?: boolean };

/* ───────────────────────── AGENT CONFIG ─────────────────────── */

const AGENT_KAELEN: AgentConfig = {
    name: "Kaelen R.",
    role: "Conversion Architect",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
    status: "Online"
};

/* ─────────────────── DOGFOODING SCRIPTS ────────────────────── */

const AD_FORMATS: Record<AdLength, AdFormatConfig> = {
    '6s': {
        id: '6s',
        label: '6s Bumper',
        icon: '⚡',
        tag: 'Bumper Ad',
        objective: 'Retención pura. Stop the scroll.',
        visualPrompt: 'POV extreme macro, neural network ensamblando rostro humano hiperrealista, partículas violeta flotando, cinemático.',
        voiceScript: 'La producción de video tradicional ha muerto. Despliega instancias sintéticas al instante.',
        duration: 6,
        chatMessages: [
            {
                id: 'k6-1',
                sender: 'ai',
                text: "Protocolo Bumper activado. 6 segundos es todo lo que necesitamos para implantar la idea. He diseñado un gancho neural con un CTR proyectado del 340% sobre el benchmark de la industria. El render cinemático está listo en tu monitor."
            },
            {
                id: 'k6-2',
                sender: 'user',
                text: "El hook es brutal. Compílalo para YouTube pre-roll y Meta Stories."
            },
            {
                id: 'k6-3',
                sender: 'ai',
                text: "Compilación completada a latencia cero. El bumper de 6s está renderizado en 4K HDR con codec AV1. Frecuencia de impacto: máxima. Presiona DEPLOY para inyectar en las redes.",
                hasWidget: true
            }
        ],
        quickPrompts: [
            "⚡ Maximizar retención 3s",
            "🧠 Hook más agresivo",
            "🎯 Formato YouTube pre-roll",
            "💀 Eliminar frame muerto"
        ]
    },
    '15s': {
        id: '15s',
        label: '15s Short',
        icon: '📱',
        tag: 'Social Short',
        objective: 'Conversión rápida en TikTok/Reels.',
        visualPrompt: 'CEO estresado en oficina oscura, transición a pantalla EtherAgent UI brillando, avatar sintético habla perfecto, iluminación violeta volumétrica.',
        voiceScript: '¿Gastando miles de dólares en luces y actores que se cansan? Bienvenido a EtherAgent OS. Compila agentes de IA humanos en milisegundos. Domina tu mercado sin costos de producción. Inicia hoy.',
        duration: 15,
        chatMessages: [
            {
                id: 'k15-1',
                sender: 'ai',
                text: "Análisis de mercado completado. El formato de 15 segundos es el arma definitiva para TikTok e Instagram Reels. He integrado la narrativa Problema→Solución con un arco dramático de 3 actos comprimidos. CPA estimado: -40% vs. creativos traditional."
            },
            {
                id: 'k15-2',
                sender: 'user',
                text: "Necesito que el dolor del CEO sea más visible. Que el contraste con EtherAgent sea brutal."
            },
            {
                id: 'k15-3',
                sender: 'ai',
                text: "Contraste amplificado. Frame 1-5s: oficina oscura, estrés visible, facturas de producción. Frame 6-12s: la pantalla de EtherAgent ilumina todo. Frame 13-15s: CTA directo. El render está en tu terminal.",
                hasWidget: true
            }
        ],
        quickPrompts: [
            "📱 Optimizar para TikTok FYP",
            "🔥 Hook de dolor + solución",
            "💰 Añadir precio tachado",
            "🎬 Transición cinemática"
        ]
    },
    '30s': {
        id: '30s',
        label: '30s Spot',
        icon: '🎬',
        tag: 'Standard Spot',
        objective: 'Generación de Leads de alta calidad en Meta/LinkedIn.',
        visualPrompt: 'Valla gigante de ciudad futurista, sala de juntas C-level, avatar de Marcus hablando, telemetría de MRR subiendo, tonos violeta y negro.',
        voiceScript: 'La era de la edición manual terminó. Los CEOs modernos no editan videos, ejecutan contratos de atención sintética. EtherAgent OS proporciona la infraestructura neuronal para compilar avatares de élite que venden por ti, veinticuatro siete, en cualquier idioma, a latencia cero. Deja de editar. Empieza a compilar.',
        duration: 30,
        chatMessages: [
            {
                id: 'k30-1',
                sender: 'ai',
                text: "VSL de 30 segundos compilado. Este es el formato óptimo para Meta Ads y LinkedIn Sponsored Content. He construido una narrativa de valor completa: Contexto → Autoridad → Beneficio → CTA. El costo por lead estimado es un 62% menor que el promedio de la industria SaaS."
            },
            {
                id: 'k30-2',
                sender: 'user',
                text: "Perfecto. Añade la métrica de MRR x10 y que el avatar de Marcus cierre con autoridad."
            },
            {
                id: 'k30-3',
                sender: 'ai',
                text: "Integrado. Marcus cierra con: 'Las agencias que usan nuestro sistema están escalando su MRR por diez'. La telemetría visual confirma el claim. Spot listo para deployment masivo.",
                hasWidget: true
            }
        ],
        quickPrompts: [
            "🎬 Narrativa de valor completa",
            "📊 Integrar métricas de MRR",
            "👔 Tono C-Level ejecutivo",
            "🌐 Versión multi-idioma"
        ]
    },
    '60s': {
        id: '60s',
        label: '60s Feature',
        icon: '🏆',
        tag: 'Extended Feature',
        objective: 'Retargeting de alto valor o TV Satelital. Vende el "Por Qué".',
        visualPrompt: 'Montaje cinemático de los 4 laboratorios trabajando unidos, Matrix de Audio procesando, Matriz Visual renderizando, render final brillando en violeta, estética de película de ciencia ficción.',
        voiceScript: 'En la economía de la atención sintética, la velocidad y la confianza lo son todo. EtherAgent OS no es una herramienta; es el núcleo de tu infraestructura de marketing moderna. Ofrecemos avatares multimodales soberanos con kinesia perfecta y voces clonadas de ultra-alta fidelidad. Las agencias que usan nuestro sistema están escalando su ingreso mensual por diez al eliminar los cuellos de botella creativos. Secure your license today.',
        duration: 60,
        chatMessages: [
            {
                id: 'k60-1',
                sender: 'ai',
                text: "Protocolo Extended Feature desplegado. 60 segundos para construir confianza absoluta. He orquestado un montaje cinemático que muestra los 4 laboratorios de EtherAgent trabajando en sincronía perfecta. Este formato es ideal para retargeting de leads calificados y campañas de TV programática."
            },
            {
                id: 'k60-2',
                sender: 'user',
                text: "Quiero que se sienta como un trailer de película. Que el CEO que lo vea sienta que está perdiendo dinero cada segundo que no usa EtherAgent."
            },
            {
                id: 'k60-3',
                sender: 'ai',
                text: "Concepto rediseñado con narrativa FOMO de alta presión. Acto 1: El problema masivo (0-15s). Acto 2: La infraestructura soberana (16-40s). Acto 3: Social proof + urgencia (41-55s). Cierre: CTA con escasez (56-60s). Render final listo.",
                hasWidget: true
            }
        ],
        quickPrompts: [
            "🏆 Narrativa de confianza total",
            "🎥 Montaje cinemático 4 Labs",
            "📈 Social proof + métricas",
            "⏰ CTA con urgencia/escasez"
        ]
    }
};

/* ──────────────────── VOICE BUBBLE ──────────────────────────── */

function AIVoiceBubble({ message, isPlaying, onTogglePlay }: {
    message: Message;
    isPlaying: boolean;
    onTogglePlay: (id: string) => void;
}) {
    return (
        <div className="max-w-[85%] rounded-[1.5rem] px-4 py-3 text-sm bg-white/10 text-zinc-200 rounded-bl-sm border border-white/5">
            <div className="flex items-start gap-3">
                <button
                    onClick={() => onTogglePlay(message.id)}
                    className="mt-0.5 w-7 h-7 rounded-full bg-violet-500 hover:bg-violet-400 flex items-center justify-center transition-colors flex-shrink-0"
                >
                    {isPlaying ? (
                        <Pause size={12} className="text-black" />
                    ) : (
                        <Play size={12} className="text-black ml-0.5" />
                    )}
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-violet-400 font-mono uppercase tracking-wider">
                            {isPlaying ? 'Speaking...' : 'ElevenLabs Voice ID'}
                        </span>
                        {isPlaying && (
                            <div className="flex items-center gap-0.5 h-3">
                                {[...Array(4)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-0.5 rounded-full bg-violet-400"
                                        animate={{ height: [4, Math.random() * 10 + 4, 4] }}
                                        transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <p className="text-zinc-200 leading-relaxed">{message.text}</p>
                </div>
            </div>
        </div>
    );
}

/* ──────────────── DEPLOY SUCCESS MODAL ──────────────────────── */

function DeployModal({ onClose }: { onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                className="relative bg-zinc-950/90 border border-violet-500/30 rounded-3xl p-10 max-w-md w-full mx-4 text-center shadow-[0_0_80px_rgba(139,92,246,0.3)]"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', damping: 12 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.5)]"
                >
                    <Rocket size={36} className="text-white" />
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-2">Campaign Deployed</h3>
                <p className="text-zinc-400 text-sm mb-6">
                    Tu campaña ha sido inyectada exitosamente en Meta Ads Manager y LinkedIn Campaign Manager.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
                                <span className="text-white text-[8px] font-bold">in</span>
                            </div>
                            <span className="text-zinc-400 text-xs">LinkedIn Ads</span>
                        </div>
                        <p className="text-emerald-400 text-xs font-mono">✓ Injected</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center">
                                <span className="text-white text-[8px] font-bold">M</span>
                            </div>
                            <span className="text-zinc-400 text-xs">Meta Ads</span>
                        </div>
                        <p className="text-emerald-400 text-xs font-mono">✓ Injected</p>
                    </div>
                </div>

                <div className="space-y-2 text-left bg-black/30 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-500 text-xs">Est. Impressions</span>
                        <span className="text-white text-xs font-mono">2.4M — 5.8M</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-500 text-xs">Est. CPA Reduction</span>
                        <span className="text-violet-400 text-xs font-mono">-40%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-500 text-xs">Campaign Status</span>
                        <span className="text-emerald-400 text-xs font-mono flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            LIVE
                        </span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ────────────────────── MAIN COMPONENT ─────────────────────── */

export default function CommercialAdLab() {
    const [activeFormat, setActiveFormat] = useState<AdLength>('30s');
    const [messages, setMessages] = useState<Message[]>(AD_FORMATS['30s'].chatMessages);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [showDeployModal, setShowDeployModal] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<number | null>(null);

    const currentFormat = AD_FORMATS[activeFormat];

    // Switch format -> reset chat
    const handleFormatChange = (format: AdLength) => {
        setActiveFormat(format);
        setMessages(AD_FORMATS[format].chatMessages);
        setIsPlaying(false);
        setPlayingMessageId(null);
        setProgress(0);
        if (progressRef.current) cancelAnimationFrame(progressRef.current);
    };

    // Play/pause video simulation
    useEffect(() => {
        if (!isPlaying) {
            if (progressRef.current) cancelAnimationFrame(progressRef.current);
            return;
        }
        const duration = currentFormat.duration * 1000;
        const startTime = Date.now() - (progress / 100) * duration;

        const tick = () => {
            const elapsed = Date.now() - startTime;
            const pct = Math.min((elapsed / duration) * 100, 100);
            setProgress(pct);
            if (pct < 100) {
                progressRef.current = requestAnimationFrame(tick);
            } else {
                setIsPlaying(false);
            }
        };
        progressRef.current = requestAnimationFrame(tick);
        return () => { if (progressRef.current) cancelAnimationFrame(progressRef.current); };
    }, [isPlaying]);

    const togglePlay = (messageId: string) => {
        if (playingMessageId === messageId) {
            setPlayingMessageId(null);
            setIsPlaying(false);
        } else {
            setPlayingMessageId(messageId);
            setIsPlaying(true);
        }
    };

    const toggleVideoPlay = () => {
        if (!isPlaying && progress >= 100) setProgress(0);
        setIsPlaying(prev => !prev);
    };

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    useEffect(scrollToBottom, [messages, isTyping]);

    const sendMessage = (text: string) => {
        const userMsg: Message = { id: Date.now().toString(), sender: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: `Directiva procesada. He recompilado el spot de ${activeFormat} con tus ajustes. El CPA proyectado ha mejorado un 18% adicional. Revisa el render actualizado en tu terminal.`,
                hasWidget: true,
            }]);
        }, 1500);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        sendMessage(inputValue);
    };

    const handleQuickPrompt = (prompt: string) => {
        sendMessage(prompt.replace(/^[^\w]+/, '').trim());
    };

    const formatTabs: { id: AdLength; icon: string; label: string }[] = [
        { id: '6s', icon: '⚡', label: '6s Bumper' },
        { id: '15s', icon: '📱', label: '15s Short' },
        { id: '30s', icon: '🎬', label: '30s Spot' },
        { id: '60s', icon: '🏆', label: '60s Feature' },
    ];

    return (
        <div className="flex gap-4 h-full">
            {/* ═══════════ LEFT PANEL — CHAT ═══════════ */}
            <div className="flex-1 bg-zinc-950/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden relative">

                {/* Agent Header */}
                <div className="h-auto border-b border-white/5 bg-white/5 flex flex-col backdrop-blur-md">
                    <div className="h-20 border-b border-white/5 flex items-center px-6 justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img src={AGENT_KAELEN.avatar} alt="Kaelen R." className="w-10 h-10 rounded-full object-cover border border-violet-500/30" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-violet-500 border-2 border-zinc-900 rounded-full" />
                            </div>
                            <div>
                                <h2 className="text-white font-bold flex items-center gap-2">
                                    {AGENT_KAELEN.name} <CheckCircle2 size={14} className="text-violet-400" />
                                </h2>
                                <p className="text-xs text-zinc-400 font-mono">{AGENT_KAELEN.role}</p>
                            </div>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center gap-2">
                            <Sparkles size={12} className="text-violet-400" />
                            <span className="text-[10px] text-violet-400 font-mono uppercase tracking-widest">Active Session</span>
                        </div>
                    </div>

                    {/* Format Selector */}
                    <div className="px-6 py-4 bg-black/20">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm p-1 rounded-full border border-white/5">
                                {formatTabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleFormatChange(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${activeFormat === tab.id
                                                ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30'
                                                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <span>{tab.icon}</span>
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Objective Tag */}
                        <div className="flex items-center justify-center mt-3">
                            <div className="flex items-center gap-2 bg-violet-500/5 border border-violet-500/10 rounded-full px-4 py-1.5">
                                <Target size={10} className="text-violet-400" />
                                <span className="text-[10px] text-violet-300 font-mono">{currentFormat.objective}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.sender === 'ai' ? (
                                    <AIVoiceBubble
                                        message={msg}
                                        isPlaying={playingMessageId === msg.id}
                                        onTogglePlay={togglePlay}
                                    />
                                ) : (
                                    <div className="max-w-[80%] rounded-[1.5rem] px-5 py-3 text-sm bg-violet-500 text-white rounded-br-sm">
                                        {msg.text}
                                    </div>
                                )}
                            </motion.div>
                        ))}

                        {isTyping && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                <div className="bg-white/5 rounded-full px-5 py-4 flex items-center gap-1.5 border border-white/5">
                                    <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                    <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts + Input */}
                <div className="p-4 bg-transparent border-t border-white/5 space-y-3">
                    <div className="flex flex-wrap gap-2 px-1">
                        {currentFormat.quickPrompts.map((prompt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleQuickPrompt(prompt)}
                                disabled={isTyping}
                                className="px-3 py-1.5 text-xs rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-300 hover:bg-violet-500/10 hover:border-violet-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                    <form onSubmit={handleSendMessage} className="relative flex items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={`Dicta instrucciones a ${AGENT_KAELEN.name}...`}
                            className="w-full bg-white/5 border border-white/10 focus:border-violet-500/50 focus:bg-white/10 transition-all rounded-full py-4 pl-6 pr-14 text-white text-sm outline-none placeholder:text-zinc-500"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className="absolute right-2 p-2 bg-violet-500 hover:bg-violet-400 disabled:bg-zinc-700 text-black rounded-full transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            </div>

            {/* ═══════════ RIGHT PANEL — IPHONE + DEPLOY ═══════════ */}
            <div className="w-80 xl:w-96 flex flex-col justify-center py-4 pr-4">
                <div className="text-center mb-4">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Cinematic Ad Preview</span>
                </div>

                {/* iPhone Shell */}
                <div className="relative w-full aspect-[9/19] bg-zinc-950 border-[12px] border-zinc-900 rounded-[3rem] shadow-[0_8px_60px_rgba(139,92,246,0.15)] overflow-hidden flex flex-col justify-center items-center group">
                    {/* Notch */}
                    <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
                        <div className="w-24 h-full bg-zinc-900 rounded-b-xl" />
                    </div>

                    {messages.some(m => m.hasWidget) ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black">
                            {/* Cinematic Background */}
                            <div className="absolute inset-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-950/80 via-black to-purple-950/60" />
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=700&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                {/* Animated particles */}
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-1 h-1 bg-violet-400/60 rounded-full"
                                        style={{ left: `${20 + i * 12}%`, top: `${30 + (i % 3) * 20}%` }}
                                        animate={{ y: [-10, 10, -10], opacity: [0.3, 0.8, 0.3] }}
                                        transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                                    />
                                ))}
                            </div>

                            {/* Sponsored Overlay */}
                            <div className="absolute top-12 left-0 right-0 px-4 z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img src={AGENT_KAELEN.avatar} className="w-7 h-7 rounded-full border border-violet-500/30" alt="Kaelen" />
                                        <div>
                                            <p className="text-white text-[10px] font-bold">etheragent.studio</p>
                                            <p className="text-white/40 text-[8px]">Sponsored · {currentFormat.tag}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md rounded-full px-2 py-0.5">
                                        <span className="text-[8px] text-white/60 font-mono">{activeFormat}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Center Play/Pause */}
                            <AnimatePresence>
                                {!isPlaying && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        onClick={toggleVideoPlay}
                                        className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-violet-500/80 backdrop-blur-md flex items-center justify-center z-20 hover:bg-violet-400/90 transition-colors shadow-[0_0_40px_rgba(139,92,246,0.5)]"
                                    >
                                        <Play size={28} className="text-white ml-1" />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                            {isPlaying && (
                                <button
                                    onClick={toggleVideoPlay}
                                    className="absolute inset-0 z-20"
                                />
                            )}

                            {/* Bottom Content */}
                            <div className="absolute bottom-8 left-3 right-3 z-10">
                                <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-violet-500/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Megaphone size={12} className="text-violet-400" />
                                        <span className="text-violet-400 text-[9px] font-mono uppercase tracking-wider">{currentFormat.tag}</span>
                                    </div>
                                    <p className="text-white text-xs leading-relaxed line-clamp-3 mb-3">
                                        {currentFormat.voiceScript}
                                    </p>

                                    {/* Waveform */}
                                    <div className="flex items-center gap-0.5 h-6 mb-2">
                                        {[...Array(24)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="w-[3px] bg-violet-400 rounded-full"
                                                animate={{
                                                    height: isPlaying ? [6, Math.random() * 18 + 6, 6] : 6,
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                    repeat: isPlaying ? Infinity : 0,
                                                    delay: i * 0.04,
                                                    ease: 'easeInOut'
                                                }}
                                                style={{ opacity: isPlaying ? 0.9 : 0.3 }}
                                            />
                                        ))}
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span className="text-[8px] text-zinc-500 font-mono">
                                            {Math.floor((progress / 100) * currentFormat.duration)}s
                                        </span>
                                        <span className="text-[8px] text-zinc-500 font-mono">{currentFormat.duration}s</span>
                                    </div>
                                </div>
                            </div>

                            {/* Side engagement */}
                            <div className="absolute right-2 top-[35%] flex flex-col gap-3 z-10">
                                {[
                                    { icon: <TrendingUp size={18} />, label: '840K' },
                                    { icon: <BarChart3 size={18} />, label: '-40% CPA' },
                                    { icon: <Zap size={18} />, label: '0ms' },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <div className="text-white/80 drop-shadow-lg">{item.icon}</div>
                                        <span className="text-white text-[8px] font-bold drop-shadow-md mt-0.5">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-center px-6">
                            <Tv size={32} className="text-zinc-700 mx-auto mb-4" />
                            <p className="text-zinc-500 text-xs font-mono">Esperando compilación del spot comercial...</p>
                        </div>
                    )}
                </div>

                {/* DEPLOY CTA */}
                <div className="mt-6">
                    <button
                        onClick={() => setShowDeployModal(true)}
                        className="w-full group relative overflow-hidden rounded-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-500 to-violet-600 opacity-90 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-r from-violet-600/80 to-purple-600/80 backdrop-blur-xl" />
                        <div className="relative flex items-center justify-center gap-3 py-5 px-6">
                            <Rocket size={20} className="text-white" />
                            <span className="text-white font-bold text-sm tracking-wider uppercase">
                                Deploy to Ad Networks
                            </span>
                            <ChevronRight size={16} className="text-white/70 group-hover:translate-x-1 transition-transform" />
                        </div>
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.4)] group-hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] transition-shadow pointer-events-none" />
                    </button>
                    <p className="text-center text-[9px] text-zinc-600 font-mono mt-2 tracking-wider">
                        Inject into Meta Ads & LinkedIn Campaign Manager
                    </p>
                </div>
            </div>

            {/* Deploy Modal */}
            <AnimatePresence>
                {showDeployModal && <DeployModal onClose={() => setShowDeployModal(false)} />}
            </AnimatePresence>
        </div>
    );
}
