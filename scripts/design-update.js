const fs = require('fs');
const path = require('path');

// Helper to write files with base64 to avoid encoding issues
function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const buf = Buffer.from(content, 'utf8');
  fs.writeFileSync(filePath, buf);
  console.log('Wrote: ' + filePath);
}

// ─── THEME CONSTANTS (shared reference) ───────────────────────

const THEME = `
// Vibe Working Design System
export const COLORS = {
  // Core
  background: '#FAF7F2',
  surface: '#FFFFFF',
  surfaceAlt: '#FEFDFB',
  text: '#2D2A26',
  textSecondary: '#5C5750',
  textMuted: '#8A847A',
  textFaint: '#B5B0A8',
  border: 'rgba(0,0,0,0.06)',
  borderLight: 'rgba(0,0,0,0.04)',
  
  // Category Colors
  boss: '#E8634A',
  teammates: '#4A90D9',
  classmates: '#6B5CE7',
  humanHelp: '#2EBD6B',
  mood: '#E8A94A',
  
  // UI
  accent: '#2EBD6B',
  accentDark: '#1FA85C',
  dark: '#2D2A26',
  darkAlt: '#4A4540',
  danger: '#E8634A',
  
  // Auth specific
  authGradientStart: '#2D2A26',
  authGradientEnd: '#4A4540',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};
`;

// ─── COACHING CONTENT DATA ────────────────────────────────────

