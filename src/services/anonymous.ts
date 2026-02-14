// =============================================================================
// Vibe Working — Anonymous Questions Service (Ask All of Us)
// =============================================================================
import { supabase } from '../lib/supabase';
import { handleSupabaseError } from '../lib/api-utils';
import type {
  AnonymousQuestion,
  AnonymousAnswer,
  QuestionVote,
  QuestionWithAnswers,
  VoteType,
} from '../types/database';

// ---------------------------------------------------------------------------
// List questions (with user's vote status)
// ---------------------------------------------------------------------------
export async function getQuestions(
  limit = 50,
  offset = 0,
  orderBy: 'recent' | 'popular' = 'recent',
): Promise<QuestionWithAnswers[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  let query = supabase
    .from('anonymous_questions')
    .select('*')
    .eq('is_active', true);

  if (orderBy === 'popular') {
    query = query.order('vote_count', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data: questions, error } = await query.range(offset, offset + limit - 1);
  if (error) handleSupabaseError(error);
  if (!questions || questions.length === 0) return [];

  // Batch fetch answers and user votes
  const questionIds = questions.map((q) => q.id);

  const [answersRes, votesRes] = await Promise.all([
    supabase
      .from('anonymous_answers')
      .select('*')
      .in('question_id', questionIds)
      .order('created_at', { ascending: true }),
    supabase
      .from('question_votes')
      .select('*')
      .in('question_id', questionIds)
      .eq('user_id', user.id),
  ]);

  const answersByQ = new Map<string, AnonymousAnswer[]>();
  for (const a of answersRes.data ?? []) {
    const list = answersByQ.get(a.question_id) ?? [];
    list.push(a);
    answersByQ.set(a.question_id, list);
  }

  const userVotesByQ = new Map<string, VoteType>();
  for (const v of votesRes.data ?? []) {
    userVotesByQ.set(v.question_id, v.vote);
  }

  return questions.map((q) => ({
    ...q,
    answers: answersByQ.get(q.id) ?? [],
    user_vote: userVotesByQ.get(q.id) ?? null,
  }));
}

// ---------------------------------------------------------------------------
// Post a question
// ---------------------------------------------------------------------------
export async function postQuestion(text: string): Promise<AnonymousQuestion> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('anonymous_questions')
    .insert({ user_id: user.id, question_text: text })
    .select()
    .single();

  if (error) handleSupabaseError(error);
  return data!;
}

// ---------------------------------------------------------------------------
// Answer a question
// ---------------------------------------------------------------------------
export async function answerQuestion(
  questionId: string,
  text: string,
): Promise<AnonymousAnswer> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('anonymous_answers')
    .insert({
      question_id: questionId,
      user_id: user.id,
      answer_text: text,
    })
    .select()
    .single();

  if (error) handleSupabaseError(error);
  return data!;
}

// ---------------------------------------------------------------------------
// Vote / toggle vote
// ---------------------------------------------------------------------------
export async function voteQuestion(
  questionId: string,
  vote: VoteType,
): Promise<{ action: 'voted' | 'changed' | 'removed' }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Check existing vote
  const { data: existing } = await supabase
    .from('question_votes')
    .select('*')
    .eq('question_id', questionId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    if (existing.vote === vote) {
      // Same vote → remove (toggle off)
      await supabase
        .from('question_votes')
        .delete()
        .eq('id', existing.id);
      return { action: 'removed' };
    } else {
      // Different vote → update
      await supabase
        .from('question_votes')
        .update({ vote })
        .eq('id', existing.id);
      return { action: 'changed' };
    }
  }

  // New vote
  const { error } = await supabase
    .from('question_votes')
    .insert({ question_id: questionId, user_id: user.id, vote });

  if (error) handleSupabaseError(error);
  return { action: 'voted' };
}
