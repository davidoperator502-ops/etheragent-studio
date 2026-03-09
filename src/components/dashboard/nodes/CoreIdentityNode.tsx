import { Handle, Position, NodeProps } from '@xyflow/react';
import { Bot, ShieldCheck, Zap, ChevronDown, User } from 'lucide-react';
import { useState } from 'react';

interface CoreIdentityNodeData {
  avatarId?: string;
  avatarName?: string;
  avatarImage?: string;
  trust?: number;
  role?: string;
  niche?: string;
}

const avatarImages: Record<string, string> = {
  'eth_zero': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  'a1': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
  'a2': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
  'a3': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
  'a4': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  'eth_sdr_01': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
};

const AVATAR_EXAMPLES = [
  { id: 'eth_zero', name: 'David G.', role: 'EtherAgent Founder', niche: 'Dogfooding Campaign', trust: 99, desc: 'Demo instance - eats own dog food' },
  { id: 'a1', name: 'Marcus V.', role: 'Enterprise FinTech Exec', niche: 'High-Ticket B2B', trust: 98, desc: 'B2B Sales closer' },
  { id: 'a2', name: 'Elena R.', role: 'AI Tech Founder', niche: 'SaaS & Digital Products', trust: 96, desc: 'Silicon Valley energy' },
  { id: 'a3', name: 'Dr. Aris', role: 'Medical Specialist', niche: 'Health & Wellness', trust: 99, desc: 'Scientific authority' },
  { id: 'a4', name: 'Viktor S.', role: 'E-commerce Growth', niche: 'D2C & Retention', trust: 97, desc: 'LTV maximization' },
  { id: 'eth_sdr_01', name: 'Valeria M.', role: 'Growth Strategist', niche: 'LATAM SDR', trust: 98.5, desc: 'Bilingual closer' },
];

export function CoreIdentityNode({ data }: NodeProps) {
  const nodeData = data as CoreIdentityNodeData;
  const [showExamples, setShowExamples] = useState(false);
  
  const trustPercent = nodeData.trust || 99;
  const avatarImage = nodeData.avatarImage || avatarImages['eth_zero'];
  const avatarName = nodeData.avatarName || 'David G.';
  
  const trustColor = trustPercent >= 95 ? 'text-emerald-400' : trustPercent >= 85 ? 'text-amber-400' : 'text-red-400';
  const trustBg = trustPercent >= 95 ? 'bg-emerald-500/20 text-emerald-300' : trustPercent >= 85 ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300';

  return (
    <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-4 min-w-[300px] text-white shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <Handle type="target" position={Position.Left} className="!bg-emerald-500 !w-3 !h-3" />
      
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/30 to-teal-600/30 border border-emerald-500/30">
          <Bot size={18} className="text-emerald-400" />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-widest text-emerald-400/70 font-bold">NODE 02</span>
          <h4 className="text-sm font-bold">Core Identity</h4>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 bg-black/40 border border-white/10 rounded-lg mb-3">
        <img 
          src={avatarImage} 
          alt={avatarName}
          className="w-14 h-14 rounded-lg object-cover border-2 border-emerald-500/30"
        />
        <div className="flex-1">
          <p className="text-sm font-bold text-white">{avatarName}</p>
          <p className="text-[10px] text-white/50">{nodeData.role || 'Neural Instance'}</p>
          <p className="text-[9px] text-emerald-400 mt-1">{nodeData.niche || 'Dogfooding Campaign'}</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-lg mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className={trustColor} />
          <span className="text-[9px] uppercase tracking-widest text-white/40">TRUST</span>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-bold font-mono ${trustBg}`}>
          {trustPercent}%
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-lg mb-3">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-amber-400" />
          <span className="text-[9px] uppercase tracking-widest text-white/40">STATUS</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400">ACTIVE</span>
        </div>
      </div>

      <button 
        onClick={() => setShowExamples(!showExamples)}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-emerald-500/50 transition-colors text-xs"
      >
        <User size={12} />
        {showExamples ? 'Hide Examples' : 'Load Avatar Examples'}
      </button>

      {showExamples && (
        <div className="space-y-2 max-h-40 overflow-y-auto mt-2">
          {AVATAR_EXAMPLES.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => {
                if ((window as any).setNodeData) {
                  (window as any).setNodeData('core-identity', { 
                    avatarId: avatar.id, 
                    avatarName: avatar.name,
                    avatarImage: avatarImages[avatar.id],
                    trust: avatar.trust,
                    role: avatar.role,
                    niche: avatar.niche,
                  });
                }
              }}
              className="w-full flex items-center gap-3 p-2 bg-black/40 border border-white/5 rounded hover:border-emerald-500/30 transition-colors"
            >
              <img 
                src={avatarImages[avatar.id]} 
                alt={avatar.name}
                className="w-8 h-8 rounded object-cover"
              />
              <div className="text-left flex-1">
                <p className="text-[10px] text-white font-medium">{avatar.name}</p>
                <p className="text-[8px] text-emerald-400">{avatar.trust}% Trust</p>
              </div>
            </button>
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Right} className="!bg-emerald-500 !w-3 !h-3" />
    </div>
  );
}

export default CoreIdentityNode;
