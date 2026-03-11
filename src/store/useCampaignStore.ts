import { create } from 'zustand';
import { CampaignMatrix } from '../lib/groqService';
import { CampaignWorkspace } from '../lib/geminiService';

interface CampaignState {
  targetUrl: string;
  ceoCommand: string;
  matrix: CampaignMatrix | null;
  workspace: CampaignWorkspace | null;
  setInputs: (url: string, command: string) => void;
  setMatrix: (matrix: CampaignMatrix) => void;
  setWorkspace: (ws: CampaignWorkspace) => void;
  reset: () => void;
}

export const useCampaignStore = create<CampaignState>((set) => ({
  targetUrl: '',
  ceoCommand: '',
  matrix: null,
  workspace: null,

  setInputs: (url, command) => set({ targetUrl: url, ceoCommand: command }),
  setMatrix: (matrix) => set({ matrix }),
  setWorkspace: (ws) => set({ workspace: ws }),
  reset: () => set({ targetUrl: '', ceoCommand: '', matrix: null, workspace: null }),
}));
