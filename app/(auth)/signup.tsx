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
import { colors } from '../../src/theme';
import { useT } from '../../src/i18n';

export default function SignupScreen() {
  const { signUpWithEmail, error, loading } = useAuth();
  const t = useT();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert(t.auth.missingTitle, t.auth.fillAllFields);
      return;
    }
    if (password !== confirm) {
      Alert.alert(t.auth.errorTitle, t.auth.passwordsDontMatch);
      return;
    }
    if (password.length < 6) {
      Alert.alert(t.auth.errorTitle, t.auth.minChars);
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
          <Text style={styles.title}>{t.auth.signUp}</Text>
          <Text style={styles.sub}>
            {t.auth.signupSubtitle}
          </Text>
        </View>

        <View>
          <Text style={styles.label}>{t.auth.fullName}</Text>
          <TextInput
            style={styles.input}
            placeholder={t.auth.namePlaceholder}
            placeholderTextColor="#555"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>{t.auth.email}</Text>
          <TextInput
            style={styles.input}
            placeholder={t.auth.emailPlaceholder}
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>{t.auth.password}</Text>
          <TextInput
            style={styles.input}
            placeholder={t.auth.passwordPlaceholder}
            placeholderTextColor="#555"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>{t.auth.confirmPassword}</Text>
          <TextInput
            style={styles.input}
            placeholder={t.auth.repeatPassword}
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
              {loading ? t.auth.signingUp : t.auth.signUp}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t.auth.alreadyHaveAccount}{' '}
          </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>{t.auth.signIn}</Text>
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
