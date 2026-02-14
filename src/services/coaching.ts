// =============================================================================
// Vibe Working — Coaching Service
// =============================================================================
import { supabase } from '../lib/supabase';
import { handleSupabaseError, withRetry } from '../lib/api-utils';
import type {
  CoachingCategory,
  CoachingCategoryWithSections,
  CoachingSection,
  CoachingSectionWithItems,
  CoachingItem,
  CheckinQuestion,
  CheckinQuestionWithTips,
  BehaviorSlider,
  BehaviorSliderRec,
} from '../types/database';

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export async function getCategories(): Promise<CoachingCategory[]> {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('coaching_categories')
      .select('*')
      .is('archived_at', null)
      .order('sort_order');

    if (error) handleSupabaseError(error);
    return data!;
  });
}

// ---------------------------------------------------------------------------
// Full content tree: categories → sections → items
// ---------------------------------------------------------------------------
export async function getContentTree(): Promise<CoachingCategoryWithSections[]> {
  return withRetry(async () => {
    // Fetch all in parallel
    const [catRes, secRes, itemRes] = await Promise.all([
      supabase
        .from('coaching_categories')
        .select('*')
        .is('archived_at', null)
        .order('sort_order'),
      supabase
        .from('coaching_sections')
        .select('*')
        .is('archived_at', null)
        .order('sort_order'),
      supabase
        .from('coaching_items')
        .select('*')
        .is('archived_at', null)
        .order('sort_order'),
    ]);

    if (catRes.error) handleSupabaseError(catRes.error);
    if (secRes.error) handleSupabaseError(secRes.error);
    if (itemRes.error) handleSupabaseError(itemRes.error);

    const categories = catRes.data!;
    const sections = secRes.data!;
    const items = itemRes.data!;

    // Build item map: section_id → items[]
    const itemsBySection = new Map<string, CoachingItem[]>();
    for (const item of items) {
      const list = itemsBySection.get(item.section_id) ?? [];
      list.push(item);
      itemsBySection.set(item.section_id, list);
    }

    // Build section map: category_id → sections[]
    const sectionsByCategory = new Map<string, CoachingSectionWithItems[]>();
    for (const sec of sections) {
      const list = sectionsByCategory.get(sec.category_id) ?? [];
      list.push({ ...sec, items: itemsBySection.get(sec.id) ?? [] });
      sectionsByCategory.set(sec.category_id, list);
    }

    return categories.map((cat) => ({
      ...cat,
      sections: sectionsByCategory.get(cat.id) ?? [],
    }));
  });
}

// ---------------------------------------------------------------------------
// Sections by category
// ---------------------------------------------------------------------------
export async function getSections(categoryId: string): Promise<CoachingSection[]> {
  const { data, error } = await supabase
    .from('coaching_sections')
    .select('*')
    .eq('category_id', categoryId)
    .is('archived_at', null)
    .order('sort_order');

  if (error) handleSupabaseError(error);
  return data!;
}

// ---------------------------------------------------------------------------
// Items by section
// ---------------------------------------------------------------------------
export async function getItems(sectionId: string): Promise<CoachingItem[]> {
  const { data, error } = await supabase
    .from('coaching_items')
    .select('*')
    .eq('section_id', sectionId)
    .is('archived_at', null)
    .order('sort_order');

  if (error) handleSupabaseError(error);
  return data!;
}

// ---------------------------------------------------------------------------
// Check-in Questions with Tips
// ---------------------------------------------------------------------------
export async function getCheckinQuestions(): Promise<CheckinQuestionWithTips[]> {
  const [qRes, tRes] = await Promise.all([
    supabase
      .from('checkin_questions')
      .select('*')
      .is('archived_at', null)
      .order('sort_order'),
    supabase.from('checkin_question_tips').select('*').order('sort_order'),
  ]);

  if (qRes.error) handleSupabaseError(qRes.error);
  if (tRes.error) handleSupabaseError(tRes.error);

  const tipsByQuestion = new Map<string, typeof tRes.data>();
  for (const tip of tRes.data!) {
    const list = tipsByQuestion.get(tip.question_id) ?? [];
    list.push(tip);
    tipsByQuestion.set(tip.question_id, list);
  }

  return qRes.data!.map((q) => ({
    ...q,
    tips: tipsByQuestion.get(q.id) ?? [],
  }));
}

// ---------------------------------------------------------------------------
// Behavior Sliders with Recommendations
// ---------------------------------------------------------------------------
export async function getBehaviorSliders(
  categorySlug?: string,
): Promise<(BehaviorSlider & { recs: BehaviorSliderRec[] })[]> {
  let query = supabase.from('behavior_sliders').select('*').order('sort_order');
  if (categorySlug) query = query.eq('category_slug', categorySlug);

  const [sRes, rRes] = await Promise.all([
    query,
    supabase.from('behavior_slider_recs').select('*').order('sort_order'),
  ]);

  if (sRes.error) handleSupabaseError(sRes.error);
  if (rRes.error) handleSupabaseError(rRes.error);

  const recsBySlider = new Map<string, BehaviorSliderRec[]>();
  for (const rec of rRes.data!) {
    const list = recsBySlider.get(rec.slider_id) ?? [];
    list.push(rec);
    recsBySlider.set(rec.slider_id, list);
  }

  return sRes.data!.map((s) => ({
    ...s,
    recs: recsBySlider.get(s.id) ?? [],
  }));
}
