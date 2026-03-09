import { Handle, Position, NodeProps } from '@xyflow/react';
import { MapPin, Layers, Sparkles, Sun, Building2, Waves, Globe, Sunrise } from 'lucide-react';
import { useState } from 'react';

interface TopologyNodeData {
  locationName?: string;
  locationDescription?: string;
  prompt?: string;
  timeOfDay?: string;
  weather?: string;
}

const LOCATION_EXAMPLES = [
  { 
    id: 'times_square', 
    name: 'Times Square NYC', 
    category: 'urban',
    description: 'NYC Central Hub - Alta densidad visual', 
    prompt: 'Times Square, New York City, bustling at night. Neon signs, LED billboards, crowd activity. Wet pavement reflections, cinematic night lighting.',
    timeOfDay: 'night',
    weather: 'clear'
  },
  { 
    id: 'shibuya', 
    name: 'Shibuya Crossing Tokyo', 
    category: 'urban',
    description: 'Tokio Cyberpunk District', 
    prompt: 'Shibuya Crossing, Tokyo, rainy atmosphere. Neon reflections, wet streets, cyberpunk aesthetic. Tokyo night lights, bustling crowd.',
    timeOfDay: 'night',
    weather: 'rain'
  },
  { 
    id: 'wall_street', 
    name: 'Wall Street', 
    category: 'finance',
    description: 'Financial District NYC', 
    prompt: 'Wall Street, Manhattan, morning light. Historic brownstones, modern skyscrapers, business professionals. Golden hour lighting.',
    timeOfDay: 'morning',
    weather: 'clear'
  },
  { 
    id: 'miami_beach', 
    name: 'Miami Beach', 
    category: 'leisure',
    description: 'Luxury Beach Resort', 
    prompt: 'Luxury beach resort at sunset, golden hour, palm trees. Crystal clear water, white sand, resort architecture. Cinematic drone shot.',
    timeOfDay: 'sunset',
    weather: 'clear'
  },
  { 
    id: 'metaverse', 
    name: 'Cyber Metaverse', 
    category: 'virtual',
    description: 'Digital Virtual Environment', 
    prompt: 'Futuristic virtual environment, digital landscape, neon grid, holographic elements. Cyberpunk aesthetic, volumetric fog, glitch effects.',
    timeOfDay: 'eternal',
    weather: 'digital'
  },
  { 
    id: 'corporate_office', 
    name: 'Corporate HQ', 
    category: 'office',
    description: 'Modern Office Space', 
    prompt: 'Contemporary corporate office interior, floor-to-ceiling windows, city views. Warm ambient lighting, modern furniture, minimalist design.',
    timeOfDay: 'day',
    weather: 'clear'
  },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'urban': return Building2;
    case 'finance': return Building2;
    case 'leisure': return Waves;
    case 'virtual': return Globe;
    case 'office': return Building2;
    default: return MapPin;
  }
};

const getTimeIcon = (time: string) => {
  switch (time) {
    case 'night': return Moon;
    case 'sunset': return Sunrise;
    case 'morning': return Sunrise;
    case 'day': return Sun;
    default: return Sun;
  }
};

function Moon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
}

export function TopologyNode({ data }: NodeProps) {
  const nodeData = data as TopologyNodeData;
  const [showExamples, setShowExamples] = useState(false);
  
  const locationName = nodeData.locationName || 'Times Square NYC';
  const locationDescription = nodeData.locationDescription || 'NYC Central Hub';

  const example = LOCATION_EXAMPLES.find(l => l.name === locationName) || LOCATION_EXAMPLES[0];
  const CategoryIcon = getCategoryIcon(example.category);
  const TimeIcon = getTimeIcon(example.timeOfDay);

  return (
    <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-4 min-w-[300px] text-white shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <Handle type="target" position={Position.Left} className="!bg-cyan-500 !w-3 !h-3" />
      
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-500/30">
          <MapPin size={18} className="text-cyan-400" />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-widest text-cyan-400/70 font-bold">NODE 03</span>
          <h4 className="text-sm font-bold">Topology</h4>
        </div>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-lg p-3 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <CategoryIcon size={12} className="text-cyan-400" />
          <span className="text-[9px] uppercase tracking-widest text-white/40">ENVIRONMENT</span>
        </div>
        <p className="text-xs text-white/80 font-medium">{locationName}</p>
        <p className="text-[10px] text-white/40 mt-1">{locationDescription}</p>
        
        <div className="flex gap-2 mt-2">
          <span className="text-[8px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">{example.category.toUpperCase()}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <div className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 flex items-center gap-2">
          <TimeIcon size={12} className="text-amber-400" />
          <span className="text-[9px] text-white/60">{nodeData.timeOfDay || example.timeOfDay}</span>
        </div>
        <div className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 flex items-center gap-2">
          <Waves size={12} className="text-blue-400" />
          <span className="text-[9px] text-white/60">{nodeData.weather || example.weather}</span>
        </div>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1.5">
          <Layers size={12} className="text-violet-400" />
          <span className="text-[9px] uppercase tracking-widest text-white/40">PROMPT</span>
        </div>
        <p className="text-[9px] text-white/60 font-mono line-clamp-3">
          {nodeData.prompt || example.prompt}
        </p>
      </div>

      <button 
        onClick={() => setShowExamples(!showExamples)}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-cyan-500/50 transition-colors text-xs mt-3"
      >
        <Sparkles size={12} />
        {showExamples ? 'Hide Examples' : 'Load Location Examples'}
      </button>

      {showExamples && (
        <div className="space-y-2 max-h-40 overflow-y-auto mt-2">
          {LOCATION_EXAMPLES.map((loc) => {
            const Icon = getCategoryIcon(loc.category);
            return (
              <button
                key={loc.id}
                onClick={() => {
                  if ((window as any).setNodeData) {
                    (window as any).setNodeData('topology', { 
                      locationName: loc.name,
                      locationDescription: loc.description,
                      prompt: loc.prompt,
                      timeOfDay: loc.timeOfDay,
                      weather: loc.weather,
                    });
                  }
                }}
                className="w-full flex items-center gap-3 p-2 bg-black/40 border border-white/5 rounded hover:border-cyan-500/30 transition-colors"
              >
                <Icon size={14} className="text-cyan-400" />
                <div className="text-left flex-1">
                  <p className="text-[10px] text-white font-medium">{loc.name}</p>
                  <p className="text-[8px] text-white/40">{loc.category}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <Handle type="source" position={Position.Right} className="!bg-cyan-500 !w-3 !h-3" />
    </div>
  );
}

export default TopologyNode;
