/**
 * Vibe Working — Teams Hook
 */
import { useState, useCallback, useEffect } from 'react';
import * as teamsService from '../services/teams';
import type { Team } from '../types/database';

export function useTeams(userId: string | undefined) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) {
      setTeams([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const list = await teamsService.getMyTeams();
      setTeams(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load teams');
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createTeam = useCallback(async (name: string) => {
    const team = await teamsService.createTeam(name);
    await refresh();
    return team;
  }, [refresh]);

  const joinTeam = useCallback(async (inviteCode: string) => {
    const team = await teamsService.joinTeam(inviteCode);
    await refresh();
    return team;
  }, [refresh]);

  const leaveTeam = useCallback(async (teamId: string) => {
    await teamsService.leaveTeam(teamId);
    await refresh();
  }, [refresh]);

  return {
    teams,
    loading,
    error,
    refresh,
    createTeam,
    joinTeam,
    leaveTeam,
  };
}