const CONTENT_DATA = `
export const COACHING_CONTENT = {
  boss: {
    title: 'Boss Coaching',
    emoji: '👔',
    color: '#E8634A',
    sections: [
      {
        title: 'First Principles',
        icon: '🗺️',
        items: [
          { title: 'Understand Their Pressures', desc: "Your boss has a boss too. Learn what metrics and goals they're measured on — it changes how you interpret their behavior." },
          { title: 'Be Predictably Reliable', desc: "Consistency beats brilliance. Show up on time, deliver what you promise, and communicate early when you can't." },
          { title: 'Manage Up, Not Around', desc: "Give your boss what they need before they ask. Anticipate questions, prep solutions, and make their job easier." },
          { title: 'Read the Room', desc: "Learn to sense when it's a good time to pitch an idea vs. when to stay quiet. Timing is everything." },
        ],
      },
      {
        title: 'Favorite Extremes',
        icon: '⚡',
        items: [
          { title: 'Radical Transparency', desc: "Share bad news fast. Bosses respect the person who tells them about problems early, not the one who hides them." },
          { title: 'Over-Communicate Progress', desc: 'Send brief weekly updates even if not asked. "Here\\'s what I did, what\\'s next, where I need help."' },
          { title: 'Ask for Feedback Directly', desc: 'Don\\'t wait for reviews. Ask: "What\\'s one thing I could do better this week?" It shows ambition and humility.' },
          { title: 'Take the Tough Assignment', desc: "Volunteer for the project nobody wants. It's the fastest way to build trust and prove your value." },
        ],
      },
      {
        title: 'Triangulation',
        icon: '📐',
        items: [
          { title: 'The Silent Treatment', desc: 'Your boss seems distant after a meeting. Before panicking: check if they\\'re stressed about something else. Ask a trusted coworker. Then approach with "Is there anything I can help with?"' },
          { title: 'The Contradicting Directive', desc: 'Your boss says one thing Monday, another Thursday. Document what was said, then clarify: "I want to make sure I\\'m aligned — last week you mentioned X, and today Y. Which should I prioritize?"' },
          { title: 'The Public Criticism', desc: 'Your boss corrects you in front of others. Stay calm in the moment, then request a private follow-up: "I\\'d love to understand that feedback better — can we chat for 5 minutes?"' },
        ],
      },
      {
        title: 'Human Help',
        icon: '🤝',
        items: [
          { title: 'Find a Boss Whisperer', desc: "Identify someone who's worked with your boss for years. They know the patterns, triggers, and preferences." },
          { title: 'Mirror Their Style', desc: "If your boss sends short emails, don't write novels. If they love data, bring charts. Adapt your communication style." },
          { title: 'Build Micro-Trust', desc: "Small wins compound. Nail the small tasks first — they're auditions for the big ones." },
          { title: 'Celebrate Their Wins', desc: "Acknowledge when your boss does something well. People rarely thank their managers, and it builds genuine goodwill." },
        ],
      },
    ],
  },
  teammates: {
    title: 'Teammates Coaching',
    emoji: '🤜',
    color: '#4A90D9',
    sections: [
      {
        title: 'Casual Favors',
        icon: '☕',
        items: [
          { title: 'The Coffee Run', desc: '"I\\'m grabbing coffee, want anything?" — the simplest relationship builder in any office.' },
          { title: 'Cover Without Being Asked', desc: 'Notice when a teammate is swamped and offer to help. "I have bandwidth — want me to take that meeting recap?"' },
          { title: 'Share the Spotlight', desc: 'In meetings, credit teammates publicly: "This was actually Sarah\\'s idea" goes a long way.' },
          { title: 'Remember Their Preferences', desc: "Oat milk? Tea not coffee? These tiny details signal that you see them as a person, not just a coworker." },
        ],
      },
      {
        title: 'Five Year Rulers',
        icon: '📏',
        items: [
          { title: 'Think Long-Term', desc: "The teammate you help today might be your future manager, business partner, or reference. Invest in relationships for the long game." },
          { title: 'Stay Curious About Their Goals', desc: 'Ask: "Where do you want to be in a few years?" Then remember it. Check in on their progress months later.' },
          { title: 'Be the Connector', desc: "If you know someone who can help a teammate's career, make the introduction. Being a connector makes you invaluable." },
        ],
      },
      {
        title: 'Walk with Me',
        icon: '🚶',
        items: [
          { title: 'Walking Meetings', desc: "Suggest a walk instead of a conference room. Movement reduces tension and creates more honest conversations." },
          { title: 'Lunch Beyond Your Desk', desc: "Eating alone is fine sometimes, but eating with teammates builds bonds that Slack can't replicate." },
          { title: 'Commute Buddies', desc: "If you share a commute route, travel together sometimes. Some of the best work conversations happen off the clock." },
          { title: 'After-Hours Without Pressure', desc: "Invite teammates to low-key hangouts. No pressure to attend, no awkwardness if they skip." },
        ],
      },
    ],
  },
  classmates: {
    title: 'Classmates Coaching',
    emoji: '🎓',
    color: '#6B5CE7',
    sections: [
      {
        title: 'Know My Birthday',
        icon: '🎂',
        items: [
          { title: 'Deepen Existing Bonds', desc: "These are your close work friends. Invest in them — they're your safety net when work gets hard." },
          { title: 'Be Vulnerable First', desc: "Share a struggle or failure. It gives them permission to do the same and deepens the relationship." },
          { title: 'Create Traditions', desc: "Friday coffee, monthly lunch, annual team dinner. Traditions create a sense of belonging." },
          { title: 'Support Outside Work', desc: "Show up for their life events — promotions, moves, tough days. Be a complete friend, not just a work friend." },
        ],
      },
      {
        title: 'Know My Name',
        icon: '👋',
        items: [
          { title: 'Move Beyond Small Talk', desc: 'Go from "How was your weekend?" to "What are you working on that excites you?" — questions that show genuine interest.' },
          { title: 'Find Shared Interests', desc: "Sports, music, hobbies, food — find the overlap and use it as a bridge to deeper connection." },
          { title: 'Ask for Their Expertise', desc: 'Everyone has a superpower. Asking for help is a compliment. "You\\'re great at presentations — can I get your feedback?"' },
          { title: 'Be Consistent', desc: "Don't be the person who's friendly one week and invisible the next. Consistency builds trust." },
        ],
      },
      {
        title: "Don't Know Me",
        icon: '🙈',
        items: [
          { title: 'Start with a Smile', desc: "A genuine smile and nod in the hallway costs nothing and signals warmth. Don't underestimate it." },
          { title: 'Learn Names First', desc: "Make an effort to learn everyone's name on your floor. Use it when you greet them. People love hearing their name." },
          { title: 'Ask One Real Question', desc: 'Move past "How are you?" with: "Have you been here long?" or "What team are you on?" — one question opens the door.' },
          { title: 'Find the Connectors', desc: "Every office has social hubs — people who know everyone. Befriend them and you'll naturally expand your network." },
        ],
      },
    ],
  },
  humanHelp: {
    title: 'Human Help',
    emoji: '💬',
    color: '#2EBD6B',
    sections: [
      {
        title: 'Ask a Mentor for a Tip',
        icon: '🧑‍🏫',
        items: [
          { title: 'Be Specific', desc: 'Don\\'t ask "Any advice?" Ask: "How would you handle a boss who micromanages?" Specific questions get specific, useful answers.' },
          { title: 'Prepare Your Story', desc: "Before reaching out, write down the situation in 3 sentences. Context helps mentors give better advice." },
          { title: 'Follow Up with Results', desc: "After trying their advice, report back. Mentors love knowing their guidance helped — and it keeps the relationship alive." },
        ],
      },
      {
        title: 'Ask a Peer for a Tip',
        icon: '👥',
        items: [
          { title: 'Shared Experience = Better Advice', desc: "Peers going through the same thing understand nuance that mentors might miss." },
          { title: 'No Judgment Zone', desc: 'Peer advice feels safer. You can say "I feel lost" without worrying about looking incompetent.' },
          { title: 'Trade Tips Regularly', desc: 'Create a culture of sharing. "Here\\'s what worked for me" exchanges benefit everyone.' },
        ],
      },
      {
        title: 'Ask All of Us — Anonymous',
        icon: '🎭',
        items: [
          { title: 'Total Anonymity', desc: "Your identity is never revealed. Ask the question you're too embarrassed to ask out loud." },
          { title: 'Community Wisdom', desc: "Dozens of people who've been in your shoes can offer perspectives you'd never get from one person." },
          { title: 'Be Respectful', desc: "Anonymity is a privilege. Keep questions genuine and responses constructive." },
          { title: 'Pay It Forward', desc: "When you've navigated a tough situation, come back and answer questions for others. That's how we all grow." },
        ],
      },
    ],
  },
};

export const MOOD_SCALES = [
  { id: 1, left: 'Friendly', right: 'Hostile', leftEmoji: '😊', rightEmoji: '😤', color: '#2EBD6B' },
  { id: 2, left: 'Patient', right: 'Pushy', leftEmoji: '🧘', rightEmoji: '⏱️', color: '#4A90D9' },
  { id: 3, left: 'Courageous', right: 'Fearful', leftEmoji: '🦁', rightEmoji: '😰', color: '#E8634A' },
  { id: 4, left: 'Open', right: 'Closed', leftEmoji: '🔓', rightEmoji: '🔒', color: '#6B5CE7' },
  { id: 5, left: 'Empowering', right: 'Controlling', leftEmoji: '🚀', rightEmoji: '🎛️', color: '#E8A94A' },
];
`;

