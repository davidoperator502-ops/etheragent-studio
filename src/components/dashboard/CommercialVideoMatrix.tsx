import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Clapperboard, Film, MonitorPlay, Smartphone, Upload, CheckCircle2, Copy
} from 'lucide-react';

// Base de datos de Prompts de Video Maestros (Cinematic Magical Realism - Sora/Runway)
const VIDEO_PROMPTS = [
    {
        id: 'social_bumper_6s',
        module: '6s Bumper',
        icon: <Film size={18} className="text-emerald-500" />,
        agent: 'Valeria M. (Growth Hacker)',
        context: 'Bumper Ads / YT Shorts (9:16) - El Gancho Instantáneo',
        ratio: '9:16',
        prompt: "VISUAL: Extreme macro close-up of an elegant female CEO's finger tapping a pulsating emerald 'DEPLOY ETHERAGENT' button on an obsidian smartphone screen. The moment her skin touches the glass, a volumetric shockwave of cyan and emerald digital light violently washes over the out-of-focus background of a mundane, warm-lit cafe. The physical brick walls shatter into floating data particles, instantly replaced by a pitch-black, hyper-futuristic production matrix. A pristine, hyper-realistic synthetic AI agent materializes from a beam of light in the background, flawlessly delivering a pitch to a floating robotic drone camera. Photorealistic, ARRI Alexa 65, 35mm lens, extreme depth of field, high contrast color grading. || MOTION DIRECTIVE: Dynamic kinetic shockwave transition. 120fps slow-motion exactly at the split-second of the tap, then violently accelerating into hyper-lapse as the cafe geometry dissolves into the digital realm. Flawless motion blur, high-octane B2B luxury energy.",
        color: 'emerald',
    },
    {
        id: 'social_short_15s',
        module: '15s Short',
        icon: <Smartphone size={18} className="text-violet-500" />,
        agent: 'Kaelen R. (Conversion Architect)',
        context: 'Meta Ads / LinkedIn (1:1 o 4:5) - La Creación',
        ratio: '1:1',
        prompt: "VISUAL: A male founder stands in a completely empty, raw concrete warehouse holding a tablet with the 'EtherAgent OS' interface. He swipes the screen. With a magical realism effect, a full high-end podcast set and three hyper-realistic holographic AI agents instantly pop into existence around him out of digital light. One agent adjusts a microphone, another reviews a glowing cyan script floating in the air. The founder smiles confidently. || MOTION DIRECTIVE: Smooth Steadicam circling the founder. The materialization of the holograms and furniture should be sudden, popping in like 3D assets rendering in real-time. High-end lifestyle tech commercial.",
        color: 'violet',
    },
    {
        id: 'video_spot_30s',
        module: '30s Spot',
        icon: <Clapperboard size={18} className="text-cyan-500" />,
        agent: 'Marcus V. (High-Ticket Closer)',
        context: 'YouTube Pre-roll / Horizontal (16:9) - Dominación OOH',
        ratio: '16:9',
        prompt: "VISUAL: A businesswoman sits in the back of a luxury car at night, looking at the EtherAgent OS app on her phone. She presses 'EXECUTE'. She looks out the window. The boring, static billboards of the rainy city street glitch and instantly transform into massive, synchronized glowing holographic ads featuring her AI agents. The city is now her digital empire. Neon reflections on wet glass. || MOTION DIRECTIVE: Smooth cinematic tracking shot starting inside the car, moving past the CEO's profile to focus on the outside window transformation. Cyberpunk aesthetic grounded in modern reality.",
        color: 'cyan',
    },
    {
        id: 'ooh_feature_60s',
        module: '60s Feature',
        icon: <MonitorPlay size={18} className="text-amber-500" />,
        agent: 'Viktor S. (Spatial Architect)',
        context: 'Metaverse Billboard (21:9) - El Contraste Absoluto',
        ratio: '21:9',
        prompt: "VISUAL: A CEO stands calmly in the middle of a chaotic, stressful traditional marketing agency (cables everywhere, broken lights, people yelling). She taps her glowing phone. A shockwave of deep violet light expands from the device. Everything traditional dissolves into glowing black sand, instantly replaced by a silent, pristine, ultra-modern obsidian room where perfect AI avatars are silently compiling thousands of videos in floating emerald holographic screens. She calmly sips her espresso. || MOTION DIRECTIVE: 1000fps slow-motion shockwave effect. Liquid transition from chaotic reality to a serene, futuristic control room. Cinematic crane shot pushing in on the CEO's calm face.",
        color: 'amber',
    },
];

interface CommercialVideoMatrixProps {
    isDemoMode?: boolean;
}

export default function CommercialVideoMatrix({ isDemoMode = false }: CommercialVideoMatrixProps) {
    const [uploadedFiles, setUploadedFiles] = useState<Record<string, boolean>>({});
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text).catch(() => { });
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

    // GHOST IN THE MACHINE: isDemoMode auto-pilot
    React.useEffect(() => {
        if (!isDemoMode) return;

        // Sequentially "copy" each prompt and mark as "uploaded"
        const steps = VIDEO_PROMPTS.map((prompt, index) => ({
            copyDelay: index * 1200,
            uploadDelay: index * 1200 + 600,
            id: prompt.id,
            text: prompt.prompt,
        }));

        const timeouts: NodeJS.Timeout[] = [];

        steps.forEach(step => {
            timeouts.push(setTimeout(() => {
                setCopiedId(step.id);
            }, step.copyDelay));

            timeouts.push(setTimeout(() => {
                setCopiedId(null);
                setUploadedFiles(prev => ({ ...prev, [step.id]: true }));
            }, step.uploadDelay));
        });

        return () => timeouts.forEach(clearTimeout);
    }, [isDemoMode]);

    return (
        <div className="flex-1 p-4 md:p-8 h-screen overflow-y-auto pb-32 md:pb-8">
            <div className="mb-10">
                <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">
                    <Clapperboard size={14} className="text-zinc-400" /> Cinematic Render Control
                </div>
                <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
                    Commercial Video <span className="font-light text-zinc-600">Matrix</span>
                </h1>
                <p className="text-zinc-400 mt-2 font-mono text-sm">
                    Panel de inyección de video cinemático (Sora / Runway / Pika). Copia el prompt de movimiento, genera el render y súbelo para inyectarlo en las campañas.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20 md:pb-6">
                {VIDEO_PROMPTS.map((req) => (
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
                                    <CheckCircle2 size={12} /> Render Inyectado
                                </div>
                            ) : (
                                <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-full flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                                    <Film size={12} /> Esperando Render
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
                                            <span>COPIAR PROMPT DE VIDEO</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <input
                                type="file"
                                accept="video/mp4,video/webm"
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
                                        <span className="font-bold text-sm">✓ RENDER DE VIDEO INYECTADO</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={18} />
                                        <span className="font-bold text-sm">SUBIR RENDER DE VIDEO (.MP4 / .WEBM)</span>
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
