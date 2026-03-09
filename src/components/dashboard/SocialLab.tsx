import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone, Send, Sparkles, CheckCircle2, ChevronRight,
  Heart, MessageCircle, Share2, MoreHorizontal, Play, Pause,
  TrendingUp, Briefcase, Instagram, Video, Image, Twitter, Linkedin, Facebook, Zap
} from 'lucide-react';
import { useSocialMetrics } from '@/hooks/useSocialMetrics';

type FormatType = 'video' | 'static';
type VideoPlatform = 'tiktok' | 'yt_shorts' | 'ig_reels';
type StaticPlatform = 'twitter' | 'linkedin' | 'meta';

interface AgentConfig {
  name: string;
  role: string;
  avatar: string;
  status: string;
  color: 'emerald' | 'cyan' | 'rose' | 'gray' | 'blue';
  accentClass: string;
  textColor: string;
  borderColor: string;
  bgColor: string;
}

const AGENT_VALERIA: AgentConfig = {
  name: "Valeria M.",
  role: "Lead Growth Hacker",
  avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
  status: "Online",
  color: 'emerald',
  accentClass: 'bg-emerald-500',
  textColor: 'text-emerald-400',
  borderColor: 'border-emerald-500/20',
  bgColor: 'bg-emerald-500/10'
};

const AGENT_MARCUS: AgentConfig = {
  name: "Marcus V.",
  role: "High-Ticket Closer",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
  status: "Online",
  color: 'cyan',
  accentClass: 'bg-cyan-500',
  textColor: 'text-cyan-400',
  borderColor: 'border-cyan-500/20',
  bgColor: 'bg-cyan-500/10'
};

const AGENT_SOPHIA: AgentConfig = {
  name: "Sophia L.",
  role: "Brand Architect",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
  status: "Online",
  color: 'rose',
  accentClass: 'bg-rose-500',
  textColor: 'text-rose-400',
  borderColor: 'border-rose-500/20',
  bgColor: 'bg-rose-500/10'
};

const VIDEO_PLATFORMS: Record<VideoPlatform, {
  id: VideoPlatform;
  label: string;
  icon: React.ReactNode;
  agent: AgentConfig;
  quickPrompts: string[];
}> = {
  tiktok: {
    id: 'tiktok',
    label: 'TikTok',
    icon: <span className="text-lg">📱</span>,
    agent: AGENT_VALERIA,
    quickPrompts: [
      "⚡ Haz el hook más agresivo (3s)",
      "🎵 Añadir audio trending",
      "🔥 Virality score +20%",
      "📱 Optimizar para FYP"
    ]
  },
  yt_shorts: {
    id: 'yt_shorts',
    label: 'YT Shorts',
    icon: <span className="text-lg">▶️</span>,
    agent: AGENT_VALERIA,
    quickPrompts: [
      "🎬 Formato Shorts optimizado",
      "📊 Engagement para algoritmo",
      "🔔 Subscribe CTA integrado",
      "⏱️ Duración ideal 45s"
    ]
  },
  ig_reels: {
    id: 'ig_reels',
    label: 'IG Reels',
    icon: <Instagram size={14} />,
    agent: AGENT_VALERIA,
    quickPrompts: [
      "📸 Estilo visual Instagram",
      "💫 Efectos de transición",
      "🎵 Audio trending Reels",
      "🔍 Hashtags estratégicOS"
    ]
  }
};

const STATIC_PLATFORMS: Record<StaticPlatform, {
  id: StaticPlatform;
  label: string;
  icon: React.ReactNode;
  agent: AgentConfig;
  quickPrompts: string[];
}> = {
  twitter: {
    id: 'twitter',
    label: 'X / Twitter',
    icon: <Twitter size={14} />,
    agent: AGENT_SOPHIA,
    quickPrompts: [
      "💬 Hook para timeline",
      "📈 Card visual optimizado",
      "🔥 Thread starter",
      "🎯 CTA viral"
    ]
  },
  linkedin: {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: <Linkedin size={14} />,
    agent: AGENT_MARCUS,
    quickPrompts: [
      "📊 Optimizar para agendar llamadas",
      "👔 Tono C-Level Executive",
      "💼 Añadir caso de éxito B2B",
      "🎯 CTA para MRR"
    ]
  },
  meta: {
    id: 'meta',
    label: 'Meta / FB',
    icon: <Facebook size={14} />,
    agent: AGENT_SOPHIA,
    quickPrompts: [
      "🎨 Creatividad Meta Ads",
      "🛒 Catálogo de productos",
      "📱 Formato carrusel",
      "🎯 Retargeting strategy"
    ]
  }
};

