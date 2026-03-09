import { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Mic, Volume2, Play, Instagram, Twitter, Youtube, Globe, ChevronDown, FileAudio } from 'lucide-react';

interface NeuralAudioNodeData {
  script?: string;
  voiceId?: string;
  voiceName?: string;
  language?: 'en' | 'es';
}

const VOICE_EXAMPLES = [
  { id: 'en_male_deep', name: 'Deep Baritone (EN)', language: 'en', gender: 'male', style: 'Authoritative', desc: 'Strong, commanding voice for enterprise' },
  { id: 'en_female_authoritative', name: 'Authoritative (EN)', language: 'en', gender: 'female', style: 'Corporate', desc: 'Professional, confident delivery' },
  { id: 'en_male_casual', name: 'Casual Dynamic (EN)', language: 'en', gender: 'male', style: 'Conversational', desc: 'Friendly, approachable tone' },
  { id: 'en_female_warm', name: 'Warm & Friendly (EN)', language: 'en', gender: 'female', style: 'Empathetic', desc: 'Warm, engaging personality' },
  { id: 'es_male_authoritative', name: 'Autoritario (ES)', language: 'es', gender: 'male', style: 'Corporate', desc: 'Strong Spanish authority' },
  { id: 'es_female_warm', name: 'Cálida & Cercana (ES)', language: 'es', gender: 'female', style: 'Empathetic', desc: 'Warm Latin American' },
  { id: 'es_male_energetic', name: 'Enérgico (ES)', language: 'es', gender: 'male', style: 'High-Energy', desc: 'Dynamic, energetic pitch' },
];

const SCRIPT_EXAMPLES = {
  en: [
    { id: 'b2b_pitch', name: 'B2B Pitch', script: 'Ladies and gentlemen, we\'ve analyzed your market position. Here\'s the strategy that will 10x your revenue in the next quarter. Our AI-driven approach has delivered proven results for Fortune 500 companies worldwide. Let me show you the numbers that matter.' },
    { id: 'product_launch', name: 'Product Launch', script: 'Introducing the future of your industry. This isn\'t just a product—it\'s a revolution. Every feature designed with one purpose: to accelerate your growth. Ready to see what\'s possible?' },
    { id: 'testimonial', name: 'Testimonial', script: 'I\'ve tried everything. But nothing compared to what we achieved together. The results speak for themselves—300% growth in just 90 days. This is the tool I wish I had known about years ago.' },
    { id: 'webinar_intro', name: 'Webinar Intro', script: 'Welcome everyone. Today we\'re diving deep into strategies that top performers use to dominate their markets. By the end of this session, you\'ll have actionable insights you can implement immediately. Let\'s begin.' },
  ],
  es: [
    { id: 'b2b_pitch_es', name: 'Pitch B2B', script: 'Señores, hemos analizado su posición en el mercado. Esta es la estrategia que triplicará sus ingresos en el próximo trimestre. Nuestro enfoque impulsado por IA ha demostrado resultados probados para empresas Fortune 500 a nivel mundial.' },
    { id: 'product_launch_es', name: 'Lanzamiento', script: 'Presentamos el futuro de su industria. Esto no es solo un producto—es una revolución. Cada característica diseñada con un propósito: acelerar su crecimiento. ¿Listo para ver lo que es posible?' },
    { id: 'testimonial_es', name: 'Testimonio', script: 'Lo probé todo. Pero nada se comparó con lo que logramos juntos. Los resultados hablan por sí mismos—300% de crecimiento en solo 90 días. Esta es la herramienta que wish hubiera conocido antes.' },
    { id: 'webinar_intro_es', name: 'Intro Webinar', script: 'Bienvenidos a todos. Hoy nos sumergiremos en estrategias que los mejores líderes usan para dominar sus mercados. Al final de esta sesión, tendrá información accionable que puede implementar inmediatamente. Empecemos.' },
  ],
};

const PLATFORM_CONFIGS = [
  { id: 'instagram', name: 'TikTok/Reels', icon: Instagram, color: 'pink', maxDuration: 60 },
  { id: 'twitter', name: 'X/Twitter', icon: Twitter, color: 'blue', maxDuration: 280 },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'red', maxDuration: 600 },
];

