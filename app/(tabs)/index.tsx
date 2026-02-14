import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { useCheckin } from '../../src/hooks/useCheckin';
import { useState } from 'react';

const CATEGORIES = [
  { emoji: '👔', title: 'Your Boss', desc: 'How can I save you time today?', route: '/(tabs)/coaching', slug: 'boss' },
  { emoji: '🤝', title: 'Teammates', desc: 'Do what you say. Finish what you start. Always please and thank you!', route: '/(tabs)/coaching', slug: 'teammates' },
  { emoji: '🎓', title: 'Classmates', desc: 'Your contacts, My contacts.', route: '/(tabs)/coaching', slug: 'classmates' },
  { emoji: '💬', title: 'Ask All of Us', desc: 'Ask anonymously work relationship questions. Get advice from i3 and students', route: '/(tabs)/coaching', slug: 'community' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { profile, user } = useAuth();
  const { todayCount, canCheckin, isComplete, loading } = useCheckin(user?.id);
  const [overallScore, setOverallScore] = useState(3); // 1-5 slider

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const handleStartCheckin = () => {
    router.push('/(tabs)/checkin');
  };

  const handleOverallSubmit = () => {
    // Quick overall slider could create a minimal check-in; for now we just navigate to full check-in
    router.push('/(tabs)/checkin');
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {greeting} / Welcome back! 👋
        </Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 {profile?.streak_count ?? 0}</Text>
        </View>
      </View>

      {/* Check-in Slider - hidden after 6 */}
      {!loading && canCheckin && (
        <View style={styles.sliderCard}>
          <Text style={styles.sliderTitle}>How Did You Do Today? 📝</Text>
          <View style={styles.sliderRow}>
            <Text style={[styles.sliderLabel, { color: '#E8634A' }]}>Extremely Failed</Text>
            <Text style={[styles.sliderLabel, { color: '#4A90D9' }]}>Extremely Well</Text>
          </View>
          {Platform.OS === 'web' ? (
            <input
              type="range"
              min="1"
              max="5"
              value={overallScore}
              onChange={(e: any) => setOverallScore(+e.target.value)}
              style={styles.rangeInput}
            />
          ) : (
            <Text style={styles.sliderValue}>{overallScore}</Text>
          )}
          <TouchableOpacity style={styles.primaryButton} onPress={handleStartCheckin}>
            <Text style={styles.primaryButtonText}>Start Check-in</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Check-in Status */}
      <View style={styles.statusRow}>
        <Text style={styles.statusText}>
          {isComplete
            ? 'All 6 check-ins complete!'
            : `${todayCount}/6 check-ins today`}
        </Text>
      </View>

      {/* Category Grid 2×2 */}
      <View style={styles.grid}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.slug}
            style={styles.gridCard}
            onPress={() => router.push(cat.route as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.gridEmoji}>{cat.emoji}</Text>
            <Text style={styles.gridTitle}>{cat.title}</Text>
            <Text style={styles.gridDesc} numberOfLines={2}>{cat.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#0F0A1A',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#0F0A1A',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 48 : 60,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  streakBadge: {
    backgroundColor: '#2D1F4E',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  streakText: {
    color: '#F8A523',
    fontSize: 14,
    fontWeight: '700',
  },
  sliderCard: {
    backgroundColor: '#1A1429',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2D2640',
  },
  sliderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  sliderValue: {
    fontSize: 24,
    color: '#6C5CE7',
    textAlign: 'center',
    marginVertical: 8,
  },
  rangeInput: {
    width: '100%',
    height: 8,
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  statusRow: {
    marginBottom: 20,
  },
  statusText: {
    fontSize: 14,
    color: '#8B7FA8',
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCard: {
    width: '48%',
    padding: 16,
    backgroundColor: '#1A1429',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2D2640',
  },
  gridEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  gridDesc: {
    fontSize: 12,
    color: '#8B7FA8',
    lineHeight: 16,
  },
});
