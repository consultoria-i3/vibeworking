// =============================================================================
// Vibe Working — API Utilities (error handling, retry, offline queue)
// =============================================================================
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from './supabase';

// ---------------------------------------------------------------------------
// Error wrapper
// ---------------------------------------------------------------------------
export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleSupabaseError(error: unknown): never {
  if (error && typeof error === 'object' && 'message' in error) {
    const e = error as { message: string; code?: string; details?: string };
    throw new ApiError(e.message, e.code);
  }
  throw new ApiError('Unknown error');
}

// ---------------------------------------------------------------------------
// Retry wrapper
// ---------------------------------------------------------------------------
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, delayMs * 2 ** attempt));
      }
    }
  }
  throw lastError;
}

// ---------------------------------------------------------------------------
// Offline Mutation Queue
// ---------------------------------------------------------------------------
const QUEUE_KEY = 'vw_offline_queue';

interface QueuedMutation {
  id: string;
  table: string;
  operation: 'insert' | 'update' | 'upsert' | 'delete';
  data?: Record<string, unknown>;
  match?: Record<string, unknown>;
  timestamp: number;
}

export async function queueMutation(mutation: Omit<QueuedMutation, 'id' | 'timestamp'>): Promise<void> {
  const queue = await getQueue();
  queue.push({
    ...mutation,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  });
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export async function getQueue(): Promise<QueuedMutation[]> {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function flushQueue(): Promise<{ succeeded: number; failed: number }> {
  const queue = await getQueue();
  if (queue.length === 0) return { succeeded: 0, failed: 0 };

  let succeeded = 0;
  let failed = 0;
  const remaining: QueuedMutation[] = [];

  for (const item of queue) {
    try {
      const builder = supabase.from(item.table);
      let query;

      switch (item.operation) {
        case 'insert':
          query = builder.insert(item.data!);
          break;
        case 'update':
          query = builder.update(item.data!).match(item.match!);
          break;
        case 'upsert':
          query = builder.upsert(item.data!);
          break;
        case 'delete':
          query = builder.delete().match(item.match!);
          break;
      }

      const { error } = await query;
      if (error) throw error;
      succeeded++;
    } catch {
      failed++;
      remaining.push(item);
    }
  }

  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
  return { succeeded, failed };
}

// Auto-flush when coming back online
export function startQueueSync(): () => void {
  const unsubscribe = NetInfo.addEventListener((state) => {
    if (state.isConnected) {
      flushQueue().catch(console.error);
    }
  });
  return unsubscribe;
}
