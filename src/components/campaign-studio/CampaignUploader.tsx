import { useRef, useState } from 'react';
import { Loader2, CheckCircle2, FileUp } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  uploading: boolean;
  hasMedia: boolean;
  mediaType: 'video' | 'image';
  onFile: (file: File) => void;
  /** Notifica al padre el tipo detectado (para sincronizar el preview). */
  onMediaTypeDetected?: (t: 'video' | 'image') => void;
  className?: string;
}

const ACCEPT = 'video/mp4,video/webm,video/quicktime,image/jpeg,image/png,image/webp';

// Dropzone de subida de activo propio. Extraído de SocialLab.tsx:1023-1068 + handlers 446-478.
export function CampaignUploader({ uploading, hasMedia, mediaType, onFile, onMediaTypeDetected, className = '' }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handle = (file: File) => {
    if (file.type.startsWith('video/')) onMediaTypeDetected?.('video');
    else if (file.type.startsWith('image/')) onMediaTypeDetected?.('image');
    onFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handle(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (file.type.startsWith('video/') || file.type.startsWith('image/')) handle(file);
    else toast.error('Solo se permiten archivos de video o imagen');
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
      onClick={() => fileInputRef.current?.click()}
      className={`group border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
        dragOver
          ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]'
          : hasMedia
            ? 'border-emerald-500/30 bg-emerald-500/[0.04] hover:bg-emerald-500/[0.07]'
            : 'border-zinc-700 bg-zinc-900/40 hover:border-emerald-500/40 hover:bg-zinc-900/60'
      } ${className}`}
    >
      <input ref={fileInputRef} type="file" accept={ACCEPT} onChange={handleFileChange} className="hidden" />
      {uploading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={22} className="text-emerald-400 animate-spin" />
          <span className="text-xs text-zinc-400 font-mono">Subiendo…</span>
        </div>
      ) : hasMedia ? (
        <div className="flex items-center justify-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} className="text-emerald-400" />
          </div>
          <div className="flex flex-col items-start min-w-0">
            <span className="text-xs text-emerald-300 font-semibold">{mediaType === 'video' ? 'Video' : 'Imagen'} cargado</span>
            <span className="text-[10px] text-zinc-500">Click o suelta para reemplazar</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center transition-colors duration-200 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30">
            <FileUp size={18} className="text-zinc-500 transition-colors duration-200 group-hover:text-emerald-400" />
          </div>
          <span className="text-xs text-zinc-300 font-semibold mt-1">Sube tu {mediaType === 'video' ? 'video' : 'imagen'}</span>
          <span className="text-[10px] text-zinc-600">Arrastra o haz click · {mediaType === 'video' ? 'MP4 · WEBM · MOV' : 'JPG · PNG · WEBP'}</span>
        </div>
      )}
    </div>
  );
}
