// =============================================================================
// Vibe Working — Teams Service
// =============================================================================
import { supabase } from '../lib/supabase';
import { handleSupabaseError } from '../lib/api-utils';
import type { Team, TeamMember } from '../types/database';

function randomInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function getMyTeams(): Promise<Team[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: memberRows } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id);

  if (!memberRows?.length) return [];

  const teamIds = memberRows.map((r) => r.team_id);
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .in('id', teamIds)
    .order('created_at', { ascending: false });

  if (error) handleSupabaseError(error);
  return data ?? [];
}

export async function createTeam(name: string): Promise<Team> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  let inviteCode = randomInviteCode();
  let attempts = 0;
  while (attempts < 10) {
    const { data: existing } = await supabase.from('teams').select('id').eq('invite_code', inviteCode).single();
    if (!existing) break;
    inviteCode = randomInviteCode();
    attempts++;
  }

  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert({ name, invite_code: inviteCode, created_by: user.id })
    .select()
    .single();

  if (teamError) handleSupabaseError(teamError);

  const { error: memberError } = await supabase
    .from('team_members')
    .insert({ team_id: team!.id, user_id: user.id, role: 'admin' });

  if (memberError) handleSupabaseError(memberError);
  return team!;
}

export async function joinTeam(inviteCode: string): Promise<Team> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const code = inviteCode.trim().toUpperCase();
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('*')
    .eq('invite_code', code)
    .single();

  if (teamError || !team) throw new Error('Invalid or expired invite code');

  const { error: memberError } = await supabase
    .from('team_members')
    .insert({ team_id: team.id, user_id: user.id, role: 'member' });

  if (memberError) {
    if (memberError.code === '23505') throw new Error('You are already in this team');
    handleSupabaseError(memberError);
  }
  return team;
}

export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('team_id', teamId)
    .order('joined_at');

  if (error) handleSupabaseError(error);
  return data ?? [];
}

export async function leaveTeam(teamId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('team_id', teamId)
    .eq('user_id', user.id);

  if (error) handleSupabaseError(error);
}

export async function saveConversationAnalysis(params: {
  teamId?: string;
  otherMemberName?: string;
  conversationText: string;
  recommendationText: string;
}): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from('conversation_analyses').insert({
    user_id: user.id,
    team_id: params.teamId ?? null,
    other_member_name: params.otherMemberName ?? null,
    conversation_text: params.conversationText,
    recommendation_text: params.recommendationText,
  });

  if (error) handleSupabaseError(error);
}
