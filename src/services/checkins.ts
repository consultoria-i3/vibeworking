// =============================================================================
// Vibe Working — Check-ins Service
// =============================================================================
import { supabase, getSupabaseOrNull } from '../lib/supabase';
import { handleSupabaseError, queueMutation } from '../lib/api-utils';
import { SORT_ORDER_TO_RELATIONSHIP } from '../data/checkinQuestions';
import NetInfo from '@react-native-community/netinfo';
import type {
  DailyCheckin,
  CheckinAnswer,
  CheckinWithAnswers,
  CheckinInput,
} from '../types/database';

/** DB stores 2–10 (0.5 scale). Normalize to 1–5 for app. */
function normalizeAnswerValue(a: CheckinAnswer): CheckinAnswer {
  return { ...a, value: a.value >= 2 && a.value <= 10 ? a.value / 2 : a.value };
}

// ---------------------------------------------------------------------------
// Save a daily check-in with answers (transactional)
// ---------------------------------------------------------------------------
export async function saveCheckin(input: CheckinInput): Promise<CheckinWithAnswers> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const netState = await NetInfo.fetch();

  // Offline fallback
  if (!netState.isConnected) {
    await queueMutation({
      table: 'daily_checkins',
      operation: 'upsert',
      data: {
        user_id: user.id,
        checkin_date: input.checkin_date ?? new Date().toISOString().split('T')[0],
        overall_score: input.overall_score,
        notes: input.notes,
      },
    });
    // Return optimistic result
    return {
      id: 'offline-pending',
      user_id: user.id,
      checkin_date: input.checkin_date ?? new Date().toISOString().split('T')[0],
      overall_score: input.overall_score ?? null,
      notes: input.notes ?? null,
      created_at: new Date().toISOString(),
      answers: input.answers.map((a) => ({
        id: 'offline-pending',
        checkin_id: 'offline-pending',
        question_id: a.question_id,
        value: a.value,
        detail_text: a.detail_text ?? null,
        created_at: new Date().toISOString(),
      })),
    };
  }

  // Upsert check-in (unique on user_id + checkin_date)
  const { data: checkin, error: checkinErr } = await supabase
    .from('daily_checkins')
    .upsert(
      {
        user_id: user.id,
        checkin_date: input.checkin_date ?? new Date().toISOString().split('T')[0],
        overall_score: input.overall_score,
        notes: input.notes,
      },
      { onConflict: 'user_id,checkin_date' },
    )
    .select()
    .single();

  if (checkinErr) handleSupabaseError(checkinErr);

  // Delete old answers then insert new ones
  await supabase.from('checkin_answers').delete().eq('checkin_id', checkin!.id);

  const answerRows = input.answers.map((a) => ({
    checkin_id: checkin!.id,
    question_id: a.question_id,
    value: Math.round(a.value * 2), // store 2–10 for 1–5 (0.5 steps)
  }));

  const { data: answers, error: ansErr } = await supabase
    .from('checkin_answers')
    .insert(answerRows)
    .select();

  if (ansErr) handleSupabaseError(ansErr);

  return { ...checkin!, answers: (answers ?? []).map(normalizeAnswerValue) };
}

// ---------------------------------------------------------------------------
// Get check-in history (paginated)
// ---------------------------------------------------------------------------
export async function getCheckinHistory(
  limit = 30,
  offset = 0,
): Promise<CheckinWithAnswers[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: checkins, error } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('user_id', user.id)
    .order('checkin_date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) handleSupabaseError(error);
  if (!checkins || checkins.length === 0) return [];

  // Batch fetch all answers
  const checkinIds = checkins.map((c) => c.id);
  const { data: answers, error: ansErr } = await supabase
    .from('checkin_answers')
    .select('*')
    .in('checkin_id', checkinIds);

  if (ansErr) handleSupabaseError(ansErr);

  const answersByCheckin = new Map<string, CheckinAnswer[]>();
  for (const a of answers ?? []) {
    const list = answersByCheckin.get(a.checkin_id) ?? [];
    list.push(normalizeAnswerValue(a));
    answersByCheckin.set(a.checkin_id, list);
  }

  return checkins.map((c) => ({
    ...c,
    answers: answersByCheckin.get(c.id) ?? [],
  }));
}

// ---------------------------------------------------------------------------
// Get check-in stats (avg scores, streak info)
// ---------------------------------------------------------------------------
export interface CheckinStats {
  totalCheckins: number;
  averageScore: number | null;
  currentStreak: number;
  last7DaysScores: { date: string; score: number | null }[];
}

export async function getCheckinStats(): Promise<CheckinStats> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Profile for streak
  const { data: profile } = await supabase
    .from('profiles')
    .select('streak_count')
    .eq('id', user.id)
    .single();

  // Last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: recent, error } = await supabase
    .from('daily_checkins')
    .select('checkin_date, overall_score')
    .eq('user_id', user.id)
    .gte('checkin_date', sevenDaysAgo.toISOString().split('T')[0])
    .order('checkin_date', { ascending: true });

  if (error) handleSupabaseError(error);

  // Total count
  const { count } = await supabase
    .from('daily_checkins')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const scores = (recent ?? []).map((r) => r.overall_score).filter(Boolean) as number[];
  const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

  return {
    totalCheckins: count ?? 0,
    averageScore: avg ? Math.round(avg * 100) / 100 : null,
    currentStreak: profile?.streak_count ?? 0,
    last7DaysScores: (recent ?? []).map((r) => ({
      date: r.checkin_date,
      score: r.overall_score,
    })),
  };
}

