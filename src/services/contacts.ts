// =============================================================================
// Vibe Working — Contacts Service (Classmates)
// =============================================================================
import { supabase } from '../lib/supabase';
import { handleSupabaseError } from '../lib/api-utils';
import type { Contact, ContactInput, DailyContactLog } from '../types/database';

// ---------------------------------------------------------------------------
// Contacts CRUD
// ---------------------------------------------------------------------------
export async function getContacts(): Promise<Contact[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', user.id)
    .order('sort_order');

  if (error) handleSupabaseError(error);
  return data!;
}

export async function addContact(input: ContactInput): Promise<Contact> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('contacts')
    .insert({ ...input, user_id: user.id })
    .select()
    .single();

  if (error) handleSupabaseError(error);
  return data!;
}

export async function updateContact(
  contactId: string,
  updates: Partial<ContactInput>,
): Promise<Contact> {
  const { data, error } = await supabase
    .from('contacts')
    .update(updates)
    .eq('id', contactId)
    .select()
    .single();

  if (error) handleSupabaseError(error);
  return data!;
}

export async function deleteContact(contactId: string): Promise<void> {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', contactId);

  if (error) handleSupabaseError(error);
}

export async function reorderContacts(
  orderedIds: string[],
): Promise<void> {
  // Batch update sort_order
  const updates = orderedIds.map((id, i) =>
    supabase.from('contacts').update({ sort_order: i }).eq('id', id),
  );
  await Promise.all(updates);
}

// ---------------------------------------------------------------------------
// Daily Contact Logs
// ---------------------------------------------------------------------------
export async function logDailyContact(
  contactId: string,
  note?: string,
  date?: string,
): Promise<DailyContactLog> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('daily_contact_logs')
    .upsert(
      {
        user_id: user.id,
        contact_id: contactId,
        log_date: date ?? new Date().toISOString().split('T')[0],
        connected: true,
        note,
      },
      { onConflict: 'user_id,contact_id,log_date' },
    )
    .select()
    .single();

  if (error) handleSupabaseError(error);
  return data!;
}

export async function getDailyLogs(date?: string): Promise<DailyContactLog[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const targetDate = date ?? new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_contact_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('log_date', targetDate);

  if (error) handleSupabaseError(error);
  return data!;
}

export async function getContactLogHistory(
  contactId: string,
  limit = 30,
): Promise<DailyContactLog[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('daily_contact_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('contact_id', contactId)
    .order('log_date', { ascending: false })
    .limit(limit);

  if (error) handleSupabaseError(error);
  return data!;
}
