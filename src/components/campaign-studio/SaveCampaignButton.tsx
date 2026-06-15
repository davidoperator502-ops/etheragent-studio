import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, X, Loader2, CheckCircle2 } from 'lucide-react';

interface SaveArgs {
  campaignName: string;
  selectedClientId: string;
  newClientName: string;
  surface: string;
}

interface Props {
  surface: string;
  clients: { id: string; nombre: string }[];
  saving: boolean;
  fetchClients: () => void;
  onSave: (args: SaveArgs) => Promise<boolean>;
}

// Botón "Guardar Campaña" + modal de archivo. Extraído de SocialLab.tsx:218-263, 562-567, 1100-1173.
export function SaveCampaignButton({ surface, clients, saving, fetchClients, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('new');
  const [newClientName, setNewClientName] = useState('');

  const openModal = () => { fetchClients(); setOpen(true); };

  const handleSave = async () => {
    const ok = await onSave({ campaignName, selectedClientId, newClientName, surface });
    if (ok) setOpen(false);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg transition-all duration-200 active:scale-95 border border-emerald-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
      >
        <Bookmark size={14} /> Guardar Campaña
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl relative"
            >
              <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
                <X size={20} />
              </button>

              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Bookmark className="text-emerald-500" /> Guardar en Historial
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-500 uppercase mb-2">Nombre de Campaña</label>
                  <input
                    type="text" value={campaignName} onChange={e => setCampaignName(e.target.value)}
                    placeholder="Ej. Black Friday Q4"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-500 uppercase mb-2">Cliente / Marca</label>
                  <select
                    value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors mb-2"
                  >
                    <option value="new">+ Crear nuevo cliente...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>

                  {selectedClientId === 'new' && (
                    <input
                      type="text" value={newClientName} onChange={e => setNewClientName(e.target.value)}
                      placeholder="Nombre del nuevo cliente"
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  )}
                </div>

                <button
                  onClick={handleSave} disabled={saving}
                  className="w-full mt-2 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  Confirmar y Guardar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
