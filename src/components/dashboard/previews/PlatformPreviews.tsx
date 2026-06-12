import React from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, X, Send, Music2, Wifi, BatteryFull, SignalHigh } from 'lucide-react';

interface PreviewProps {
  hasMedia: boolean;
  asset?: any;
  userName?: string;
  avatarUrl?: string;
}

/* ── Simulated iOS status bar ──────────────────────────────────────────────
   tone="light"  → white glyphs (sits over dark media / dark chrome)
   tone="dark"   → near-black glyphs (sits over white chrome: Feed/LinkedIn)   */
const StatusBar: React.FC<{ tone?: 'light' | 'dark' }> = ({ tone = 'light' }) => {
  const color = tone === 'light' ? 'text-white' : 'text-black';
  return (
    <div className={`relative flex items-center justify-between px-6 pt-2.5 pb-1 ${color}`}>
      <span className="text-[13px] font-semibold tracking-tight drop-shadow-sm tabular-nums">9:41</span>
      <div className="flex items-center gap-1.5">
        <SignalHigh size={15} strokeWidth={2.5} className="drop-shadow-sm" />
        <Wifi size={14} strokeWidth={2.5} className="drop-shadow-sm" />
        <BatteryFull size={20} strokeWidth={2} className="drop-shadow-sm" />
      </div>
    </div>
  );
};

/* Marquee audio pill shared by the vertical-video chrome */
const AudioPill: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-1.5 text-white/90 text-[11px] bg-black/30 rounded-full px-2.5 py-1 backdrop-blur-sm max-w-full overflow-hidden">
    <Music2 size={11} className="shrink-0" />
    <div className="overflow-hidden whitespace-nowrap">
      <span className="inline-block animate-[marquee_12s_linear_infinite]">{label} · {label} · </span>
    </div>
  </div>
);

/* Reusable counter for the right action rail */
const RailItem: React.FC<{ icon: React.ReactNode; label?: string }> = ({ icon, label }) => (
  <div className="flex flex-col items-center gap-1">
    {icon}
    {label && <span className="text-white text-[11px] font-semibold drop-shadow-md">{label}</span>}
  </div>
);

export const InstagramReelPreview: React.FC<PreviewProps> = ({ hasMedia, asset }) => (
  <div className={`absolute inset-0 flex flex-col justify-between ${hasMedia ? 'pointer-events-none' : ''}`}>
    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 pointer-events-none" />

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
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px] shrink-0">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold text-white">EA</div>
          </div>
          <span className="text-white font-semibold text-sm drop-shadow-md truncate">@etheragent</span>
          <button className="px-2.5 py-1 rounded-md border border-white/50 text-[11px] font-semibold text-white shrink-0">Follow</button>
        </div>
        <p className="text-white text-[13px] drop-shadow-md leading-snug font-medium line-clamp-2">
          {asset?.hook || asset?.visual_description?.substring(0, 80) || 'Campaña AI generada'}
        </p>
        <AudioPill label={`Original Audio — ${asset?.call_to_action || 'EtherAgent'}`} />
      </div>
      <div className="flex flex-col items-center gap-5 pb-1 shrink-0">
        <RailItem icon={<Heart size={27} className="text-white drop-shadow-md" />} label="12K" />
        <RailItem icon={<MessageCircle size={26} className="text-white drop-shadow-md" />} label="432" />
        <RailItem icon={<Send size={24} className="text-white drop-shadow-md -rotate-12" />} label="2.1K" />
        <RailItem icon={<MoreHorizontal size={24} className="text-white drop-shadow-md" />} />
        <div className="w-7 h-7 rounded-md bg-white/20 border-2 border-white/60 overflow-hidden flex items-center justify-center animate-[spin_4s_linear_infinite]">
          <Music2 size={11} className="text-white" />
        </div>
      </div>
    </div>
  </div>
);