// ─── TAB LAYOUT ──────────────────────────────────────────────

const TABS_LAYOUT = `import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

const COLORS = {
  background: '#FAF7F2',
  text: '#2D2A26',
  textMuted: '#8A847A',
  accent: '#2EBD6B',
  border: 'rgba(0,0,0,0.06)',
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.text,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 64,
          ...(Platform.OS === 'web' ? {
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: [{ translateX: -215 }],
            maxWidth: 430,
            width: '100%',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          } : {}),
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Coach',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="checkin"
        options={{
          title: 'Mood',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📊" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="coaching"
        options={{
          title: 'Community',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🎭" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ emoji, focused }) {
  const { Text, View } = require('react-native');
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{
        fontSize: 22,
        opacity: focused ? 1 : 0.45,
      }}>
        {emoji}
      </Text>
    </View>
  );
}
`;

// ─── HOME / COACH SCREEN ─────────────────────────────────────

const HOME_SCREEN = `import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
} from 'react-native';
import { COACHING_CONTENT } from '../../src/data/content';
import { useAuth } from '../../src/hooks/useAuth';

export default function HomeScreen() {
  const { profile } = useAuth();
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);

  const displayName = profile?.display_name
    || profile?.email?.split('@')[0]
    || 'friend';

  const categories = Object.entries(COACHING_CONTENT);

  const toggleCategory = (key) => {
    setExpandedCategory(expandedCategory === key ? null : key);
    setExpandedSection(null);
    setExpandedItem(null);
  };

  const toggleSection = (idx) => {
    setExpandedSection(expandedSection === idx ? null : idx);
    setExpandedItem(null);
  };

  const toggleItem = (idx) => {
    setExpandedItem(expandedItem === idx ? null : idx);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerLabel}>VIBE WORKING</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome */}
        <View style={styles.welcome}>
          <Text style={styles.welcomeTitle}>
            Your Coaching{String.fromCharCode(10)}Toolkit
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Navigate workplace relationships with confidence
          </Text>
        </View>

        {/* Category Cards */}
        {categories.map(([key, cat]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.categoryCard,
              { backgroundColor: cat.color + '12', borderColor: cat.color + '25' },
            ]}
            onPress={() => toggleCategory(key)}
            activeOpacity={0.7}
          >
            <View style={styles.categoryRow}>
              <View style={styles.categoryLeft}>
                <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                </View>
                <View>
                  <Text style={styles.categoryTitle}>{cat.title}</Text>
                  <Text style={styles.categoryMeta}>
                    {cat.sections.length} sections · {cat.sections.reduce((a, s) => a + s.items.length, 0)} tips
                  </Text>
                </View>
              </View>
              <Text style={[styles.chevron, expandedCategory === key && styles.chevronOpen]}>
                ›
              </Text>
            </View>

            {/* Expanded Sections */}
            {expandedCategory === key && (
              <View style={styles.sectionsContainer}>
                {cat.sections.map((section, si) => (
                  <View key={si}>
                    <TouchableOpacity
                      style={styles.sectionCard}
                      onPress={() => toggleSection(si)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.sectionRow}>
                        <View style={styles.sectionLeft}>
                          <Text style={styles.sectionIcon}>{section.icon}</Text>
                          <View>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            <Text style={styles.sectionMeta}>
                              {section.items.length} strategies
                            </Text>
                          </View>
                        </View>
                        <View style={[styles.badge, { backgroundColor: cat.color + '18' }]}>
                          <Text style={[styles.badgeText, { color: cat.color }]}>
                            {section.items.length}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {/* Expanded Items */}
                    {expandedSection === si && (
                      <View style={styles.itemsContainer}>
                        {section.items.map((item, ii) => (
                          <TouchableOpacity
                            key={ii}
                            style={[
                              styles.itemCard,
                              expandedItem === ii && {
                                borderLeftColor: cat.color,
                                borderLeftWidth: 3,
                              },
                            ]}
                            onPress={() => toggleItem(ii)}
                            activeOpacity={0.8}
                          >
                            <View style={styles.itemHeader}>
                              <Text style={styles.itemTitle}>{item.title}</Text>
                              <Text style={[
                                styles.itemChevron,
                                expandedItem === ii && styles.itemChevronOpen,
                              ]}>
                                ›
                              </Text>
                            </View>
                            {expandedItem === ii && (
                              <Text style={styles.itemDesc}>{item.desc}</Text>
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 8,
    paddingBottom: 16,
    backgroundColor: '#FAF7F2',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B5B0A8',
    letterSpacing: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8A94A',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  welcome: {
    marginTop: 8,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2D2A26',
    lineHeight: 34,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#8A847A',
    marginTop: 8,
    lineHeight: 21,
  },
  categoryCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1.5,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D2A26',
  },
  categoryMeta: {
    fontSize: 12,
    color: '#8A847A',
    marginTop: 2,
  },
  chevron: {
    fontSize: 20,
    color: '#C5C0B8',
  },
  chevronOpen: {
    color: '#2D2A26',
  },
  sectionsContainer: {
    marginTop: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  sectionIcon: {
    fontSize: 22,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D2A26',
  },
  sectionMeta: {
    fontSize: 12,
    color: '#8A847A',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  itemsContainer: {
    marginBottom: 8,
    paddingLeft: 4,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D2A26',
    flex: 1,
  },
  itemChevron: {
    fontSize: 14,
    color: '#C5C0B8',
  },
  itemChevronOpen: {
    color: '#2D2A26',
  },
  itemDesc: {
    fontSize: 14,
    lineHeight: 22,
    color: '#5C5750',
    marginTop: 10,
  },
});
`;

