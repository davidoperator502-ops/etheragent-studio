import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Sparkles, Zap, Loader2, Upload, Film } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CommercialLab() {
    const [assetUrl, setAssetUrl] = useState<string | null>(null);
    const [isVideo, setIsVideo] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isCompiling, setIsCompiling] = useState(false);
    const [chatStep, setChatStep] = useState(1);

    // 1. Fetch Inicial: Buscar el asset nuevo
    useEffect(() => {
        const fetchAsset = async () => {
            const { data } = await supabase
                .from('visual_assets')
                .select('id, url')
                .in('id', ['commercial_new_video', 'commercial_new_image']);

            if (data && data.length > 0) {
                const videoAsset = data.find(item => item.id === 'commercial_new_video');
                const imgAsset = data.find(item => item.id === 'commercial_new_image');

                if (videoAsset) {
                    setAssetUrl(videoAsset.url);
                    setIsVideo(true);
                } else if (imgAsset) {
                    setAssetUrl(imgAsset.url);
                    setIsVideo(false);
                }
            }
            setLoading(false);
        };
        fetchAsset();
    }, []);

    // 2. Subida Directa Segura (La misma lógica invencible del OOH)
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) return;
            setUploading(true);

            const isVid = file.type.includes('video');
            const assetId = isVid ? 'commercial_new_video' : 'commercial_new_image';
            const fileExt = file.name.split('.').pop();
            const fileName = `${assetId}-${Date.now()}.${fileExt}`;

            // Subir al Storage
            const { error: uploadError } = await supabase.storage.from('visual-assets').upload(fileName, file);
            if (uploadError) throw uploadError;

            // Obtener URL y guardar en BD
            const { data: { publicUrl } } = supabase.storage.from('visual-assets').getPublicUrl(fileName);
            await supabase.from('visual_assets').upsert({ id: assetId, url: publicUrl, updated_at: new Date() });

            // Proyectar en la pantalla Inmediatamente
            setAssetUrl(publicUrl);
            setIsVideo(isVid);
        } catch (error) {
            console.error('Error subiendo asset:', error);
            alert('Error al subir el archivo.');
        } finally {
            setUploading(false);
        }
    };

    const handleCompile = () => {
        setIsCompiling(true);
        setTimeout(() => { setIsCompiling(false); setChatStep(2); }, 2500);
    };

    return (
        <div className="flex flex-col xl:flex-row min-h-screen w-full bg-[#050505] text-white p-4 md:p-8 gap-8 pb-32">

            {/* PANEL IZQUIERDO: Chat de Kaelen R. */}
            <div className="flex-1 flex flex-col max-w-3xl">
                <header className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-full border-2 border-purple-500/50 flex items-center justify-center bg-zinc-900">
                            <span className="font-black text-2xl text-white">K</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Kaelen R.</h2>
                            <p className="text-purple-500 font-mono text-xs tracking-widest uppercase">
                                Conversion Architect • Active Session
                            </p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 bg-[#0a0a0c] border border-white/5 rounded-3xl p-8 flex flex-col relative overflow-visible">
                    <div className="flex items-center gap-2 mb-8 justify-between w-[90%]">
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} className="text-purple-500" />
                            <span className="text-purple-500 text-[10px] font-mono tracking-widest uppercase">Nodo: Commercial Studio</span>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl rounded-tl-sm w-[90%] mb-6">
                        <p className="text-base text-zinc-300 leading-relaxed">
                            He preparado la estructura para el Video Sales Letter de conversión directa. ¿Autorizas inyectar el asset final para revisión ejecutiva?
                        </p>
                    </div>

                    <div className="bg-purple-900/20 border border-purple-500/20 p-6 rounded-2xl rounded-tr-sm w-[85%] self-end mb-6">
                        <p className="text-base text-purple-100 leading-relaxed">
                            Procede, Kaelen. Maximiza el contraste y prepara el llamado a la acción.
                        </p>
                    </div>

                    {chatStep === 2 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 border border-purple-500/30 p-6 rounded-2xl rounded-tl-sm w-[90%] mb-6">
                            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                            <p className="text-base text-white leading-relaxed font-medium">
                                Asset comercial inyectado. Verifica el dispositivo de alta fidelidad a tu derecha.
                            </p>
                        </motion.div>
                    )}

                    <div className="mt-auto grid grid-cols-2 gap-4">
                        <button onClick={handleCompile} disabled={isCompiling || chatStep === 2} className="bg-[#111] hover:bg-zinc-800 border border-white/5 p-4 rounded-xl flex items-center justify-center gap-3 text-sm font-bold text-zinc-300 transition-colors">
                            {isCompiling ? <Loader2 size={18} className="text-purple-500 animate-spin" /> : <Zap size={18} className="text-purple-500" />} Renderizar Comercial
                        </button>
                    </div>
                </div>
            </div>

            {/* PANEL DERECHO: EL MÓVIL PERFECTO CON BOTÓN DE SUBIDA */}
            <div className="w-full xl:w-[420px] shrink-0 flex flex-col items-center pt-8">

                <div className="w-[340px] flex justify-between items-center mb-6 px-2">
                    <h3 className="text-sm font-mono tracking-widest uppercase text-zinc-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Ad Preview
                    </h3>

                    {/* EL BOTÓN DE SUBIDA (Igual al de OOH) */}
                    <div className="relative">
                        <input type="file" accept="image/*,video/*" onChange={handleFileUpload} disabled={uploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <button className="flex items-center gap-2 bg-purple-500/10 text-purple-500 border border-purple-500/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-500/20 transition-colors">
                            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} {uploading ? 'Subiendo...' : 'Subir Asset'}
                        </button>
                    </div>
                </div>

                {/* EL MÓVIL ESTRICTO (340x720px) */}
                <div className="relative w-[340px] h-[720px] bg-black border-[8px] border-[#1c1c1e] rounded-[3.5rem] shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden flex flex-col shrink-0 group">

                    {/* Notch del Celular */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-50"></div>

                    <div className="flex-1 relative bg-zinc-900 w-full h-full">
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-purple-500" size={40} /></div>
                        ) : assetUrl ? (
                            isVideo ? (
                                // Renderizado de Video
                                <video src={assetUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-10" />
                            ) : (
                                // Renderizado de Imagen
                                <img src={assetUrl} alt="Commercial" className="absolute inset-0 w-full h-full object-cover z-10" />
                            )
                        ) : (
                            // Estado Vacío
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 font-mono text-xs uppercase text-center p-8 z-10 border border-dashed border-zinc-800 m-4 rounded-xl gap-2">
                                <Film size={24} className="text-zinc-700" />
                                <span>Sube tu asset comercial</span>
                            </div>
                        )}

                        {/* Overlay sutil estilo Red Social */}
                        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur text-[8px] font-mono text-purple-500 px-2 py-1 rounded z-20">
                            NODE_ACTIVE_COMMERCIAL
                        </div>
                    </div>
                </div>

                <button className={`mt-8 w-[340px] py-4 rounded-xl font-black font-mono text-sm tracking-widest transition-all duration-300 ${chatStep === 2 ? 'bg-purple-500 hover:bg-purple-400 text-black shadow-[0_0_30px_rgba(168,85,247,0.3)]' : 'bg-zinc-900 text-zinc-600 border border-white/5 cursor-not-allowed'}`}>
                    [ DEPLOY TO NETWORKS ]
                </button>
            </div>
        </div>
    );
}
