import React from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, MoreVertical, X, Send, Music2, Plus, ThumbsUp, Repeat2 } from 'lucide-react';

interface PreviewProps {
  hasMedia: boolean;
  asset?: any;
  userName?: string;
  avatarUrl?: string;
}

/* ── Simulated iOS status bar ──────────────────────────────────────────────
   tone="light"  → white glyphs (over dark media / dark chrome)
   tone="dark"   → near-black glyphs (over white chrome: Feed/LinkedIn)        */
const StatusBar: React.FC<{ tone?: 'light' | 'dark' }> = ({ tone = 'light' }) => {
  const isLight = tone === 'light';
  const glyph = isLight ? 'fill-white' : 'fill-black';
  const txt = isLight ? 'text-white' : 'text-black';
  const stroke = isLight ? 'border-white/70' : 'border-black/60';
  const fillBar = isLight ? 'bg-white' : 'bg-black';
  return (
    <div className={`relative flex items-center justify-between px-6 pt-2.5 pb-1 select-none ${txt}`}>
      <span className="text-[13px] font-semibold tracking-tight tabular-nums drop-shadow-sm">9:41</span>
      <div className="flex items-center gap-1.5">
        {/* Cellular signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" className={`${glyph} drop-shadow-sm`} aria-hidden>
          <rect x="0" y="7.5" width="3" height="3.5" rx="0.8" />
          <rect x="4.6" y="5" width="3" height="6" rx="0.8" />
          <rect x="9.2" y="2.5" width="3" height="8.5" rx="0.8" />
          <rect x="13.8" y="0" width="3" height="11" rx="0.8" />
        </svg>
        {/* Wi-Fi */}
        <svg width="16" height="11" viewBox="0 0 16 11" className={`${glyph} drop-shadow-sm`} aria-hidden>
          <path d="M8 1.6c2.85 0 5.46 1.08 7.42 2.85l-1.5 1.65C12.32 4.7 10.27 3.9 8 3.9S3.68 4.7 2.08 6.1L.58 4.45A11.08 11.08 0 0 1 8 1.6Zm0 3.7c1.68 0 3.22.6 4.42 1.6l-1.52 1.67c-.78-.64-1.79-1.02-2.9-1.02s-2.12.38-2.9 1.02L3.58 6.9A6.86 6.86 0 0 1 8 5.3Zm0 3.66 1.62 1.78c-.43.4-1 .66-1.62.66s-1.19-.26-1.62-.66L8 8.96Z" />
        </svg>
        {/* Battery */}
        <div className="flex items-center gap-0.5">
          <div className={`relative w-[24px] h-[12px] rounded-[3.5px] border ${stroke} flex items-center px-[1.5px]`}>
            <div className={`h-[7px] ${fillBar} rounded-[1.5px]`} style={{ width: '72%' }} />
          </div>
          <div className={`w-[1.5px] h-[4px] rounded-r-sm ${isLight ? 'bg-white/70' : 'bg-black/60'}`} />
        </div>
      </div>
    </div>
  );
};

/* Marquee audio pill shared by the vertical-video chrome */
const AudioPill: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-1.5 text-white/95 text-[11px] bg-black/30 rounded-full pl-2 pr-3 py-1 backdrop-blur-sm max-w-[200px] overflow-hidden">
    <Music2 size={11} className="shrink-0" />
    <div className="overflow-hidden whitespace-nowrap">
      <span className="inline-block animate-[marquee_14s_linear_infinite]">{label}&nbsp;·&nbsp;{label}&nbsp;·&nbsp;</span>
    </div>
  </div>
);

/* Reusable counter for the right action rail */
const RailItem: React.FC<{ icon: React.ReactNode; label?: string }> = ({ icon, label }) => (
  <div className="flex flex-col items-center gap-1">
    {icon}
    {label && <span className="text-white text-[11px] font-semibold drop-shadow-md tabular-nums">{label}</span>}
  </div>
);

/* Instagram gradient avatar ring */
const IgAvatar: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <div className="rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px] shrink-0" style={{ width: size, height: size }}>
    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold text-white">EA</div>
  </div>
);

