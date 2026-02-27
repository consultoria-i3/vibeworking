import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { Logo } from '../../src/components/Logo';
import { colors } from '../../src/theme';
import { CATEGORY_COLORS } from '../../src/constants/categories';

export default function CoachingScreen() {
  const { slug } = useLocalSearchParams<{ slug?: string }>();
  const sectionColor = slug ? (CATEGORY_COLORS[slug] ?? colors.background) : colors.background;

  return (
    <View style={[styles.container, { backgroundColor: sectionColor }]}>
      <Link href="/(tabs)" asChild>
        <TouchableOpacity style={styles.homeLink} accessibilityLabel="Go to home">
          <Text style={styles.homeLinkText}>🏠 Home</Text>
        </TouchableOpacity>
      </Link>
      <View style={[styles.innerSection, { backgroundColor: sectionColor }]}>
        <Logo size={64} />
        <Text style={styles.title}>Coaching</Text>
        <Text style={styles.subtitle}>Coming soon — coaching categories will load here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  homeLink: {
    position: 'absolute',
    top: 56,
    left: 12,
    zIndex: 1,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  homeLinkText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4b5563',
  },
  innerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
