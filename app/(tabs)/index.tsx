import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { useCheckin } from '../../src/hooks/useCheckin';
import { useReminders } from '../../src/hooks/useReminders';
import { useCategoryAverages } from '../../src/hooks/useCategoryAverages';
import { sendReminderToPhone } from '../../src/lib/reminderDelivery';
import {
  getQuestionsForRotation,
  getSliderColor,
  getSliderLabel,
  getFiresideSliderLabel,
  FIRESIDE_OPTION_LABELS,
  FIRESIDE_OPTION_EMOJIS,
  getDisplayQuestion,
  RELATIONSHIP_LABELS,
  LOW_SCORE_THRESHOLD,
  type CheckinQuestionData,
} from '../../src/data/checkinQuestions';
import { Logo } from '../../src/components/Logo';
import { SectionIcon } from '../../src/components/ThreeBodyIcons';
import { colors, fonts } from '../../src/theme';
import { CATEGORY_COLORS, LIGHT_PURPLE } from '../../src/constants/categories';
import { useState, useEffect, useRef } from 'react';
import { getSupabaseOrNull } from '../../src/lib/supabase';
import {
  getGuidelines,
  getTipFromText,
  transcribeImage,
  uploadShowMeImage,
  saveShowMeEntry,
} from '../../src/services/showMe';

import type { SectionIconId } from '../../src/types/sectionIcon';

const CATEGORIES = [
  { emoji: '👔', icon: 'app' as SectionIconId, title: 'Boss', desc: 'How can I save you time? Get there early, stay late.', route: '/(tabs)/coaching', slug: 'boss' },
  { emoji: '🤝', icon: 'figure8' as SectionIconId, title: 'Teammates', desc: 'Please & Thank you. Do what you say. Finish what you start. Ask for advice often.', route: '/(tabs)/coaching', slug: 'teammates' },
  { emoji: '🎓', icon: 'chaotic' as SectionIconId, title: 'Classmates', desc: 'Casual favors machine!', route: '/(tabs)/coaching', slug: 'classmates' },
  { emoji: '🔺', icon: 'triangle' as SectionIconId, title: 'I think we could be friends', desc: 'Remind myself when I sit beside someone, make a queue, or get introduced', route: '/(tabs)/coaching', slug: 'triangulation' },
];

/** Fireside: same section-card design as others when selected; Start opens check-in */
const FIRESIDE_SECTION = { emoji: '🔥', icon: 'orbital' as SectionIconId, title: 'Fireside', desc: "Let's see your outplai." } as const;
/** Minetoo: title + description only in selector; in main window shows Start → chat (ChatGPT-style) */
const MINETOO_SECTION = { emoji: '👥', icon: 'suns' as SectionIconId, title: 'Your contacts, my contacts', desc: 'Estimate yours and see your reach.' } as const;

/** Third word for dynamic tagline "Outplai yourself [word]." — one picked randomly per session */
const TAGLINE_THIRD_WORDS = [
  'daily', 'better', 'again', 'boldly', 'bravely', 'wisely', 'faster', 'smarter', 'stronger', 'harder',
  'higher', 'further', 'louder', 'sharper', 'deeper', 'greater', 'bigger', 'calmer', 'clearer', 'brighter',
  'bolder', 'fiercer', 'prouder', 'humbler', 'kinder', 'quicker', 'sooner', 'later', 'always', 'forever',
  'now', 'today', 'tomorrow', 'consistently', 'relentlessly', 'fearlessly', 'confidently', 'creatively', 'strategically', 'intentionally',
  'mindfully', 'purposefully', 'passionately', 'patiently', 'persistently', 'courageously', 'decisively', 'gracefully', 'effortlessly', 'effectively',
  'efficiently', 'continuously', 'constantly', 'completely', 'totally', 'fully', 'entirely', 'absolutely', 'undeniably', 'remarkably',
  'exceptionally', 'tremendously', 'dramatically', 'significantly', 'seriously', 'properly', 'correctly', 'accurately', 'precisely', 'perfectly',
  'differently', 'uniquely', 'independently', 'competitively', 'aggressively', 'ambitiously', 'authentically', 'brilliantly', 'dynamically', 'energetically',
  'enthusiastically', 'fiercely', 'freely', 'generously', 'heroically', 'honestly', 'intelligently', 'intuitively', 'masterfully', 'optimally',
  'proactively', 'resiliently', 'skillfully', 'triumphantly', 'unapologetically', 'victoriously', 'wildly',
];

/** Range options for contact estimates: [min, max], midpoint used for total; displayLabel shows ~max */
const CONTACT_RANGES = [
  { label: '0–30', displayLabel: '~30', midpoint: 15 },
  { label: '30–60', displayLabel: '~60', midpoint: 45 },
  { label: '60–100', displayLabel: '~100', midpoint: 80 },
  { label: '100–200', displayLabel: '~200', midpoint: 150 },
  { label: '200–300', displayLabel: '~300', midpoint: 250 },
  { label: '300–400', displayLabel: '~400', midpoint: 350 },
  { label: '400–500', displayLabel: '~500', midpoint: 450 },
  { label: '500–700', displayLabel: '~700', midpoint: 600 },
  { label: '700–900', displayLabel: '~900', midpoint: 800 },
] as const;

const CONTACT_ESTIMATE_MULTIPLIER = 250; // 250 reachable contacts

/** Family members that work: only 30, 60, 90 */
const CONTACT_FAMILY_OPTIONS = [
  { displayLabel: '~30', midpoint: 30 },
  { displayLabel: '~60', midpoint: 60 },
  { displayLabel: '~90', midpoint: 90 },
] as const;

/** Friends, colleagues, clients: 30, 60, 90, 150, 250 */
const CONTACT_COLLEAGUES_OPTIONS = [
  { displayLabel: '~30', midpoint: 30 },
  { displayLabel: '~60', midpoint: 60 },
  { displayLabel: '~90', midpoint: 90 },
  { displayLabel: '~150', midpoint: 150 },
  { displayLabel: '~250', midpoint: 250 },
] as const;

