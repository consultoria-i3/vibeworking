// =============================================================================
// Vibe Working — Supabase Client
// =============================================================================
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Detect web without importing react-native (avoids issues at bundle load on web)
const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

const webStorage = {
  getItem: (key: string) => Promise.resolve(typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null),
  setItem: (key: string, value: string) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
    return Promise.resolve();
  },
};

function getStorage() {
  if (isWeb) return webStorage;
  // Native only: require to avoid loading AsyncStorage on web (can crash or bloat)
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  return AsyncStorage;
}

function createSupabaseClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: getStorage(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: isWeb,
    },
  });
}

// Type assertion so callers don't need null checks; useAuth handles null for config error UI
export const supabase = createSupabaseClient() as SupabaseClient;