export const TikTokPreview: React.FC<PreviewProps> = ({ hasMedia, asset }) => (
  <div className={`absolute inset-0 flex flex-col justify-between ${hasMedia ? 'pointer-events-none' : ''}`}>
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85 pointer-events-none" />

    <div className="relative z-10">
      <StatusBar />
      <div className="flex justify-center items-center pt-3 gap-5">
        <span className="text-white/50 font-semibold text-[15px]">Following</span>
        <div className="flex flex-col items-center">
          <span className="text-white font-bold text-[15px] drop-shadow-md">For You</span>
          <div className="w-6 h-[3px] bg-white rounded-full mt-1" />
        </div>
      </div>
    </div>

    <div className="relative flex justify-between items-end px-4 pb-6 z-10 gap-3">
      <div className="flex flex-col gap-2 min-w-0 flex-1 pb-1">
        <span className="text-white font-bold text-[15px] drop-shadow-md truncate">@etheragent</span>
        <p className="text-white/95 text-[13px] drop-shadow-md leading-snug line-clamp-2">
          {asset?.hook || asset?.visual_description?.substring(0, 80) || 'Campaña AI generada'} <span className="font-bold">#fyp #marketing</span>
        </p>
        <span className="text-white font-semibold text-[12px] drop-shadow-md flex items-center gap-1.5 mt-0.5">
          <Music2 size={12} /> original sound — EtherAgent
        </span>
      </div>
      <div className="flex flex-col items-center gap-4 shrink-0">
        <div className="relative w-11 h-11 rounded-full bg-white flex items-center justify-center mb-2">
          <span className="text-black font-bold text-xs">EA</span>
          <div className="absolute -bottom-1.5 bg-[#fe2c55] rounded-full w-5 h-5 flex items-center justify-center text-white text-sm font-bold leading-none shadow-sm">+</div>
        </div>
        <RailItem icon={<Heart size={32} fill="currentColor" className="text-white drop-shadow-md" />} label="120K" />
        <RailItem icon={<MessageCircle size={29} fill="currentColor" className="text-white drop-shadow-md" />} label="1042" />
        <RailItem icon={<Bookmark size={28} fill="currentColor" className="text-white drop-shadow-md" />} label="8900" />
        <RailItem icon={<Share2 size={28} fill="currentColor" className="text-white drop-shadow-md" />} label="Share" />
        <div className="w-10 h-10 rounded-full bg-zinc-900 mt-1 animate-[spin_3s_linear_infinite] flex items-center justify-center border-[6px] border-zinc-700">
          <Music2 size={11} className="text-white" />
        </div>
      </div>
    </div>
  </div>
);

export const YouTubeShortPreview: React.FC<PreviewProps> = ({ hasMedia, asset }) => (
  <div className={`absolute inset-0 flex flex-col justify-between ${hasMedia ? 'pointer-events-none' : ''}`}>
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85 pointer-events-none" />

    <div className="relative z-10">
      <StatusBar />
      <div className="flex justify-between items-center px-4 pt-3">
        <span className="text-white font-bold text-lg tracking-tight drop-shadow-md">Shorts</span>
        <MoreHorizontal className="text-white drop-shadow-md" />
      </div>
    </div>

    <div className="relative flex justify-between items-end px-4 pb-6 z-10 gap-3">
      <div className="flex flex-col gap-3 min-w-0 flex-1 pb-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
            <span className="text-black font-bold text-[10px]">EA</span>
          </div>
          <span className="text-white font-semibold text-sm drop-shadow-md truncate">@etheragent</span>
          <button className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold shrink-0">Subscribe</button>
        </div>
        <p className="text-white text-sm drop-shadow-md line-clamp-2">
          {asset?.hook || asset?.visual_description?.substring(0, 80) || 'Campaña AI generada'}
        </p>
      </div>
      <div className="flex flex-col items-center gap-5 shrink-0">
        <RailItem icon={<Heart size={27} className="text-white drop-shadow-md" />} label="Like" />
        <RailItem icon={<Heart size={27} className="text-white rotate-180 drop-shadow-md" />} label="Dislike" />
        <RailItem icon={<MessageCircle size={26} className="text-white drop-shadow-md" />} label="432" />
        <RailItem icon={<Share2 size={26} className="text-white drop-shadow-md" />} label="Share" />
        <div className="w-9 h-9 rounded-md bg-white/20 mt-1 flex items-center justify-center border border-white/40">
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
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px]">
          <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-[9px] font-bold text-white">EA</div>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-white text-[13px] font-semibold">etheragent</span>
          <span className="text-zinc-500 text-[11px]">Sponsored</span>
        </div>
      </div>
      <MoreHorizontal size={18} className="text-white" />
    </div>

    {/* Media window — the base media layer shows through here */}
    <div className="flex-1 min-h-0" />

    <div className="bg-black px-3 pt-3 pb-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Heart size={24} className="text-white" />
          <MessageCircle size={24} className="text-white" />
          <Send size={24} className="text-white" />
        </div>
        <Bookmark size={24} className="text-white" />
      </div>
      <span className="text-white text-xs font-semibold">12,431 likes</span>
      <div className="text-white text-[13px] leading-snug line-clamp-2">
        <span className="font-semibold mr-1.5">etheragent</span>
        {asset?.hook || asset?.visual_description?.substring(0, 100)}
      </div>
      <span className="text-zinc-500 text-xs">View all 142 comments</span>
      <span className="text-zinc-600 text-[10px] uppercase tracking-wide">2 hours ago</span>
    </div>
  </div>
);

