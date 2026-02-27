/**
 * Vibe Working — Low-score reminders (questions answered 3 or below)
 */
import { useState, useCallback, useEffect } from 'react';
import { getLowScoreReminders, type LowScoreReminder } from '../services/checkins';

export function useReminders(userId: string | undefined) {
  const [reminders, setReminders] = useState<LowScoreReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) {
      setReminders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const list = await getLowScoreReminders(userId);
      setReminders(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load reminders');
      setReminders([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { reminders, loading, error, refresh };
}
