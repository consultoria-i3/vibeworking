// =============================================================================
// Vibe Working — Boss Mood Service (Energy Check-in)
// =============================================================================
import { supabase } from '../lib/supabase';
import { handleSupabaseError } from '../lib/api-utils';
import type {
  BossMoodEntry,
  BossMoodScale,
  BossMoodEntryWithScales,
  BossMoodInput,
} from '../types/database';

// ---------------------------------------------------------------------------
// Save mood entry with all 5 scales
// ---------------------------------------------------------------------------
export async function saveMoodEntry(input: BossMoodInput): Promise<BossMoodEntryWithScales> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Insert entry
  const { data: entry, error: entryErr } = await supabase
    .from('boss_mood_entries')
    .insert({
      user_id: user.id,
      overall_insight: input.overall_insight,
    })
    .select()
    .single();

  if (entryErr) handleSupabaseError(entryErr);

  // Insert scales
  const scaleRows = input.scales.map((s) => ({
    entry_id: entry!.id,
    scale_name: s.scale_name,
    value: s.value,
  }));

  const { data: scales, error: scaleErr } = await supabase
    .from('boss_mood_scales')
    .insert(scaleRows)
    .select();

  if (scaleErr) handleSupabaseError(scaleErr);

  return { ...entry!, scales: scales! };
}

// ---------------------------------------------------------------------------
// Get mood history (with scales)
// ---------------------------------------------------------------------------
export async function getMoodHistory(limit = 30): Promise<BossMoodEntryWithScales[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: entries, error } = await supabase
    .from('boss_mood_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) handleSupabaseError(error);
  if (!entries || entries.length === 0) return [];

  const entryIds = entries.map((e) => e.id);
  const { data: scales, error: scaleErr } = await supabase
    .from('boss_mood_scales')
    .select('*')
    .in('entry_id', entryIds);

  if (scaleErr) handleSupabaseError(scaleErr);

  const scalesByEntry = new Map<string, BossMoodScale[]>();
  for (const s of scales ?? []) {
    const list = scalesByEntry.get(s.entry_id) ?? [];
    list.push(s);
    scalesByEntry.set(s.entry_id, list);
  }

  return entries.map((e) => ({
    ...e,
    scales: scalesByEntry.get(e.id) ?? [],
  }));
}

// ---------------------------------------------------------------------------
// Get last 7 entries for sparkline trends
// ---------------------------------------------------------------------------
export interface MoodTrendPoint {
  date: string;
  scales: Record<string, number>;
  avgValue: number;
}

export async function getMoodTrends(days = 7): Promise<MoodTrendPoint[]> {
  const history = await getMoodHistory(days);

  return history.reverse().map((entry) => {
    const scaleMap: Record<string, number> = {};
    let sum = 0;
    for (const s of entry.scales) {
      scaleMap[s.scale_name] = s.value;
      sum += s.value;
    }
    return {
      date: entry.created_at,
      scales: scaleMap,
      avgValue: entry.scales.length > 0 ? Math.round(sum / entry.scales.length) : 0,
    };
  });
}
