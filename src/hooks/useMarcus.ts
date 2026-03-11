// src/hooks/useMarcus.ts
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface MarcusDecision {
  intent: string;
  target_brand: string;
  agents_to_activate: string[];
  parameters: {
    vibe: string;
    resolution: string;
  };
  marcus_confirmation_msg: string;
}

interface UseMarcusReturn {
  orchestrate: (prompt: string) => Promise<MarcusDecision | null>;
  isOrchestrating: boolean;
  error: string | null;
  lastDecision: MarcusDecision | null;
}

export function useMarcus(): UseMarcusReturn {
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDecision, setLastDecision] = useState<MarcusDecision | null>(null);

  const orchestrate = useCallback(async (prompt: string): Promise<MarcusDecision | null> => {
    setIsOrchestrating(true);
    setError(null);

    try {
      // Obtener el usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      
      // Obtener la URL de Supabase
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      
      // Llamar a la Edge Function de Marcus
      const response = await fetch(`${supabaseUrl}/functions/v1/marcus-orchestrator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          prompt,
          userId: user?.id || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Orquestación fallida');
      }

      const decision: MarcusDecision = await response.json();
      
      setLastDecision(decision);
      console.log('🎯 Marcus decision:', decision);
      
      return decision;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('❌ Marcus orchestration error:', errorMessage);
      return null;
    } finally {
      setIsOrchestrating(false);
    }
  }, []);

  return {
    orchestrate,
    isOrchestrating,
    error,
    lastDecision,
  };
}

// Helper para determinar qué lab activar basado en la decisión de Marcus
export function getActiveLabsFromDecision(decision: MarcusDecision): {
  nexus: boolean;
  social: boolean;
  sonic: boolean;
  ooh: boolean;
  ads: boolean;
} {
  const agents = decision.agents_to_activate.map(a => a.toLowerCase());
  
  return {
    nexus: decision.intent === 'campaña_global' || agents.includes('marcus'),
    social: agents.includes('valeria') || decision.intent === 'solo_social' || decision.intent === 'campaña_global',
    sonic: agents.includes('aria') || decision.intent === 'solo_audio' || decision.intent === 'campaña_global',
    ooh: agents.includes('viktor') || decision.intent === 'solo_ooh' || decision.intent === 'campaña_global',
    ads: agents.includes('kaelen') || decision.intent === 'solo_ads' || decision.intent === 'campaña_global',
  };
}

// Constantes para los agentes disponibles
export const AGENT_CAPABILITIES = {
  marcus: {
    name: 'Marcus',
    role: 'Chief Orchestrator',
    color: 'cyan',
    description: 'Orquestación de campañas globales',
  },
  valeria: {
    name: 'Valeria',
    role: 'Social Lab Director',
    color: 'emerald',
    description: 'Contenido para TikTok, Instagram, LinkedIn',
  },
  aria: {
    name: 'Aria',
    role: 'Sonic Lab Engineer',
    color: 'amber',
    description: 'Audio, voiceovers y cuñas radiales',
  },
  viktor: {
    name: 'Viktor',
    role: 'Virtual OOH Lead',
    color: 'orange',
    description: 'Vallas digitales y publicidad exterior virtual',
  },
  kaelen: {
    name: 'Kaelen',
    role: 'Performance Ads Manager',
    color: 'violet',
    description: 'Campañas de ads optimizadas por ROAS',
  },
} as const;

export default useMarcus;
