import { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Play, Wifi, Gauge, Cpu, Download, Atom } from 'lucide-react';

interface QuantumMergeNodeData {
  isRendering?: boolean;
  progress?: number;
  onExecute?: () => void;
}

export function QuantumMergeNode({ data }: NodeProps) {
  const nodeData = data as QuantumMergeNodeData;
  const isRendering = nodeData.isRendering || false;
  const progress = nodeData.progress || 0;

  return (
    <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-4 min-w-[320px] text-white shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <Handle type="target" position={Position.Left} className="!bg-emerald-500 !w-3 !h-3" />
      
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/30 to-cyan-600/30 border border-emerald-500/30">
          <Atom size={18} className="text-emerald-400" />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-widest text-emerald-400/70 font-bold">NODE 05</span>
          <h4 className="text-sm font-bold">Quantum Merge</h4>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden mb-3">
        <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded border border-red-500/30 font-mono text-[9px]">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> REC
            </div>
            <span className="text-[9px] uppercase tracking-widest text-white/50 font-mono">
              TC: 01:00:00:00
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[9px] text-white/40">
            <span>ISO 800</span>
            <span>5600K</span>
            <div className="flex items-center gap-1 text-emerald-400">
              <Wifi size={10} /> STABLE
            </div>
          </div>
        </div>

        <div className="aspect-video relative flex items-center justify-center bg-black/60">
          {isRendering ? (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="relative w-20 h-20 flex items-center justify-center mb-3">
                <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-r-2 border-cyan-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
                <div className="absolute inset-4 rounded-full border-b-2 border-violet-500 animate-spin" style={{ animationDuration: '1.2s' }}></div>
                <span className="text-lg font-mono font-bold text-white">{progress}%</span>
              </div>
              <p className="text-[10px] font-bold text-emerald-400 tracking-widest animate-pulse">COMPILING</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Play size={24} className="text-emerald-400 ml-1" />
              </div>
              <p className="text-[10px] text-white/40 font-mono tracking-widest">RENDER VIEWER</p>
            </div>
          )}
        </div>

        <div className="px-3 py-2 border-t border-zinc-800 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Gauge size={10} className="text-zinc-500" />
              <span className="text-[9px] text-zinc-400 font-mono">FPS: 60</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu size={10} className="text-emerald-500" />
              <span className="text-[9px] text-emerald-400 font-mono">8K</span>
            </div>
          </div>
          <button className="p-1.5 text-white/40 hover:text-white/70 transition-colors">
            <Download size={12} />
          </button>
        </div>
      </div>

      <button
        onClick={() => nodeData.onExecute?.()}
        disabled={isRendering}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold font-mono text-sm transition-all ${
          isRendering
            ? 'bg-zinc-800 border border-zinc-700 text-zinc-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 border border-emerald-400 text-white hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]'
        }`}
      >
        {isRendering ? (
          <>
            <div className="w-3 h-3 rounded-full border-2 border-zinc-500 border-t-white animate-spin" />
            EXECUTING QUANTUM MERGE...
          </>
        ) : (
          <>
            <Play size={16} />
            EXECUTE
          </>
        )}
      </button>

      <Handle type="source" position={Position.Right} className="!bg-emerald-500 !w-3 !h-3" />
    </div>
  );
}

export default QuantumMergeNode;
