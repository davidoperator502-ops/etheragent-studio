// src/hooks/useSonicMetrics.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface SonicMetrics {
    voiceModel: string;
    frequency: string;
    decibels: string;
    platform: string;
}

export function useSonicMetrics() {
    const [sonicData, setSonicData] = useState<SonicMetrics>({
        voiceModel: 'Aria (Neural)',
        frequency: '432 Hz',
        decibels: '-14 dB',
        platform: 'Spotify B2B'
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchLatestSonicData() {
            try {
                setIsLoading(true);

                // Buscamos la campaña más reciente desplegada
                const { data, error } = await supabase
                    .from('campaigns')
                    .select('metrics')
                    .eq('status', 'deployed')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (error && error.code !== 'PGRST116') throw error;

                if (data && data.metrics) {
                    setSonicData({
                        voiceModel: data.metrics.voice_model || 'Aria (Neural)',
                        frequency: data.metrics.audio_frequency || '432 Hz',
                        decibels: data.metrics.audio_decibels || '-14 dB',
                        platform: data.metrics.audio_platform || 'Spotify B2B'
                    });
                }
            } catch (err: any) {
                console.error('Error sincronizando métricas de Aria:', err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchLatestSonicData();
    }, []);

    return { sonicData, isLoading };
}
