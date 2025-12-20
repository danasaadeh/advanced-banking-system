
import {
  useSimplifiedQuery,
  useSimplifiedMutation,
  useSimplifiedInfiniteQuery,
  type SimplifiedQueryOptions,
  type SimplifiedMutationOptions,
} from './hooks';

import {
  queryClient,
  invalidateQueries,
  prefetchQuery,
  cancelQueries,
  resetQueryCache,
} from './query-client';

import {
  DEFAULT_QUERY_CONFIG,
  DEFAULT_MUTATION_CONFIG,
} from './defaults';

export {
  useSimplifiedQuery as useApiQuery,
  useSimplifiedMutation as useApiMutation,
  useSimplifiedInfiniteQuery as useApiInfiniteQuery,
  type SimplifiedQueryOptions as ApiQueryOptions,
  type SimplifiedMutationOptions as ApiMutationOptions,
};

export {
  queryClient,
  invalidateQueries,
  prefetchQuery,
  cancelQueries,
  resetQueryCache,
};

export {
  DEFAULT_QUERY_CONFIG,
  DEFAULT_MUTATION_CONFIG,
};


const queryFacade = {
  // Hooks
  useApiQuery: useSimplifiedQuery,
  useApiMutation: useSimplifiedMutation,
  useApiInfiniteQuery: useSimplifiedInfiniteQuery,
  
  // Query Client
  queryClient,
  invalidateQueries,
  prefetchQuery,
  cancelQueries,
  resetQueryCache,
  
  // Config
  DEFAULT_QUERY_CONFIG,
  DEFAULT_MUTATION_CONFIG,
};

export default queryFacade;