// ---------------------------------------------------------------------------
// Get today's check-in (if exists)
// ---------------------------------------------------------------------------
export async function getTodayCheckin(): Promise<CheckinWithAnswers | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const today = new Date().toISOString().split('T')[0];

  const { data: checkin } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('user_id', user.id)
    .eq('checkin_date', today)
    .maybeSingle();

  if (!checkin) return null;

  const { data: answers } = await supabase
    .from('checkin_answers')
    .select('*')
    .eq('checkin_id', checkin.id);

  return { ...checkin, answers: (answers ?? []).map(normalizeAnswerValue) };
}

// ---------------------------------------------------------------------------
// Low-score reminders (answers with value <= 3 in app scale; DB stores 2–10)
// ---------------------------------------------------------------------------
export interface LowScoreReminder {
  id: string;
  checkin_date: string;
  question_id: string;
  question: string;
  emoji: string | null;
  advice: string;
  value: number; // 1–5 app scale
}

const REMINDER_DAYS = 14;
const DB_VALUE_MAX_FOR_LOW = 6; // app score 3 = DB value 6

export async function getLowScoreReminders(userId?: string): Promise<LowScoreReminder[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];
  let uid = userId;
  if (uid == null) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    uid = user.id;
  }

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - REMINDER_DAYS);
  const fromStr = fromDate.toISOString().split('T')[0];

  const { data: checkins, error: checkinErr } = await supabase
    .from('daily_checkins')
    .select('id, checkin_date')
    .eq('user_id', uid)
    .gte('checkin_date', fromStr)
    .order('checkin_date', { ascending: false });

  if (checkinErr) handleSupabaseError(checkinErr);
  if (!checkins?.length) return [];

  const checkinIds = checkins.map((c) => c.id);
  const { data: answers, error: ansErr } = await supabase
    .from('checkin_answers')
    .select('id, checkin_id, question_id, value')
    .in('checkin_id', checkinIds)
    .lte('value', DB_VALUE_MAX_FOR_LOW);

  if (ansErr) handleSupabaseError(ansErr);
  if (!answers?.length) return [];

  const questionIds = [...new Set(answers.map((a) => a.question_id))];
  const [questionsRes, tipsRes] = await Promise.all([
    supabase.from('checkin_questions').select('id, question, emoji').in('id', questionIds),
    supabase.from('checkin_question_tips').select('question_id, text').in('question_id', questionIds).eq('max_value', 3),
  ]);

  const questionsMap = new Map<string | number, { question: string; emoji: string | null }>();
  (questionsRes.data ?? []).forEach((q: { id: string; question: string; emoji: string | null }) => {
    questionsMap.set(q.id, { question: q.question, emoji: q.emoji });
  });
  const tipsMap = new Map<string | number, string>();
  (tipsRes.data ?? []).forEach((t: { question_id: string; text: string }) => {
    tipsMap.set(t.question_id, t.text);
  });

  const checkinDateMap = new Map<string, string>();
  checkins.forEach((c: { id: string; checkin_date: string }) => checkinDateMap.set(c.id, c.checkin_date));

  const reminders: LowScoreReminder[] = [];
  for (const a of answers) {
    const q = questionsMap.get(a.question_id);
    const advice = tipsMap.get(a.question_id);
    const date = checkinDateMap.get(a.checkin_id);
    if (!q || !advice || !date) continue;
    reminders.push({
      id: a.id,
      checkin_date: date,
      question_id: a.question_id,
      question: q.question,
      emoji: q.emoji,
      advice,
      value: a.value >= 2 && a.value <= 10 ? a.value / 2 : a.value,
    });
  }
  reminders.sort((a, b) => b.checkin_date.localeCompare(a.checkin_date));
  return reminders;
}

// ---------------------------------------------------------------------------
// Category average scores (for home grid card colors)
// ---------------------------------------------------------------------------
export interface CategoryAverages {
  boss: number | null;
  teammates: number | null;
  classmates: number | null;
}

export async function getCategoryAverages(userId?: string): Promise<CategoryAverages> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { boss: null, teammates: null, classmates: null };
  let uid = userId;
  if (uid == null) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { boss: null, teammates: null, classmates: null };
    uid = user.id;
  }
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 14);
  const fromStr = fromDate.toISOString().split('T')[0];
  const { data: checkins } = await supabase
    .from('daily_checkins')
    .select('id')
    .eq('user_id', uid)
    .gte('checkin_date', fromStr);
  if (!checkins?.length) return { boss: null, teammates: null, classmates: null };
  const checkinIds = checkins.map((c) => c.id);
  const { data: answers } = await supabase
    .from('checkin_answers')
    .select('question_id, value')
    .in('checkin_id', checkinIds);
  if (!answers?.length) return { boss: null, teammates: null, classmates: null };
  const { data: questions } = await supabase
    .from('checkin_questions')
    .select('id, sort_order');
  const qIdToSort = new Map<string, number>();
  (questions ?? []).forEach((q: { id: string; sort_order: number }) => qIdToSort.set(q.id, q.sort_order));
  const byCat: Record<string, number[]> = { boss: [], teammates: [], classmates: [] };
  for (const a of answers) {
    const sortOrder = qIdToSort.get(a.question_id);
    if (sortOrder == null) continue;
    const cat = SORT_ORDER_TO_RELATIONSHIP[sortOrder];
    if (!cat || !byCat[cat]) continue;
    const appValue = a.value >= 2 && a.value <= 10 ? a.value / 2 : a.value;
    byCat[cat].push(appValue);
  }
  const avg = (arr: number[]) =>
    arr.length > 0 ? arr.reduce((s, v) => s + v, 0) / arr.length : null;
  return {
    boss: avg(byCat.boss),
    teammates: avg(byCat.teammates),
    classmates: avg(byCat.classmates),
  };
}
