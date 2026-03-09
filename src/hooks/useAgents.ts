// src/hooks/useAgents.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Ajusta la ruta si es necesario

// Tipado estricto para producción
export interface Agent {
    id: string;
    name: string;
    role: string;
    color_theme: string;
    system_prompt: string;
    is_active: boolean;
}

export function useAgents() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAgents() {
            try {
                setIsLoading(true);
                // Hacemos la consulta a Supabase
                const { data, error } = await supabase
                    .from('agents')
                    .select('*')
                    .eq('is_active', true) // Solo traemos los agentes activos
                    .order('created_at', { ascending: true });

                if (error) throw error;

                // Inyectamos los datos en el estado
                if (data) setAgents(data as Agent[]);

            } catch (err: any) {
                console.error('Error extrayendo agentes de la Neural Matrix:', err.message);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAgents();
    }, []);

    return { agents, isLoading, error };
}
