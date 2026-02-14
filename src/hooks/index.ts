// =============================================================================
// Vibe Working — Domain Hooks
// Thin wrappers around services using useQuery / useMutation
// =============================================================================
import { useQuery, useMutation } from './useDataHooks';

// Services
import * as coaching from '../services/coaching';
import * as checkins from '../services/checkins';
import * as savedItems from '../services/savedItems';
import * as contacts from '../services/contacts';
import * as mood from '../services/mood';
import * as anonymous from '../services/anonymous';
import * as notes from '../services/notes';

// Types
import type {
  CheckinInput,
  ContactInput,
  BossMoodInput,
  VoteType,
} from '../types/database';

// ===========================================================================
// Coaching Content
// ===========================================================================
export function useContentTree() {
  return useQuery(() => coaching.getContentTree(), [], {
    refetchInterval: 24 * 60 * 60 * 1000, // refresh daily
  });
}

export function useCheckinQuestions() {
  return useQuery(() => coaching.getCheckinQuestions());
}

export function useBehaviorSliders(categorySlug?: string) {
  return useQuery(
    () => coaching.getBehaviorSliders(categorySlug),
    [categorySlug],
  );
}

// ===========================================================================
// Daily Check-ins
// ===========================================================================
export function useCheckinHistory(limit = 30) {
  return useQuery(() => checkins.getCheckinHistory(limit), [limit]);
}

export function useCheckinStats() {
  return useQuery(() => checkins.getCheckinStats());
}

export function useTodayCheckin() {
  return useQuery(() => checkins.getTodayCheckin());
}

export function useSaveCheckin() {
  return useMutation((input: CheckinInput) => checkins.saveCheckin(input));
}

// ===========================================================================
// Saved Items
// ===========================================================================
export function useSavedItems() {
  return useQuery(() => savedItems.getSavedItems());
}

export function useSaveItem() {
  return useMutation(({ itemId, note }: { itemId: string; note?: string }) =>
    savedItems.saveItem(itemId, note),
  );
}

export function useUnsaveItem() {
  return useMutation((itemId: string) => savedItems.unsaveItem(itemId));
}

// ===========================================================================
// Contacts
// ===========================================================================
export function useContacts() {
  return useQuery(() => contacts.getContacts());
}

export function useAddContact() {
  return useMutation((input: ContactInput) => contacts.addContact(input));
}

export function useUpdateContact() {
  return useMutation(
    ({ id, updates }: { id: string; updates: Partial<ContactInput> }) =>
      contacts.updateContact(id, updates),
  );
}

export function useDeleteContact() {
  return useMutation((id: string) => contacts.deleteContact(id));
}

export function useDailyLogs(date?: string) {
  return useQuery(() => contacts.getDailyLogs(date), [date]);
}

export function useLogContact() {
  return useMutation(
    ({ contactId, note }: { contactId: string; note?: string }) =>
      contacts.logDailyContact(contactId, note),
  );
}

// ===========================================================================
// Boss Mood
// ===========================================================================
export function useMoodHistory(limit = 30) {
  return useQuery(() => mood.getMoodHistory(limit), [limit]);
}

export function useMoodTrends(days = 7) {
  return useQuery(() => mood.getMoodTrends(days), [days]);
}

export function useSaveMood() {
  return useMutation((input: BossMoodInput) => mood.saveMoodEntry(input));
}

// ===========================================================================
// Anonymous Questions
// ===========================================================================
export function useQuestions(orderBy: 'recent' | 'popular' = 'recent') {
  return useQuery(() => anonymous.getQuestions(50, 0, orderBy), [orderBy]);
}

export function usePostQuestion() {
  return useMutation((text: string) => anonymous.postQuestion(text));
}

export function useAnswerQuestion() {
  return useMutation(
    ({ questionId, text }: { questionId: string; text: string }) =>
      anonymous.answerQuestion(questionId, text),
  );
}

export function useVoteQuestion() {
  return useMutation(
    ({ questionId, vote }: { questionId: string; vote: VoteType }) =>
      anonymous.voteQuestion(questionId, vote),
  );
}

// ===========================================================================
// User Item Notes & Photos
// ===========================================================================
export function useItemNote(itemRef: string) {
  return useQuery(() => notes.getOrCreateNote(itemRef), [itemRef]);
}

export function useSaveNote() {
  return useMutation(
    ({ itemRef, text }: { itemRef: string; text: string }) =>
      notes.saveNoteText(itemRef, text),
  );
}

export function useUploadPhoto() {
  return useMutation(
    ({ noteId, file }: { noteId: string; file: { uri: string; type: string; name: string } }) =>
      notes.uploadItemPhoto(noteId, file),
  );
}

export function useDeletePhoto() {
  return useMutation(
    ({ photoId, photoUrl }: { photoId: string; photoUrl: string }) =>
      notes.deleteItemPhoto(photoId, photoUrl),
  );
}

export function useItemsWithContent() {
  return useQuery(() => notes.getItemsWithContent());
}