export const InstagramReelPreview: React.FC<PreviewProps> = ({ hasMedia, asset }) => (
  <div className={`absolute inset-0 flex flex-col justify-between ${hasMedia ? 'pointer-events-none' : ''}`}>
    <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/85 pointer-events-none" />

    <div className="relative z-10">
      <StatusBar />
      <div className="flex justify-between items-center px-4 pt-3">
        <span className="text-white font-bold text-xl drop-shadow-md tracking-tight">Reels</span>
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    </div>

    <div className="relative flex justify-between items-end px-4 pb-7 z-10 gap-3">
      <div className="flex flex-col gap-3 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <IgAvatar />
          <span className="text-white font-semibold text-sm drop-shadow-md truncate">@etheragent</span>
          <button className="px-2.5 py-[3px] rounded-md border border-white/60 text-[11px] font-semibold text-white shrink-0">Seguir</button>
        </div>
        <p className="text-white text-[13px] drop-shadow-md leading-snug font-medium line-clamp-2">
          {asset?.hook || asset?.visual_description?.substring(0, 80) || 'Campaña AI generada'}
        </p>
        <AudioPill label={`Audio original — ${asset?.call_to_action || 'EtherAgent'}`} />
      </div>
      <div className="flex flex-col items-center gap-[18px] pb-1 shrink-0">
        <RailItem icon={<Heart size={28} className="text-white drop-shadow-md" strokeWidth={1.6} />} label="12.4 mil" />
        <RailItem icon={<MessageCircle size={27} className="text-white drop-shadow-md" strokeWidth={1.6} />} label="432" />
        <RailItem icon={<Send size={25} className="text-white drop-shadow-md -rotate-[18deg]" strokeWidth={1.6} />} label="2.1 mil" />
        <RailItem icon={<MoreHorizontal size={24} className="text-white drop-shadow-md" />} />
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-emerald-400 to-emerald-700 border-2 border-white/70 overflow-hidden flex items-center justify-center animate-[spin_4s_linear_infinite] shadow-md">
          <Music2 size={11} className="text-white" />
        </div>
      </div>
    </div>
  </div>
);

export const TikTokPreview: React.FC<PreviewProps> = ({ hasMedia, asset }) => (
  <div className={`absolute inset-0 flex flex-col justify-between ${hasMedia ? 'pointer-events-none' : ''}`}>
    <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/85 pointer-events-none" />

    <div className="relative z-10">
      <StatusBar />
      <div className="flex justify-center items-center pt-3 gap-5">
        <span className="text-white/50 font-semibold text-[15px]">Siguiendo</span>
        <div className="flex flex-col items-center">
          <span className="text-white font-bold text-[15px] drop-shadow-md">Para ti</span>
          <div className="w-7 h-[3px] bg-white rounded-full mt-1" />
        </div>
      </div>
    </div>

    <div className="relative flex justify-between items-end px-4 pb-6 z-10 gap-3">
      <div className="flex flex-col gap-2 min-w-0 flex-1 pb-1">
        <span className="text-white font-bold text-[15px] drop-shadow-md truncate">@etheragent</span>
        <p className="text-white/95 text-[13px] drop-shadow-md leading-snug line-clamp-2">
          {asset?.hook || asset?.visual_description?.substring(0, 80) || 'Campaña AI generada'} <span className="font-bold">#fyp #marketing</span>
        </p>
        <span className="text-white font-semibold text-[12px] drop-shadow-md flex items-center gap-1.5 mt-0.5 min-w-0">
          <Music2 size={12} className="shrink-0" /> <span className="truncate">original sound — EtherAgent</span>
        </span>
      </div>
      <div className="flex flex-col items-center gap-[18px] shrink-0">
        <div className="relative w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2 shadow-lg">
          <span className="text-black font-bold text-xs">EA</span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#fe2c55] rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
            <Plus size={13} className="text-white" strokeWidth={3} />
          </div>
        </div>
        <RailItem icon={<Heart size={33} fill="currentColor" className="text-white drop-shadow-md" />} label="120.4 mil" />
        <RailItem icon={<MessageCircle size={30} fill="currentColor" className="text-white drop-shadow-md" />} label="1042" />
        <RailItem icon={<Bookmark size={29} fill="currentColor" className="text-white drop-shadow-md" />} label="8900" />
        <RailItem icon={<Share2 size={29} fill="currentColor" className="text-white drop-shadow-md" />} label="Compartir" />
        <div className="w-11 h-11 rounded-full bg-zinc-900 mt-1 animate-[spin_3s_linear_infinite] flex items-center justify-center border-[7px] border-zinc-700 shadow-lg">
          <Music2 size={11} className="text-white" />
        </div>
      </div>
    </div>
  </div>
);

