import { useState, useEffect, useCallback } from 'react';
import type { TelemetryData } from '@/types';

interface UseTelemetryOptions {
  enabled?: boolean;
  updateInterval?: number;
}

export function useTelemetry({ enabled = true, updateInterval = 5000 }: UseTelemetryOptions = {}) {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(() => {
    if (!enabled) return;

    setConnected(true);
    
    const mockSubscription = setInterval(() => {
      setData(prev => {
        const base = prev || {
          revenue: 42820,
          dailyLeads: 842,
          activeRentals: 47,
          topAvatar: 'Marcus V.',
          roas: 4.2
        };
        
        return {
          revenue: base.revenue + Math.floor(Math.random() * 100 - 50),
          dailyLeads: base.dailyLeads + Math.floor(Math.random() * 10 - 5),
          activeRentals: Math.max(1, base.activeRentals + Math.floor(Math.random() * 3 - 1)),
          topAvatar: base.topAvatar,
          roas: Math.max(1, Math.min(10, base.roas + (Math.random() * 0.4 - 0.2)))
        };
      });
    }, updateInterval);

    return () => {
      clearInterval(mockSubscription);
      setConnected(false);
    };
  }, [enabled, updateInterval]);

  useEffect(() => {
    const cleanup = connect();
    return () => {
      if (cleanup) cleanup();
    };
  }, [connect]);

  const reconnect = useCallback(() => {
    setError(null);
    connect();
  }, [connect]);

  return {
    data,
    connected,
    error,
    reconnect
  };
}

export default useTelemetry;
