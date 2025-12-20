
import { QueryClient } from '@tanstack/react-query';
import { DEFAULT_QUERY_CONFIG } from './defaults';


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: DEFAULT_QUERY_CONFIG,
    mutations: {
      onError: (error: unknown) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

export function invalidateQueries(queryKey: any[]) {
  return queryClient.invalidateQueries({ queryKey });
}

export async function prefetchQuery<T>(
  queryKey: any[],
  queryFn: () => Promise<T>
) {
  return queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });
}


export function cancelQueries(queryKey: any[]) {
  return queryClient.cancelQueries({ queryKey });
}

export function resetQueryCache() {
  return queryClient.clear();
}