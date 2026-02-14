// =============================================================================
// Vibe Working — useAuth Hook
// =============================================================================
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';
import type { Profile } from '../types/database';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

type AuthContextType = AuthState & AuthActions;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthInternal();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// ---------------------------------------------------------------------------
// Internal hook implementation
// ---------------------------------------------------------------------------
function useAuthInternal(): AuthContextType {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  const CONFIG_ERROR = 'Missing Supabase config. Add a .env file with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY (see .env.example).';

  // Fetch profile
  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setState((s) => ({ ...s, profile: data }));
    }
  }, []);

  // Listen for auth changes
  useEffect(() => {
    if (!supabase) {
      setState((s) => ({ ...s, loading: false, error: CONFIG_ERROR }));
      return;
    }
    let cancelled = false;
    // Get initial session (short timeout so we never spin forever)
    const timeoutId = setTimeout(() => {
      if (cancelled) return;
      setState((s) => (s.loading ? { ...s, loading: false } : s));
    }, 2000);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      clearTimeout(timeoutId);
      setState((s) => ({
        ...s,
        session,
        user: session?.user ?? null,
        loading: false,
      }));
      if (session?.user) fetchProfile(session.user.id);
    }).catch(() => {
      if (cancelled) return;
      clearTimeout(timeoutId);
      setState((s) => ({ ...s, loading: false }));
    });

    // Subscribe to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState((s) => ({
          ...s,
          session,
          user: session?.user ?? null,
          loading: false,
        }));
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setState((s) => ({ ...s, profile: null }));
        }
      },
    );

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Actions
  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!supabase) return setState((s) => ({ ...s, error: CONFIG_ERROR }));
    setState((s) => ({ ...s, error: null, loading: true }));
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setState((s) => ({ ...s, error: error.message, loading: false }));
  }, []);

  const signUpWithEmail = useCallback(
    async (email: string, password: string, name?: string) => {
      if (!supabase) return setState((s) => ({ ...s, error: CONFIG_ERROR }));
      setState((s) => ({ ...s, error: null, loading: true }));
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) setState((s) => ({ ...s, error: error.message, loading: false }));
    },
    [],
  );

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return setState((s) => ({ ...s, error: CONFIG_ERROR }));
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) setState((s) => ({ ...s, error: error.message }));
  }, []);

  const signInWithApple = useCallback(async () => {
    if (!supabase) return setState((s) => ({ ...s, error: CONFIG_ERROR }));
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'apple' });
    if (error) setState((s) => ({ ...s, error: error.message }));
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setState({ session: null, user: null, profile: null, loading: false, error: null });
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (!supabase) return setState((s) => ({ ...s, error: CONFIG_ERROR }));
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setState((s) => ({ ...s, error: error.message }));
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<Profile>) => {
      if (!state.user || !supabase) return;
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', state.user.id)
        .select()
        .single();

      if (error) {
        setState((s) => ({ ...s, error: error.message }));
      } else {
        setState((s) => ({ ...s, profile: data }));
      }
    },
    [state.user],
  );

  const refreshProfile = useCallback(async () => {
    if (state.user) await fetchProfile(state.user.id);
  }, [state.user, fetchProfile]);

  return {
    ...state,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithApple,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile,
  };
}