type Message = { id: string; sender: 'ai' | 'user'; text: string; hasWidget?: boolean };

interface MessageBubbleProps {
  message: Message;
  isPlaying: boolean;
  onTogglePlay: (id: string) => void;
  agentColor: string;
}

function AIVoiceBubble({ message, isPlaying, onTogglePlay, agentColor }: MessageBubbleProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return { accent: 'bg-emerald-500 hover:bg-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-400' };
      case 'cyan':
        return { accent: 'bg-cyan-500 hover:bg-cyan-400', text: 'text-cyan-400', bg: 'bg-cyan-400' };
      case 'rose':
        return { accent: 'bg-rose-500 hover:bg-rose-400', text: 'text-rose-400', bg: 'bg-rose-400' };
      case 'gray':
        return { accent: 'bg-zinc-500 hover:bg-zinc-400', text: 'text-zinc-400', bg: 'bg-zinc-400' };
      case 'blue':
        return { accent: 'bg-blue-500 hover:bg-blue-400', text: 'text-blue-400', bg: 'bg-blue-400' };
      default:
        return { accent: 'bg-emerald-500 hover:bg-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-400' };
    }
  };

  const colors = getColorClasses(agentColor);

  return (
    <div className={`max-w-[85%] rounded-[1.5rem] px-4 py-3 text-sm bg-white/10 text-zinc-200 rounded-bl-sm border border-white/5`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onTogglePlay(message.id)}
          className={`mt-0.5 w-7 h-7 rounded-full ${colors.accent} flex items-center justify-center transition-colors flex-shrink-0`}
        >
          {isPlaying ? (
            <Pause size={12} className="text-black" />
          ) : (
            <Play size={12} className="text-black ml-0.5" />
          )}
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] ${colors.text} font-mono uppercase tracking-wider`}>
              {isPlaying ? 'Speaking...' : 'ElevenLabs Voice ID'}
            </span>
            {isPlaying && (
              <div className="flex items-center gap-0.5 h-3">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-0.5 rounded-full ${colors.bg}`}
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

interface SocialLabProps {
  isDemoMode?: boolean;
}

