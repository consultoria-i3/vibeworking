/**
 * Vibe Working — Average score per category (boss, teammates, classmates) for card colors
 */
import { useState, useCallback, useEffect } from 'react';
import { getCategoryAverages, type CategoryAverages } from '../services/checkins';

export function useCategoryAverages(userId: string | undefined) {
  const [averages, setAverages] = useState<CategoryAverages>({
    boss: null,
    teammates: null,
    classmates: null,
  });

  const refresh = useCallback(async () => {
    if (!userId) return;
    const data = await getCategoryAverages(userId);
    setAverages(data);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { averages, refresh };
}
