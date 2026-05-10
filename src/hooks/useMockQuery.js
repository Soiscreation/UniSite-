import { useQuery } from '@tanstack/react-query'

export function useMockQuery(queryFn, deps = []) {
  const query = useQuery({
    queryKey: [queryFn.name || 'mock-query', ...deps],
    queryFn,
  })

  return {
    data: query.data || null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