// ─── MOOD / CHECK-IN SCREEN ─────────────────────────────────

const CHECKIN_SCREEN = `import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  SafeAreaView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { MOOD_SCALES } from '../../src/data/content';

export default function CheckinScreen() {
  const [values, setValues] = useState({ 1: 50, 2: 50, 3: 50, 4: 50, 5: 50 });
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSave = () => {
    setHistory(prev => [
      ...prev,
      { values: { ...values }, note, date: new Date().toLocaleDateString() },
    ]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setNote('');
  };

  const getMoodLabel = (value, scale) => {
    if (value <= 30) return scale.left;
    if (value >= 70) return scale.right;
    return 'Neutral';
  };

  const getMoodEmoji = (value, scale) => {
    if (value <= 30) return scale.leftEmoji;
    if (value >= 70) return scale.rightEmoji;
    return '😐';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>VIBE WORKING</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>📊 Boss Mood Tracker</Text>
        <Text style={styles.subtitle}>
          Rate your boss's mood today. Track patterns over time.
        </Text>

        {MOOD_SCALES.map((scale) => (
          <View key={scale.id} style={styles.moodCard}>
            <View style={styles.moodLabels}>
              <Text style={[styles.moodLabel, { color: scale.color }]}>
                {scale.leftEmoji} {scale.left}
              </Text>
              <Text style={[styles.moodLabel, { color: '#8A847A' }]}>
                {scale.right} {scale.rightEmoji}
              </Text>
            </View>

            {Platform.OS === 'web' ? (
              <input
                type="range"
                min="0"
                max="100"
                value={values[scale.id]}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [scale.id]: +e.target.value }))
                }
                style={{
                  width: '100%',
                  height: 6,
                  borderRadius: 3,
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  background: 'linear-gradient(90deg, ' + scale.color + ' 0%, #E5E1DB 50%, ' + scale.color + '60 100%)',
                  outline: 'none',
                  cursor: 'pointer',
                  accentColor: scale.color,
                }}
              />
            ) : (
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={100}
                value={values[scale.id]}
                onValueChange={(v) =>
                  setValues((prev) => ({ ...prev, [scale.id]: Math.round(v) }))
                }
                minimumTrackTintColor={scale.color}
                maximumTrackTintColor="#E5E1DB"
                thumbTintColor={scale.color}
              />
            )}

            <Text style={[styles.moodEmoji, { color: scale.color }]}>
              {getMoodEmoji(values[scale.id], scale)}
            </Text>
          </View>
        ))}

        {/* Note Input */}
        <TextInput
          style={styles.noteInput}
          placeholder="Add a note... (e.g., Boss had a tough meeting)"
          placeholderTextColor="#B5B0A8"
          value={note}
          onChangeText={setNote}
          multiline
        />

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, saved && styles.saveButtonSaved]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {saved ? '✓ Saved!' : "Save Today's Entry"}
          </Text>
        </TouchableOpacity>

        {/* History */}
        {history.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>Recent Entries</Text>
            {history.slice().reverse().map((entry, i) => (
              <View key={i} style={styles.historyCard}>
                <Text style={styles.historyDate}>{entry.date}</Text>
                <View style={styles.historyTags}>
                  {MOOD_SCALES.map((s) => (
                    <View
                      key={s.id}
                      style={[
                        styles.historyTag,
                        { backgroundColor: s.color + '12' },
                      ]}
                    >
                      <Text style={[styles.historyTagText, { color: s.color }]}>
                        {getMoodLabel(entry.values[s.id], s)}
                      </Text>
                    </View>
                  ))}
                </View>
                {entry.note ? (
                  <Text style={styles.historyNote}>"{entry.note}"</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 8,
    paddingBottom: 16,
    backgroundColor: '#FAF7F2',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B5B0A8',
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2D2A26',
    marginTop: 12,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#8A847A',
    marginBottom: 20,
    lineHeight: 18,
  },
  moodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  moodLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  moodLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  moodEmoji: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 8,
  },
  noteInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    padding: 14,
    fontSize: 14,
    color: '#2D2A26',
    minHeight: 70,
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  saveButton: {
    backgroundColor: '#2D2A26',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonSaved: {
    backgroundColor: '#2EBD6B',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  historySection: {
    marginTop: 28,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D2A26',
    marginBottom: 14,
  },
  historyCard: {
    backgroundColor: '#FEFDFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  historyDate: {
    fontSize: 12,
    color: '#8A847A',
    fontWeight: '600',
    marginBottom: 8,
  },
  historyTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  historyTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  historyTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  historyNote: {
    fontSize: 13,
    color: '#5C5750',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
`;

