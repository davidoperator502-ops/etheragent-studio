import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Image, Copy, Upload, CheckCircle2,
  Video, Smartphone, MonitorPlay, Target, Palette, Briefcase
} from 'lucide-react';

const VISUAL_REQUIREMENTS = [
  {
    id: 'social_video_1',
    module: 'Social Video',
    icon: <Smartphone size={18} className="text-emerald-500" />,
    agent: 'Valeria M. (Growth Hacker)',
    context: 'Fondo Viral para TikTok/Reels/Shorts',
    ratio: '9:16',
    prompt: "--v 6.0 --ar 9:16 --style raw cinematic POV, looking up at a massive, highly intricate holographic neural network physically compiling a photorealistic digital human face in real-time. The environment is a pitch-black, ultra-modern glass server room. Intricate, glowing emerald green UI elements, nodes, and data streams floating in the air. The typography 'EtherAgent OS' is subtly integrated into the floating UI glass panels. Hyperrealistic, 8k resolution, shot on ARRI Alexa 65, 35mm lens, f/1.8, moody volumetric lighting, dense atmospheric fog, dramatic depth of field, sharp focus on the digital face, glowing particle effects --c 15 --stylize 200",
    color: 'emerald',
    accept: 'video/mp4,video/quicktime',
    formatLabel: 'SUBIR VIDEO (.MP4)'
  },
  {
    id: 'social_static_1',
    module: 'Social Static',
    icon: <Briefcase size={18} className="text-cyan-500" />,
    agent: 'Marcus V. (High-Ticket Closer)',
    context: 'Imagen de Autoridad para LinkedIn / X',
    ratio: '4:5',
    prompt: "--v 6.0 --ar 4:5 interior design photography, ultra-premium C-suite corporate boardroom. In the center, a glowing, translucent cyan smart-contract hologram projecting upwards from a sleek, polished obsidian conference table. The intricate hologram displays a massive MRR financial growth chart, global nodes, and data visualizations. The background features a deeply out-of-focus, sprawling New York City skyline at midnight through floor-to-ceiling windows. Dark mode luxury aesthetic, cinematic rim lighting, photorealistic, 8k, hyper-detailed textures, ray-traced reflections on the obsidian table, shot on medium format Hasselblad, f/2.8 --stylize 300",
    color: 'cyan',
    accept: 'image/png,image/jpeg,image/webp',
    formatLabel: 'SUBIR IMAGEN (.PNG/.JPG)'
  },
  {
    id: 'ooh_viktor_1',
    module: 'Virtual OOH',
    icon: <MonitorPlay size={18} className="text-cyan-500" />,
    agent: 'Viktor S. (Spatial Architect)',
    context: 'Valla 21:9 para Metaverso / UEFN',
    ratio: '21:9',
    prompt: "--v 6.0 --ar 21:9 epic wide master shot, a massive panoramic digital billboard dominating a photorealistic, dystopian cyberpunk metropolis at night. The glowing billboard displays a pristine, hyper-detailed synthetic AI agent face with piercing, glowing cyan eyes looking down at the city. Bold, integrated typography reads: 'CEOS DONT EDIT. THEY COMPILE.' Ray-traced neon reflections bouncing off rain-slicked wet asphalt. Cinematic lighting, dense volumetric smog, flying neon vehicles blurred in motion, Unreal Engine 5 render style, Octane Render, 8k, masterpiece, highly detailed architecture --c 20 --stylize 250",
    color: 'cyan',
    accept: 'image/png,image/jpeg',
    formatLabel: 'SUBIR IMAGEN PANORÁMICA'
  },
  {
    id: 'ads_kaelen_1',
    module: 'Performance Ads',
    icon: <Target size={18} className="text-violet-500" />,
    agent: 'Kaelen R. (Conversion Architect)',
    context: 'Anuncio de Retargeting Meta/LinkedIn',
    ratio: '1:1',
    prompt: "--v 6.0 --ar 1:1 extreme macro photography, a hyper-futuristic obsidian AI server processor core, pulsating with deep violet, magenta and amethyst bioluminescent light. Intricate liquid cooling tubes with glowing fluid flowing through them. The text 'EtherAgent OS - Neural Core' is elegantly and precisely engraved in sleek, minimalist typography on the brushed dark titanium metal casing. Pure pitch-black background, dramatic studio lighting, softbox reflections, hyper-detailed high-end commercial tech product shot, subsurface scattering, focus stacking, pristine clarity, 8k resolution --style raw --stylize 150",
    color: 'violet',
    accept: 'image/png,image/jpeg,video/mp4',
    formatLabel: 'SUBIR ASSET DE CONVERSIÓN'
  }
];

