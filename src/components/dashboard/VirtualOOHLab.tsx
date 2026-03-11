import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useVoiceStore } from '@/store/useVoiceStore';
import { useCampaignStore } from '@/store/useCampaignStore';
import { MonitorPlay, Sparkles, Zap, Loader2, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VirtualOOHLab() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDemo = location.state?.isDemo === true;
  const isFullDemo = location.state?.isFullDemo === true;
  const nextStep = location.state?.nextStep;

  const [billboardUrl, setBillboardUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [chatStep, setChatStep] = useState(1);

  const { speak, stopSpeaking, isSpeaking } = useVoiceStore();
  const workspace = useCampaignStore((state) => state.workspace);

  // Fetch inicial de Supabase
  useEffect(() => {
    const fetchAsset = async () => {
      const { data } = await supabase
        .from('visual_assets')
        .select('id, url')
        .in('id', ['viktor_ooh_billboard', 'viktor_ooh_video']);

      if (data && data.length > 0) {
        const videoAsset = data.find(item => item.id === 'viktor_ooh_video');
        const imgAsset = data.find(item => item.id === 'viktor_ooh_billboard');

        if (videoAsset) {
          setBillboardUrl(videoAsset.url);
          setIsVideo(true);
        } else if (imgAsset) {
          setBillboardUrl(imgAsset.url);
          setIsVideo(false);
        }
      }
      setLoading(false);
    };
    fetchAsset();
  }, []);

  // Demo mode voice
  useEffect(() => {
    if (isDemo) {
      const viktorWelcome = "Bienvenido al Virtual OOH Lab, CEO. Soy Viktor, tu arquitecto espacial. Desplegaremos tu marca en vallas panorámicas 8K y el Metaverso. ¿Preparado para dominar el mundo real?";

      window.speechSynthesis.onvoiceschanged = () => speak(viktorWelcome, "viktor");
      if (window.speechSynthesis.getVoices().length > 0) speak(viktorWelcome, "viktor");

      if (isFullDemo && nextStep === 3) {
        setTimeout(() => {
          speak("Último paso. Transfiriendo a Kaelen en Performance Ads. Optimizaremos el ROAS.", "viktor");
          setTimeout(() => {
            navigate('/dashboard/ads', { state: { isDemo: true, isFullDemo: true } });
          }, 4500);
        }, 6000);
      }
    }
    return () => stopSpeaking();
  }, [isDemo]);

  // Subida Directa
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      setUploading(true);

      const isVid = file.type.includes('video');
      const assetId = isVid ? 'viktor_ooh_video' : 'viktor_ooh_billboard';
      const fileExt = file.name.split('.').pop();
      const fileName = `${assetId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('visual-assets').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('visual-assets').getPublicUrl(fileName);
      await supabase.from('visual_assets').upsert({ id: assetId, url: publicUrl, updated_at: new Date() });

      setBillboardUrl(publicUrl);
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
    <div className="flex flex-col xl:flex-row min-h-screen w-full bg-[#050505] text-white p-4 md:p-8 gap-8 pb-32 overflow-y-auto">

      {/* PANEL IZQUIERDO: Chat de Viktor */}
      <div className="flex-1 flex flex-col max-w-3xl">
        <header className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full border-2 border-orange-500/50 flex items-center justify-center bg-zinc-900">
              <span className="font-black text-2xl text-white">V</span>
              {isDemo && isSpeaking && <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold">Viktor S.</h2>
              <p className="text-orange-500 font-mono text-xs tracking-widest uppercase">
                Spatial Architect • {isDemo ? 'Demo Activa' : 'Active Session'}
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 bg-[#0a0a0c] border border-white/5 rounded-3xl p-8 flex flex-col relative overflow-visible">
          <div className="flex items-start gap-2 mb-8">
            <Sparkles size={16} className="text-orange-500 mt-0.5 shrink-0" />
            <span className="text-orange-500 text-[10px] font-mono tracking-widest uppercase break-words pr-4">
              {workspace ? `Prompt Base: ${workspace.visual_vectors}` : "Nodo: Neo-Shibuya"}
            </span>
          </div>

          <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl rounded-tl-sm w-[90%] mb-6">
            <p className="text-base text-zinc-300 leading-relaxed">
              {workspace?.viktor_chat || "He asegurado el inventario digital en la plaza principal. ¿Autorizas encender el holograma a escala urbana para dominar el espacio visual?"}
            </p>
          </div>

          <div className="bg-orange-900/20 border border-orange-500/20 p-6 rounded-2xl rounded-tr-sm w-[85%] self-end mb-6">
            <p className="text-base text-orange-100 leading-relaxed">Procede. Que el contraste ilumine toda la calle.</p>
          </div>

          {chatStep === 2 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 border border-orange-500/30 p-6 rounded-2xl rounded-tl-sm w-[90%] mb-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
              <p className="text-base text-white leading-relaxed font-medium">
                Despliegue holográfico activo. Verifica el panel físico a tu derecha.
              </p>
            </motion.div>
          )}

          <div className="mt-auto grid grid-cols-2 gap-4">
            <button onClick={handleCompile} disabled={isCompiling || chatStep === 2} className="bg-[#111] hover:bg-zinc-800 border border-white/5 p-4 rounded-xl flex items-center justify-center gap-3 text-sm font-bold text-zinc-300 transition-colors">
              {isCompiling ? <Loader2 size={18} className="text-orange-500 animate-spin" /> : <Zap size={18} className="text-orange-500" />} Encender Valla
            </button>
          </div>
        </div>
      </div>

      {/* PANEL DERECHO: EL MÓVIL PERFECTO (Idéntico a Social Lab — 340x720) */}
      <div className="w-full xl:w-[420px] shrink-0 flex flex-col items-center pt-8">

        <div className="w-[340px] flex justify-between items-center mb-6 px-2">
          <h3 className="text-sm font-mono tracking-widest uppercase text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Spatial Preview
          </h3>

          {/* BOTÓN PARA SUBIR IMAGEN/VIDEO DIRECTAMENTE */}
          <div className="relative">
            <input type="file" accept="image/*,video/*" onChange={handleFileUpload} disabled={uploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <button className="flex items-center gap-2 bg-orange-500/10 text-orange-500 border border-orange-500/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-500/20 transition-colors">
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} {uploading ? 'Subiendo...' : 'Subir Asset'}
            </button>
          </div>
        </div>

        {/* EL MÓVIL ESTRICTO (340x720px) */}
        <div className="relative w-[340px] h-[720px] bg-black border-[8px] border-[#1c1c1e] rounded-[3.5rem] shadow-[0_0_50px_rgba(249,115,22,0.15)] overflow-hidden flex flex-col shrink-0 group">

          {/* Notch del Celular */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-50"></div>

          <div className="flex-1 relative bg-zinc-900 w-full h-full">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-orange-500" size={40} /></div>
            ) : billboardUrl ? (
              isVideo ? (
                <video src={billboardUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-10" />
              ) : (
                <img src={billboardUrl} alt="Billboard" className="absolute inset-0 w-full h-full object-cover z-10" />
              )
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-600 font-mono text-xs uppercase text-center p-8 z-10 border border-dashed border-zinc-800 m-4 rounded-xl">
                Sube tu asset OOH
              </div>
            )}

            {/* Overlay sutil para OOH */}
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur text-[8px] font-mono text-orange-500 px-2 py-1 rounded z-20">
              NODE_ACTIVE_OOH
            </div>
          </div>
        </div>

        <button className={`mt-8 w-[340px] py-4 rounded-xl font-black font-mono text-sm tracking-widest transition-all duration-300 ${chatStep === 2 ? 'bg-orange-500 hover:bg-orange-400 text-black shadow-[0_0_30px_rgba(249,115,22,0.3)]' : 'bg-zinc-900 text-zinc-600 border border-white/5 cursor-not-allowed'}`}>
          [ DEPLOY TO METAVERSE ]
        </button>
      </div>
    </div>
  );
}
