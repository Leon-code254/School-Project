import { useState, useEffect, useCallback } from 'react';
import cacheService from '../services/cacheService';

interface UseCachedDataOptions<T> {
  key: string;
  fetchFn: () => Promise<T>;
  ttl?: number;
  deps?: any[];
  initialData?: T | null;
}

interface CachedDataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useCachedData<T>({
  key,
  fetchFn,
  ttl,
  deps = [],
  initialData = null,
}: UseCachedDataOptions<T>): CachedDataState<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (skipCache = false) => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      if (!skipCache) {
        const cachedData = cacheService.get<T>(key);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh data
      const freshData = await fetchFn();
      
      // Cache the response
      cacheService.set(key, freshData, ttl);
      
      setData(freshData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      // Log error but don't throw to prevent crashing the app
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [key, fetchFn, ttl]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData, ...deps]);

  const refetch = useCallback(() => fetchData(true), [fetchData]);

  return { data, loading, error, refetch };
}

export default useCachedData;