// ─── COMMUNITY / ASK SCREEN ─────────────────────────────────

const COACHING_SCREEN = `import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  SafeAreaView,
} from 'react-native';

const SAMPLE_QUESTIONS = [
  { q: "My boss takes credit for my ideas in meetings. How do I handle this without making it awkward?", answers: 7, votes: 23, category: 'boss', time: '2h ago' },
  { q: "Is it weird to eat lunch alone every day? I feel like everyone has their groups already.", answers: 12, votes: 41, category: 'classmates', time: '5h ago' },
  { q: "How do you set boundaries with a teammate who constantly vents about work?", answers: 5, votes: 18, category: 'teammates', time: '1d ago' },
  { q: "First week at my job and I accidentally called my manager by the wrong name. Twice. Is my career over?", answers: 15, votes: 52, category: 'boss', time: '2d ago' },
];

const CAT_COLORS = {
  boss: '#E8634A',
  teammates: '#4A90D9',
  classmates: '#6B5CE7',
  general: '#2EBD6B',
};

export default function CoachingScreen() {
  const [questions, setQuestions] = useState(SAMPLE_QUESTIONS);
  const [showNew, setShowNew] = useState(false);
  const [newQ, setNewQ] = useState('');
  const [voted, setVoted] = useState({});

  const handleSubmit = () => {
    if (!newQ.trim()) return;
    setQuestions(prev => [
      { q: newQ, answers: 0, votes: 0, category: 'general', time: 'just now' },
      ...prev,
    ]);
    setNewQ('');
    setShowNew(false);
  };

  const handleVote = (index) => {
    if (voted[index]) return;
    setVoted(v => ({ ...v, [index]: true }));
    setQuestions(prev =>
      prev.map((q, j) => (j === index ? { ...q, votes: q.votes + 1 } : q))
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>VIBE WORKING</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>🎭 Ask All of Us</Text>
        <Text style={styles.subtitle}>
          Anonymous questions. Real answers from people who get it.
        </Text>

        {/* New Question Form */}
        {showNew && (
          <View style={styles.newCard}>
            <TextInput
              style={styles.newInput}
              placeholder="What's on your mind? (100% anonymous)"
              placeholderTextColor="#B5B0A8"
              value={newQ}
              onChangeText={setNewQ}
              multiline
              autoFocus
            />
            <View style={styles.newActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowNew(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.postButton,
                  !newQ.trim() && styles.postButtonDisabled,
                ]}
                onPress={handleSubmit}
              >
                <Text
                  style={[
                    styles.postText,
                    !newQ.trim() && styles.postTextDisabled,
                  ]}
                >
                  Post Anonymously
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Ask Button */}
        {!showNew && (
          <TouchableOpacity
            style={styles.askButton}
            onPress={() => setShowNew(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.askButtonText}>+ Ask a Question</Text>
          </TouchableOpacity>
        )}

        {/* Questions List */}
        {questions.map((item, i) => (
          <View key={i} style={styles.questionCard}>
            <View style={styles.questionTop}>
              <View
                style={[
                  styles.catBadge,
                  { backgroundColor: (CAT_COLORS[item.category] || '#8A847A') + '18' },
                ]}
              >
                <Text
                  style={[
                    styles.catBadgeText,
                    { color: CAT_COLORS[item.category] || '#8A847A' },
                  ]}
                >
                  {item.category}
                </Text>
              </View>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>

            <Text style={styles.questionText}>{item.q}</Text>

            <View style={styles.questionBottom}>
              <TouchableOpacity
                style={[
                  styles.voteButton,
                  voted[i] && styles.voteButtonActive,
                ]}
                onPress={() => handleVote(i)}
              >
                <Text
                  style={[
                    styles.voteText,
                    voted[i] && styles.voteTextActive,
                  ]}
                >
                  ▲ {item.votes}
                </Text>
              </TouchableOpacity>
              <Text style={styles.answerCount}>
                💬 {item.answers} {item.answers === 1 ? 'answer' : 'answers'}
              </Text>
            </View>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 8,
    paddingBottom: 16,
    backgroundColor: '#FAF7F2',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B5B0A8',
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2D2A26',
    marginTop: 12,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#8A847A',
    marginBottom: 16,
    lineHeight: 18,
  },
  askButton: {
    backgroundColor: '#2EBD6B',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  askButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  newCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  newInput: {
    backgroundColor: '#FAF7F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    padding: 12,
    fontSize: 14,
    color: '#2D2A26',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  newActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    padding: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#8A847A',
    fontSize: 14,
    fontWeight: '600',
  },
  postButton: {
    flex: 2,
    backgroundColor: '#2EBD6B',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#E5E1DB',
  },
  postText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  postTextDisabled: {
    color: '#8A847A',
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  questionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  catBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  catBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 11,
    color: '#B5B0A8',
  },
  questionText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#2D2A26',
    fontWeight: '500',
    marginBottom: 12,
  },
  questionBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  voteButton: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  voteButtonActive: {
    backgroundColor: '#2EBD6B15',
    borderColor: '#2EBD6B30',
  },
  voteText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8A847A',
  },
  voteTextActive: {
    color: '#2EBD6B',
  },
  answerCount: {
    fontSize: 12,
    color: '#8A847A',
  },
});
`;

