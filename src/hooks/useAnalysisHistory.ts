import { useState, useEffect, useCallback } from 'react';
import type { AnalysisData } from '@/services/api';

const HISTORY_KEY = 'etheragent_analysis_history';
const MAX_HISTORY = 10;

export interface AnalysisHistoryItem {
  id: string;
  url: string;
  timestamp: number;
  data?: AnalysisData;
}

export function useAnalysisHistory() {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not load analysis history:', e);
    }
    setIsHydrated(true);
  }, []);

  const addToHistory = useCallback((url: string, data?: AnalysisData) => {
    if (!isHydrated) return;

    const newItem: AnalysisHistoryItem = {
      id: `analysis-${Date.now()}`,
      url,
      timestamp: Date.now(),
      data
    };

    setHistory(prev => {
      const filtered = prev.filter(item => item.url !== url);
      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY);
      
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save analysis history:', e);
      }
      
      return updated;
    });
  }, [isHydrated]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.warn('Could not clear analysis history:', e);
    }
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save analysis history:', e);
      }
      return updated;
    });
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory,
    isHydrated
  };
}

export default useAnalysisHistory;