export const YouTubeShortPreview: React.FC<PreviewProps> = ({ hasMedia, asset }) => (
  <div className={`absolute inset-0 flex flex-col justify-between ${hasMedia ? 'pointer-events-none' : ''}`}>
    <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/85 pointer-events-none" />

    <div className="relative z-10">
      <StatusBar />
      <div className="flex justify-between items-center px-4 pt-3">
        <span className="text-white font-bold text-lg tracking-tight drop-shadow-md">Shorts</span>
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          <MoreVertical size={20} className="text-white drop-shadow-md" />
        </div>
      </div>
    </div>

    <div className="relative flex justify-between items-end px-4 pb-6 z-10 gap-3">
      <div className="flex flex-col gap-3 min-w-0 flex-1 pb-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
            <span className="text-black font-bold text-[10px]">EA</span>
          </div>
          <span className="text-white font-semibold text-sm drop-shadow-md truncate">@etheragent</span>
          <button className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold shrink-0">Suscribirse</button>
        </div>
        <p className="text-white text-sm drop-shadow-md line-clamp-2">
          {asset?.hook || asset?.visual_description?.substring(0, 80) || 'Campaña AI generada'}
        </p>
      </div>
      <div className="flex flex-col items-center gap-5 shrink-0">
        <RailItem icon={<ThumbsUp size={26} className="text-white drop-shadow-md" />} label="34 mil" />
        <RailItem icon={<ThumbsUp size={26} className="text-white rotate-180 drop-shadow-md" />} label="No me gusta" />
        <RailItem icon={<MessageCircle size={26} className="text-white drop-shadow-md" />} label="432" />
        <RailItem icon={<Share2 size={26} className="text-white drop-shadow-md" />} label="Compartir" />
        <div className="w-9 h-9 rounded-md bg-white/15 mt-1 flex items-center justify-center border border-white/40 animate-[spin_5s_linear_infinite]">
          <Music2 size={12} className="text-white" />
        </div>
      </div>
    </div>
  </div>
);

export const InstagramFeedPreview: React.FC<PreviewProps> = ({ asset }) => (
  <div className="absolute inset-0 flex flex-col bg-black">
    <StatusBar />
    <div className="flex items-center justify-between px-3 py-2.5 bg-black">
      <div className="flex items-center gap-2.5 min-w-0">
        <IgAvatar size={32} />
        <div className="flex flex-col leading-tight min-w-0">
          <span className="text-white text-[13px] font-semibold truncate">etheragent</span>
          <span className="text-zinc-500 text-[11px]">Publicidad</span>
        </div>
      </div>
      <MoreHorizontal size={18} className="text-white shrink-0" />
    </div>

    {/* Media window — base media layer shows through here */}
    <div className="flex-1 min-h-0" />

    <div className="bg-black px-3 pt-2.5 pb-4 flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Heart size={25} className="text-white" strokeWidth={1.8} />
          <MessageCircle size={25} className="text-white -scale-x-100" strokeWidth={1.8} />
          <Send size={24} className="text-white -rotate-[18deg]" strokeWidth={1.8} />
        </div>
        <Bookmark size={24} className="text-white" strokeWidth={1.8} />
      </div>
      <span className="text-white text-[13px] font-semibold">12 431 Me gusta</span>
      <div className="text-white text-[13px] leading-snug line-clamp-2">
        <span className="font-semibold mr-1.5">etheragent</span>
        {asset?.hook || asset?.visual_description?.substring(0, 100)}
      </div>
      <span className="text-zinc-500 text-xs">Ver los 142 comentarios</span>
      <span className="text-zinc-600 text-[10px] uppercase tracking-wide">hace 2 horas</span>
    </div>
  </div>
);

export const InstagramStoryPreview: React.FC<PreviewProps> = () => (
  <div className="absolute inset-0 flex flex-col">
    <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/55 pointer-events-none" />

    <div className="relative z-30">
      <div className="px-3 pt-2.5 flex gap-1">
        <div className="flex-1 h-[2.5px] bg-white rounded-full" />
        <div className="flex-1 h-[2.5px] bg-white/30 rounded-full overflow-hidden">
          <div className="h-full w-2/5 bg-white rounded-full" />
        </div>
        <div className="flex-1 h-[2.5px] bg-white/30 rounded-full" />
      </div>
      <div className="flex items-center justify-between px-3 pt-3">
        <div className="flex items-center gap-2 min-w-0">
          <IgAvatar size={32} />
          <span className="text-white text-sm font-semibold drop-shadow-md truncate">etheragent <span className="text-white/60 font-normal ml-1">2 h</span></span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <MoreHorizontal size={20} className="text-white drop-shadow-md" />
          <X size={22} className="text-white drop-shadow-md" />
        </div>
      </div>
    </div>

    <div className="absolute bottom-6 left-3 right-3 flex items-center gap-3 z-30">
      <div className="flex-1 rounded-full border border-white/60 bg-black/20 backdrop-blur px-4 py-2.5">
        <span className="text-white/80 text-sm">Enviar mensaje</span>
      </div>
      <Heart size={26} className="text-white drop-shadow-md" strokeWidth={1.8} />
      <Send size={26} className="text-white drop-shadow-md -rotate-[18deg]" strokeWidth={1.8} />
    </div>
  </div>
);

