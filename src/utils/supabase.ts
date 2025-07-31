import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Usa variables de entorno o reemplaza por tus valores reales
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://TU_SUPABASE_URL.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'TU_SUPABASE_ANON_KEY';

// La configuración recomendada para React Native
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    storageKey: 'supabase.auth.token',
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
