import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useRouter, Link } from 'expo-router';
import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { useAuth } from '../../src/hooks/useAuth';
import { useCheckin } from '../../src/hooks/useCheckin';
import { getSupabaseOrNull } from '../../src/lib/supabase';
import {
  getQuestionsForRotation,
  getSliderLabel,
  getSliderColor,
  getDisplayQuestion,
  getLocalizedQuestion,
  LOW_SCORE_THRESHOLD,
  MAX_QUESTIONS_SIGNED_IN,
  type CheckinQuestionData,
} from '../../src/data/checkinQuestions';
import { colors } from '../../src/theme';
import { useT } from '../../src/i18n';

export default function CheckinScreen() {
  const t = useT();
  const router = useRouter();
  const { user, profile, updateProfile } = useAuth();
  const { canCheckin, submitCheckin, refresh } = useCheckin(user?.id);
  const [questions, setQuestions] = useState<CheckinQuestionData[]>(() => getQuestionsForRotation());
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ value: number; detailText: string; skipped?: boolean }[]>(
    () => questions.map(() => ({ value: 3, detailText: '', skipped: false }))
  );
  const [showResult, setShowResult] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [pendingSubmitAnswers, setPendingSubmitAnswers] = useState<typeof answers | null>(null);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const tipShowTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoAdvanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [progressBarPercent, setProgressBarPercent] = useState(0);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [tipReminderVia, setTipReminderVia] = useState<string | null>(null);
  const [tipReminderPhone, setTipReminderPhone] = useState('');

  const currentQ = questions[step];
  const currentAnswer = answers[step];
  const isLowScore = (currentAnswer?.value ?? 3) < LOW_SCORE_THRESHOLD;
  const isLastQuestion = step === questions.length - 1;

  useEffect(() => {
    if (showResult && !isLowScore) {
      setProgressBarPercent(0);
      setCountdownSeconds(20);
      const start = Date.now();
      const duration = 20000;
      const interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const pct = Math.min(100, (elapsed / duration) * 100);
        setProgressBarPercent(pct);
        setCountdownSeconds(Math.max(1, 20 - Math.floor(elapsed / 1000)));
      }, 50);
      return () => clearInterval(interval);
    }
    setProgressBarPercent(0);
    setCountdownSeconds(0);
  }, [showResult, isLowScore, step]);

  useEffect(() => {
    if (user && questions.length === 5 && step === 0) {
      const q20 = getQuestionsForRotation(MAX_QUESTIONS_SIGNED_IN);
      setQuestions(q20);
      setAnswers(q20.map(() => ({ value: 3, detailText: '', skipped: false })));
    }
  }, [user]);

  const handleScoreChange = (value: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = { ...next[step], value };
      return next;
    });
    if (tipShowTimeoutRef.current) {
      clearTimeout(tipShowTimeoutRef.current);
      tipShowTimeoutRef.current = null;
    }
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    if (value >= LOW_SCORE_THRESHOLD) {
      setShowResult(true);
      autoAdvanceTimeoutRef.current = setTimeout(() => {
        autoAdvanceTimeoutRef.current = null;
        setShowResult(false);
        setTipReminderVia(null);
        setTipReminderPhone('');
        const currentStep = step;
        const currentQuestions = questions;
        const currentAnswers = answers;
        if (currentStep === currentQuestions.length - 1) {
          if (user) {
            handleSubmit();
          } else {
            setShowSignupForm(true);
          }
        } else {
          setStep((s) => s + 1);
        }
      }, 20000);
    } else if (value < LOW_SCORE_THRESHOLD && questions[step]?.advice) {
      tipShowTimeoutRef.current = setTimeout(() => {
        setShowResult(true);
        tipShowTimeoutRef.current = null;
      }, 4000);
    }
  };

  useEffect(() => {
    return () => {
      if (tipShowTimeoutRef.current) clearTimeout(tipShowTimeoutRef.current);
      if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
    };
  }, [step]);

  const handleSkip = () => {
    if (tipShowTimeoutRef.current) {
      clearTimeout(tipShowTimeoutRef.current);
      tipShowTimeoutRef.current = null;
    }
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = { ...next[step], skipped: true };
      return next;
    });
    setShowResult(false);
    setTipReminderVia(null);
    setTipReminderPhone('');
    if (!user && step >= 4) {
      setShowSignupForm(true);
    } else if (user && step >= questions.length - 1) {
      handleSubmit();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    if (showResult) {
      if (isLastQuestion) {
        if (user) {
          handleSubmit();
        } else {
          setShowSignupForm(true);
        }
      } else {
        setShowResult(false);
        setTipReminderVia(null);
        setTipReminderPhone('');
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
      .filter((a) => !a.skipped);
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
      await refresh();
      router.replace('/(tabs)');
    }
  };

  useEffect(() => {
    if (!canCheckin && user) {
      router.replace('/(tabs)');
    }
  }, [canCheckin, user]);

  // After visitor signs up, save their answers (user appears via auth listener)
  useEffect(() => {
    if (!user || !pendingSubmitAnswers) return;
    const doSave = async () => {
      setSubmitting(true);
      setError('');
      const toSubmit = pendingSubmitAnswers
        .map((a, i) => ({ ...a, i }))
        .filter((a) => !a.skipped);
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
        await refresh();
        router.replace('/(tabs)');
      }
    };
    doSave();
  }, [user, pendingSubmitAnswers]);

  const handleVisitorSignup = async () => {
    if (!signupName || !signupEmail || !signupPassword) {
      Alert.alert(t.auth.missingTitle, t.auth.fillAllFields);
      return;
    }
    if (signupPassword !== signupConfirm) {
      Alert.alert(t.auth.errorTitle, t.auth.passwordsDontMatch);
      return;
    }
    if (signupPassword.length < 6) {
      Alert.alert(t.auth.errorTitle, t.auth.minChars);
      return;
    }
    const supabase = getSupabaseOrNull();
    if (!supabase) {
      setError('App not configured. Add .env with Supabase URL and key.');
      return;
    }
    setError('');
    setSubmitting(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
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

  if (!currentQ && !showSignupForm) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t.checkin.noQuestions}</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>{t.checkin.goBack}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showSignupForm) {
    return (
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.keyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.signupContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.signupHeadline}>
              {t.checkin.saveYourPlay}
            </Text>
            <Text style={styles.label}>{t.auth.fullName}</Text>
            <TextInput
              style={styles.input}
              placeholder={t.auth.namePlaceholder}
              placeholderTextColor={colors.textMuted}
              value={signupName}
              onChangeText={setSignupName}
            />
            <Text style={styles.label}>{t.auth.email}</Text>
            <TextInput
              style={styles.input}
              placeholder={t.auth.emailPlaceholder}
              placeholderTextColor={colors.textMuted}
              value={signupEmail}
              onChangeText={setSignupEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.label}>{t.auth.password}</Text>
            <TextInput
              style={styles.input}
              placeholder={t.auth.passwordPlaceholder}
              placeholderTextColor={colors.textMuted}
              value={signupPassword}
              onChangeText={setSignupPassword}
              secureTextEntry
            />
            <Text style={styles.label}>{t.auth.confirmPassword}</Text>
            <TextInput
              style={styles.input}
              placeholder={t.auth.repeatPassword}
              placeholderTextColor={colors.textMuted}
              value={signupConfirm}
              onChangeText={setSignupConfirm}
              secureTextEntry
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity
              style={[styles.button, submitting && styles.buttonDisabled]}
              onPress={handleVisitorSignup}
              disabled={submitting}
            >
              <Text style={styles.buttonText}>
                {submitting ? t.checkin.creating : t.checkin.saveMyAnswers}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Link href="/(tabs)" asChild>
          <TouchableOpacity style={styles.checkinHeader} accessibilityLabel="Go to home">
            <Text style={styles.header}>{t.appName}</Text>
          </TouchableOpacity>
        </Link>
        {!showResult ? (
          <>
            <View style={styles.questionCard}>
              <View style={Platform.OS === 'web' ? styles.iconGrayscale : undefined}>
                <Text style={styles.emoji}>{currentQ.emoji}</Text>
              </View>
              <Text style={styles.question}>{getDisplayQuestion(currentQ)}</Text>
              {getLocalizedQuestion(currentQ).example ? <Text style={styles.questionExample}>{getLocalizedQuestion(currentQ).example}</Text> : null}
              <Text style={styles.sliderLabel}>
                {getSliderLabel(currentAnswer.value)}
              </Text>
              {Platform.OS === 'web' ? (
                <View style={styles.sliderWebWrap}>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={currentAnswer.value}
                    onInput={(e: ChangeEvent<HTMLInputElement>) =>
                      handleScoreChange(+e.target.value)
                    }
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleScoreChange(+e.target.value)
                    }
                    style={{
                      width: '100%',
                      height: 8,
                      marginTop: 4,
                      marginBottom: 4,
                      minHeight: 44,
                      paddingTop: 18,
                      paddingBottom: 18,
                      accentColor: getSliderColor(currentAnswer.value),
                      cursor: 'pointer',
                    }}
                  />
                  <View
                    style={[
                      styles.labelUnderThumb,
                      { left: `${(currentAnswer.value - 1) / 4 * 100}%`, transform: [{ translateX: -40 }] },
                    ]}
                  >
                    <Text style={[styles.labelUnderThumbText, { color: getSliderColor(currentAnswer.value) }]}>
                      {getSliderLabel(currentAnswer.value)}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.sliderWebWrap}>
                  <Slider
                    style={styles.nativeSlider}
                    minimumValue={1}
                    maximumValue={5}
                    step={0.5}
                    value={currentAnswer.value}
                    onValueChange={handleScoreChange}
                    minimumTrackTintColor={getSliderColor(currentAnswer.value)}
                    maximumTrackTintColor={colors.cardBorder}
                    thumbTintColor={getSliderColor(currentAnswer.value)}
                  />
                  <View
                    style={[
                      styles.labelUnderThumb,
                      { left: `${(currentAnswer.value - 1) / 4 * 100}%` },
                      { transform: [{ translateX: -40 }] },
                    ]}
                  >
                    <Text style={[styles.labelUnderThumbText, { color: getSliderColor(currentAnswer.value) }]}>
                      {getSliderLabel(currentAnswer.value)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </>
        ) : (
          <>
            <View style={styles.resultCard}>
              {isLowScore ? (
                <>
                  <Text style={styles.yourPlayLabel}>{t.checkin.yourPlay} {currentAnswer?.value ?? 3}</Text>
                  <Text style={styles.resultTitle}>{t.checkin.coachSays}</Text>
                  <Text style={styles.resultText}>{getLocalizedQuestion(currentQ).advice}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.yourPlayLabel}>{t.checkin.yourPlay} {currentAnswer?.value ?? 3}</Text>
                  <Text style={styles.resultTitle}>{t.checkin.attaWay}</Text>
                  <Text style={styles.resultText}>
                    {t.checkin.keepItUp}
                  </Text>
                  {getLocalizedQuestion(currentQ)?.advice ? (
                    <View style={{ marginTop: 12 }}>
                      <Text style={styles.resultTitle}>{t.checkin.tip}</Text>
                      <Text style={styles.resultText}>{getLocalizedQuestion(currentQ).advice}</Text>
                    </View>
                  ) : null}
                </>
              )}
              {!isLowScore ? (
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: `${progressBarPercent}%` }]} />
                  <View style={styles.progressBarCountdownWrap} pointerEvents="none">
                    <Text style={styles.progressBarCountdown}>{countdownSeconds}</Text>
                  </View>
                </View>
              ) : null}
            </View>
          </>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.buttonRow}>
          {!showResult ? (
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>{t.checkin.skip}</Text>
            </TouchableOpacity>
          ) : null}
          {user ? (
            <TouchableOpacity
              style={[styles.doneButton, submitting && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.doneButtonText}>{submitting ? t.checkin.saving : t.checkin.done}</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleNext}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>
              {submitting
                ? t.checkin.saving
                : showResult && isLastQuestion
                ? (user ? t.checkin.next : t.checkin.done)
                : showResult
                ? t.checkin.next
                : t.checkin.continue}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 12,
    paddingTop: 24,
    paddingBottom: 48,
  },
  checkinHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  header: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  progress: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  questionCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 28,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.logoPurple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconGrayscale: Platform.select({ web: { filter: 'grayscale(1)' } as any, default: {} }),
  emoji: {
    fontSize: 46,
    marginBottom: 14,
  },
  question: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 28,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  questionExample: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 16,
    lineHeight: 20,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  sliderWebWrap: {
    marginVertical: 2,
    position: 'relative',
  },
  labelUnderThumb: {
    position: 'absolute',
    bottom: 0,
    minWidth: 80,
    alignItems: 'center',
  },
  labelUnderThumbText: {
    fontSize: 13,
    fontWeight: '500',
  },
  nativeSlider: {
    width: '100%',
    height: 44,
  },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  yourPlayLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.logoYellow,
    marginBottom: 12,
  },
  resultText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  answerReceivedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  answerReceivedIcon: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.primary,
  },
  answerReceivedText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: colors.cardBorder,
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressBarCountdownWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarCountdown: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  tipReminderBlock: {
    marginTop: 8,
    marginBottom: 16,
    padding: 14,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tipReminderInput: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4b5563',
  },
  doneButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  doneButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4b5563',
  },
  tipButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  tipButtonDisabled: {
    opacity: 0.5,
  },
  tipButtonText: {
    fontSize: 15,
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
  error: {
    color: colors.error,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  keyboard: {
    flex: 1,
  },
  signupContainer: {
    paddingHorizontal: 12,
    paddingTop: 32,
    paddingBottom: 48,
  },
  signupHeadline: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 8,
  },
  signupSub: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
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
});
