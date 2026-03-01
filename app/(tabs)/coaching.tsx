import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { colors } from '../../src/theme';
import { CATEGORY_COLORS } from '../../src/constants/categories';
import { useT } from '../../src/i18n';

export default function CoachingScreen() {
  const t = useT();
  const { slug } = useLocalSearchParams<{ slug?: string }>();
  const sectionColor = slug ? (CATEGORY_COLORS[slug] ?? colors.background) : colors.background;

  return (
    <View style={[styles.container, { backgroundColor: sectionColor }]}>
      <Link href="/(tabs)" asChild>
        <TouchableOpacity style={styles.homeLink} accessibilityLabel="Go to home">
          <Text style={styles.homeLinkText}>{t.nav.home}</Text>
        </TouchableOpacity>
      </Link>
      <View style={[styles.innerSection, { backgroundColor: sectionColor }]}>
        <Text style={styles.title}>{t.coaching.title}</Text>
        <Text style={styles.subtitle}>{t.coaching.comingSoon}</Text>
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