export const InstagramStoryPreview: React.FC<PreviewProps> = () => (
  <div className="absolute inset-0 flex flex-col">
    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" />

    <div className="relative z-30">
      <div className="px-3 pt-2.5 flex gap-1">
        <div className="flex-1 h-[2.5px] bg-white rounded-full" />
        <div className="flex-1 h-[2.5px] bg-white/30 rounded-full" />
        <div className="flex-1 h-[2.5px] bg-white/30 rounded-full" />
      </div>
      <div className="flex items-center justify-between px-3 pt-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px] shrink-0">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold text-white">EA</div>
          </div>
          <span className="text-white text-sm font-semibold drop-shadow-md truncate">etheragent <span className="text-white/60 font-normal ml-1">2h</span></span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <MoreHorizontal size={20} className="text-white" />
          <X size={22} className="text-white" />
        </div>
      </div>
    </div>

    <div className="absolute bottom-6 left-3 right-3 flex items-center gap-3 z-30">
      <div className="flex-1 rounded-full border border-white/50 bg-black/20 backdrop-blur px-4 py-2.5">
        <span className="text-white/80 text-sm">Send message</span>
      </div>
      <Heart size={26} className="text-white drop-shadow-md" />
      <Send size={26} className="text-white drop-shadow-md" />
    </div>
  </div>
);

export const LinkedInPreview: React.FC<PreviewProps> = ({ asset }) => (
  <div className="absolute inset-0 flex flex-col bg-white">
    <StatusBar tone="dark" />
    <div className="flex flex-col px-4 pt-2 pb-3 bg-white">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-zinc-200 flex items-center justify-center rounded text-zinc-500 font-bold text-xl shrink-0">EA</div>
        <div className="flex flex-col min-w-0">
          <span className="text-black font-bold text-sm leading-none mb-1 truncate">EtherAgent OS</span>
          <span className="text-zinc-500 text-[11px] leading-none mb-0.5">14,203 followers</span>
          <span className="text-zinc-500 text-[11px] leading-none flex items-center gap-1">2h • <span className="w-2 h-2 rounded-full border border-zinc-500" /></span>
        </div>
      </div>
      <p className="text-black text-sm line-clamp-3">
        {asset?.hook} {asset?.visual_description ? `— ${asset.visual_description.substring(0, 90)}…` : ''}
      </p>
    </div>

    {/* Media window — the base media layer shows through here */}
    <div className="flex-1 min-h-0" />

    <div className="px-4 pt-1 pb-3 bg-white flex flex-col">
      <div className="flex items-center gap-1.5 py-2 border-b border-zinc-100">
        <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-[8px]">👍</div>
        <span className="text-zinc-500 text-xs">1,245 • 42 comments</span>
      </div>
      <div className="flex items-center justify-between pt-2 px-1">
        <div className="flex flex-col items-center gap-1 text-zinc-600"><Heart size={20} /><span className="text-[10px] font-semibold">Like</span></div>
        <div className="flex flex-col items-center gap-1 text-zinc-600"><MessageCircle size={20} /><span className="text-[10px] font-semibold">Comment</span></div>
        <div className="flex flex-col items-center gap-1 text-zinc-600"><Share2 size={20} /><span className="text-[10px] font-semibold">Repost</span></div>
        <div className="flex flex-col items-center gap-1 text-zinc-600"><Send size={20} /><span className="text-[10px] font-semibold">Send</span></div>
      </div>
    </div>
  </div>
);

export const TwitterPreview: React.FC<PreviewProps> = ({ asset }) => (
  <div className="absolute inset-0 flex flex-col bg-black">
    <StatusBar />
    <div className="px-4 pt-2 flex items-start gap-3 bg-black">
      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold text-xs shrink-0">EA</div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-white font-bold text-[15px] truncate">EtherAgent</span>
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-400 shrink-0" fill="currentColor"><path d="M22.5 12.5l-1.5-1.5.5-2-2-.5-.5-2-2 .5-1.5-1.5-1.5 1.5-2-.5-.5 2-2 .5.5 2-1.5 1.5 1.5 1.5-.5 2 2 .5.5 2 2-.5 1.5 1.5 1.5-1.5 2 .5.5-2 2-.5-.5-2 1.5-1.5z" /></svg>
            <span className="text-zinc-500 text-[15px] truncate">@etheragent · 2h</span>
          </div>
          <MoreHorizontal size={18} className="text-zinc-500 shrink-0" />
        </div>
        <p className="text-white text-[15px] mt-1 mb-3 leading-snug line-clamp-3">
          {asset?.hook} <span className="text-blue-400">#AI #Tech</span>
        </p>
      </div>
    </div>

    {/* Media window — the base media layer shows through here */}
    <div className="flex-1 min-h-0 mx-4 rounded-2xl border border-zinc-800 overflow-hidden" />

    <div className="flex items-center justify-around px-4 pt-3 pb-4 text-zinc-500">
      <div className="flex items-center gap-1.5"><MessageCircle size={18} /><span className="text-xs">142</span></div>
      <div className="flex items-center gap-1.5"><Share2 size={18} /><span className="text-xs">1.2K</span></div>
      <div className="flex items-center gap-1.5"><Heart size={18} /><span className="text-xs">4.3K</span></div>
      <div className="flex items-center gap-1.5"><Bookmark size={18} /><span className="text-xs">89</span></div>
    </div>
  </div>
);
