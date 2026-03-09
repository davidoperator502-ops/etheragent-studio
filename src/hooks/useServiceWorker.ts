import { useState, useEffect, useCallback } from 'react';

interface UseServiceWorkerReturn {
  updateReady: boolean;
  registration: ServiceWorkerRegistration | null;
  reload: () => void;
}

export function useServiceWorker(): UseServiceWorkerReturn {
  const [updateReady, setUpdateReady] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateReady(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const reload = useCallback(() => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }, [registration]);

  return { updateReady, registration, reload };
}

export default useServiceWorker;
