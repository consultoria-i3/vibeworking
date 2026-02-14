// =============================================================================
// Vibe Working — User Item Notes & Photos Service
// =============================================================================
import { supabase } from '../lib/supabase';
import { handleSupabaseError } from '../lib/api-utils';
import type { UserItemNote, UserItemPhoto, UserItemNoteWithPhotos } from '../types/database';

// ---------------------------------------------------------------------------
// Get or create note for an item
// ---------------------------------------------------------------------------
export async function getOrCreateNote(itemRef: string): Promise<UserItemNoteWithPhotos> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Try to get existing
  const { data: existing } = await supabase
    .from('user_item_notes')
    .select('*')
    .eq('user_id', user.id)
    .eq('item_ref', itemRef)
    .maybeSingle();

  if (existing) {
    const { data: photos } = await supabase
      .from('user_item_photos')
      .select('*')
      .eq('note_id', existing.id)
      .order('sort_order');
    return { ...existing, photos: photos ?? [] };
  }

  // Create new
  const { data: note, error } = await supabase
    .from('user_item_notes')
    .insert({ user_id: user.id, item_ref: itemRef })
    .select()
    .single();

  if (error) handleSupabaseError(error);
  return { ...note!, photos: [] };
}

// ---------------------------------------------------------------------------
// Save note text (auto-save on blur)
// ---------------------------------------------------------------------------
export async function saveNoteText(itemRef: string, text: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('user_item_notes')
    .upsert(
      { user_id: user.id, item_ref: itemRef, note_text: text },
      { onConflict: 'user_id,item_ref' },
    );

  if (error) handleSupabaseError(error);
}

// ---------------------------------------------------------------------------
// Upload photo to Supabase Storage + link to note
// ---------------------------------------------------------------------------
export async function uploadItemPhoto(
  noteId: string,
  file: { uri: string; type: string; name: string },
): Promise<UserItemPhoto> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const filePath = `${user.id}/${noteId}/${Date.now()}-${file.name}`;

  // Upload to storage
  const response = await fetch(file.uri);
  const blob = await response.blob();

  const { error: uploadErr } = await supabase.storage
    .from('item-photos')
    .upload(filePath, blob, { contentType: file.type });

  if (uploadErr) handleSupabaseError(uploadErr);

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('item-photos')
    .getPublicUrl(filePath);

  // Get current max sort_order
  const { data: existing } = await supabase
    .from('user_item_photos')
    .select('sort_order')
    .eq('note_id', noteId)
    .order('sort_order', { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

  // Insert photo record
  const { data: photo, error: insertErr } = await supabase
    .from('user_item_photos')
    .insert({
      note_id: noteId,
      photo_url: urlData.publicUrl,
      sort_order: nextOrder,
    })
    .select()
    .single();

  if (insertErr) handleSupabaseError(insertErr);
  return photo!;
}

// ---------------------------------------------------------------------------
// Delete photo
// ---------------------------------------------------------------------------
export async function deleteItemPhoto(photoId: string, photoUrl: string): Promise<void> {
  // Extract path from URL for storage deletion
  const urlParts = photoUrl.split('/item-photos/');
  if (urlParts.length > 1) {
    await supabase.storage.from('item-photos').remove([urlParts[1]]);
  }

  const { error } = await supabase
    .from('user_item_photos')
    .delete()
    .eq('id', photoId);

  if (error) handleSupabaseError(error);
}

// ---------------------------------------------------------------------------
// Check which items have notes/photos (for colored dot indicator)
// ---------------------------------------------------------------------------
export async function getItemsWithContent(): Promise<Set<string>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase
    .from('user_item_notes')
    .select('item_ref, note_text')
    .eq('user_id', user.id);

  const withContent = new Set<string>();
  for (const note of data ?? []) {
    if (note.note_text && note.note_text.trim().length > 0) {
      withContent.add(note.item_ref);
    }
  }

  // Also check photos
  const { data: photos } = await supabase
    .from('user_item_photos')
    .select('note_id')
    .in(
      'note_id',
      (data ?? []).map((n) => n.item_ref), // This needs to be note IDs
    );

  // Simpler approach: get all notes that have photos
  const { data: notesWithPhotos } = await supabase
    .from('user_item_notes')
    .select('item_ref, user_item_photos(id)')
    .eq('user_id', user.id);

  for (const note of notesWithPhotos ?? []) {
    if ((note as any).user_item_photos?.length > 0) {
      withContent.add(note.item_ref);
    }
  }

  return withContent;
}
