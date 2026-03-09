import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mic, Copy, Upload, CheckCircle2,
  Volume2, Cpu, Smartphone, MonitorPlay, Target,
  Radio, Headphones, Podcast
} from 'lucide-react';

const AUDIO_REQUIREMENTS = [
  {
    id: 'nexus_welcome',
    module: 'Nexus Genesis',
    icon: <Cpu size={18} className="text-emerald-500" />,
    agent: 'System Core (Marcus / Adam)',
    context: 'Bienvenida a la plataforma (Home)',
    script: "Infraestructura en línea. Bienvenido a EtherAgent OS. Estás frente al motor de compilación neuronal más avanzado del mercado. Inyecta tu dominio o un asset visual en la terminal. El sistema extraerá tu arquetipo corporativo y generará tu matriz de dominación omnicanal en segundos.",
    color: 'emerald'
  },
  {
    id: 'social_valeria_1',
    module: 'Social Lab',
    icon: <Smartphone size={18} className="text-emerald-500" />,
    agent: 'Valeria M. (Growth Hacker)',
    context: 'Primer mensaje del chat',
    script: "Iniciando sesión segura. He analizado el vector 'La muerte de la agencia tradicional' para la cuenta de EtherAgent Studio. He ajustado el hook para generar un ochenta y siete por ciento de retención en los primeros tres segundos. ¿Autorizas la compilación del audio sintético con voz de Autoridad?",
    color: 'emerald'
  },
  {
    id: 'ooh_viktor_1',
    module: 'Virtual OOH Lab',
    icon: <MonitorPlay size={18} className="text-cyan-500" />,
    agent: 'Viktor S. (Spatial Architect)',
    context: 'Propuesta de despliegue en Metaverso',
    script: "Conexión a Nodos Globales establecida. Detecto liquidez de tráfico masiva en el servidor Neo-Shibuya de Unreal Engine. El CPM está en mínimos históricos. ¿Desplegamos el holograma de EtherAgent Studio en una valla inmersiva para impactar a doscientos cincuenta mil usuarios concurrentes hoy?",
    color: 'cyan'
  },
  {
    id: 'ads_kaelen_1',
    module: 'Performance Ads Lab',
    icon: <Target size={18} className="text-violet-500" />,
    agent: 'Kaelen R. (Conversion Architect)',
    context: 'Voiceover del anuncio B2B',
    script: "Cómo cerramos cuatrocientos cincuenta mil dólares en ingresos recurrentes sin grabar un solo video. La era de la edición manual terminó. Los CEOs no editan, compilan. Implementa contratos inteligentes de atención con EtherAgent OS y escala tus conversiones automáticamente.",
    color: 'violet'
  },
  {
    id: 'audio_spotify_1',
    module: 'Sonic Lab (Spotify)',
    icon: <Radio size={18} className="text-amber-500" />,
    agent: 'Aria V. (Sonic Architect)',
    context: 'Spotify B2B Ad — Interrupción de Patrón',
    script: "[SFX: Glitch digital + 1s de silencio]. Estás escuchando este anuncio porque nuestra red neuronal detectó tu perfil corporativo. No grabamos esta voz en un estudio; fue compilada en milisegundos por EtherAgent OS. Los CEOs modernos no contratan locutores; ejecutan contratos de atención sintética. Domina el espectro auditivo. Inicia tu infraestructura en EtherAgent punto Studio.",
    color: 'amber'
  },
  {
    id: 'audio_podcast_1',
    module: 'Sonic Lab (Mid-roll)',
    icon: <Podcast size={18} className="text-amber-500" />,
    agent: 'Aria V.',
    context: 'Podcast Mid-roll — Efecto ASMR / Proximidad',
    script: "[Voz íntima/Cercana]. Pausa tu podcast un segundo. Presta atención a la respiración y el tono de mi voz... Lo que escuchas no es humano. Es una instancia neuronal de alta fidelidad. Las agencias de élite ya están desplegando campañas globales a latencia cero. El audio ahora es código. Deja de editar. Empieza a compilar.",
    color: 'amber'
  },
  {
    id: 'audio_dialogue_1',
    module: 'Sonic Lab (AI Dialogue)',
    icon: <Headphones size={18} className="text-amber-500" />,
    agent: 'Aria V. & Marcus V.',
    context: 'Diálogo Sintético — Dos IAs',
    script: "Aria: Marcus, el CEO que nos escucha aún usa agencias tradicionales. / Marcus: Un error de cálculo. Nuestro costo de despliegue es un 90% menor y no dormimos. / Aria: Exacto. Bienvenidos a EtherAgent OS. Sus nuevos agentes de ventas están listos para compilar.",
    color: 'amber'
  }
];

export default function NeuralAudioMatrix() {
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
          <Volume2 size={14} className="text-zinc-400" /> Voice Synthesis Control
        </div>
        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
          Neural Audio <span className="font-light text-zinc-600">Matrix</span>
        </h1>
        <p className="text-zinc-400 mt-2 font-mono text-sm">
          Panel de inyección de voces sintéticas (ElevenLabs / Azure). Copia el guion, genera el audio y carga el .mp3 para activar a los Agentes.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
        {AUDIO_REQUIREMENTS.map((req) => (
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
                  <CheckCircle2 size={12} /> Audio Inyectado
                </div>
              ) : (
                <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-full flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                  <Mic size={12} /> Esperando Audio
                </div>
              )}
            </div>

            <div className="bg-black/50 border border-zinc-800 rounded-xl p-4 mb-6 flex-1 relative z-10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Contexto: {req.context}</span>
                <button
                  onClick={() => handleCopy(req.script, req.id)}
                  className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-xs font-mono bg-zinc-900 px-2 py-1 rounded"
                >
                  {copiedId === req.id ? <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 size={12} /> Copiado</span> : <><Copy size={12} /> Copiar Prompt</>}
                </button>
              </div>
              <p className="text-zinc-300 text-sm italic leading-relaxed">"{req.script}"</p>
            </div>

            <div className="relative z-10 mt-auto">
              <input
                type="file"
                accept="audio/mpeg, audio/mp3, audio/wav"
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
                    <Volume2 size={18} />
                    <span className="font-bold text-sm">REEMPLAZAR ARCHIVO .MP3</span>
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    <span className="font-bold text-sm">SUBIR AUDIO (.MP3)</span>
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
