// =============================================================================
// Vibe Working — Show me: image → text (OCR) → tip from guidelines
// =============================================================================
import { supabase } from '../lib/supabase';
import type { RecommendationGuideline, ShowMeEntry } from '../types/database';

const SHOW_ME_BUCKET = 'show-me';

/** Fetch all recommendation guidelines from DB, ordered by sort_order */
export async function getGuidelines(): Promise<RecommendationGuideline[]> {
  const { data, error } = await supabase
    .from('recommendation_guidelines')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return getDefaultGuidelines();
  return (data ?? []) as RecommendationGuideline[];
}

/** In-memory fallback if DB not yet migrated or empty */
function getDefaultGuidelines(): RecommendationGuideline[] {
  return [
    { id: '1', label: 'Meeting', keywords: ['meeting', 'agenda', 'schedule'], tip_text: 'Send a short agenda 24h before. One line per topic.', sort_order: 10, created_at: '', updated_at: '' },
    { id: '2', label: 'Email', keywords: ['email', 'follow-up', 'reply'], tip_text: 'Reply within 24h even if just "Got it — will get back by [date]."', sort_order: 20, created_at: '', updated_at: '' },
    { id: 'default', label: 'Default', keywords: [], tip_text: 'Pick one small action you can do in the next 24 hours. Write it down or tell someone.', sort_order: 999, created_at: '', updated_at: '' },
  ];
}

/** Match transcribed text to a guideline by keywords; return tip_text (and label). */
export function getTipFromText(
  text: string,
  guidelines: RecommendationGuideline[]
): { tipText: string; label: string } {
  const lower = (text || '').toLowerCase().trim();
  if (!lower) {
    const def = guidelines.find((g) => g.sort_order >= 900) ?? guidelines[guidelines.length - 1];
    return { tipText: def?.tip_text ?? 'Snap a photo of text for a tailored tip.', label: def?.label ?? 'Default' };
  }
  for (const g of guidelines) {
    if (!g.keywords?.length) continue;
    for (const kw of g.keywords) {
      if (kw && lower.includes(kw.toLowerCase())) {
        return { tipText: g.tip_text, label: g.label };
      }
    }
  }
  const def = guidelines.find((g) => g.sort_order >= 900) ?? guidelines[guidelines.length - 1];
  return { tipText: def?.tip_text ?? 'Pick one small action in the next 24 hours.', label: def?.label ?? 'Default' };
}

/** Run OCR on image (Tesseract). Works on web; may work on native in some setups. */
export async function transcribeImage(imageUri: string): Promise<string> {
  try {
    const Tesseract = await import('tesseract.js');
    const { data } = await Tesseract.recognize(imageUri, 'eng', { logger: () => {} });
    return (data?.text ?? '').trim();
  } catch {
    return '';
  }
}

/** Upload image to storage show-me/{userId}/{uuid}.ext; return storage path. */
export async function uploadShowMeImage(userId: string, uri: string, mimeType: string = 'image/jpeg'): Promise<string | null> {
  const ext = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
  const name = `${userId}/${crypto.randomUUID()}.${ext}`;
  let body: Blob | ArrayBuffer;
  try {
    const res = await fetch(uri);
    body = await res.arrayBuffer();
  } catch {
    return null;
  }
  const { error } = await supabase.storage.from(SHOW_ME_BUCKET).upload(name, body, {
    contentType: mimeType,
    upsert: false,
  });
  if (error) return null;
  return name;
}

/** Insert a show_me_entries row. */
export async function saveShowMeEntry(
  userId: string,
  imagePath: string | null,
  transcribedText: string,
  tipText: string
): Promise<ShowMeEntry | null> {
  const { data, error } = await supabase
    .from('show_me_entries')
    .insert({
      user_id: userId,
      image_path: imagePath,
      transcribed_text: transcribedText,
      tip_text: tipText,
    })
    .select('*')
    .single();
  if (error) return null;
  return data as ShowMeEntry;
}

/** List recent show_me_entries for the user. */
export async function getShowMeEntries(userId: string, limit = 10): Promise<ShowMeEntry[]> {
  const { data, error } = await supabase
    .from('show_me_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data ?? []) as ShowMeEntry[];
}
