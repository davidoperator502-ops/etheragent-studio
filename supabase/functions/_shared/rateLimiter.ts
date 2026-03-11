// supabase/functions/_shared/rateLimiter.ts
// Rate limiter simple para Edge Functions
// Usa un Map en memoria (en producción usar Redis)

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuración por tier de suscripción
const RATE_LIMITS = {
  free: { requests: 10, windowMs: 60 * 1000 },      // 10 req/min
  growth: { requests: 50, windowMs: 60 * 1000 },     // 50 req/min
  'c-suite': { requests: 200, windowMs: 60 * 1000 }, // 200 req/min
  enterprise: { requests: 1000, windowMs: 60 * 1000 }, // 1000 req/min
};

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number;
}

export async function checkRateLimit(
  userId: string | null,
  subscriptionTier: string = 'free'
): Promise<RateLimitResult> {
  const clientId = userId || `ip_${Date.now()}_${Math.random()}`;
  const now = Date.now();
  
  const limit = RATE_LIMITS[subscriptionTier as keyof typeof RATE_LIMITS] || RATE_LIMITS.free;
  
  const entry = rateLimitStore.get(clientId);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime: now + limit.windowMs,
    });
    
    return {
      allowed: true,
      remaining: limit.requests - 1,
      resetIn: limit.windowMs,
    };
  }
  
  if (entry.count >= limit.requests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetTime - now,
    };
  }
  
  entry.count++;
  
  return {
    allowed: true,
    remaining: limit.requests - entry.count,
    resetIn: entry.resetTime - now,
  };
}

export function addRateLimitHeaders(
  headers: Headers,
  result: RateLimitResult
): void {
  headers.set('X-RateLimit-Limit', String(RATE_LIMITS.free.requests));
  headers.set('X-RateLimit-Remaining', String(result.remaining));
  headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetIn / 1000)));
}

// Limpiar entradas expiradas cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);
