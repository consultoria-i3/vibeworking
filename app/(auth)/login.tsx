import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { Logo } from '../../src/components/Logo';
import { colors } from '../../src/theme';

export default function LoginScreen() {
  const { signInWithEmail, signInWithGoogle, error, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter both email and password.');
      return;
    }
    await signInWithEmail(email.trim(), password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Logo size={72} />
          <Text style={styles.title}>Vibe Working</Text>
          <Text style={styles.subtitle}>
            Your daily coaching companion for thriving at work
          </Text>
        </View>

        {/* Email Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Your password"
            placeholderTextColor="#555"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleEmailLogin}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <Link href="/(auth)/forgot-password" asChild>
            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google OAuth */}
        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          onPress={signInWithGoogle}
          disabled={loading}
        >
          <Text style={styles.googleButtonText}>🔵  Continue with Google</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  error: {
    color: colors.error,
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: 'transparent',
  },
  primaryButtonText: {
    color: '#4b5563',
    fontSize: 15,
    fontWeight: '500',
  },
  forgotButton: {
    alignItems: 'center',
    marginTop: 12,
  },
  forgotText: {
    color: colors.accent,
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.cardBorder,
  },
  dividerText: {
    color: colors.textMuted,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  googleButtonText: {
    color: '#4b5563',
    fontSize: 15,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  footerLink: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '500',
  },
});
