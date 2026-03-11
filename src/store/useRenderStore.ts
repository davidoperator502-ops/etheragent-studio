// src/store/useRenderStore.ts
// Memoria global de renders: conecta la Commercial Matrix con el Commercial Lab
import { create } from 'zustand';

interface RenderState {
    // Map de asset_id -> URL del render subido
    renders: Record<string, string | null>;
    // El render activo que se proyecta en el Lab
    activeRenderId: string | null;

    setRenderUrl: (assetId: string, url: string | null) => void;
    setActiveRender: (assetId: string | null) => void;
    resetRenders: () => void;
}

export const useRenderStore = create<RenderState>((set) => ({
    renders: {},
    activeRenderId: null,

    setRenderUrl: (assetId, url) =>
        set((state) => ({
            renders: { ...state.renders, [assetId]: url },
            // Auto-seleccionar el más reciente como activo
            activeRenderId: assetId,
        })),

    setActiveRender: (assetId) =>
        set({ activeRenderId: assetId }),

    resetRenders: () =>
        set({ renders: {}, activeRenderId: null }),
}));
