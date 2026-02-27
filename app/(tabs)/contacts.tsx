/**
 * Circle of Contacts — Mypl.ai
 * Contact counts by category (Family, Extended Family, Friends, Extended Friends, Work Colleagues).
 * Capacities based on Dunbar-style social layers.
 */
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { CONTACT_CATEGORIES, type ContactCategorySlug } from '../../src/data/contactCategories';
import { colors } from '../../src/theme';

const AVERAGE_CONTACTS = 700;

function getHealthLabel(pct: number): { label: string; color: string } {
  if (pct === 0) return { label: 'Empty', color: '#666' };
  if (pct < 40) return { label: 'Sparse', color: '#FF6B6B' };
  if (pct < 70) return { label: 'Growing', color: '#FF9F43' };
  if (pct <= 100) return { label: 'Healthy', color: '#48C9B0' };
  return { label: 'Overloaded', color: '#FF6B6B' };
}

function getDaysLeft(lastReset: number): number {
  const diff = Date.now() - lastReset;
  const daysPassed = Math.floor(diff / (1000 * 60 * 60 * 24));
  return Math.max(0, 7 - daysPassed);
}

const CHART_SIZE = Platform.OS === 'web' ? 280 : 220;
const CX = CHART_SIZE / 2;
const CY = CHART_SIZE / 2;
const MAX_R = CHART_SIZE / 2 - 24;
const MIN_R = 20;
const RINGS = CONTACT_CATEGORIES.length;

function RadialChart({
  categoryCounts,
  totalLabel,
}: {
  categoryCounts: Record<ContactCategorySlug, number>;
  totalLabel?: number;
}) {
  const total =
    totalLabel ??
    Object.values(categoryCounts).reduce((a, b) => a + (b ?? 0), 0);
  return (
    <View style={styles.chartWrap}>
      {CONTACT_CATEGORIES.map((cat, i) => {
        const idx = RINGS - 1 - i;
        const r = MIN_R + ((MAX_R - MIN_R) / RINGS) * (idx + 1);
        const strokeWidth = RINGS - idx < 3 ? 10 : 14;
        return (
          <View
            key={cat.slug}
            style={[
              styles.ring,
              {
                width: r * 2,
                height: r * 2,
                borderRadius: r,
                left: CX - r,
                top: CY - r,
                borderWidth: strokeWidth,
                borderColor: cat.color,
                opacity: 0.35,
              },
            ]}
          />
        );
      })}
      <View style={styles.chartCenter} pointerEvents="none">
        <Text style={styles.chartTotal}>{total}</Text>
        <Text style={styles.chartTotalLabel}>TOTAL</Text>
      </View>
    </View>
  );
}

const initialCounts = (): Record<ContactCategorySlug, number> => {
  const o: Record<string, number> = {};
  CONTACT_CATEGORIES.forEach((c) => {
    o[c.slug] = 0;
  });
  return o as Record<ContactCategorySlug, number>;
};

