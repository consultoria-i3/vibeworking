// Loaded after first paint so import errors don't cause a blank page
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../src/hooks/useAuth';
import { View, ActivityIndicator, StyleSheet, Text, ScrollView } from 'react-native';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { Platform } from 'react-native';

const fullHeight = Platform.OS === 'web' ? { minHeight: '100vh' as unknown as number } : { flex: 1 };

function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, loading, error } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const isConfigError = error?.includes('Missing Supabase') ?? false;

  useEffect(() => {
    if (loading || isConfigError) return;
    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    if (!session && !inAuthGroup) router.replace('/(auth)/login');
    else if (session && !inTabsGroup) router.replace('/(tabs)');
  }, [session, loading, segments, isConfigError]);

  if (loading) {
    return (
      <View style={[styles.loading, fullHeight]}>
        <ActivityIndicator size="large" color="#6C5CE7" />
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
            Create a .env file in the vibeworking folder with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY (see .env.example), then restart.
          </Text>
        </ScrollView>
      </View>
    );
  }
  return <View style={fullHeight}>{children}</View>;
}

export default function AppContent() {
  return (
    <AuthProvider>
      <AuthGate>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthGate>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0A1A',
  },
  errorContent: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  errorTitle: { fontSize: 20, fontWeight: '700', color: '#FF6B6B', marginBottom: 12 },
  errorMessage: { fontSize: 14, color: '#C4B8DB', marginBottom: 16 },
  errorHint: { fontSize: 13, color: '#8B7FA8' },
});
