import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../src/hooks/useAuth';
import { View, ActivityIndicator, StyleSheet, Text, ScrollView } from 'react-native';
import { colors } from '../src/theme';
import { Platform } from 'react-native';
import { RootErrorBoundary } from './RootWrapper';

const fullHeight = { flex: 1 as const };

function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, loading, error } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const isConfigError = error?.includes('Missing Supabase') ?? false;

  useEffect(() => {
    if (loading || isConfigError) return;
    const first = segments?.[0];
    const inAuthGroup = first === '(auth)';
    const inTabsGroup = first === '(tabs)';
    const isIndexOrInitial = !first || first === 'index'; // root index redirects to tabs
    // Allow visitors on (tabs) and on index (redirects to tabs)
    if (!session && !inAuthGroup && !inTabsGroup && !isIndexOrInitial)
      router.replace('/(auth)/login');
    else if (session && !inTabsGroup) router.replace('/(tabs)');
  }, [session, loading, segments, isConfigError]);

  if (loading) {
    return (
      <View style={[styles.loading, fullHeight]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>{Platform.OS === 'web' && typeof window !== 'undefined' && window.location.hostname.includes('outpl') ? 'Outplai' : 'Relacion.at!'}</Text>
      </View>
    );
  }
  if (isConfigError) {
    return (
      <View style={[styles.loading, fullHeight]}>
        <ScrollView contentContainerStyle={styles.errorContent}>
          <Text style={styles.errorTitle}>Setup required</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Text style={styles.errorHint}>
            Create a .env file in the vibeworking folder with EXPO_PUBLIC_SUPABASE_URL and
            EXPO_PUBLIC_SUPABASE_ANON_KEY (see .env.example), then restart.
          </Text>
        </ScrollView>
      </View>
    );
  }
  return <View style={fullHeight}>{children}</View>;
}

export function ErrorBoundary({ error }: { error: Error; retry?: () => void }) {
  return (
    <View style={[styles.loading, fullHeight]}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMessage}>{error?.message || 'Unknown error'}</Text>
    </View>
  );
}

export default function RootLayout() {
  return (
    <RootErrorBoundary>
      <View style={[fullHeight, styles.root]}>
        <AuthProvider>
          <AuthGate>
            <Stack screenOptions={{ headerShown: false }} />
          </AuthGate>
        </AuthProvider>
      </View>
    </RootErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: colors.background },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: colors.textSecondary,
  },
  errorContent: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  errorTitle: { fontSize: 20, fontWeight: '500', color: colors.error, marginBottom: 12 },
  errorMessage: { fontSize: 14, color: colors.textSecondary, marginBottom: 16 },
  errorHint: { fontSize: 13, color: colors.textMuted },
});