/** People you recognize, were friends with, say Hi, know your name: 50, 100, 150, 250, 300 */
const CONTACT_RECOGNIZE_OPTIONS = [
  { displayLabel: '~50', midpoint: 50 },
  { displayLabel: '~100', midpoint: 100 },
  { displayLabel: '~150', midpoint: 150 },
  { displayLabel: '~250', midpoint: 250 },
  { displayLabel: '~300', midpoint: 300 },
] as const;

export default function HomeScreen() {
  const router = useRouter();
  const { profile, user, signOut, updateProfile } = useAuth();
  const { todayCount, canCheckin, isComplete, loading, submitCheckin, refresh } = useCheckin(user?.id);
  const { reminders, refresh: refreshReminders } = useReminders(user?.id);
  const { averages: categoryAverages, refresh: refreshCategoryAverages } = useCategoryAverages(user?.id);

  const [questions, setQuestions] = useState<CheckinQuestionData[]>(() => getQuestionsForRotation(3));
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ value: number; detailText: string; skipped?: boolean }[]>(
    () => questions.map(() => ({ value: 3, detailText: '', skipped: false }))
  );
  const [showResult, setShowResult] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [pendingSubmitAnswers, setPendingSubmitAnswers] = useState<typeof answers | null>(null);
  /** After visitor signup + submit, show category colors from these until next refresh. */
  const [lastSubmittedAverages, setLastSubmittedAverages] = useState<{ boss: number | null; teammates: number | null; classmates: number | null } | null>(null);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [showMeLoading, setShowMeLoading] = useState(false);
  const [showMeImageUri, setShowMeImageUri] = useState<string | null>(null);
  const [showMeTranscription, setShowMeTranscription] = useState('');
  const [showMeTip, setShowMeTip] = useState('');
  const [showMeError, setShowMeError] = useState('');
  const [firesideStarted, setFiresideStarted] = useState(false);
  const [startFiresideHovered, setStartFiresideHovered] = useState(false);
  /** After first 3 questions: show subsections + "New fireside?" then start second round. */
  const [showFiresideSummary, setShowFiresideSummary] = useState(false);
  /** Averages from first fireside round; used for subsection colors and for section label colors in round 2. */
  const [firstFiresideAverages, setFirstFiresideAverages] = useState<{ boss: number | null; teammates: number | null; classmates: number | null } | null>(null);
  const [firesideRound, setFiresideRound] = useState<1 | 2>(1);
  const firesideRoundRef = useRef(1);
  /** When user taps "You are outplaying!" or "Use the tips!" we highlight the tip section */
  const [resultTipHighlight, setResultTipHighlight] = useState(false);
  /** Your contacts, my contacts: index into CONTACT_RANGES (0–8) or null */
  const [contactsFamily, setContactsFamily] = useState<number | null>(null);
  const [contactsClosestFriends, setContactsClosestFriends] = useState<number | null>(null);
  const [contactsColleagues, setContactsColleagues] = useState<number | null>(null);
  const [contactsRecognize, setContactsRecognize] = useState<number | null>(null);
  /** Section shown in the main content area (where Fireside lives). No navigation — content swaps in place. */
  const [activeSection, setActiveSection] = useState<'fireside' | 'boss' | 'teammates' | 'classmates' | 'triangulation' | 'minetoo'>('fireside');
  /** When user clicked Start on Fireside section card, show check-in (same graphic design as other sections first) */
  const [firesideSectionStarted, setFiresideSectionStarted] = useState(false);
  /** When user clicks Start on any section, open chat (greeting + thread + input) */
  const [sectionChatStarted, setSectionChatStarted] = useState<typeof activeSection | null>(null);
  const [sectionChatReplies, setSectionChatReplies] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [sectionChatInput, setSectionChatInput] = useState('');
  /** Tagline third word: "Outplai yourself [taglineWord]." — random per session */
  const [taglineWord] = useState(() => TAGLINE_THIRD_WORDS[Math.floor(Math.random() * TAGLINE_THIRD_WORDS.length)]);
  const scrollRef = useRef<ScrollView>(null);
  const setActiveSectionAndScroll = (section: typeof activeSection) => {
    setActiveSection(section);
    if (section !== 'fireside') {
      setFiresideSectionStarted(false);
      setFiresideStarted(false);
    }
    setSectionChatStarted(null);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };
  const handleSectionChatSend = () => {
    const t = sectionChatInput.trim();
    if (!t) return;
    setSectionChatReplies((prev) => [...prev, { role: 'user', text: t }]);
    setSectionChatInput('');
    setSectionChatReplies((prev) => [...prev, { role: 'assistant', text: "I'm here to help. (More coming soon.)" }]);
  };
  useEffect(() => {
    firesideRoundRef.current = firesideRound;
  }, [firesideRound]);

  const currentQ = questions[step];
  const currentAnswer = answers[step];
  /** Fireside: 0 = no default; user must select 1–4. */
  const firesideUnset = (currentAnswer?.value ?? 0) < 1;
  const isLowScore = (currentAnswer?.value ?? 3) < LOW_SCORE_THRESHOLD;
  const isLastQuestion = step === questions.length - 1;

  useEffect(() => {
    if (user && questions.length !== 3 && step === 0) {
      const q3 = getQuestionsForRotation(3);
      setQuestions(q3);
      setAnswers(q3.map(() => ({ value: 0, detailText: '', skipped: false })));
    }
  }, [user]);

  /** Pending averages from current session (before signup or before submit). Used when visitor finished 5 questions. Only non-skipped answers. */
  const pendingFromSession = (() => {
    if (!showSignupForm || answers.length !== questions.length) return null;
    const byCat: Record<string, number[]> = { boss: [], teammates: [], classmates: [] };
    answers.forEach((a, i) => {
      if (a.skipped) return;
      const q = questions[i];
      if (!q?.relationshipCategory || !byCat[q.relationshipCategory]) return;
      byCat[q.relationshipCategory].push(a.value);
    });
    const avg = (arr: number[]) => (arr.length > 0 ? arr.reduce((s, v) => s + v, 0) / arr.length : null);
    return {
      boss: avg(byCat.boss),
      teammates: avg(byCat.teammates),
      classmates: avg(byCat.classmates),
    };
  })();

  /** Effective averages: just-submitted (after signup), pending session (visitor), or DB. */
  const effectiveAverages = user && lastSubmittedAverages
    ? lastSubmittedAverages
    : !user && pendingFromSession
    ? pendingFromSession
    : categoryAverages;

  const handleScoreChange = (value: number) => {
    const clamped = Math.round(Math.min(4, Math.max(1, value)));
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = { ...next[step], value: clamped };
      return next;
    });
    if (clamped >= LOW_SCORE_THRESHOLD) {
      setShowResult(true);
    } else if (clamped < LOW_SCORE_THRESHOLD && questions[step]?.advice) {
      setShowResult(true);
    }
  };

  const handleSkip = () => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = { ...next[step], skipped: true };
      return next;
    });
    setShowResult(false);
    if (step >= questions.length - 1) {
      if (firesideRound === 1) {
        const byCat: Record<string, number[]> = { boss: [], teammates: [], classmates: [] };
        answers.forEach((a, i) => {
          if (a.skipped || i === step) return; // current step is being skipped
          const q = questions[i];
          if (q?.relationshipCategory && byCat[q.relationshipCategory]) byCat[q.relationshipCategory].push(a.value);
        });
        const avg = (arr: number[]) => (arr.length > 0 ? arr.reduce((s, v) => s + v, 0) / arr.length : null);
        setFirstFiresideAverages({
          boss: avg(byCat.boss),
          teammates: avg(byCat.teammates),
          classmates: avg(byCat.classmates),
        });
        setShowFiresideSummary(true);
      } else {
        if (!user) setShowSignupForm(true);
        else handleSubmit();
      }
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (showResult) {
      if (isLastQuestion) {
        if (firesideRound === 1) {
          const byCat: Record<string, number[]> = { boss: [], teammates: [], classmates: [] };
          answers.forEach((a, i) => {
            if (a.skipped) return;
            const q = questions[i];
            if (q?.relationshipCategory && byCat[q.relationshipCategory]) byCat[q.relationshipCategory].push(a.value);
          });
          const avg = (arr: number[]) => (arr.length > 0 ? arr.reduce((s, v) => s + v, 0) / arr.length : null);
          setFirstFiresideAverages({
            boss: avg(byCat.boss),
            teammates: avg(byCat.teammates),
            classmates: avg(byCat.classmates),
          });
          setShowFiresideSummary(true);
        } else {
          if (user) {
            handleSubmit();
          } else {
            setShowSignupForm(true);
          }
        }
      } else {
        setShowResult(false);
        setResultTipHighlight(false);
        setStep((s) => s + 1);
      }
    } else {
      setShowResult(true);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    const toSubmit = answers
      .map((a, i) => ({ ...a, i }))
      .filter((a) => !a.skipped && a.value >= 1);
    const result = await submitCheckin(
      toSubmit.map(({ value, detailText, i }) => ({
        questionId: questions[i].id,
        value,
        detailText: detailText || undefined,
      })),
      questions
    );
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else {
      const byCat: Record<string, number[]> = { boss: [], teammates: [], classmates: [] };
      answers.forEach((a, i) => {
        if (a.skipped) return;
        const q = questions[i];
        if (q?.relationshipCategory && byCat[q.relationshipCategory]) byCat[q.relationshipCategory].push(a.value);
      });
      const avg = (arr: number[]) => (arr.length > 0 ? arr.reduce((s, v) => s + v, 0) / arr.length : null);
      setLastSubmittedAverages({
        boss: avg(byCat.boss),
        teammates: avg(byCat.teammates),
        classmates: avg(byCat.classmates),
      });
      setStep(0);
      setAnswers(questions.map(() => ({ value: 0, detailText: '', skipped: false })));
      setShowResult(false);
      setError('');
      await refresh();
      await refreshReminders();
      await refreshCategoryAverages();
    }
  };

  // Web: Enter key acts as Continue when fireside is showing questions/result
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.defaultPrevented) return;
      if (!canCheckin || !firesideStarted || showSignupForm || showFiresideSummary) return;
      if (!showResult || submitting) return;
      e.preventDefault();
      handleNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [canCheckin, firesideStarted, showSignupForm, showFiresideSummary, showResult, submitting, handleNext]);

  // After visitor signs up, save their answers and show category colors from results
  useEffect(() => {
    if (!user || !pendingSubmitAnswers) return;
    const submittedAnswers = pendingSubmitAnswers;
    const doSave = async () => {
      setSubmitting(true);
      setError('');
      const toSubmit = submittedAnswers
        .map((a, i) => ({ ...a, i }))
        .filter((a) => !a.skipped && a.value >= 1);
      const result = await submitCheckin(
        toSubmit.map(({ value, detailText, i }) => ({
          questionId: questions[i].id,
          value,
          detailText: detailText || undefined,
        })),
        questions
      );
      setSubmitting(false);
      setPendingSubmitAnswers(null);
      setShowSignupForm(false);
      if (result.error) {
        setError(result.error);
      } else {
        const byCat: Record<string, number[]> = { boss: [], teammates: [], classmates: [] };
        submittedAnswers.forEach((a, i) => {
          if (a.skipped) return;
          const q = questions[i];
          if (q?.relationshipCategory && byCat[q.relationshipCategory]) byCat[q.relationshipCategory].push(a.value);
        });
        const avg = (arr: number[]) => (arr.length > 0 ? arr.reduce((s, v) => s + v, 0) / arr.length : null);
        setLastSubmittedAverages({
          boss: avg(byCat.boss),
          teammates: avg(byCat.teammates),
          classmates: avg(byCat.classmates),
        });
        setStep(0);
        setAnswers(questions.map(() => ({ value: 0, detailText: '', skipped: false })));
        setShowResult(false);
        await refresh();
        await refreshReminders();
        await refreshCategoryAverages();
      }
    };
    doSave();
  }, [user, pendingSubmitAnswers]);

  const handleShowMe = async () => {
    setShowMeError('');
    setShowMeTip('');
    setShowMeTranscription('');
    setShowMeImageUri(null);
    try {
      if (Platform.OS !== 'web' && ImagePicker.requestMediaLibraryPermissionsAsync) {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          setShowMeError('Permission to access photos is required.');
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.9,
      });
      if (result.canceled || !result.assets?.[0]?.uri) return;
      const asset = result.assets[0];
      const uri = asset.uri;
      const mimeType = asset.mimeType ?? 'image/jpeg';
      setShowMeImageUri(uri);
      setShowMeLoading(true);
      const guidelines = await getGuidelines();
      const transcribed = await transcribeImage(uri);
      setShowMeTranscription(transcribed || '(No text detected)');
      const { tipText } = getTipFromText(transcribed, guidelines);
      setShowMeTip(tipText);
      if (user?.id) {
        let imagePath: string | null = null;
        try {
          imagePath = await uploadShowMeImage(user.id, uri, mimeType);
        } catch (_) {}
        await saveShowMeEntry(user.id, imagePath, transcribed, tipText);
      }
    } catch (e) {
      setShowMeError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setShowMeLoading(false);
    }
  };

  const handleVisitorSignup = async () => {
    if (!signupName || !signupEmail || !signupPassword) {
      Alert.alert('Missing', 'Fill all fields');
      return;
    }
    if (signupPassword !== signupConfirm) {
      Alert.alert('Error', "Passwords don't match");
      return;
    }
    if (signupPassword.length < 6) {
      Alert.alert('Error', 'Min 6 characters');
      return;
    }
    const supabase = getSupabaseOrNull();
    if (!supabase) {
      setError('App not configured. Add .env with Supabase URL and key.');
      return;
    }
    setError('');
    setSubmitting(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email: signupEmail.trim(),
      password: signupPassword,
      options: { data: { full_name: signupName.trim() } },
    });
    setSubmitting(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setPendingSubmitAnswers([...answers]);
  };

  const renderCheckinSection = () => {
    if (!canCheckin || loading) return null;

    if (!firesideStarted) {
      return (
        <View style={styles.firesideStartCard}>
          <Text style={styles.firesideHeadline}>Fireside?</Text>
          <TouchableOpacity
            style={[
              styles.startFiresideButton,
              startFiresideHovered && styles.startFiresideButtonHover,
            ]}
            onPress={() => {
              setFiresideStarted(true);
              setAnswers(questions.map(() => ({ value: 0, detailText: '', skipped: false })));
            }}
            onMouseEnter={() => setStartFiresideHovered(true)}
            onMouseLeave={() => setStartFiresideHovered(false)}
          >
            <Text style={[
              styles.startFiresideButtonText,
              startFiresideHovered && styles.startFiresideButtonTextHover,
            ]}>Start</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (showSignupForm) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboard}
        >
          <View style={styles.sliderCard}>
            <Text style={styles.signupHeadline}>
              Save your play.
            </Text>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor={colors.textMuted}
              value={signupName}
              onChangeText={setSignupName}
            />
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={colors.textMuted}
              value={signupEmail}
              onChangeText={setSignupEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.fieldLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Min 6 characters"
              placeholderTextColor={colors.textMuted}
              value={signupPassword}
              onChangeText={setSignupPassword}
              secureTextEntry
            />
            <Text style={styles.fieldLabel}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Repeat password"
              placeholderTextColor={colors.textMuted}
              value={signupConfirm}
              onChangeText={setSignupConfirm}
              secureTextEntry
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.checkinButtonRow}>
              <TouchableOpacity
                style={[styles.primaryButton, submitting && styles.buttonDisabled]}
                onPress={handleVisitorSignup}
                disabled={submitting}
              >
                <Text style={styles.primaryButtonText}>
                  {submitting ? 'Creating...' : 'Save my answers'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      );
    }

    if (showFiresideSummary && firstFiresideAverages) {
      const subsections = [
        { key: 'boss' as const, label: RELATIONSHIP_LABELS.boss },
        { key: 'teammates' as const, label: RELATIONSHIP_LABELS.teammates },
        { key: 'classmates' as const, label: RELATIONSHIP_LABELS.classmates },
      ];
      return (
        <>
          <View style={styles.sliderCard}>
            <Text style={styles.firesideHeadline}>Fireside?</Text>
            <View style={styles.firesideSummarySubsections}>
              {subsections.map(({ key, label }) => {
                const avg = firstFiresideAverages[key];
                const isGood = avg != null && avg >= 3;
                const bgColor = avg != null
                  ? (isGood ? 'rgba(34, 197, 94, 0.25)' : 'rgba(220, 38, 38, 0.25)')
                  : '#f0f0f0';
                const borderColor = avg != null ? (isGood ? '#22C55E' : '#DC2626') : colors.cardBorder;
                const labelColor = avg != null ? (isGood ? '#22C55E' : '#DC2626') : colors.text;
                return (
                  <View key={key} style={[styles.firesideSummarySubsection, { backgroundColor: bgColor, borderWidth: 1, borderColor }]}>
                    <Text style={[styles.firesideSummarySubsectionLabel, { color: labelColor }]}>{label}</Text>
                  </View>
                );
              })}
            </View>
            <Text style={styles.firesideNewFiresideText}>New fireside?</Text>
            <TouchableOpacity
              style={[styles.startFiresideButton, startFiresideHovered && styles.startFiresideButtonHover]}
              onPress={() => {
                const nextQ = getQuestionsForRotation(3);
                setQuestions(nextQ);
                setAnswers(nextQ.map(() => ({ value: 0, detailText: '', skipped: false })));
                setStep(0);
                setShowResult(false);
                setShowFiresideSummary(false);
                setFiresideRound(2);
              }}
              onMouseEnter={() => setStartFiresideHovered(true)}
              onMouseLeave={() => setStartFiresideHovered(false)}
            >
              <Text style={[styles.startFiresideButtonText, startFiresideHovered && styles.startFiresideButtonTextHover]}>Start</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    }

    return (
      <>
        <Text style={styles.firesideHeadline}>Fireside?</Text>
        <View style={styles.sliderCard}>
        <Text
          style={[
            styles.relationshipLabel,
            firesideRound === 2 && currentQ && firstFiresideAverages != null && firstFiresideAverages[currentQ.relationshipCategory] != null
              ? { color: getSliderColor(firstFiresideAverages[currentQ.relationshipCategory]!) }
              : (currentAnswer?.value ?? 0) >= 1
                ? { color: (currentAnswer!.value >= 3 ? '#22C55E' : '#DC2626') }
                : undefined,
          ]}
        >
          {currentQ && RELATIONSHIP_LABELS[currentQ.relationshipCategory]}
        </Text>

        {!showResult ? (
          <>
            <View style={styles.questionDetailRow}>
              <View style={styles.questionLeft}>
                <Text
                  style={[
                    styles.questionText,
                    (currentAnswer?.value ?? 0) >= 1 && { color: (currentAnswer!.value >= 3 ? '#22C55E' : '#DC2626') },
                  ]}
                >
                  {currentQ ? getDisplayQuestion(currentQ) : ''}
                </Text>
                {currentQ?.example ? (
                  <Text
                    style={[
                      styles.questionExample,
                      (currentAnswer?.value ?? 0) >= 1 && { color: (currentAnswer!.value >= 3 ? '#22C55E' : '#DC2626') },
                    ]}
                  >
                    {currentQ.example}
                  </Text>
                ) : null}
                <View style={styles.firesideSliderBlock}>
                  <View style={styles.firesideLabelsOverLine}>
                    {FIRESIDE_OPTION_LABELS.map((label, i) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => handleScoreChange(i + 1)}
                        style={styles.firesideOptionLabelTouchable}
                        activeOpacity={0.7}
                        hitSlop={{ top: 8, bottom: 12, left: 4, right: 4 }}
                      >
                        <Text style={styles.firesideOptionEmoji}>{FIRESIDE_OPTION_EMOJIS[i]}</Text>
                        <Text
                          style={[
                            styles.firesideOptionLabel,
                            (currentAnswer?.value ?? 0) === i + 1 && styles.firesideOptionLabelSelected,
                            (currentAnswer?.value ?? 0) === i + 1 && { color: getSliderColor(i + 1) },
                          ]}
                        >
                          {label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.resultQuestionRow}>
              <Text style={styles.resultQuestionLabel}>{currentQ ? getDisplayQuestion(currentQ) : ''}</Text>
            </View>
            <View style={[
                styles.resultCard,
                !firesideUnset && {
                  backgroundColor: (currentAnswer?.value ?? 1) >= 3 ? 'rgba(34, 197, 94, 0.18)' : 'rgba(220, 38, 38, 0.18)',
                  borderColor: (currentAnswer?.value ?? 1) >= 3 ? 'rgba(34, 197, 94, 0.45)' : 'rgba(220, 38, 38, 0.45)',
                },
              ]}>
              {firesideUnset ? (
                <>
                  <Text style={styles.yourPlayLabel}>😊 No score selected</Text>
                  <Text style={styles.resultText}>Slide to pick 1–4, then tap Continue.</Text>
                  <TouchableOpacity
                    style={styles.backToSelectButton}
                    onPress={() => { setShowResult(false); setResultTipHighlight(false); }}
                  >
                    <Text style={styles.backToSelectButtonText}>Back to select</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.yourPlayLabel}>😊 Your play: {currentAnswer?.value} — <Text style={{ color: (currentAnswer?.value ?? 1) >= 3 ? '#22C55E' : '#DC2626' }}>{getFiresideSliderLabel(currentAnswer?.value ?? 1)}</Text></Text>
                  <Text style={[styles.resultTitle, { color: (currentAnswer?.value ?? 1) >= 3 ? '#22C55E' : '#DC2626' }]}>{(currentAnswer?.value ?? 1) >= 3 ? '✨ Atta way!' : 'Aww…'}</Text>
                  <Text style={[styles.resultText, { marginBottom: 6 }]}>Got it!</Text>
                  {(currentAnswer?.value ?? 1) >= 3 ? (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => { setResultTipHighlight(true); setTimeout(() => setResultTipHighlight(false), 2500); }}
                    >
                      <Text style={styles.resultText}>
                        You are outplaying!{' '}
                        <Text style={[styles.resultText, { fontWeight: '600', color: (currentAnswer?.value ?? 1) >= 3 ? '#22C55E' : '#DC2626' }]}>
                          {getFiresideSliderLabel(currentAnswer?.value ?? 1)}
                        </Text>
                        . Tap to see tip below.
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => { setResultTipHighlight(true); setTimeout(() => setResultTipHighlight(false), 2500); }}
                    >
                      <Text style={styles.resultText}>
                        Use the tips! It will play out! Tap to see tip below.
                      </Text>
                    </TouchableOpacity>
                  )}
                  {currentQ?.advice ? (
                    <View style={[styles.resultTipBlock, resultTipHighlight && styles.resultTipBlockHighlight]}>
                      <Text style={[styles.resultTitle, { color: (currentAnswer?.value ?? 1) >= 3 ? '#22C55E' : '#DC2626' }]}>💡 Tip</Text>
                      <Text style={[styles.resultText, { color: (currentAnswer?.value ?? 1) >= 3 ? '#22C55E' : '#DC2626' }]}>{currentQ.advice}</Text>
                    </View>
                  ) : null}
                </>
              )}
            </View>
          </>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.checkinButtonRow}>
          {!showResult ? (
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          ) : null}
          {user ? (
            <TouchableOpacity
              style={[styles.doneButton, submitting && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.doneButtonText}>{submitting ? 'Saving...' : 'Done'}</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={[styles.primaryButton, (submitting || (!showResult && firesideUnset)) && styles.buttonDisabled]}
            onPress={handleNext}
            disabled={submitting || (!showResult && firesideUnset)}
          >
            <Text style={styles.primaryButtonText}>
              {submitting
                ? 'Saving...'
                : showResult && isLastQuestion
                ? (user ? 'Next' : 'Done')
                : showResult
                ? 'Next'
                : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator>
          {/* Logo and tagline at top left */}
          <View style={styles.topLogo}>
          <Logo size={40} />
          <View style={styles.topTaglineWrap}>
              <Text style={styles.topTagline}>Outpla<Text style={[styles.topTagline, { color: '#FF52A0', fontStyle: 'italic' }]}>i</Text> yourself {taglineWord}.</Text>
            </View>
        </View>

        {/* Main content area: Fireside or selected section (same card design, then Start → content) */}
        {activeSection === 'fireside' ? (
          firesideSectionStarted ? (
            renderCheckinSection()
          ) : (
            <View style={[styles.sectionCard, { backgroundColor: LIGHT_PURPLE }]}>
              <View style={styles.sectionCardEmoji}>
                <SectionIcon iconId={FIRESIDE_SECTION.icon} size={40} />
              </View>
              <Text style={styles.sectionCardTitle}>{FIRESIDE_SECTION.title}</Text>
              <Text style={styles.sectionCardDesc}>{FIRESIDE_SECTION.desc}</Text>
              <TouchableOpacity
                style={[styles.startFiresideButton, Platform.OS === 'web' && startFiresideHovered && styles.startFiresideButtonHover]}
                onPress={() => { setFiresideSectionStarted(true); setFiresideStarted(true); setAnswers(questions.map(() => ({ value: 0, detailText: '', skipped: false }))); }}
                onMouseEnter={Platform.OS === 'web' ? () => setStartFiresideHovered(true) : undefined}
                onMouseLeave={Platform.OS === 'web' ? () => setStartFiresideHovered(false) : undefined}
              >
                <Text style={[styles.startFiresideButtonText, Platform.OS === 'web' && startFiresideHovered && styles.startFiresideButtonTextHover]}>Start</Text>
              </TouchableOpacity>
            </View>
          )
        ) : sectionChatStarted === activeSection ? (
          <View style={styles.chatMainWrap}>
            <ScrollView style={styles.chatThreadScroll} contentContainerStyle={styles.chatThreadContent} keyboardShouldPersistTaps="handled">
              <View style={styles.chatBubbleWrapAssistant}>
                <Text style={styles.chatBubbleText}>
                  {(() => {
                    const sectionTitle = CATEGORIES.find(c => c.slug === activeSection)?.title;
                    if (sectionTitle && (activeSection === 'boss' || activeSection === 'teammates' || activeSection === 'classmates')) {
                      return `Let's outplai. How are you doing with your ${sectionTitle}?`;
                    }
                    return "Let's outplai!";
                  })()}
                </Text>
              </View>
              {sectionChatReplies.map((msg, i) => (
                <View key={i} style={msg.role === 'user' ? styles.chatBubbleWrapUser : styles.chatBubbleWrapAssistant}>
                  <Text style={msg.role === 'user' ? styles.chatBubbleTextUser : styles.chatBubbleText}>{msg.text}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                placeholder=""
                placeholderTextColor={colors.textMuted}
                value={sectionChatInput}
                onChangeText={setSectionChatInput}
                multiline={false}
                onSubmitEditing={handleSectionChatSend}
              />
              <TouchableOpacity style={styles.chatSendButton} onPress={handleSectionChatSend}>
                <Text style={styles.chatSendButtonText}>↑</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : activeSection === 'minetoo' ? (
          <View style={[styles.sectionCard, { backgroundColor: LIGHT_PURPLE }]}>
            <View style={styles.sectionCardEmoji}>
              <SectionIcon iconId={MINETOO_SECTION.icon} size={40} />
            </View>
            <Text style={styles.sectionCardTitle}>{MINETOO_SECTION.title}</Text>
            <Text style={styles.sectionCardDesc}>{MINETOO_SECTION.desc}</Text>
            <TouchableOpacity
              style={[styles.startFiresideButton, Platform.OS === 'web' && startFiresideHovered && styles.startFiresideButtonHover]}
              onPress={() => setSectionChatStarted('minetoo')}
              onMouseEnter={Platform.OS === 'web' ? () => setStartFiresideHovered(true) : undefined}
              onMouseLeave={Platform.OS === 'web' ? () => setStartFiresideHovered(false) : undefined}
            >
              <Text style={[styles.startFiresideButtonText, Platform.OS === 'web' && startFiresideHovered && styles.startFiresideButtonTextHover]}>Start</Text>
            </TouchableOpacity>
          </View>
        ) : (() => {
          const cat = CATEGORIES.find((c) => c.slug === activeSection);
          if (!cat) return null;
          const hasAnyScores =
            effectiveAverages.boss != null ||
            effectiveAverages.teammates != null ||
            effectiveAverages.classmates != null;
          const bgColor = hasAnyScores && user && cat.slug !== 'triangulation'
            ? (getSliderColor(effectiveAverages[cat.slug as 'boss' | 'teammates' | 'classmates'] ?? 0) ?? LIGHT_PURPLE)
            : (CATEGORY_COLORS[cat.slug] ?? LIGHT_PURPLE);
          return (
            <View style={[styles.sectionCard, { backgroundColor: bgColor }]}>
              <View style={styles.sectionCardEmoji}>
                <SectionIcon iconId={cat.icon} size={40} />
              </View>
              <Text style={styles.sectionCardTitle}>{cat.title}</Text>
              <Text style={styles.sectionCardDesc}>{cat.desc}</Text>
              <TouchableOpacity
                style={[styles.startFiresideButton, Platform.OS === 'web' && startFiresideHovered && styles.startFiresideButtonHover]}
                onPress={() => setSectionChatStarted(activeSection)}
                onMouseEnter={Platform.OS === 'web' ? () => setStartFiresideHovered(true) : undefined}
                onMouseLeave={Platform.OS === 'web' ? () => setStartFiresideHovered(false) : undefined}
              >
                <Text style={[styles.startFiresideButtonText, Platform.OS === 'web' && startFiresideHovered && styles.startFiresideButtonTextHover]}>Start</Text>
              </TouchableOpacity>
            </View>
          );
        })()}

        {/* All sections: scroll to see (Fireside, Boss, Teammates, etc.) */}
        <View style={styles.sectionSelectorWrap}>
          <View style={styles.grid}>
            {activeSection !== 'fireside' && (
              <TouchableOpacity
                key="fireside"
                style={[styles.gridCard, { backgroundColor: '#f9f9f9' }]}
                onPress={() => setActiveSectionAndScroll('fireside')}
                activeOpacity={0.8}
              >
                <View style={styles.gridTitleRow}>
                  <View style={styles.gridEmoji}>
                    <SectionIcon iconId="orbital" size={24} />
                  </View>
                  <Text style={styles.gridTitle}>Fireside</Text>
                </View>
                <Text style={styles.gridDesc} numberOfLines={2}>{FIRESIDE_SECTION.desc}</Text>
              </TouchableOpacity>
            )}
            {CATEGORIES.filter((cat) => cat.slug !== activeSection).map((cat) => {
              const hasAnyScores =
                effectiveAverages.boss != null ||
                effectiveAverages.teammates != null ||
                effectiveAverages.classmates != null;
              let bgColor = '#f9f9f9';
              if (user && hasAnyScores && cat.slug !== 'triangulation') {
                const avg = effectiveAverages[cat.slug as 'boss' | 'teammates' | 'classmates'];
                if (avg != null) bgColor = getSliderColor(avg);
              }
              return (
                <TouchableOpacity
                  key={cat.slug}
                  style={[styles.gridCard, { backgroundColor: bgColor }]}
                  onPress={() => setActiveSectionAndScroll(cat.slug)}
                  activeOpacity={0.8}
                >
                  <View style={styles.gridTitleRow}>
                    <View style={styles.gridEmoji}>
                      <SectionIcon iconId={cat.icon} size={24} />
                    </View>
                    <Text style={styles.gridTitle}>{cat.title}</Text>
                  </View>
                  <Text style={styles.gridDesc} numberOfLines={2}>{cat.desc}</Text>
                </TouchableOpacity>
              );
            })}
            {activeSection !== 'minetoo' && (
              <TouchableOpacity
                key="minetoo"
                style={[styles.gridCard, { backgroundColor: '#f9f9f9' }]}
                onPress={() => setActiveSectionAndScroll('minetoo')}
                activeOpacity={0.8}
              >
                <View style={styles.gridTitleRow}>
                  <View style={styles.gridEmoji}>
                    <SectionIcon iconId={MINETOO_SECTION.icon} size={24} />
                  </View>
                  <Text style={styles.gridTitle}>{MINETOO_SECTION.title}</Text>
                </View>
                <Text style={styles.gridDesc} numberOfLines={2}>{MINETOO_SECTION.desc}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.showMeSection}>
          <View style={[styles.gridTitleRow, { marginBottom: 6 }]}>
            <View style={Platform.OS === 'web' ? styles.iconGrayscale : undefined}>
              <Text style={styles.gridEmoji}>📷</Text>
            </View>
            <Text style={styles.showMeTitle}>Show me</Text>
          </View>
          <Text style={styles.showMeSubtitle}>I'll give you a quick tip to try.</Text>
          <TouchableOpacity
            style={[styles.showMeButton, showMeLoading && styles.showMeButtonDisabled]}
            onPress={handleShowMe}
            disabled={showMeLoading}
          >
            <Text style={styles.showMeButtonText}>{showMeLoading ? 'Reading…' : 'Snap it!'}</Text>
          </TouchableOpacity>
          {showMeError ? <Text style={styles.showMeError}>{showMeError}</Text> : null}
          {showMeImageUri ? (
            <View style={styles.showMePreview}>
              <Image source={{ uri: showMeImageUri }} style={styles.showMeImage} resizeMode="cover" />
            </View>
          ) : null}
          {showMeTranscription ? (
            <View style={styles.showMeResult}>
              <Text style={styles.showMeResultLabel}>Transcription</Text>
              <Text style={styles.showMeTranscription}>{showMeTranscription}</Text>
              <Text style={styles.showMeResultLabel}>💡 Tip</Text>
              <Text style={styles.showMeTip}>{showMeTip}</Text>
            </View>
          ) : null}
        </View>

        {user && (reminders?.length ?? 0) > 0 ? (
          <View style={styles.remindersSection}>
            <Text style={styles.remindersTitle}>📌 Things to work on</Text>
            <Text style={styles.remindersSubtitle}>You scored 3 or below here. Try the tip next time — you got this.</Text>
            <TouchableOpacity
              style={styles.sendToPhoneButton}
              onPress={() => {
                const first = reminders?.[0];
                const msg = first
                  ? `My plai reminder: ${first.question} — 💡 ${first.advice}`
                  : 'My plai: check your follow-ups in the app.';
                sendReminderToPhone(profile?.reminder_via ?? null, profile?.reminder_phone, msg);
              }}
            >
              <Text style={styles.sendToPhoneButtonText}>Send these tips to my phone</Text>
            </TouchableOpacity>
            {(reminders ?? []).slice(0, 5).map((r) => (
              <View key={r.id} style={styles.reminderCard}>
                <Text style={styles.reminderDate}>{r.checkin_date}</Text>
                <Text style={styles.reminderQuestion}>{r.emoji ? `${r.emoji} ` : ''}{r.question}</Text>
                <Text style={styles.reminderScore}>Your score: {r.value}/5</Text>
                <Text style={styles.reminderAdvice}>💡 {r.advice}</Text>
              </View>
            ))}
            {(reminders?.length ?? 0) > 5 ? (
              <Text style={styles.remindersMore}>+{(reminders?.length ?? 0) - 5} more from the last 14 days</Text>
            ) : null}
          </View>
        ) : null}

        <View style={styles.footer}>
          <View style={styles.footerLinks}>
            {user ? (
              <TouchableOpacity onPress={signOut} style={styles.footerLink}>
                <Text style={styles.footerLinkText}>Sign out</Text>
              </TouchableOpacity>
            ) : (
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity style={styles.footerLink}>
                  <Text style={styles.footerLinkText}>Sign in</Text>
                </TouchableOpacity>
              </Link>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  sectionSelectorWrap: {
    marginTop: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'web' ? 24 : 32,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'web' ? 48 : 60,
    paddingBottom: 24,
  },
  topLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  topTaglineWrap: {
    flex: 1,
  },
  topTagline: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
  },
  topTaglineItalic: {
    fontStyle: 'italic',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerHome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingRight: 12,
  },
  headerHomeText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  streakBadge: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  streakText: {
    color: colors.logoYellow,
    fontSize: 14,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loginLink: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  loginLinkText: {
    color: '#4b5563',
    fontSize: 15,
    fontWeight: '500',
  },
  footer: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    alignItems: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerLink: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  footerLinkText: {
    color: '#4b5563',
    fontSize: 15,
    fontWeight: '500',
  },
  footerSeparator: {
    color: colors.textMuted,
    fontSize: 14,
  },
  sliderCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  firesideHeadline: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FF52A0',
    marginBottom: 0,
  },
  firesideStartCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
  },
  startFiresideButton: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 20,
    marginTop: 0,
  },
  startFiresideButtonHover: {
    backgroundColor: 'transparent',
  },
  startFiresideButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  startFiresideButtonTextHover: {
    color: '#4b5563',
  },
  firesideSummarySubsections: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  firesideSummarySubsection: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    minWidth: 80,
  },
  firesideSummarySubsectionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
  },
  firesideNewFiresideText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  sliderTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  relationshipLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.primary,
    marginBottom: 6,
    textAlign: 'center',
  },
  questionEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  questionDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  questionLeft: {
    flex: 1,
    minWidth: 0,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 20,
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  questionExample: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 6,
    lineHeight: 16,
  },
  sliderLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  firesideSliderBlock: {
    width: '100%',
    marginTop: 4,
  },
  firesideLabelsOverLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    paddingHorizontal: 0,
    alignItems: 'flex-end',
    ...(Platform.OS === 'web' ? { zIndex: 2, position: 'relative' as const } : {}),
  },
  firesideOptionLabelTouchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 2,
    minHeight: 38,
  },
  firesideOptionEmoji: {
    fontSize: 16,
    marginBottom: 2,
  },
  firesideOptionLabel: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
  },
  firesideOptionLabelSelected: {
    fontWeight: '500',
  },
  sliderTrackWrap: {
    marginTop: 0,
    marginBottom: 0,
    position: 'relative',
    ...(Platform.OS === 'web' ? { zIndex: 1 } : {}),
  },
  nativeSlider: {
    width: '100%',
    height: 36,
  },
  labelUnderThumb: {
    position: 'absolute',
    bottom: 0,
    minWidth: 60,
    alignItems: 'center',
  },
  labelUnderThumbText: {
    fontSize: 11,
    fontWeight: '500',
  },
  rangeInput: {
    width: '100%',
    height: 6,
    marginBottom: 2,
    cursor: 'pointer',
    minHeight: 36,
    paddingVertical: 14,
  },
  resultQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  iconGrayscale: Platform.select({ web: { filter: 'grayscale(1)' } as any, default: {} }),
  resultQuestionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  resultCard: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  resultTipBlock: {
    marginTop: 6,
  },
  resultTipBlockHighlight: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  tipReminderBlock: {
    marginTop: 4,
    marginBottom: 8,
    padding: 10,
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tipReminderInput: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.text,
    marginBottom: 6,
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  skipButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4b5563',
  },
  doneButton: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  doneButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4b5563',
  },
  tipButton: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  tipButtonDisabled: {
    opacity: 0.5,
  },
  tipButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4b5563',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4b5563',
  },
  modalSendButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  modalSendText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4b5563',
  },
  yourPlayLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  yourPlayAnswer: {
    fontWeight: '500',
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.logoYellow,
    marginBottom: 4,
  },
  resultText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  resultTipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 20,
  },
  backToSelectButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  backToSelectButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.primary,
  },
  answerReceivedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  answerReceivedIcon: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
  },
  answerReceivedText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  checkinButtonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#4b5563',
    fontSize: 13,
    fontWeight: '500',
  },
  error: {
    color: colors.error,
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  statusRow: {
    marginBottom: 20,
  },
  statusText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  signupHeadline: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 6,
  },
  signupSub: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  grid: {
    flexDirection: 'column',
    gap: 10,
  },
  sectionCard: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionCardEmoji: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCardTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  sectionCardDesc: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  sectionCardComing: {
    fontSize: 14,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  chatMainWrap: {
    flex: 1,
    minHeight: 280,
  },
  chatThreadScroll: {
    flex: 1,
  },
  chatThreadContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 12,
    paddingBottom: 24,
  },
  chatBubbleWrapAssistant: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chatBubbleWrapUser: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
    backgroundColor: '#FF52A0',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderTopRightRadius: 4,
  },
  chatBubbleText: {
    fontSize: 15,
    color: colors.text,
  },
  chatBubbleTextUser: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginHorizontal: 12,
    marginBottom: 12,
    gap: 10,
  },
  chatInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  chatSendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FF52A0',
    borderRadius: 10,
  },
  chatSendButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  gridCard: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  gridTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  gridEmoji: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    color: colors.text,
  },
  gridDesc: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  contactsSection: {
    marginTop: 24,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  contactsSectionTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  contactsSectionSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 16,
  },
  contactsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginTop: 12,
    marginBottom: 6,
  },
  contactsRangeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  contactsRangeChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  contactsRangeChipSelected: {
    backgroundColor: '#FF52A0',
    borderColor: '#FF52A0',
  },
  contactsRangeChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
  },
  contactsRangeChipTextSelected: {
    color: '#fff',
  },
  contactsTotalLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    marginTop: 20,
    marginBottom: 8,
  },
  contactsCopy: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 8,
  },
  contactsFormula: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    marginBottom: 12,
  },
  contactsCelebration: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    marginTop: 4,
  },
  showMeSection: {
    marginTop: 24,
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'flex-start',
  },
  showMeTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 6,
    textAlign: 'left',
    flex: 1,
  },
  showMeSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 14,
    lineHeight: 20,
    textAlign: 'left',
  },
  showMeButton: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingLeft: 0,
    paddingRight: 24,
    backgroundColor: 'transparent',
    borderRadius: 12,
  },
  showMeButtonDisabled: {
    opacity: 0.7,
  },
  showMeButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'left',
  },
  showMeError: {
    fontSize: 13,
    color: '#c00',
    marginTop: 10,
  },
  showMePreview: {
    marginTop: 14,
    borderRadius: 10,
    overflow: 'hidden',
    maxHeight: 180,
    backgroundColor: colors.background,
  },
  showMeImage: {
    width: '100%',
    height: 180,
  },
  showMeResult: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  showMeResultLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
    marginTop: 10,
  },
  showMeTranscription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  showMeTip: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 22,
  },
  remindersSection: {
    marginTop: 28,
    marginBottom: 24,
  },
  remindersTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  remindersSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  sendToPhoneButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  sendToPhoneButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4b5563',
  },
  reminderCard: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    padding: 14,
    marginBottom: 12,
  },
  reminderDate: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 6,
  },
  reminderQuestion: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 6,
  },
  reminderScore: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  reminderAdvice: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  remindersMore: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
});