export function NeuralAudioNode({ data }: NodeProps) {
  const nodeData = data as NeuralAudioNodeData;
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVoiceExamples, setShowVoiceExamples] = useState(false);
  const [showScriptExamples, setShowScriptExamples] = useState(false);
  
  const language = nodeData.language || 'en';
  const voiceName = nodeData.voiceName || 'Deep Baritone (EN)';
  const script = nodeData.script || 'Enter your script for synthesis...';

  const handlePreview = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const handleSelectVoice = (voice: typeof VOICE_EXAMPLES[0]) => {
    if ((window as any).setNodeData) {
      (window as any).setNodeData('neural-audio', { 
        voiceId: voice.id,
        voiceName: voice.name,
        language: voice.language,
        script: nodeData.script,
      });
    }
    setShowVoiceExamples(false);
  };

  const handleSelectScript = (scriptText: string) => {
    if ((window as any).setNodeData) {
      (window as any).setNodeData('neural-audio', { 
        ...nodeData,
        script: scriptText,
      });
    }
    setShowScriptExamples(false);
  };

  return (
    <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-4 min-w-[320px] text-white shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <Handle type="target" position={Position.Left} className="!bg-violet-500 !w-3 !h-3" />
      
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/30 to-pink-600/30 border border-violet-500/30">
          <Mic size={18} className="text-violet-400" />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-widest text-violet-400/70 font-bold">NODE 04</span>
          <h4 className="text-sm font-bold">Neural Audio</h4>
        </div>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Volume2 size={12} className="text-pink-400" />
            <span className="text-[9px] uppercase tracking-widest text-white/40">VOICE SYNTHESIS</span>
          </div>
          <div className="flex items-center gap-1">
            <Globe size={10} className="text-white/40" />
            <span className="text-[9px] text-white/40">{language.toUpperCase()}</span>
          </div>
        </div>
        
        <button
          onClick={() => setShowVoiceExamples(!showVoiceExamples)}
          className="w-full flex items-center justify-between p-2 bg-black/40 border border-white/10 rounded hover:border-violet-500/50 transition-colors"
        >
          <span className="text-xs text-white">{voiceName}</span>
          <ChevronDown size={14} className="text-white/40" />
        </button>

        {showVoiceExamples && (
          <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
            {VOICE_EXAMPLES.map((voice) => (
              <button
                key={voice.id}
                onClick={() => handleSelectVoice(voice)}
                className="w-full text-left p-2 bg-black/40 border border-white/5 rounded hover:border-violet-500/50 transition-colors"
              >
                <p className="text-[10px] text-white">{voice.name}</p>
                <p className="text-[8px] text-violet-400">{voice.desc}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-black/40 border border-white/10 rounded-lg p-3 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <FileAudio size={12} className="text-cyan-400" />
          <span className="text-[9px] uppercase tracking-widest text-white/40">SCRIPT PREVIEW</span>
        </div>
        
        <button
          onClick={() => setShowScriptExamples(!showScriptExamples)}
          className="w-full text-left p-2 bg-black/40 border border-white/10 rounded hover:border-violet-500/50 transition-colors mb-2"
        >
          <span className="text-[9px] text-violet-400">{showScriptExamples ? '▼ Select preset' : '▶ Load script presets'}</span>
        </button>

        <p className="text-[10px] text-white/60 font-mono line-clamp-4">
          {script}
        </p>

        {showScriptExamples && (
          <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
            {SCRIPT_EXAMPLES[language].map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectScript(s.script)}
                className="w-full text-left p-2 bg-black/40 border border-white/5 rounded hover:border-cyan-500/50 transition-colors"
              >
                <p className="text-[10px] text-white font-medium">{s.name}</p>
                <p className="text-[8px] text-white/40 line-clamp-1">{s.script}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        {PLATFORM_CONFIGS.map((platform) => {
          const Icon = platform.icon;
          return (
            <div 
              key={platform.id}
              className={`flex items-center gap-1.5 px-2 py-1 rounded bg-${platform.color}-500/10 border border-${platform.color}-500/30 flex-1 justify-center`}
            >
              <Icon size={12} className={`text-${platform.color}-400`} />
              <span className="text-[8px] text-white/60">{platform.name.split('/')[0]}</span>
            </div>
          );
        })}
      </div>

      <button
        onClick={handlePreview}
        disabled={isPlaying || !script}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all ${
          isPlaying 
            ? 'bg-gradient-to-r from-violet-500 to-pink-500 border-violet-400 text-white' 
            : 'bg-black/40 border-white/10 text-white/70 hover:border-violet-500/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
        }`}
      >
        <Play size={14} className={isPlaying ? 'animate-pulse' : ''} />
        <span className="text-xs font-bold font-mono">
          {isPlaying ? '▶ SYNTHESIZING...' : '▶ PREVIEW SYNTHETIC VOICE'}
        </span>
      </button>

      <Handle type="source" position={Position.Right} className="!bg-violet-500 !w-3 !h-3" />
    </div>
  );
}

export default NeuralAudioNode;
