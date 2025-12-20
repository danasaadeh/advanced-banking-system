
import { 
  useQuery, 
  useMutation, 
  useInfiniteQuery,
  type UseQueryOptions,
  type UseMutationOptions,
  type UseInfiniteQueryOptions,
  type QueryKey,
  type InfiniteData,
} from '@tanstack/react-query';
import { toast } from '@/shared/components/ui/sonner';
import { DEFAULT_QUERY_CONFIG, DEFAULT_MUTATION_CONFIG } from './defaults';


export interface SimplifiedQueryOptions<
  TData = unknown,
  TError = Error,
  TQueryKey extends QueryKey = QueryKey
> {
  key: TQueryKey;
  fetcher: () => Promise<TData>;
  successMessage?: string;
  getSuccessMessage?: (data: TData) => string;
  errorMessage?: string;
  hideErrorToast?: boolean;
  hideSuccessToast?: boolean;
  enabled?: boolean;
  extraOptions?: Omit<
    UseQueryOptions<TData, TError, TData, TQueryKey>, 
    'queryKey' | 'queryFn' | 'enabled'
  >;
}

export interface SimplifiedMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void
> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  successMessage?: string;
  getSuccessMessage?: (data: TData, variables: TVariables) => string;
  errorMessage?: string;
  hideErrorToast?: boolean;
  hideSuccessToast?: boolean;
  extraOptions?: Omit<
    UseMutationOptions<TData, TError, TVariables>, 
    'mutationFn'
  >;
}


export function useSimplifiedQuery<
  TData = unknown,
  TError = Error,
  TQueryKey extends QueryKey = QueryKey
>(options: SimplifiedQueryOptions<TData, TError, TQueryKey>) {
  const { 
    key, 
    fetcher, 
    successMessage,
    getSuccessMessage,
    errorMessage = 'Failed to fetch data',
    hideErrorToast = false,
    hideSuccessToast = false,
    enabled = true,
    extraOptions = {},
  } = options;

  return useQuery({
    ...DEFAULT_QUERY_CONFIG,
    ...extraOptions,
    queryKey: key,
    enabled,
    queryFn: async () => {
      try {
        const data = await fetcher();
        if (!hideSuccessToast) {
          const message = getSuccessMessage 
            ? getSuccessMessage(data)
            : successMessage;
          if (message) {
            toast.success(message, { duration: 3000 });
          }
        }
        return data;
      } catch (error) {
        if (!hideErrorToast) {
          const message = error instanceof Error 
            ? error.message 
            : errorMessage;
          toast.error(message, { duration: 3000 });
        }
        throw error;
      }
    },
  });
}

export function useSimplifiedMutation<
  TData = unknown,
  TError = Error,
  TVariables = void
>(options: SimplifiedMutationOptions<TData, TError, TVariables>) {
  const {
    mutationFn,
    successMessage,
    getSuccessMessage,
    errorMessage = 'Operation failed',
    hideErrorToast = false,
    hideSuccessToast = false,
    extraOptions = {},
  } = options;

  return useMutation({
    ...DEFAULT_MUTATION_CONFIG,
    ...extraOptions,
    mutationFn: async (variables: TVariables) => {
      try {
        return await mutationFn(variables);
      } catch (error) {
        if (!hideErrorToast) {
          const message = error instanceof Error 
            ? error.message 
            : errorMessage;
          toast.error(message, { duration: 3000 });
        }
        throw error;
      }
    },
    onSuccess: (data, variables, context) => {
      if (!hideSuccessToast) {
        const message = getSuccessMessage
          ? getSuccessMessage(data, variables)
          : successMessage;
        if (message) {
          toast.success(message, { duration: 3000 });
        }
      }
      
      if (extraOptions.onSuccess) {
        extraOptions.onSuccess(data, variables, context);
      }
    },
  });
}

export function useSimplifiedInfiniteQuery<
  TData = unknown,
  TError = Error,
  TQueryKey extends QueryKey = QueryKey
>(options: {
  key: TQueryKey;
  fetcher: (pageParam: any) => Promise<TData>;
  getNextPageParam: (lastPage: TData, allPages: TData[]) => any | undefined;
  successMessage?: string;
  errorMessage?: string;
  hideErrorToast?: boolean;
  hideSuccessToast?: boolean;
  extraOptions?: Omit<
    UseInfiniteQueryOptions<TData, TError, InfiniteData<TData>, TData, TQueryKey>,
    'queryKey' | 'queryFn' | 'getNextPageParam'
  >;
}) {
  const { 
    key, 
    fetcher, 
    successMessage,
    errorMessage = 'Failed to fetch data',
    hideErrorToast = false,
    hideSuccessToast = false,
    extraOptions = {},
    getNextPageParam,
  } = options;

  return useInfiniteQuery({
    ...DEFAULT_QUERY_CONFIG,
    ...extraOptions,
    queryKey: key,
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const data = await fetcher(pageParam);
        if (!hideSuccessToast && successMessage) {
          toast.success(successMessage, { duration: 3000 });
        }
        return data;
      } catch (error) {
        if (!hideErrorToast) {
          const message = error instanceof Error 
            ? error.message 
            : errorMessage;
          toast.error(message, { duration: 3000 });
        }
        throw error;
      }
    },
    getNextPageParam,
  });
}