export default function VisualAssetMatrix() {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTimeout(() => {
        setUploadedFiles(prev => ({ ...prev, [id]: true }));
      }, 800);
    }
  };

  return (
    <div className="flex-1 p-8 h-screen overflow-y-auto">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">
          <Palette size={14} className="text-zinc-400" /> Visual Synthesis Control
        </div>
        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
          Visual Asset <span className="font-light text-zinc-600">Matrix</span>
        </h1>
        <p className="text-zinc-400 mt-2 font-mono text-sm">
          Panel de inyección de assets visuales (Imágenes/Videos). Copia el prompt para Midjourney/Runway, genera el asset y súbelo para inyectarlo en los agentes.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
        {VISUAL_REQUIREMENTS.map((req) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-950/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 shadow-2xl flex flex-col relative overflow-hidden"
          >
            <div className={`absolute -right-20 -top-20 w-64 h-64 bg-${req.color}-500/10 blur-[80px] rounded-full pointer-events-none`} />

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-zinc-900 border border-${req.color}-500/30 rounded-xl flex items-center justify-center`}>
                  {req.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold">{req.module}</h3>
                  <p className="text-xs text-zinc-500 font-mono uppercase">{req.agent}</p>
                </div>
              </div>

              {uploadedFiles[req.id] ? (
                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                  <CheckCircle2 size={12} /> Asset Visual Inyectado
                </div>
              ) : (
                <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-full flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                  <Image size={12} /> Esperando Asset
                </div>
              )}
            </div>

            <div className="bg-black/50 border border-zinc-800 rounded-xl p-4 mb-4 flex-1 relative z-10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                  Contexto: {req.context}
                </span>
                <span className="text-[10px] text-zinc-600 font-mono uppercase bg-zinc-900 px-2 py-0.5 rounded">
                  {req.ratio}
                </span>
              </div>
              <p className="text-zinc-300 text-sm italic leading-relaxed">"{req.prompt}"</p>
            </div>

            <div className="relative z-10 mt-auto">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => handleCopy(req.prompt, req.id)}
                  className="flex-1 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-2 text-xs font-bold"
                >
                  {copiedId === req.id ? (
                    <>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span className="text-emerald-500">COPIADO</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>COPIAR PROMPT</span>
                    </>
                  )}
                </button>
              </div>

              <input
                type="file"
                accept={req.accept}
                className="hidden"
                id={`upload-${req.id}`}
                onChange={(e) => handleFileUpload(req.id, e)}
              />
              <label
                htmlFor={`upload-${req.id}`}
                className={`w-full py-4 rounded-xl border border-dashed flex items-center justify-center gap-2 cursor-pointer transition-all ${uploadedFiles[req.id]
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/20'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-white/30 hover:text-white'
                  }`}
              >
                {uploadedFiles[req.id] ? (
                  <>
                    <CheckCircle2 size={18} />
                    <span className="font-bold text-sm">✓ ASSET VISUAL INYECTADO</span>
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    <span className="font-bold text-sm">{req.formatLabel}</span>
                  </>
                )}
              </label>
            </div>

          </motion.div>
        ))}
      </div>
    </div>
  );
}
