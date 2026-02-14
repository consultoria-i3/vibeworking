// =============================================================================
// Vibe Working — Check-ins Service
// =============================================================================
import { supabase } from '../lib/supabase';
import { handleSupabaseError, queueMutation } from '../lib/api-utils';
import NetInfo from '@react-native-community/netinfo';
import type {
  DailyCheckin,
  CheckinAnswer,
  CheckinWithAnswers,
  CheckinInput,
} from '../types/database';

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
    value: a.value,
  }));

  const { data: answers, error: ansErr } = await supabase
    .from('checkin_answers')
    .insert(answerRows)
    .select();

  if (ansErr) handleSupabaseError(ansErr);

  return { ...checkin!, answers: answers! };
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
    list.push(a);
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

  return { ...checkin, answers: answers ?? [] };
}