export default function SocialLab({ isDemoMode = false }: SocialLabProps) {
  const { socialData, isLoading } = useSocialMetrics();
  const location = useLocation();
  const [formatType, setFormatType] = useState<FormatType>('video');
  const [videoPlatform, setVideoPlatform] = useState<VideoPlatform>('tiktok');
  const [staticPlatform, setStaticPlatform] = useState<StaticPlatform>('linkedin');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Iniciando sesión segura. He analizado el vector 'La muerte de la agencia tradicional' para la cuenta de EtherAgent Studio. He ajustado el hook para generar un 87% de retención en los primeros 3 segundos. ¿Autorizas la compilación del audio sintético con voz de Autoridad?"
    },
    {
      id: '2',
      sender: 'user',
      text: "Procede. Asegúrate de que el CTA envíe a los CEOs directamente al módulo de Licensing."
    },
    {
      id: '3',
      sender: 'ai',
      text: "Compilación exitosa a latencia cero. Kinesia y lip-sync sincronizados. Tienes el render final en el monitor espacial a tu derecha. Presiona [COMPILE TO FORGE] para inyectarlo en la red.",
      hasWidget: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentPlatform = formatType === 'video' ? VIDEO_PLATFORMS[videoPlatform] : STATIC_PLATFORMS[staticPlatform];
  const currentAgent = currentPlatform.agent;
  const isVideoFormat = formatType === 'video';

  // GHOST IN THE MACHINE: isDemoMode auto-pilot
  useEffect(() => {
    if (!isDemoMode) return;

    // Ensure Video → TikTok is selected
    setFormatType('video');
    setVideoPlatform('tiktok');

    const demoPrompt = `Compilar hook neural de ${socialData.duration} con ${socialData.hookType}. Target: CEOs Fortune 500. Retención proyectada ${socialData.retention}.`;
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      setInputValue(demoPrompt.slice(0, charIndex + 1));
      charIndex++;
      if (charIndex >= demoPrompt.length) {
        clearInterval(typeInterval);
        // Auto-send after a small pause
        setTimeout(() => {
          sendMessage(demoPrompt);
        }, 400);
      }
    }, 30);

    return () => clearInterval(typeInterval);
  }, [isDemoMode, socialData]);

  // GHOST IN THE MACHINE: incoming prompt auto-pilot
  useEffect(() => {
    if (location.state?.incomingPrompt) {
      const ordenDelCEO = location.state.incomingPrompt;
      setInputValue(ordenDelCEO);

      setTimeout(() => {
        sendMessage(ordenDelCEO);
      }, 500);

      window.history.replaceState({}, document.title);
    }
  }, [location.state?.incomingPrompt]);

  const togglePlay = (messageId: string) => {
    if (playingMessageId === messageId) {
      setPlayingMessageId(null);
      setIsPlaying(false);
    } else {
      setPlayingMessageId(messageId);
      setIsPlaying(true);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages, isTyping]);

  const sendMessage = (text: string) => {
    const newUserMsg: Message = { id: Date.now().toString(), sender: 'user', text };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    const platformMessages: Record<string, string> = {
      tiktok: "Estrategia asimilada. He renderizado un 'Hook' viral de 6 segundos diseñada para maximizar el alcance en TikTok. Revisa el pre-render en tu terminal móvil a la derecha.",
      yt_shorts: "Estrategia asimilada. He creado un script optimizado para YouTube Shorts con formato vertical. El contenido está listo para previsualización.",
      ig_reels: "Estrategia asimilada. He diseñado una pieza visual con enfoque lifestyle y FOMO para Instagram Reels. El diseño está listo en tu previsualización espacial.",
      twitter: "Estrategia asimilada. He creado un tweet optimizado para maximizar el engagement en el timeline de X. Revisa la previsualización en formato desktop.",
      linkedin: "Estrategia asimilada. He creado un script corporativo de alto nivel optimizado para generar leads B2B y agendar llamadas con tomadores de decisión. Revisa el pre-render en tu terminal móvil.",
      meta: "Estrategia asimilada. He diseñado una creatividad para Meta Ads con formato carrusel optimizado para conversiones. El diseño está listo en tu previsualización."
    };

    const platformKey = formatType === 'video' ? videoPlatform : staticPlatform;

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: platformMessages[platformKey],
        hasWidget: true
      }]);
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
  };

  const handleQuickPrompt = (prompt: string) => {
    const cleanPrompt = prompt.replace(/^[^\w]+/, '').trim();
    sendMessage(cleanPrompt);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full overflow-y-auto md:overflow-hidden pb-28 md:pb-0">
      <div className="w-full md:flex-1 bg-zinc-950/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden relative order-2 md:order-1 min-h-[60vh] md:min-h-0">
        <div className="h-auto border-b border-white/5 bg-white/5 flex flex-col backdrop-blur-md">
          <div className="h-20 border-b border-white/5 flex items-center px-6 justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={currentAgent.avatar} alt="Agent" className="w-10 h-10 rounded-full object-cover border border-white/20" />
                <div className={`absolute bottom-0 right-0 w-3 h-3 ${currentAgent.accentClass} border-2 border-zinc-900 rounded-full`} />
              </div>
              <div>
                <h2 className="text-white font-bold flex items-center gap-2">
                  {currentAgent.name} <CheckCircle2 size={14} className={currentAgent.textColor} />
                </h2>
                <p className="text-xs text-zinc-400 font-mono">{currentAgent.role}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full ${currentAgent.bgColor} border ${currentAgent.borderColor} flex items-center gap-2`}>
              <Sparkles size={12} className={currentAgent.textColor} />
              <span className={`text-[10px] ${currentAgent.textColor} font-mono uppercase tracking-widest`}>Active Session</span>
            </div>
          </div>

          <div className="px-6 py-4 bg-black/20 space-y-3">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm p-1 rounded-full">
                <button
                  onClick={() => setFormatType('video')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${formatType === 'video'
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Video size={14} />
                  <span>VIDEO VECTORS</span>
                </button>
                <button
                  onClick={() => setFormatType('static')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${formatType === 'static'
                    ? 'bg-zinc-100 text-black shadow-lg'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Image size={14} />
                  <span>STATIC VECTORS</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center w-full">
              <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm p-1 rounded-full overflow-x-auto snap-x hide-scrollbar max-w-full w-max">
                {formatType === 'video' ? (
                  (Object.keys(VIDEO_PLATFORMS) as VideoPlatform[]).map((platform) => (
                    <button
                      key={platform}
                      onClick={() => setVideoPlatform(platform)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${videoPlatform === platform
                        ? 'bg-white text-black shadow-lg'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      {VIDEO_PLATFORMS[platform].icon}
                      <span className="hidden sm:inline">{VIDEO_PLATFORMS[platform].label}</span>
                    </button>
                  ))
                ) : (
                  (Object.keys(STATIC_PLATFORMS) as StaticPlatform[]).map((platform) => (
                    <button
                      key={platform}
                      onClick={() => setStaticPlatform(platform)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${staticPlatform === platform
                        ? 'bg-white text-black shadow-lg'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      {STATIC_PLATFORMS[platform].icon}
                      <span className="hidden sm:inline">{STATIC_PLATFORMS[platform].label}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* PARÁMETROS DINÁMICOS DESDE SUPABASE */}
          <div className="px-6 py-2 border-b border-white/5 pb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-zinc-500 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                <Zap size={14} className={currentAgent.textColor} /> Vector de Retención
              </h3>
              <span className={`px-2 py-0.5 ${currentAgent.bgColor} ${currentAgent.textColor} text-[8px] font-mono rounded-full border ${currentAgent.borderColor} animate-pulse`}>
                LIVE SYNC
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <div className="bg-white/5 border border-white/5 p-2 rounded-lg">
                <p className="text-zinc-500 text-[9px] font-mono mb-1">PLATAFORMA</p>
                {isLoading ? <div className="h-4 w-12 bg-white/10 rounded animate-pulse" /> : <p className="text-white text-xs font-bold">{socialData.platform}</p>}
              </div>

              <div className="bg-white/5 border border-white/5 p-2 rounded-lg">
                <p className="text-zinc-500 text-[9px] font-mono mb-1">DURACIÓN</p>
                {isLoading ? <div className="h-4 w-8 bg-white/10 rounded animate-pulse" /> : <p className={`text-xs font-bold ${currentAgent.textColor}`}>{socialData.duration}</p>}
              </div>

              <div className="bg-white/5 border border-white/5 p-2 rounded-lg lg:col-span-2">
                <p className="text-zinc-500 text-[9px] font-mono mb-1">NEURAL HOOK</p>
                {isLoading ? <div className="h-4 w-20 bg-white/10 rounded animate-pulse" /> : <p className="text-white text-xs font-bold truncate">{socialData.hookType}</p>}
              </div>
            </div>
          </div>
        </div>

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
                    agentColor={currentAgent.color}
                  />
                ) : (
                  <div className={`max-w-[80%] rounded-[1.5rem] px-5 py-3 text-sm ${msg.sender === 'user'
                    ? `${currentAgent.accentClass} text-white rounded-br-sm`
                    : 'bg-white/10 text-zinc-200 rounded-bl-sm border border-white/5'
                    }`}>
                    {msg.text}
                  </div>
                )}
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white/5 rounded-full px-5 py-4 flex items-center gap-1.5 border border-white/5">
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-transparent border-t border-white/5 space-y-3">
          <div className="flex flex-wrap gap-2 px-1">
            {currentPlatform.quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(prompt)}
                disabled={isTyping}
                className={`px-3 py-1.5 text-xs rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:border-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
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
              placeholder={`Dicta instrucciones a ${currentAgent.name}...`}
              className={`w-full bg-white/5 border border-white/10 focus:border-${currentAgent.color}-500/50 focus:bg-white/10 transition-all rounded-full py-4 pl-6 pr-14 text-white text-sm outline-none placeholder:text-zinc-500`}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className={`absolute right-2 p-2 ${currentAgent.accentClass} hover:brightness-110 disabled:bg-zinc-700 text-black rounded-full transition-colors`}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      <div className="w-full md:w-80 xl:w-96 flex flex-col justify-center py-4 md:py-8 pr-0 md:pr-4 order-1 md:order-2">
        <div className="text-center mb-6">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Live Spatial Preview</span>
        </div>

        {isVideoFormat ? (
          <div className="relative w-full aspect-[9/19] bg-zinc-950 border-[12px] border-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col justify-center items-center group">
            <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
              <div className="w-24 h-full bg-zinc-900 rounded-b-xl" />
            </div>

            {messages.some(m => m.hasWidget) ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black">
                <img
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=700&fit=crop"
                  className="w-full h-full object-cover opacity-90"
                  alt="Video Preview"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute top-12 left-0 right-0 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={currentAgent.avatar}
                        className="w-8 h-8 rounded-full border border-white/20"
                        alt={currentAgent.name}
                      />
                      <div>
                        <p className="text-white text-xs font-bold">etheragent.studio</p>
                        <p className="text-white/50 text-[10px]">Sponsored</p>
                      </div>
                    </div>
                    <MoreHorizontal size={16} className="text-white" />
                  </div>
                </div>

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                  <div className="flex flex-col items-center">
                    <Heart size={24} className="text-white drop-shadow-lg" fill="white" />
                    <span className="text-white text-xs font-bold drop-shadow-md">124K</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <MessageCircle size={24} className="text-white drop-shadow-lg" />
                    <span className="text-white text-xs font-bold drop-shadow-md">4.2K</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Share2 size={24} className="text-white drop-shadow-lg" />
                    <span className="text-white text-xs font-bold drop-shadow-md">8.7K</span>
                  </div>
                </div>

                <div className="absolute bottom-10 left-4 right-4">
                  <h4 className="text-white font-bold text-sm mb-1">El fin del video tradicional 💀</h4>
                  <p className="text-zinc-300 text-xs line-clamp-2 mb-3">Despliega instancias sintéticas con EtherAgent OS.</p>

                  {/* Tarjeta de Telemetría sobre el video */}
                  <div className="backdrop-blur-md bg-black/40 border border-white/10 p-3 rounded-xl mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-zinc-400 text-[10px] font-mono">RETENCIÓN ESPERADA</p>
                      <TrendingUp size={12} className={currentAgent.textColor} />
                    </div>
                    {isLoading ? (
                      <div className="h-6 w-16 bg-white/10 rounded animate-pulse" />
                    ) : (
                      <p className={`text-2xl font-bold ${currentAgent.textColor}`}>{socialData.retention}</p>
                    )}
                  </div>

                  <div className="mt-2 bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`w-10 h-10 rounded-full ${currentAgent.accentClass} hover:brightness-110 flex items-center justify-center transition-colors flex-shrink-0`}
                      >
                        {isPlaying ? (
                          <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                        ) : (
                          <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg>
                        )}
                      </button>

                      <div className="flex-1 flex items-center gap-0.5 h-8">
                        {[...Array(20)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-emerald-400 rounded-full"
                            animate={{
                              height: isPlaying ? [8, Math.random() * 24 + 8, 8] : 8,
                            }}
                            transition={{
                              duration: 0.5,
                              repeat: isPlaying ? Infinity : 0,
                              delay: i * 0.05,
                              ease: "easeInOut"
                            }}
                            style={{ opacity: isPlaying ? 0.9 : 0.4 }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-center gap-1">
                      <span className="text-[9px] text-zinc-500 font-mono">Powered by</span>
                      <span className={`text-[9px] text-emerald-500/70 font-mono font-bold`}>Nvidia Audio2Face</span>
                      <span className="text-zinc-600 text-[8px]">&</span>
                      <span className="text-[9px] text-emerald-500/70 font-mono font-bold">ElevenLabs</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-white/60 text-xs">
                      #AIInfrastructure #EtherAgentOS #NoCode
                    </span>
                  </div>
                  <button className={`mt-4 w-full py-2 ${currentAgent.accentClass} text-black rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2`}>
                    [ COMPILE TO FORGE ] <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center px-6">
                <Smartphone size={32} className="text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 text-xs font-mono">Esperando compilación neural para previsualización...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="relative w-full aspect-[9/19] bg-zinc-950 border-[12px] border-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col group">
            <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
              <div className="w-24 h-full bg-zinc-900 rounded-b-xl" />
            </div>

            {messages.some(m => m.hasWidget) ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-white flex flex-col">
                {/* Mobile Status Bar */}
                <div className="pt-8 px-4 pb-2 bg-white flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-medium">9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-2 border border-slate-400 rounded-sm relative">
                      <div className="absolute inset-0.5 bg-slate-600 rounded-[1px]" />
                    </div>
                  </div>
                </div>

                {/* Post Header */}
                <div className="px-3 py-2 flex items-center gap-2 border-b border-slate-100">
                  <img
                    src={currentAgent.avatar}
                    className="w-8 h-8 rounded-full border border-slate-200"
                    alt={currentAgent.name}
                  />
                  <div className="flex-1">
                    <p className="text-slate-900 text-xs font-semibold">etheragent.studio</p>
                    <p className="text-slate-400 text-[10px]">
                      {staticPlatform === 'linkedin' ? 'LinkedIn • Promoted' :
                        staticPlatform === 'twitter' ? 'X • Promoted' :
                          'Meta • Sponsored'}
                    </p>
                  </div>
                  <MoreHorizontal size={16} className="text-slate-400" />
                </div>

                {/* Post Text */}
                <div className="px-3 py-2">
                  <p className="text-slate-800 text-xs leading-relaxed">
                    {staticPlatform === 'linkedin'
                      ? '🚀 El MRR de tu SaaS puede multiplicarse x3. Los CEOs modernos no editan campañas; las compilan.'
                      : staticPlatform === 'twitter'
                        ? '🦅 El fin de la agencia tradicional ha llegado. Despliega instancias sintéticas con EtherAgent OS.'
                        : '✨ Transforma tu marca hoy. 50,000 empresas ya compilan su marketing con IA.'}
                    {' '}<span className={`font-semibold ${staticPlatform === 'linkedin' ? 'text-blue-600' : staticPlatform === 'twitter' ? 'text-sky-500' : 'text-blue-500'}`}>Ver más</span>
                  </p>
                </div>

                {/* Post Image */}
                <div className="relative flex-1 min-h-0">
                  <img
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=750&fit=crop"
                    className="w-full h-full object-cover"
                    alt="Static Preview"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-black/50 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
                      <p className="text-white text-[10px] font-bold">DEPLOY AI AGENTS TODAY</p>
                      <p className="text-white/60 text-[8px]">etheragent.studio</p>
                    </div>
                  </div>
                </div>

                {/* Engagement Bar */}
                <div className="px-3 py-2.5 bg-white border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Heart size={16} className="text-slate-600" />
                        <span className="text-slate-600 text-[10px] font-medium">2.4K</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={16} className="text-slate-600" />
                        <span className="text-slate-600 text-[10px] font-medium">189</span>
                      </div>
                      <Share2 size={16} className="text-slate-600" />
                    </div>
                    {staticPlatform === 'linkedin' && (
                      <button className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full">
                        Learn More
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-center px-6">
                <Image size={32} className="text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 text-xs font-mono">Esperando asset estático...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
