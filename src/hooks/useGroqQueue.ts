import { useState, useCallback, useRef } from 'react';

export interface GroqRequest {
  id: string;
  prompt: string;
  system?: string;
  onSuccess: (response: string) => void;
  onError: (error: Error) => void;
}

export interface QueueItem extends GroqRequest {
  timestamp: number;
  retries: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerHour: number;
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  requestsPerMinute: 30,
  requestsPerHour: 500,
  maxRetries: 3,
  baseDelayMs: 2000,
  maxDelayMs: 60000,
};

export function useGroqQueue(apiKey: string, config: Partial<RateLimitConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<QueueItem | null>(null);
  
  const requestTimestamps = useRef<number[]>([]);
  const hourlyTimestamps = useRef<number[]>([]);
  const processingRef = useRef(false);

  const getCachedResponse = useCallback((prompt: string): string | null => {
    const cacheKey = `groq_cache_${btoa(prompt).substring(0, 50)}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { response, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 3600000) {
        return response;
      }
      localStorage.removeItem(cacheKey);
    }
    return null;
  }, []);

  const setCachedResponse = useCallback((prompt: string, response: string) => {
    const cacheKey = `groq_cache_${btoa(prompt).substring(0, 50)}`;
    localStorage.setItem(cacheKey, JSON.stringify({ response, timestamp: Date.now() }));
  }, []);

  const canMakeRequest = useCallback((): { allowed: boolean; waitTime: number } => {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const oneHourAgo = now - 3600000;

    const recentRequests = requestTimestamps.current.filter(t => t > oneMinuteAgo);
    const hourlyRequests = hourlyTimestamps.current.filter(t => t > oneHourAgo);

    if (recentRequests.length >= finalConfig.requestsPerMinute) {
      const oldestInWindow = recentRequests[0];
      return { allowed: false, waitTime: 60000 - (now - oldestInWindow) };
    }

    if (hourlyRequests.length >= finalConfig.requestsPerHour) {
      const oldestInHour = hourlyRequests[0];
      return { allowed: false, waitTime: 3600000 - (now - oldestInHour) };
    }

    return { allowed: true, waitTime: 0 };
  }, [finalConfig]);

  const delay = useCallback((ms: number) => new Promise(resolve => setTimeout(resolve, ms)), []);

  const executeRequest = useCallback(async (item: QueueItem): Promise<string> => {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: item.system || 'You are a helpful AI assistant.' },
          { role: 'user', content: item.prompt }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json().catch(() => ({}));
      
      if (groqResponse.status === 429) {
        throw new Error('RATE_LIMITED');
      }
      
      if (errorData.error?.code === 'context_length_exceeded') {
        throw new Error('CONTEXT_EXCEEDED');
      }
      
      throw new Error(errorData.error?.message || `API Error: ${groqResponse.status}`);
    }

    const data = await groqResponse.json();
    return data.choices[0]?.message?.content || '';
  }, [apiKey]);

  const processQueue = useCallback(async () => {
    if (processingRef.current || !apiKey) return;
    processingRef.current = true;
    setIsProcessing(true);

    while (queue.length > 0) {
      const { allowed, waitTime } = canMakeRequest();
      
      if (!allowed) {
        await delay(Math.min(waitTime + 1000, finalConfig.maxDelayMs));
        continue;
      }

      const itemIndex = queue.findIndex(q => q.status === 'pending');
      if (itemIndex === -1) break;

      const item = queue[itemIndex];
      
      setQueue(prev => prev.map((q, i) => 
        i === itemIndex ? { ...q, status: 'processing' as const } : q
      ));
      setCurrentRequest(item);

      const now = Date.now();
      requestTimestamps.current.push(now);
      hourlyTimestamps.current.push(now);

      try {
        const cachedResponse = getCachedResponse(item.prompt);
        
        let response: string;
        if (cachedResponse) {
          response = cachedResponse;
        } else {
          response = await executeRequest(item);
          setCachedResponse(item.prompt, response);
        }

        setQueue(prev => prev.map((q, i) => 
          i === itemIndex ? { ...q, status: 'completed' as const } : q
        ));
        
        item.onSuccess(response);
        
        await delay(1500);
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        if (errorMessage === 'RATE_LIMITED' && item.retries < finalConfig.maxRetries) {
          setQueue(prev => prev.map((q, i) => 
            i === itemIndex ? { ...q, retries: q.retries + 1, status: 'pending' as const } : q
          ));
          
          const backoffDelay = Math.min(
            finalConfig.baseDelayMs * Math.pow(2, item.retries),
            finalConfig.maxDelayMs
          );
          await delay(backoffDelay);
        } else {
          setQueue(prev => prev.map((q, i) => 
            i === itemIndex ? { ...q, status: 'failed' as const } : q
          ));
          item.onError(new Error(errorMessage));
        }
      }
    }

    setCurrentRequest(null);
    setIsProcessing(false);
    processingRef.current = false;
  }, [apiKey, queue, canMakeRequest, delay, executeRequest, finalConfig, getCachedResponse, setCachedResponse]);

  const enqueue = useCallback((
    prompt: string,
    onSuccess: (response: string) => void,
    onError: (error: Error) => void,
    system?: string
  ): string => {
    const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const newItem: QueueItem = {
      id,
      prompt,
      system,
      onSuccess,
      onError,
      timestamp: Date.now(),
      retries: 0,
      status: 'pending',
    };

    setQueue(prev => [...prev, newItem]);
    
    if (!processingRef.current && apiKey) {
      processQueue();
    }

    return id;
  }, [apiKey, processQueue]);

  const removeFromQueue = useCallback((id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
    setCurrentRequest(null);
  }, []);

  const getQueueStatus = useCallback(() => {
    return {
      total: queue.length,
      pending: queue.filter(q => q.status === 'pending').length,
      processing: queue.filter(q => q.status === 'processing').length,
      completed: queue.filter(q => q.status === 'completed').length,
      failed: queue.filter(q => q.status === 'failed').length,
      isProcessing,
      currentRequest: currentRequest?.id || null,
    };
  }, [queue, isProcessing, currentRequest]);

  return {
    enqueue,
    removeFromQueue,
    clearQueue,
    getQueueStatus,
    queue,
    isProcessing,
    currentRequest,
  };
}

export function createGroqRequest(prompt: string, system?: string): { prompt: string; system?: string } {
  return { prompt, system };
}
