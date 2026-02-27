// =============================================================================
// Vibe Working — Database Types
// Auto-aligned with 001_initial_schema.sql
// =============================================================================

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
export type GraduationType = 'high_school' | 'college';
export type SubscriptionTier = 'free' | 'pro';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
export type VoteType = 'up' | 'down';

// ---------------------------------------------------------------------------
// Profiles
// ---------------------------------------------------------------------------
export interface Profile {
  id: string;
  display_name: string | null;
  graduation_type: GraduationType | null;
  job_title: string | null;
  industry: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  subscription_tier: SubscriptionTier;
  streak_count: number;
  last_checkin_date: string | null;
  phone: string | null;
  reminder_via: 'sms' | 'whatsapp' | null;
  reminder_phone: string | null;
  created_at: string;
  updated_at: string;
}

export type ProfileUpdate = Partial<Pick<
  Profile,
  'display_name' | 'graduation_type' | 'job_title' | 'industry' | 'avatar_url' | 'onboarding_completed' | 'phone' | 'reminder_via' | 'reminder_phone'
>>;

// ---------------------------------------------------------------------------
// Coaching Content
// ---------------------------------------------------------------------------
export interface CoachingCategory {
  id: string;
  slug: string;
  title: string;
  emoji: string | null;
  color: string | null;
  tagline: string | null;
  sort_order: number;
  version: number;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CoachingSection {
  id: string;
  category_id: string;
  title: string;
  icon: string | null;
  sort_order: number;
  version: number;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CoachingItem {
  id: string;
  section_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  version: number;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

// Nested content tree
export interface CoachingSectionWithItems extends CoachingSection {
  items: CoachingItem[];
}

export interface CoachingCategoryWithSections extends CoachingCategory {
  sections: CoachingSectionWithItems[];
}

// ---------------------------------------------------------------------------
// Check-in Questions & Tips
// ---------------------------------------------------------------------------
export interface CheckinQuestion {
  id: string;
  question: string;
  emoji: string | null;
  category: string | null;
  cat_color: string | null;
  sort_order: number;
  archived_at: string | null;
  created_at: string;
}

export interface CheckinQuestionTip {
  id: string;
  question_id: string;
  max_value: number;
  label: string;
  color: string | null;
  text: string;
  sort_order: number;
}

export interface CheckinQuestionWithTips extends CheckinQuestion {
  tips: CheckinQuestionTip[];
}

// ---------------------------------------------------------------------------
// Show me (image → text → tip)
// ---------------------------------------------------------------------------
export interface RecommendationGuideline {
  id: string;
  label: string;
  keywords: string[];
  tip_text: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ShowMeEntry {
  id: string;
  user_id: string;
  image_path: string | null;
  transcribed_text: string;
  tip_text: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Behavior Sliders
// ---------------------------------------------------------------------------
export interface BehaviorSlider {
  id: string;
  category_slug: string;
  title: string;
  emoji: string | null;
  sort_order: number;
  created_at: string;
}

export interface BehaviorSliderRec {
  id: string;
  slider_id: string;
  max_value: number;
  label: string;
  color: string | null;
  text: string;
  sort_order: number;
}

// ---------------------------------------------------------------------------
// Daily Check-ins
// ---------------------------------------------------------------------------
export interface DailyCheckin {
  id: string;
  user_id: string;
  checkin_date: string;
  overall_score: number | null;
  notes: string | null;
  created_at: string;
}

export interface CheckinAnswer {
  id: string;
  checkin_id: string;
  question_id: string;
  value: number; // 1–5 in 0.5 steps (app); DB stores 2–10
  detail_text: string | null;
  created_at: string;
}

export interface CheckinWithAnswers extends DailyCheckin {
  answers: CheckinAnswer[];
}

export interface CheckinInput {
  checkin_date?: string;
  overall_score?: number;
  notes?: string;
  answers: { question_id: string; value: number; detail_text?: string }[];
}

// ---------------------------------------------------------------------------
// Saved Items
// ---------------------------------------------------------------------------
export interface SavedItem {
  id: string;
  user_id: string;
  item_id: string;
  note: string | null;
  saved_at: string;
}

// ---------------------------------------------------------------------------
// Contacts
// ---------------------------------------------------------------------------
export interface Contact {
  id: string;
  user_id: string;
  name: string;
  relationship: string | null;
  photo_url: string | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type ContactInput = Pick<Contact, 'name'> &
  Partial<Pick<Contact, 'relationship' | 'photo_url' | 'notes' | 'sort_order'>>;

export interface DailyContactLog {
  id: string;
  user_id: string;
  contact_id: string;
  log_date: string;
  connected: boolean;
  note: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Boss Mood
// ---------------------------------------------------------------------------
export interface BossMoodEntry {
  id: string;
  user_id: string;
  overall_insight: string | null;
  created_at: string;
}

export interface BossMoodScale {
  id: string;
  entry_id: string;
  scale_name: string;
  value: number; // 1–100
  created_at: string;
}

export interface BossMoodEntryWithScales extends BossMoodEntry {
  scales: BossMoodScale[];
}

export interface BossMoodInput {
  overall_insight?: string;
  scales: { scale_name: string; value: number }[];
}

export const BOSS_MOOD_SCALES = [
  'hostile_friendly',
  'controlling_empowering',
  'fearful_confident',
  'closed_open',
  'tense_relaxed',
] as const;

// ---------------------------------------------------------------------------
// User Item Notes & Photos
// ---------------------------------------------------------------------------
export interface UserItemNote {
  id: string;
  user_id: string;
  item_ref: string;
  note_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserItemPhoto {
  id: string;
  note_id: string;
  photo_url: string;
  sort_order: number;
  uploaded_at: string;
}

export interface UserItemNoteWithPhotos extends UserItemNote {
  photos: UserItemPhoto[];
}

// ---------------------------------------------------------------------------
// Anonymous Questions
// ---------------------------------------------------------------------------
export interface AnonymousQuestion {
  id: string;
  user_id: string;
  question_text: string;
  is_active: boolean;
  vote_count: number;
  answer_count: number;
  created_at: string;
}

export interface AnonymousAnswer {
  id: string;
  question_id: string;
  user_id: string;
  answer_text: string;
  created_at: string;
}

export interface QuestionVote {
  id: string;
  question_id: string;
  user_id: string;
  vote: VoteType;
  created_at: string;
}

export interface QuestionWithAnswers extends AnonymousQuestion {
  answers: AnonymousAnswer[];
  user_vote?: VoteType | null;
}

// ---------------------------------------------------------------------------
// Subscriptions
// ---------------------------------------------------------------------------
export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: SubscriptionStatus;
  price_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Teams & Conversation Analysis
// ---------------------------------------------------------------------------
export interface Team {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

export interface ConversationAnalysis {
  id: string;
  user_id: string;
  team_id: string | null;
  other_member_name: string | null;
  conversation_text: string;
  recommendation_text: string;
  created_at: string;
}