// ─── PROFILE SCREEN ──────────────────────────────────────────

const PROFILE_SCREEN = `import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAuth } from '../../src/hooks/useAuth';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  const displayName = profile?.display_name
    || profile?.email?.split('@')[0]
    || 'User';

  const handleSignOut = async () => {
    if (Platform.OS === 'web') {
      if (confirm('Sign out of Vibe Working?')) {
        await signOut();
        router.replace('/(auth)/login');
      }
    } else {
      Alert.alert('Sign Out', 'Sign out of Vibe Working?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>VIBE WORKING</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profileEmail}>{user?.email || ''}</Text>
          <View style={styles.tierBadge}>
            <Text style={styles.tierBadgeText}>
              {profile?.subscription_tier === 'pro' ? '⭐ Pro' : '🌱 Free'}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statNumber}>
              {profile?.streak_count || 0}
            </Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📊</Text>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Mood Logs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>💬</Text>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Questions</Text>
          </View>
        </View>

        {/* Account Info */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.infoCard}>
          <InfoRow label="Job Title" value={profile?.job_title || 'Not set'} />
          <InfoRow label="Industry" value={profile?.industry || 'Not set'} />
          <InfoRow
            label="Member Since"
            value={
              user?.created_at
                ? new Date(user.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })
                : '—'
            }
          />
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 8,
    paddingBottom: 16,
    backgroundColor: '#FAF7F2',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B5B0A8',
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    marginTop: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E8A94A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarLargeText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D2A26',
  },
  profileEmail: {
    fontSize: 14,
    color: '#8A847A',
    marginTop: 4,
  },
  tierBadge: {
    backgroundColor: '#E8A94A18',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 12,
  },
  tierBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E8A94A',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D2A26',
  },
  statLabel: {
    fontSize: 11,
    color: '#8A847A',
    marginTop: 2,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D2A26',
    marginTop: 28,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  infoLabel: {
    fontSize: 14,
    color: '#8A847A',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#2D2A26',
    fontWeight: '600',
  },
  signOutButton: {
    marginTop: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E8634A30',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#E8634A08',
  },
  signOutText: {
    color: '#E8634A',
    fontSize: 16,
    fontWeight: '700',
  },
});
`;

