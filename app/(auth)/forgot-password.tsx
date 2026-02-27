import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { Logo } from '../../src/components/Logo';
import { colors } from '../../src/theme';

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Missing email', 'Please enter your email.');
      return;
    }
    await resetPassword(email.trim());
    setSent(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Logo size={56} />
        <Text style={styles.title}>Reset Password</Text>
        {sent ? (
          <View>
            <Text style={styles.sub}>
              Check your email for a reset link.
            </Text>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => router.replace('/(auth)/login')}
            >
              <Text style={styles.btnText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.sub}>
              Enter your email and we will send a reset link.
            </Text>
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
            <TouchableOpacity
              style={styles.btn}
              onPress={handleReset}
            >
              <Text style={styles.btnText}>Send Reset Link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.back}
              onPress={() => router.back()}
            >
              <Text style={styles.backText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  sub: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 6,
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
    width: 300,
  },
  btn: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 20,
    width: 300,
  },
  btnText: {
    color: '#4b5563',
    fontSize: 15,
    fontWeight: '500',
  },
  back: {
    marginTop: 16,
    alignItems: 'center',
  },
  backText: {
    color: colors.accent,
    fontSize: 14,
  },
});
