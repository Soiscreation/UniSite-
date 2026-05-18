import { useQuery } from '@tanstack/react-query'

export function useMockQuery<T>(queryFn: () => Promise<T>, deps: unknown[] = []) {
  const query = useQuery<T>({
    queryKey: [queryFn.name || 'mock-query', ...deps],
    queryFn,
  })

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