export const LinkedInPreview: React.FC<PreviewProps> = ({ asset }) => (
  <div className="absolute inset-0 flex flex-col bg-white">
    <StatusBar tone="dark" />
    <div className="flex flex-col px-4 pt-2 pb-3 bg-white">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 bg-[#0a66c2] flex items-center justify-center rounded text-white font-bold text-xl shrink-0">EA</div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-black font-semibold text-sm leading-tight truncate">EtherAgent OS</span>
          <span className="text-zinc-500 text-[11px] leading-tight truncate">Plataforma de marketing autónomo · IA</span>
          <span className="text-zinc-500 text-[11px] leading-tight flex items-center gap-1">14 203 seguidores</span>
          <span className="text-zinc-500 text-[11px] leading-tight flex items-center gap-1">2 h • <span className="w-2.5 h-2.5 rounded-full border border-zinc-400 inline-block" /></span>
        </div>
        <span className="text-[#0a66c2] text-sm font-semibold shrink-0">+ Seguir</span>
      </div>
      <p className="text-black text-sm line-clamp-3 leading-snug">
        {asset?.hook} {asset?.visual_description ? `— ${asset.visual_description.substring(0, 90)}…` : ''}
      </p>
    </div>

    {/* Media window — base media layer shows through here */}
    <div className="flex-1 min-h-0 border-y border-zinc-200" />

    <div className="px-4 pt-1 pb-3 bg-white flex flex-col">
      <div className="flex items-center justify-between py-2 border-b border-zinc-100">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-[#0a66c2] flex items-center justify-center text-white text-[8px]">👍</div>
          <span className="text-zinc-500 text-xs">1245</span>
        </div>
        <span className="text-zinc-500 text-xs">42 comentarios · 18 republicaciones</span>
      </div>
      <div className="flex items-center justify-between pt-2 px-1">
        <div className="flex items-center gap-1.5 text-zinc-600"><ThumbsUp size={18} /><span className="text-[11px] font-semibold">Recomendar</span></div>
        <div className="flex items-center gap-1.5 text-zinc-600"><MessageCircle size={18} /><span className="text-[11px] font-semibold">Comentar</span></div>
        <div className="flex items-center gap-1.5 text-zinc-600"><Repeat2 size={18} /><span className="text-[11px] font-semibold">Compartir</span></div>
        <div className="flex items-center gap-1.5 text-zinc-600"><Send size={18} /><span className="text-[11px] font-semibold">Enviar</span></div>
      </div>
    </div>
  </div>
);

export const TwitterPreview: React.FC<PreviewProps> = ({ asset }) => (
  <div className="absolute inset-0 flex flex-col bg-black">
    <StatusBar />
    <div className="px-4 pt-2 flex items-start gap-3 bg-black">
      <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-white font-bold text-xs shrink-0">EA</div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-white font-bold text-[15px] truncate">EtherAgent</span>
            <svg viewBox="0 0 22 22" className="w-[18px] h-[18px] text-[#1d9bf0] shrink-0" fill="currentColor"><path d="M20.4 11c0-1.2-.7-2.2-1.7-2.7.3-1.1 0-2.3-.9-3.1-.8-.9-2-1.2-3.1-.9C14.2 3.3 13.2 2.6 12 2.6s-2.2.7-2.7 1.7c-1.1-.3-2.3 0-3.1.9-.9.8-1.2 2-.9 3.1C4.3 8.8 3.6 9.8 3.6 11s.7 2.2 1.7 2.7c-.3 1.1 0 2.3.9 3.1.8.9 2 1.2 3.1.9.5 1 1.5 1.7 2.7 1.7s2.2-.7 2.7-1.7c1.1.3 2.3 0 3.1-.9.9-.8 1.2-2 .9-3.1 1-.5 1.7-1.5 1.7-2.7Zm-9.3 3.4-3-3 1.3-1.3 1.7 1.7 3.9-3.9L18 9.2l-6.9 5.2Z" /></svg>
            <span className="text-zinc-500 text-[15px] truncate">@etheragent · 2h</span>
          </div>
          <MoreHorizontal size={18} className="text-zinc-500 shrink-0" />
        </div>
        <p className="text-white text-[15px] mt-1 mb-3 leading-snug line-clamp-3">
          {asset?.hook} <span className="text-[#1d9bf0]">#AI #Tech</span>
        </p>
      </div>
    </div>

    {/* Media window — base media layer shows through here */}
    <div className="flex-1 min-h-0 border-y border-zinc-800" />

    <div className="flex items-center justify-between px-7 pt-3 pb-4 text-zinc-500">
      <div className="flex items-center gap-1.5"><MessageCircle size={18} /><span className="text-xs">142</span></div>
      <div className="flex items-center gap-1.5"><Repeat2 size={18} /><span className="text-xs">1.2 mil</span></div>
      <div className="flex items-center gap-1.5"><Heart size={18} /><span className="text-xs">4.3 mil</span></div>
      <div className="flex items-center gap-1.5"><Bookmark size={18} /><span className="text-xs">89</span></div>
      <Share2 size={18} />
    </div>
  </div>
);