// ─── AUTH: LOGIN SCREEN ──────────────────────────────────────

const LOGIN_SCREEN = `import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { supabase } from '../../src/lib/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setLoading(true);
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo Area */}
          <View style={styles.logoArea}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>VW</Text>
            </View>
            <Text style={styles.appName}>Vibe Working</Text>
            <Text style={styles.tagline}>
              Your daily coaching companion for workplace wellness
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor="#B5B0A8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#B5B0A8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Link href="/(auth)/forgot-password" asChild>
              <TouchableOpacity style={styles.forgotLink}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.googleButtonText}>
                Continue with Google
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={styles.bottomLink}>
            <Text style={styles.bottomText}>Don't have an account? </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.bottomLinkText}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2D2A26',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: '#E8A94A',
    fontSize: 24,
    fontWeight: '800',
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2D2A26',
  },
  tagline: {
    fontSize: 14,
    color: '#8A847A',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  errorBox: {
    backgroundColor: '#E8634A12',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8634A25',
  },
  errorText: {
    color: '#E8634A',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5C5750',
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#FAF7F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    padding: 14,
    fontSize: 15,
    color: '#2D2A26',
    marginBottom: 12,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: '#E8A94A',
    fontSize: 13,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#2D2A26',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  dividerText: {
    color: '#B5B0A8',
    fontSize: 13,
    marginHorizontal: 16,
    fontWeight: '500',
  },
  googleButton: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.1)',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  googleButtonText: {
    color: '#2D2A26',
    fontSize: 15,
    fontWeight: '600',
  },
  bottomLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  bottomText: {
    color: '#8A847A',
    fontSize: 14,
  },
  bottomLinkText: {
    color: '#E8A94A',
    fontSize: 14,
    fontWeight: '700',
  },
});
`;

// ─── AUTH: SIGNUP SCREEN ─────────────────────────────────────

const SIGNUP_SCREEN = `import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { supabase } from '../../src/lib/supabase';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    const { error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoArea}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>VW</Text>
            </View>
            <Text style={styles.appName}>Create Account</Text>
            <Text style={styles.tagline}>
              Join the community of new professionals
            </Text>
          </View>

          <View style={styles.formCard}>
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor="#B5B0A8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="At least 6 characters"
              placeholderTextColor="#B5B0A8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor="#B5B0A8"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomLink}>
            <Text style={styles.bottomText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.bottomLinkText}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF7F2' },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  logoArea: { alignItems: 'center', marginBottom: 36 },
  logoCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#2D2A26', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  logoText: { color: '#E8A94A', fontSize: 24, fontWeight: '800' },
  appName: { fontSize: 28, fontWeight: '800', color: '#2D2A26' },
  tagline: { fontSize: 14, color: '#8A847A', marginTop: 8, textAlign: 'center' },
  formCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  errorBox: { backgroundColor: '#E8634A12', borderRadius: 10, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#E8634A25' },
  errorText: { color: '#E8634A', fontSize: 13, fontWeight: '500', textAlign: 'center' },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#5C5750', marginBottom: 6, marginTop: 4 },
  input: { backgroundColor: '#FAF7F2', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', padding: 14, fontSize: 15, color: '#2D2A26', marginBottom: 12 },
  primaryButton: { backgroundColor: '#2D2A26', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  bottomLink: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  bottomText: { color: '#8A847A', fontSize: 14 },
  bottomLinkText: { color: '#E8A94A', fontSize: 14, fontWeight: '700' },
});
`;

