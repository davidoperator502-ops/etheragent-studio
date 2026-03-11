// src/lib/aiCache.ts

const CACHE_PREFIX = 'marcus_cache_';
const CACHE_EXPIRATION = 1000 * 60 * 60; // 1 hora de validez

export const getCachedResponse = (prompt: string): string | null => {
    try {
        // Usamos encodeURIComponent para evitar DOMException con caracteres especiales/acentos
        const key = CACHE_PREFIX + btoa(encodeURIComponent(prompt.toLowerCase().trim())).slice(0, 32);
        const cached = localStorage.getItem(key);

        if (!cached) return null;

        const { response, timestamp } = JSON.parse(cached);

        // Si el cache tiene más de una hora, lo borramos (datos obsoletos)
        if (Date.now() - timestamp > CACHE_EXPIRATION) {
            localStorage.removeItem(key);
            return null;
        }

        return response;
    } catch (e) {
        console.error("Error leyendo cache:", e);
        return null;
    }
};

export const setCachedResponse = (prompt: string, response: string) => {
    try {
        const key = CACHE_PREFIX + btoa(encodeURIComponent(prompt.toLowerCase().trim())).slice(0, 32);
        const cacheData = {
            response,
            timestamp: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (e) {
        console.error("Error guardando en cache:", e);
    }
};

export const clearAICache = () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
            localStorage.removeItem(key);
        }
    });
    console.log("🧹 Memoria de Marcus purgada exitosamente.");
};