export default function ContactsScreen() {
  const [counts, setCounts] = useState(initialCounts);
  const [active, setActive] = useState<ContactCategorySlug | null>(null);
  const [mounted, setMounted] = useState(false);
  const [newThisWeek, setNewThisWeek] = useState(0);
  const [weeklyInput, setWeeklyInput] = useState(0);
  const [lastReset, setLastReset] = useState(Date.now());
  const [daysLeft, setDaysLeft] = useState(7);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const check = () => {
      const days = getDaysLeft(lastReset);
      setDaysLeft(days);
      if (days === 0) {
        setNewThisWeek(0);
        setWeeklyInput(0);
        setLastReset(Date.now());
        setDaysLeft(7);
      }
    };
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [lastReset]);

  const categoryTotal = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0);
  const myContacts = categoryTotal + newThisWeek;
  const vsAverage =
    myContacts > 0 ? Math.round((myContacts / AVERAGE_CONTACTS) * 100) : 0;
  const aboveAverage = myContacts > AVERAGE_CONTACTS;

  const totalHealth = (() => {
    let score = 0;
    CONTACT_CATEGORIES.forEach((cat) => {
      const pct = (counts[cat.slug] ?? 0) / cat.capacity;
      const capped = Math.min(pct, 1);
      score += capped * (1 / CONTACT_CATEGORIES.length);
    });
    return Math.round(score * 100);
  })();

  const healthColor =
    totalHealth > 70
      ? colors.success
      : totalHealth > 40
        ? colors.logoOrange
        : colors.error;
  const healthMessage =
    totalHealth === 0
      ? 'start adding'
      : totalHealth < 40
        ? 'room to grow'
        : totalHealth < 70
          ? 'building up'
          : totalHealth < 90
            ? 'well connected'
            : 'fully networked';

  const handleAddWeekly = () => {
    const v = Math.max(0, parseInt(String(weeklyInput), 10) || 0);
    setNewThisWeek((prev) => prev + v);
    setWeeklyInput(0);
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.brand}>MYPL.AI · RELATIONSHIP INTELLIGENCE</Text>
        <Text style={styles.title}>Circle of Contacts</Text>
        <Text style={styles.subtitle}>
          More relationships. More everything.
        </Text>
      </View>

      <View style={styles.twoCol}>
        <View style={styles.leftCol}>
          <View style={{ opacity: mounted ? 1 : 0 }}>
            <RadialChart categoryCounts={counts} totalLabel={myContacts} />
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>MY CONTACTS</Text>
              <Text style={styles.statValue}>{myContacts}</Text>
              <Text style={styles.statSub}>
                {myContacts === 1 ? 'contact' : 'contacts'}
              </Text>
            </View>
            <View style={[styles.statBox, { borderColor: healthColor + '44' }]}>
              <Text style={styles.statLabel}>HEALTH</Text>
              <Text style={[styles.statValue, { color: healthColor }]}>
                {totalHealth}
                <Text style={styles.healthPct}>%</Text>
              </Text>
              <Text style={styles.statSub}>{healthMessage}</Text>
            </View>
          </View>
          <View style={[styles.statsRow, { marginTop: 10 }]}>
            <View
              style={[
                styles.statBox,
                aboveAverage && {
                  borderColor: colors.success + '99',
                  backgroundColor: colors.success + '12',
                },
              ]}
            >
              <Text style={styles.statLabel}>YOUR CONTACTS</Text>
              <Text
                style={[
                  styles.statValue,
                  { color: aboveAverage ? colors.success : colors.logoOrange },
                ]}
              >
                {vsAverage}
                <Text style={styles.healthPct}>%</Text>
              </Text>
              <Text style={styles.statSub}>
                {aboveAverage
                  ? `${myContacts - AVERAGE_CONTACTS} above avg`
                  : `avg is ${AVERAGE_CONTACTS}`}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>AVERAGE PERSON</Text>
              <Text style={[styles.statValue, { color: colors.textMuted }]}>
                {AVERAGE_CONTACTS}
              </Text>
              <Text style={styles.statSub}>contacts worldwide</Text>
            </View>
          </View>
          <View style={styles.weeklyCard}>
            <View style={styles.weeklyHeader}>
              <Text style={styles.weeklyLabel}>NEW PEOPLE THIS WEEK</Text>
              <Text style={styles.weeklyDaysLeft}>🔄 resets in {daysLeft}d</Text>
            </View>
            <View style={styles.weeklyTotalWrap}>
              <Text style={styles.weeklyTotal}>{newThisWeek}</Text>
              <Text style={styles.weeklyTotalSub}>this week</Text>
            </View>
            <View style={styles.weeklyInputRow}>
              <TextInput
                style={styles.weeklyInput}
                value={String(weeklyInput)}
                keyboardType="number-pad"
                onChangeText={(t) =>
                  setWeeklyInput(Math.max(0, parseInt(t, 10) || 0))
                }
                placeholder="0"
              />
              <TouchableOpacity
                style={styles.weeklyAddBtn}
                onPress={handleAddWeekly}
              >
                <Text style={styles.weeklyAddBtnText}>+ ADD</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.legend}>
            {CONTACT_CATEGORIES.map((cat) => (
              <View
                key={cat.slug}
                style={[
                  styles.legendRow,
                  { opacity: active === cat.slug || !active ? 1 : 0.3 },
                ]}
              >
                <View
                  style={[styles.legendDot, { backgroundColor: cat.color }]}
                />
                <Text style={styles.legendLabel}>{cat.label}</Text>
                <Text style={[styles.legendCount, { color: cat.color }]}>
                  {counts[cat.slug] ?? 0}/{cat.capacity}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.rightCol}>
          {CONTACT_CATEGORIES.map((cat, i) => {
            const count = counts[cat.slug] ?? 0;
            const pct = Math.min((count / cat.capacity) * 100, 100);
            const health = getHealthLabel(pct);
            const isActive = active === cat.slug;

            return (
              <TouchableOpacity
                key={cat.slug}
                activeOpacity={0.8}
                onPress={() => setActive(isActive ? null : cat.slug)}
                style={[
                  styles.card,
                  isActive && {
                    borderColor: cat.color + '55',
                    backgroundColor: cat.bg,
                  },
                ]}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.cardEmoji}>{cat.emoji}</Text>
                  <View style={styles.cardTitleWrap}>
                    <Text style={styles.cardTitle}>{cat.label}</Text>
                    {isActive && (
                      <Text style={styles.cardDesc}>{cat.description}</Text>
                    )}
                  </View>
                  <View style={styles.cardMeta}>
                    <Text style={[styles.healthTag, { color: health.color }]}>
                      {health.label}
                    </Text>
                    <Text style={styles.capLabel}>cap. {cat.capacity}</Text>
                  </View>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${pct}%`,
                        backgroundColor: pct > 100 ? '#FF6B6B' : cat.color,
                      },
                    ]}
                  />
                </View>
                <View style={styles.counterRow}>
                  <TouchableOpacity
                    style={[styles.counterBtn, { borderColor: cat.color + '33' }]}
                    onPress={(e) => {
                      setCounts((p) => ({
                        ...p,
                        [cat.slug]: Math.max(0, (p[cat.slug] ?? 0) - 1),
                      }));
                    }}
                  >
                    <Text style={[styles.counterBtnText, { color: cat.color }]}>
                      −
                    </Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.counterInput}
                    value={String(counts[cat.slug] ?? 0)}
                    keyboardType="number-pad"
                    onChangeText={(t) => {
                      const v = Math.max(0, parseInt(t, 10) || 0);
                      setCounts((p) => ({ ...p, [cat.slug]: v }));
                    }}
                  />
                  <TouchableOpacity
                    style={[styles.counterBtn, { borderColor: cat.color + '33' }]}
                    onPress={() =>
                      setCounts((p) => ({
                        ...p,
                        [cat.slug]: (p[cat.slug] ?? 0) + 1,
                      }))
                    }
                  >
                    <Text style={[styles.counterBtnText, { color: cat.color }]}>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => {
              setCounts(initialCounts());
              setActive(null);
              setNewThisWeek(0);
              setWeeklyInput(0);
            }}
          >
            <Text style={styles.resetBtnText}>RESET ALL</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          BASED ON DUNBAR'S SOCIAL BRAIN HYPOTHESIS · MORE RELATIONSHIPS. MORE EVERYTHING.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingBottom: 40,
    paddingTop: Platform.OS === 'web' ? 24 : 16,
    paddingHorizontal: 16,
  },
  header: {
    width: '100%',
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  brand: {
    fontSize: 10,
    letterSpacing: 3,
    color: colors.primary,
    marginBottom: 6,
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.text,
  },
  subtitle: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
  },
  twoCol: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    padding: 0,
  },
  leftCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: Platform.OS === 'web' ? 0 : 1,
    borderRightWidth: Platform.OS === 'web' ? 1 : 0,
    borderRightColor: colors.cardBorder,
    borderBottomColor: colors.cardBorder,
  },
  chartWrap: {
    width: CHART_SIZE,
    height: CHART_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
  },
  chartCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartTotal: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.text,
  },
  chartTotalLabel: {
    fontSize: 9,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  healthPct: {
    fontSize: 14,
    color: colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    width: '100%',
    maxWidth: 320,
  },
  statBox: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9,
    letterSpacing: 2,
    color: colors.textMuted,
    marginBottom: 4,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '500',
    color: colors.text,
  },
  statSub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  weeklyCard: {
    marginTop: 12,
    width: '100%',
    maxWidth: 320,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    backgroundColor: colors.card,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  weeklyLabel: {
    fontSize: 9,
    letterSpacing: 2,
    color: colors.textMuted,
    fontWeight: '500',
  },
  weeklyDaysLeft: {
    fontSize: 9,
    color: colors.textMuted,
  },
  weeklyTotalWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 10,
  },
  weeklyTotal: {
    fontSize: 28,
    fontWeight: '500',
    color: colors.logoPurple,
  },
  weeklyTotalSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginLeft: 6,
  },
  weeklyInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  weeklyInput: {
    flex: 1,
    textAlign: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    color: colors.text,
    fontSize: 18,
    fontWeight: '500',
    paddingVertical: 12,
    paddingHorizontal: 8,
    minHeight: 44,
  },
  weeklyAddBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    minHeight: 44,
  },
  weeklyAddBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  legend: {
    marginTop: 16,
    width: '100%',
    maxWidth: 320,
    paddingHorizontal: 0,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    flex: 1,
    fontSize: 11,
    color: colors.textSecondary,
  },
  legendCount: {
    fontSize: 11,
    fontWeight: '500',
  },
  rightCol: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 0,
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
    minHeight: 44,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  cardEmoji: {
    fontSize: 22,
  },
  cardTitleWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  cardDesc: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 2,
  },
  cardMeta: {
    alignItems: 'flex-end',
  },
  healthTag: {
    fontSize: 10,
    fontWeight: '500',
  },
  capLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.cardBorder,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  counterBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnText: {
    fontSize: 20,
  },
  counterInput: {
    flex: 1,
    textAlign: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    color: colors.text,
    fontSize: 17,
    fontWeight: '500',
    paddingVertical: 10,
    paddingHorizontal: 8,
    minHeight: 44,
  },
  resetBtn: {
    marginTop: 8,
    padding: 14,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    alignItems: 'center',
  },
  resetBtnText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
    backgroundColor: colors.background,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 1,
  },
});
