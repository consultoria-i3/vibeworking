import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../src/hooks/useAuth';
import { useCheckin } from '../../src/hooks/useCheckin';
import {
  getQuestionsForRotation,
  getSliderLabel,
  getSliderColor,
  type CheckinQuestionData,
} from '../../src/data/checkinQuestions';

export default function CheckinScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { canCheckin, submitCheckin, refresh } = useCheckin(user?.id);
  const [questions] = useState<CheckinQuestionData[]>(() => getQuestionsForRotation());
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ value: number; detailText: string }[]>(
    () => questions.map(() => ({ value: 3, detailText: '' }))
  );
  const [showResult, setShowResult] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const currentQ = questions[step];
  const currentAnswer = answers[step];
  const isLowScore = currentAnswer?.value <= 3;
  const isLastQuestion = step === questions.length - 1;

  const handleScoreChange = (value: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = { ...next[step], value };
      return next;
    });
  };

  const handleDetailChange = (text: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = { ...next[step], detailText: text };
      return next;
    });
  };

  const handleNext = () => {
    if (showResult) {
      if (isLastQuestion) {
        handleSubmit();
      } else {
        setShowResult(false);
        setStep((s) => s + 1);
      }
    } else {
      setShowResult(true);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    const result = await submitCheckin(
      answers.map((a, i) => ({
        questionId: questions[i].id,
        value: a.value,
        detailText: a.detailText || undefined,
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

  if (!currentQ) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No questions for this rotation</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>VIBE WORKING</Text>
        <Text style={styles.progress}>
          Question {step + 1} of {questions.length}
        </Text>

        {!showResult ? (
          <>
            <View style={styles.questionCard}>
              <Text style={styles.emoji}>{currentQ.emoji}</Text>
              <Text style={styles.question}>{currentQ.question}</Text>
              <Text style={styles.sliderLabel}>
                {getSliderLabel(currentAnswer.value)} ({currentAnswer.value}/5)
              </Text>
              {Platform.OS === 'web' ? (
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={currentAnswer.value}
                  onChange={(e: any) => handleScoreChange(+e.target.value)}
                  style={{
                    width: '100%',
                    height: 8,
                    marginVertical: 12,
                    accentColor: getSliderColor(currentAnswer.value),
                  }}
                />
              ) : (
                <View style={styles.sliderRow}>
                  {[1, 2, 3, 4, 5].map((v) => (
                    <TouchableOpacity
                      key={v}
                      style={[
                        styles.sliderDot,
                        currentAnswer.value === v && {
                          backgroundColor: getSliderColor(v),
                          transform: [{ scale: 1.2 }],
                        },
                      ]}
                      onPress={() => handleScoreChange(v)}
                    >
                      <Text
                        style={[
                          styles.sliderDotText,
                          currentAnswer.value === v && { color: '#fff' },
                        ]}
                      >
                        {v}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              <Text style={styles.detailLabel}>💬 Let me know the details</Text>
              <TextInput
                style={styles.detailInput}
                placeholder="Optional — what happened?"
                placeholderTextColor="#8B7FA8"
                value={currentAnswer.detailText}
                onChangeText={handleDetailChange}
                multiline
              />
            </View>
          </>
        ) : (
          <View style={styles.resultCard}>
            {isLowScore ? (
              <>
                <Text style={styles.resultTitle}>💡 Try this</Text>
                <Text style={styles.resultText}>{currentQ.advice}</Text>
              </>
            ) : (
              <>
                <Text style={styles.resultTitle}>✨ Nice!</Text>
                <Text style={styles.resultText}>
                  You're building these skills. Keep it up!
                </Text>
              </>
            )}
          </View>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>
            {submitting
              ? 'Saving...'
              : showResult && isLastQuestion
              ? 'Done'
              : showResult
              ? 'Next'
              : 'Continue'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0F0A1A',
  },
  scroll: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  header: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B7FA8',
    letterSpacing: 1,
    marginBottom: 8,
  },
  progress: {
    fontSize: 14,
    color: '#8B7FA8',
    marginBottom: 24,
  },
  questionCard: {
    backgroundColor: '#1A1429',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2D2640',
  },
  emoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 26,
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#8B7FA8',
    marginBottom: 8,
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  sliderDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2D2640',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderDotText: {
    color: '#8B7FA8',
    fontSize: 14,
    fontWeight: '700',
  },
  detailLabel: {
    fontSize: 14,
    color: '#C4B8DB',
    marginTop: 16,
    marginBottom: 8,
  },
  detailInput: {
    backgroundColor: '#0F0A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D2640',
    padding: 14,
    fontSize: 15,
    color: '#FFFFFF',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  resultCard: {
    backgroundColor: '#1A1429',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2D2640',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E8A94A',
    marginBottom: 12,
  },
  resultText: {
    fontSize: 16,
    color: '#C4B8DB',
    lineHeight: 24,
  },
  error: {
    color: '#FF6B6B',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6C5CE7',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  title: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
});
