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

export default function SignupScreen() {
  const { signUpWithEmail, error, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing', 'Fill all fields');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Error', "Passwords don't match");
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Min 6 characters');
      return;
    }
    await signUpWithEmail(email.trim(), password, name.trim());
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Logo size={64} />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.sub}>
            Start your journey to a better work life
          </Text>
        </View>

        <View>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor="#555"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Min 6 characters"
            placeholderTextColor="#555"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Repeat password"
            placeholderTextColor="#555"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
          />

          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.btn}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={styles.btnText}>
              {loading ? 'Creating...' : 'Create Account'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
          </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Sign In</Text>
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
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  sub: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
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
  btn: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  btnText: {
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
