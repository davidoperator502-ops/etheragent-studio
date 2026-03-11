import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Sparkles, Zap, Loader2, Upload, Video, Image as ImageIcon, Film, Heart, MessageCircle, Share2, MoreHorizontal, UserCircle2, Bookmark, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SocialLab() {
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const [videoFormat, setVideoFormat] = useState<'reel' | 'feed' | 'story'>('reel');
  const [imageFormat, setImageFormat] = useState<'post' | 'story' | 'banner'>('post');

  const [assets, setAssets] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [chatStep, setChatStep] = useState(1);

  const getActiveAssetId = () => mediaType === 'video' ? `social_video_${videoFormat}` : `social_image_${imageFormat}`;
  const activeAssetId = getActiveAssetId();
  const currentAssetUrl = assets[activeAssetId];

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('visual_assets')
        .select('id, url')
        .in('id', [
          'social_video_reel', 'social_video_feed', 'social_video_story',
          'social_image_post', 'social_image_story', 'social_image_banner'
        ]);
        
      if (data) {
        const loadedAssets: Record<string, string> = {};
        data.forEach(item => loadedAssets[item.id] = item.url);
        setAssets(loadedAssets);
      }
      setLoading(false);
    };
    fetchAssets();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${activeAssetId}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('visual-assets').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('visual-assets').getPublicUrl(fileName);
      await supabase.from('visual_assets').upsert({ id: activeAssetId, url: publicUrl, updated_at: new Date() });

      setAssets(prev => ({ ...prev, [activeAssetId]: publicUrl }));
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

  const TikTokReelOverlay = () => (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 bg-gradient-to-b from-black/40 via-transparent to-black/60 pt-10">
      <div className="flex justify-between items-start mt-2">
        <span className="text-white font-bold text-lg drop-shadow-md">Para ti</span>
        <div className="w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur rounded-full"><Sparkles size={16} className="text-white" /></div>
      </div>
      <div className="flex justify-between items-end mb-4">
        <div className="flex flex-col gap-2 max-w-[70%]">
          <div className="flex items-center gap-2">
            <UserCircle2 size={24} className="text-white" />
            <span className="text-white font-bold drop-shadow-md">@EtherAgent</span>
          </div>
          <p className="text-white text-sm drop-shadow-md line-clamp-2">Dominando el algoritmo. 🚀 #AI #Marketing</p>
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur w-fit px-2 py-1 rounded-full mt-1">
             <span className="text-white text-xs">🎵 Sonido Original - EtherAgent</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-5 pb-2">
          <div className="flex flex-col items-center gap-1"><div className="w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center"><Heart size={20} className="text-white" fill="white" /></div><span className="text-white text-xs drop-shadow-md">1.2M</span></div>
          <div className="flex flex-col items-center gap-1"><div className="w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center"><MessageCircle size={20} className="text-white" fill="white" /></div><span className="text-white text-xs drop-shadow-md">45K</span></div>
          <div className="flex flex-col items-center gap-1"><div className="w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center"><Bookmark size={20} className="text-white" fill="white" /></div><span className="text-white text-xs drop-shadow-md">8K</span></div>
          <div className="flex flex-col items-center gap-1"><div className="w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center"><Share2 size={20} className="text-white" fill="white" /></div><span className="text-white text-xs drop-shadow-md">11K</span></div>
        </div>
      </div>
    </div>
  );

  const InstagramStoryOverlay = () => (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between bg-gradient-to-b from-black/50 via-transparent to-black/50 pt-8 px-4 pb-6">
      <div className="flex gap-1 mt-2 mb-4">
        <div className="h-0.5 bg-white/40 flex-1 rounded-full overflow-hidden"><div className="h-full bg-white w-2/3" /></div>
        <div className="h-0.5 bg-white/40 flex-1 rounded-full" />
        <div className="h-0.5 bg-white/40 flex-1 rounded-full" />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <UserCircle2 size={32} className="text-white" />
          <span className="text-white font-bold text-sm drop-shadow-md">etheragent.ai <span className="text-white/70 font-normal ml-1">2h</span></span>
        </div>
        <MoreHorizontal size={20} className="text-white" />
      </div>
      <div className="mt-auto flex items-center gap-3">
        <div className="flex-1 h-10 border border-white/50 rounded-full flex items-center px-4 backdrop-blur-sm">
          <span className="text-white/80 text-sm">Enviar mensaje...</span>
        </div>
        <Heart size={24} className="text-white" />
        <Send size={24} className="text-white" />
      </div>
    </div>
  );

  const InstagramPostOverlay = () => (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between pt-10">
      <div className="h-14 flex items-center justify-between px-3 w-full z-30 relative shrink-0">
         <div className="flex items-center gap-2">
           <UserCircle2 size={30} className="text-white" />
           <span className="text-white font-bold text-sm">etheragent.ai</span>
         </div>
         <MoreHorizontal size={20} className="text-white" />
      </div>
      
      <div className="flex-1 w-full"></div>

      <div className="px-3 py-4 flex flex-col gap-2 w-full z-30 relative shrink-0 pb-8 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex justify-between items-center mb-1">
          <div className="flex gap-4">
             <Heart size={24} className="text-white" />
             <MessageCircle size={24} className="text-white" />
             <Send size={24} className="text-white" />
          </div>
          <Bookmark size={24} className="text-white" />
        </div>
        <span className="text-white font-bold text-sm">8,492 Me gusta</span>
        <p className="text-white text-sm line-clamp-2"><span className="font-bold mr-2">etheragent.ai</span>Transformando el ecosistema B2B a velocidad luz.</p>
        <span className="text-white/60 text-[10px] mt-1">HACE 2 HORAS</span>
      </div>
    </div>
  );

  const LinkedInBannerOverlay = () => (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col pt-10">
       <div className="h-12 flex items-center px-4 shrink-0 bg-white/90 backdrop-blur">
         <div className="w-6 h-6 bg-[#0a66c2] rounded text-white flex items-center justify-center font-bold text-xs">in</div>
         <div className="ml-4 w-40 h-6 bg-zinc-200 rounded flex items-center px-2"><span className="text-zinc-400 text-xs">Buscar...</span></div>
       </div>
       
       <div className="flex-1 p-3 flex flex-col pt-4 overflow-hidden">
          <div className="w-full rounded-lg overflow-hidden flex flex-col border border-zinc-200 bg-white">
            <div className="p-3 flex items-start gap-2">
               <UserCircle2 size={36} className="text-zinc-400 shrink-0" />
               <div className="flex flex-col">
                 <span className="font-bold text-sm text-black leading-tight">EtherAgent Inc.</span>
                 <span className="text-[10px] text-zinc-500 leading-tight">1.2M seguidores</span>
                 <span className="text-[10px] text-zinc-400 flex items-center gap-1">Promocionado</span>
               </div>
            </div>
            
            <div className="w-full aspect-[16/9]"></div> 
            
            <div className="p-3 flex justify-between items-center border-t border-zinc-200">
              <div className="flex flex-col">
                 <span className="text-xs font-bold text-[#0a66c2] line-clamp-1">Descubre el futuro B2B</span>
                 <span className="text-[10px] text-zinc-500">etheragent.com</span>
              </div>
            </div>
            <div className="px-4 py-2 flex justify-between border-t border-zinc-200">
               <span className="text-xs text-zinc-600 font-bold flex items-center gap-1"><Heart size={14} className="text-zinc-500" /> Recomendar</span>
               <span className="text-xs text-zinc-600 font-bold flex items-center gap-1"><MessageCircle size={14} className="text-zinc-500" /> Comentar</span>
            </div>
          </div>
       </div>
    </div>
  );

  const renderUIOverlay = () => {
    if (!currentAssetUrl) return null;
    
    if (mediaType === 'video') {
      if (videoFormat === 'reel') return <TikTokReelOverlay />;
      if (videoFormat === 'story') return <InstagramStoryOverlay />;
      if (videoFormat === 'feed') return <InstagramPostOverlay />;
    }
    
    if (mediaType === 'image') {
      if (imageFormat === 'story') return <InstagramStoryOverlay />;
      if (imageFormat === 'post') return <InstagramPostOverlay />;
      if (imageFormat === 'banner') return <LinkedInBannerOverlay />;
    }
    
    return null;
  };

  return (
    <div className="flex flex-col xl:flex-row min-h-screen w-full bg-[#050505] text-white p-4 md:p-8 gap-8 pb-32 overflow-y-auto">
      
      <div className="flex-1 flex flex-col max-w-3xl">
        <header className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full border-2 border-emerald-500/50 flex items-center justify-center bg-zinc-900">
               <span className="font-black text-2xl text-white">V</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Valeria M.</h2>
              <p className="text-emerald-500 font-mono text-xs tracking-widest uppercase">Lead Growth Hacker • Active Session</p>
            </div>
          </div>
        </header>

        <div className="flex-1 bg-[#0a0a0c] border border-white/5 rounded-3xl p-8 flex flex-col relative shadow-2xl">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles size={16} className="text-emerald-500" />
            <span className="text-emerald-500 text-[10px] font-mono tracking-widest uppercase">Nodo: Viral Dynamics</span>
          </div>

          <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl rounded-tl-sm w-[90%] mb-6">
            <p className="text-base text-zinc-300 leading-relaxed">
              He procesado los vectores sociales. El asset está formateado con la UI nativa de la red seleccionada para maximizar la fricción viral.
            </p>
          </div>

          <div className="bg-emerald-900/20 border border-emerald-500/20 p-6 rounded-2xl rounded-tr-sm w-[85%] self-end mb-6">
            <p className="text-base text-emerald-100 leading-relaxed">
              Procede, Valeria. Verifica la telemetría visual.
            </p>
          </div>

          {chatStep === 2 && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 border border-emerald-500/30 p-6 rounded-2xl rounded-tl-sm w-[90%] mb-6">
               <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
               <p className="text-base text-white leading-relaxed font-medium">
                 Kinesia y parámetros visuales nativos compilados. Verifica la previsualización en el dispositivo a tu derecha.
               </p>
             </motion.div>
          )}

          <div className="mt-auto grid grid-cols-2 gap-4">
            <button onClick={handleCompile} disabled={isCompiling || chatStep === 2} className="bg-[#111] hover:bg-zinc-800 border border-white/5 p-4 rounded-xl flex items-center justify-center gap-3 text-sm font-bold text-zinc-300 transition-colors">
              {isCompiling ? <Loader2 size={18} className="text-emerald-500 animate-spin" /> : <Zap size={18} className="text-emerald-500" />} Compilar Assets
            </button>
          </div>
        </div>
      </div>

      <div className="w-full xl:w-[420px] shrink-0 flex flex-col items-center pt-2">
        
        <div className="w-[340px] flex p-1 bg-[#111] rounded-xl border border-white/10 mb-4">
          <button onClick={() => setMediaType('video')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${mediaType === 'video' ? 'bg-emerald-500/20 text-emerald-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <Video size={14} /> VIDEO VECTORS
          </button>
          <button onClick={() => setMediaType('image')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${mediaType === 'image' ? 'bg-emerald-500/20 text-emerald-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <ImageIcon size={14} /> STATIC VECTORS
          </button>
        </div>

        <div className="w-[340px] flex justify-between items-center mb-6">
          <div className="flex gap-2">
            {mediaType === 'video' ? (
              <>
                <button onClick={() => setVideoFormat('reel')} className={`px-3 py-1.5 rounded-md text-[10px] font-mono uppercase transition-colors ${videoFormat === 'reel' ? 'bg-emerald-500 text-black font-bold' : 'bg-[#111] text-zinc-500 border border-white/5 hover:bg-zinc-800'}`}>Reel</button>
                <button onClick={() => setVideoFormat('feed')} className={`px-3 py-1.5 rounded-md text-[10px] font-mono uppercase transition-colors ${videoFormat === 'feed' ? 'bg-emerald-500 text-black font-bold' : 'bg-[#111] text-zinc-500 border border-white/5 hover:bg-zinc-800'}`}>Feed</button>
                <button onClick={() => setVideoFormat('story')} className={`px-3 py-1.5 rounded-md text-[10px] font-mono uppercase transition-colors ${videoFormat === 'story' ? 'bg-emerald-500 text-black font-bold' : 'bg-[#111] text-zinc-500 border border-white/5 hover:bg-zinc-800'}`}>Story</button>
              </>
            ) : (
              <>
                <button onClick={() => setImageFormat('post')} className={`px-3 py-1.5 rounded-md text-[10px] font-mono uppercase transition-colors ${imageFormat === 'post' ? 'bg-emerald-500 text-black font-bold' : 'bg-[#111] text-zinc-500 border border-white/5 hover:bg-zinc-800'}`}>Post</button>
                <button onClick={() => setImageFormat('story')} className={`px-3 py-1.5 rounded-md text-[10px] font-mono uppercase transition-colors ${imageFormat === 'story' ? 'bg-emerald-500 text-black font-bold' : 'bg-[#111] text-zinc-500 border border-white/5 hover:bg-zinc-800'}`}>Story</button>
                <button onClick={() => setImageFormat('banner')} className={`px-3 py-1.5 rounded-md text-[10px] font-mono uppercase transition-colors ${imageFormat === 'banner' ? 'bg-emerald-500 text-black font-bold' : 'bg-[#111] text-zinc-500 border border-white/5 hover:bg-zinc-800'}`}>Banner</button>
              </>
            )}
          </div>
          
          <div className="relative">
            <input type="file" accept={mediaType === 'video' ? "video/*" : "image/*"} onChange={handleFileUpload} disabled={uploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <button className="flex items-center justify-center bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 w-8 h-8 rounded-lg hover:bg-emerald-500/20 transition-colors">
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            </button>
          </div>
        </div>

        <div className="relative w-[340px] h-[720px] bg-black border-[8px] border-[#1c1c1e] rounded-[3.5rem] shadow-[0_0_50px_rgba(16,185,129,0.15)] overflow-hidden flex flex-col shrink-0">
          
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-50"></div>

          <div className="flex-1 relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
            {loading ? (
              <Loader2 className="animate-spin text-emerald-500" size={40} />
            ) : currentAssetUrl ? (
              <>
                {mediaType === 'video' ? (
                  <video src={currentAssetUrl} autoPlay loop muted playsInline className={`absolute inset-0 w-full h-full z-10 ${videoFormat === 'reel' || videoFormat === 'story' ? 'object-cover' : 'object-contain bg-black'}`} />
                ) : (
                  <img src={currentAssetUrl} alt="Social Asset" className={`absolute inset-0 w-full h-full z-10 object-contain bg-black`} />
                )}
                
                {renderUIOverlay()}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-600 font-mono text-[10px] uppercase text-center p-8 z-10 border border-dashed border-zinc-800 m-4 rounded-xl gap-2 w-3/4">
                <Film size={24} className="text-zinc-700 mb-2" />
                <span>Sin {mediaType} para formato {mediaType === 'video' ? videoFormat : imageFormat}</span>
                <span className="text-emerald-500/50">Haz clic en la nube para subir</span>
              </div>
            )}
          </div>
        </div>

        <button className={`mt-8 w-[340px] py-4 rounded-xl font-black font-mono text-sm tracking-widest transition-all duration-300 ${chatStep === 2 ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'bg-zinc-900 text-zinc-600 border border-white/5 cursor-not-allowed'}`}>
          [ DEPLOY TO NETWORKS ]
        </button>
      </div>
    </div>
  );
}
