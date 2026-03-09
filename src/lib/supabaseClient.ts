// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Vite utiliza import.meta.env en lugar de process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Escudo de validación: Evita que la app crashee en Vercel si olvidas poner las variables
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('⚠️ ALERTA CRÍTICA: Variables de entorno de Supabase no encontradas.');
}

// Exportamos la instancia única del cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
