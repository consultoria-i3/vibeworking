// =============================================================================
// Vibe Working — Saved Items Service ("It Worked!")
// =============================================================================
import { supabase } from '../lib/supabase';
import { handleSupabaseError } from '../lib/api-utils';
import type { SavedItem } from '../types/database';

export async function getSavedItems(): Promise<SavedItem[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('saved_items')
    .select('*')
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false });

  if (error) handleSupabaseError(error);
  return data!;
}

export async function saveItem(itemId: string, note?: string): Promise<SavedItem> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('saved_items')
    .upsert(
      { user_id: user.id, item_id: itemId, note },
      { onConflict: 'user_id,item_id' },
    )
    .select()
    .single();

  if (error) handleSupabaseError(error);
  return data!;
}

export async function unsaveItem(itemId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('saved_items')
    .delete()
    .eq('user_id', user.id)
    .eq('item_id', itemId);

  if (error) handleSupabaseError(error);
}

export async function isItemSaved(itemId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { count } = await supabase
    .from('saved_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('item_id', itemId);

  return (count ?? 0) > 0;
}

export async function updateSavedNote(itemId: string, note: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('saved_items')
    .update({ note })
    .eq('user_id', user.id)
    .eq('item_id', itemId);

  if (error) handleSupabaseError(error);
}
