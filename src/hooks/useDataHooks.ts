// =============================================================================
// Vibe Working — Generic Data Hooks
// =============================================================================
import { useState, useEffect, useCallback, useRef } from 'react';

// ---------------------------------------------------------------------------
// useQuery — generic async data fetcher with caching
// ---------------------------------------------------------------------------
interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseQueryOptions {
  enabled?: boolean;
  refetchInterval?: number; // ms
}

export function useQuery<T>(
  queryFn: () => Promise<T>,
  deps: unknown[] = [],
  options: UseQueryOptions = {},
) {
  const { enabled = true, refetchInterval } = options;
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    if (!enabled) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await queryFn();
      if (mountedRef.current) {
        setState({ data, loading: false, error: null });
      }
    } catch (err) {
      if (mountedRef.current) {
        setState((s) => ({
          ...s,
          loading: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        }));
      }
    }
  }, [enabled, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true;
    fetch();
    return () => {
      mountedRef.current = false;
    };
  }, [fetch]);

  // Optional polling
  useEffect(() => {
    if (!refetchInterval || !enabled) return;
    const interval = setInterval(fetch, refetchInterval);
    return () => clearInterval(interval);
  }, [refetchInterval, enabled, fetch]);

  return { ...state, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useMutation — generic async mutator with optimistic updates
// ---------------------------------------------------------------------------
interface MutationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseMutationOptions<TData, TInput> {
  onSuccess?: (data: TData, input: TInput) => void;
  onError?: (error: string, input: TInput) => void;
  onSettled?: () => void;
}

export function useMutation<TData, TInput = void>(
  mutationFn: (input: TInput) => Promise<TData>,
  options: UseMutationOptions<TData, TInput> = {},
) {
  const [state, setState] = useState<MutationState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (input: TInput) => {
      setState({ data: null, loading: true, error: null });
      try {
        const data = await mutationFn(input);
        setState({ data, loading: false, error: null });
        options.onSuccess?.(data, input);
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setState((s) => ({ ...s, loading: false, error: message }));
        options.onError?.(message, input);
        throw err;
      } finally {
        options.onSettled?.();
      }
    },
    [mutationFn], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, mutate, reset };
}
