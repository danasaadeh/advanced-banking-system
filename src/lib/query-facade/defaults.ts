
export const DEFAULT_QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000, 
  retryDelay: (attemptIndex: number) => 
    Math.min(1000 * 2 ** attemptIndex, 30000),
  refetchOnWindowFocus: false,
  refetchOnMount: true,
  refetchOnReconnect: true,
};

export const DEFAULT_MUTATION_CONFIG = {
  retry: 1,
  retryDelay: 1000,
};