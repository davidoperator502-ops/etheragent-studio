import { Handle, Position, NodeProps } from '@xyflow/react';
import { Database, Link2, Globe2, Sparkles, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface DataIngestionNodeData {
  url?: string;
  archetype?: string;
  isProcessing?: boolean;
  extractedData?: {
    title?: string;
    niche?: string;
    tone?: string;
  };
}

const EXAMPLE_URLS = [
  { url: 'https://stripe.com', archetype: 'FINTECH_SaaS', title: 'Stripe - Payment Infrastructure', niche: 'FinTech', tone: 'Professional' },
  { url: 'https://openai.com', archetype: 'AI_PLATFORM', title: 'OpenAI - AI Research', niche: 'Artificial Intelligence', tone: 'Innovative' },
  { url: 'https://airbnb.com', archetype: 'MARKETPLACE', title: 'Airbnb - Travel Marketplace', niche: 'Travel Tech', tone: 'Friendly' },
  { url: 'https://techcrunch.com', archetype: 'TECH_MEDIA', title: 'TechCrunch - Tech News', niche: 'Technology', tone: 'Breaking' },
  { url: 'https://andrewchen.co', archetype: 'THOUGHT_LEADER', title: 'Andrew Chen - Growth Expert', niche: 'Growth Marketing', tone: 'Analytical' },
];

export function DataIngestionNode({ data }: NodeProps) {
  const nodeData = data as DataIngestionNodeData;
  const [showExamples, setShowExamples] = useState(false);

  return (
    <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-4 min-w-[300px] text-white shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <Handle type="target" position={Position.Left} className="!bg-violet-500 !w-3 !h-3" />
      
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/30 to-purple-600/30 border border-violet-500/30">
          <Database size={18} className="text-violet-400" />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-widest text-violet-400/70 font-bold">NODE 01</span>
          <h4 className="text-sm font-bold">Data Ingestion</h4>
        </div>
        <div className="ml-auto">
          {nodeData.isProcessing ? (
            <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
          ) : (
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-black/40 border border-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Link2 size={12} className="text-violet-400" />
            <span className="text-[9px] uppercase tracking-widest text-white/40">SOURCE URL</span>
          </div>
          <input
            type="text"
            value={nodeData.url || ''}
            placeholder="https://example.com"
            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50"
            readOnly
          />
        </div>

        <div className="bg-black/40 border border-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Globe2 size={12} className="text-cyan-400" />
            <span className="text-[9px] uppercase tracking-widest text-white/40">ARCHETYPE</span>
          </div>
          <select className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none" defaultValue={nodeData.archetype || 'B2B_LEAD_GEN'}>
            <option value="B2B_LEAD_GEN">B2B Lead Generation</option>
            <option value="FINTECH_SaaS">FinTech SaaS</option>
            <option value="AI_PLATFORM">AI Platform</option>
            <option value="MARKETPLACE">Marketplace</option>
            <option value="TECH_MEDIA">Tech Media</option>
            <option value="THOUGHT_LEADER">Thought Leader</option>
          </select>
        </div>

        {nodeData.extractedData && (
          <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={12} className="text-violet-400" />
              <span className="text-[9px] uppercase tracking-widest text-violet-400">EXTRACTED</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-white/80"><span className="text-white/40">Title:</span> {nodeData.extractedData.title}</p>
              <p className="text-xs text-white/80"><span className="text-white/40">Niche:</span> {nodeData.extractedData.niche}</p>
              <p className="text-xs text-white/80"><span className="text-white/40">Tone:</span> {nodeData.extractedData.tone}</p>
            </div>
          </div>
        )}

        <button 
          onClick={() => setShowExamples(!showExamples)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-violet-500/50 transition-colors text-xs"
        >
          <Sparkles size={12} />
          {showExamples ? 'Hide Examples' : 'Load Examples (Dogfooding)'}
        </button>

        {showExamples && (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {EXAMPLE_URLS.map((example, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if ((window as any).setNodeData) {
                    (window as any).setNodeData('data-ingestion', { 
                      url: example.url, 
                      archetype: example.archetype,
                      extractedData: { title: example.title, niche: example.niche, tone: example.tone }
                    });
                  }
                }}
                className="w-full text-left p-2 bg-black/40 border border-white/5 rounded hover:border-violet-500/30 transition-colors"
              >
                <p className="text-[10px] text-white/70 truncate">{example.url}</p>
                <p className="text-[9px] text-violet-400">{example.archetype}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="!bg-violet-500 !w-3 !h-3" />
    </div>
  );
}

export default DataIngestionNode;
