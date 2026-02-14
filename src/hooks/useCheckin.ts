/**
 * Vibe Working — Check-in Hook
 * 6/day limit, persistence, today's count
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { CheckinQuestionData } from '../data/checkinQuestions';

const MAX_CHECKINS_PER_DAY = 6;

export interface CheckinAnswerInput {
  questionId: string;
  value: number; // 1-5
  detailText?: string;
}

export interface CheckinSession {
  id: string;
  answers: CheckinAnswerInput[];
}

export function useCheckin(userId: string | undefined) {
  const [todayCount, setTodayCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const fetchTodayCount = useCallback(async () => {
    if (!userId || !supabase) {
      setLoading(false);
      return;
    }
    const { count, error } = await supabase
      .from('daily_checkins')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('checkin_date', today);
    if (!error) setTodayCount(count ?? 0);
    setLoading(false);
  }, [userId, today]);

  useEffect(() => {
    fetchTodayCount();
  }, [fetchTodayCount]);

  const canCheckin = todayCount < MAX_CHECKINS_PER_DAY;
  const isComplete = todayCount >= MAX_CHECKINS_PER_DAY;

  const submitCheckin = useCallback(
    async (answers: CheckinAnswerInput[], questions: CheckinQuestionData[]) => {
      if (!userId || !supabase) return { error: 'Not authenticated' };
      if (todayCount >= MAX_CHECKINS_PER_DAY) return { error: 'Daily limit reached' };

      const overallScore =
        answers.length > 0
          ? answers.reduce((s, a) => s + a.value, 0) / answers.length
          : null;

      const { data: checkin, error: checkinErr } = await supabase
        .from('daily_checkins')
        .insert({
          user_id: userId,
          checkin_date: today,
          overall_score: overallScore ? Math.round(overallScore * 100) / 100 : null,
        })
        .select('id')
        .single();

      if (checkinErr || !checkin) return { error: checkinErr?.message ?? 'Failed to create check-in' };

      // Map client question ids to DB question ids - we use sortOrder to match
      // For now, we need question UUIDs from DB. Fallback: store with question text as ref if no DB ids.
      // The seed uses sort_order 1-38. We'll fetch question ids by sort_order or use a different approach.
      const questionIdMap = new Map<number, string>();
      const { data: dbQuestions } = await supabase
        .from('checkin_questions')
        .select('id, sort_order');
      if (dbQuestions) {
        dbQuestions.forEach((q: { id: string; sort_order: number }) => {
          questionIdMap.set(q.sort_order, q.id);
        });
      }

      const answerRows = answers
        .map((a) => {
          const q = questions.find((q) => q.id === a.questionId);
          const sortOrder = q?.sortOrder ?? parseInt(a.questionId.replace('q', ''), 10);
          const dbId = questionIdMap.get(sortOrder);
          return dbId
            ? {
                checkin_id: checkin.id,
                question_id: dbId,
                value: a.value,
                detail_text: a.detailText ?? null,
              }
            : null;
        })
        .filter((r): r is NonNullable<typeof r> => r !== null);
      if (answerRows.length > 0) {
        const { error: answersErr } = await supabase
          .from('checkin_answers')
          .insert(answerRows);
        if (answersErr) return { error: answersErr.message };
      }

      setTodayCount((c) => c + 1);
      return { success: true };
    },
    [userId, today, todayCount]
  );

  return {
    todayCount,
    canCheckin,
    isComplete,
    loading,
    submitCheckin,
    refresh: fetchTodayCount,
  };
}