// ─── AUTH: FORGOT PASSWORD ───────────────────────────────────

const FORGOT_SCREEN = `import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '../../src/lib/supabase';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (!email) { setError('Please enter your email'); return; }
    setLoading(true);
    setError('');
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (authError) { setError(authError.message); setLoading(false); }
    else { setSent(true); setLoading(false); }
  };

  if (sent) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>📬</Text>
          <Text style={styles.appName}>Check Your Email</Text>
          <Text style={[styles.tagline, { marginBottom: 28 }]}>
            We sent a password reset link to {email}
          </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Back to Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Text style={styles.appName}>Reset Password</Text>
        <Text style={[styles.tagline, { marginBottom: 28 }]}>
          Enter your email and we'll send you a reset link
        </Text>

        <View style={styles.formCard}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            placeholderTextColor="#B5B0A8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleReset}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomLink}>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.bottomLinkText}>← Back to Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF7F2' },
  center: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  appName: { fontSize: 24, fontWeight: '800', color: '#2D2A26', textAlign: 'center' },
  tagline: { fontSize: 14, color: '#8A847A', marginTop: 8, textAlign: 'center', lineHeight: 20 },
  formCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  errorBox: { backgroundColor: '#E8634A12', borderRadius: 10, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#E8634A25' },
  errorText: { color: '#E8634A', fontSize: 13, fontWeight: '500', textAlign: 'center' },
  input: { backgroundColor: '#FAF7F2', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', padding: 14, fontSize: 15, color: '#2D2A26', marginBottom: 16 },
  primaryButton: { backgroundColor: '#2D2A26', borderRadius: 14, padding: 16, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  bottomLink: { alignItems: 'center', marginTop: 24 },
  bottomLinkText: { color: '#E8A94A', fontSize: 14, fontWeight: '700' },
});
`;

// ─── WRITE ALL FILES ─────────────────────────────────────────

const BASE = path.join(__dirname, '..');

// Data files
writeFile(path.join(BASE, 'src', 'data', 'content.ts'), CONTENT_DATA);
writeFile(path.join(BASE, 'src', 'theme', 'colors.ts'), THEME);

// Tab screens
writeFile(path.join(BASE, 'app', '(tabs)', '_layout.tsx'), TABS_LAYOUT);
writeFile(path.join(BASE, 'app', '(tabs)', 'index.tsx'), HOME_SCREEN);
writeFile(path.join(BASE, 'app', '(tabs)', 'checkin.tsx'), CHECKIN_SCREEN);
writeFile(path.join(BASE, 'app', '(tabs)', 'coaching.tsx'), COACHING_SCREEN);
writeFile(path.join(BASE, 'app', '(tabs)', 'profile.tsx'), PROFILE_SCREEN);

// Auth screens
writeFile(path.join(BASE, 'app', '(auth)', 'login.tsx'), LOGIN_SCREEN);
writeFile(path.join(BASE, 'app', '(auth)', 'signup.tsx'), SIGNUP_SCREEN);
writeFile(path.join(BASE, 'app', '(auth)', 'forgot-password.tsx'), FORGOT_SCREEN);

console.log('');
console.log('=== DESIGN UPDATE COMPLETE ===');
console.log('');
console.log('Files updated:');
console.log('  src/data/content.ts     — Coaching content & mood scales');
console.log('  src/theme/colors.ts     — Design system colors');
console.log('  app/(tabs)/_layout.tsx  — New tab bar with emoji icons');
console.log('  app/(tabs)/index.tsx    — Coach home (expandable categories)');
console.log('  app/(tabs)/checkin.tsx  — Boss Mood Tracker');
console.log('  app/(tabs)/coaching.tsx — Ask All of Us (anonymous Q&A)');
console.log('  app/(tabs)/profile.tsx  — Redesigned profile');
console.log('  app/(auth)/login.tsx    — Warm theme login');
console.log('  app/(auth)/signup.tsx   — Warm theme signup');
console.log('  app/(auth)/forgot-password.tsx — Warm theme forgot pw');
console.log('');
console.log('IMPORTANT: The Mood Tracker uses a slider. Install it:');
console.log('  npx expo install @react-native-community/slider');
console.log('');
console.log('Then restart:');
console.log('  npx expo start --clear');
console.log('');
