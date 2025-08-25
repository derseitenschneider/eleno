import type {
  QueryObserverLoadingErrorResult,
  QueryObserverLoadingResult,
  QueryObserverSuccessResult,
  UseQueryResult,
} from '@tanstack/react-query'

/**
 * Creates a complete UseQueryResult mock with all required properties
 * This helps avoid TypeScript errors when mocking @tanstack/react-query hooks
 */
export function createMockUseQueryResult<TData = unknown, TError = Error>(
  overrides: Partial<UseQueryResult<TData, TError>> = {},
): UseQueryResult<TData, TError> {
  // Base properties common to all states
  const base = {
    dataUpdatedAt: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    fetchStatus: 'idle' as const,
    isFetched: false,
    isFetchedAfterMount: false,
    isFetching: false,
    isInitialLoading: false,
    isLoading: false,
    isLoadingError: false,
    isPaused: false,
    isPlaceholderData: false,
    isRefetchError: false,
    isRefetching: false,
    isStale: false,
    refetch: () => Promise.resolve({} as UseQueryResult<TData, TError>),
  }

  // Default to pending state
  const defaultState = {
    ...base,
    data: undefined,
    error: null,
    isError: false,
    isPending: true,
    isSuccess: false,
    status: 'pending' as const,
  }

  return {
    ...defaultState,
    ...overrides,
  } as UseQueryResult<TData, TError>
}

/**
 * Creates a mock for a successful (loaded) query state
 */
export function createMockSuccessQueryResult<TData>(
  data: TData,
  overrides: Partial<QueryObserverSuccessResult<TData, Error>> = {},
): QueryObserverSuccessResult<TData, Error> {
  const base = {
    dataUpdatedAt: Date.now(),
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    fetchStatus: 'idle' as const,
    isFetched: true,
    isFetchedAfterMount: true,
    isFetching: false,
    isInitialLoading: false,
    isLoading: false,
    isLoadingError: false,
    isPaused: false,
    isPlaceholderData: false,
    isRefetchError: false,
    isRefetching: false,
    isStale: false,
    refetch: () => Promise.resolve({} as UseQueryResult<TData, Error>),
  }

  return {
    ...base,
    data,
    error: null,
    isError: false,
    isPending: false,
    isSuccess: true,
    status: 'success' as const,
    ...overrides,
  } as QueryObserverSuccessResult<TData, Error>
}

/**
 * Creates a mock for a loading query state
 */
export function createMockLoadingQueryResult<TData = unknown>(
  overrides: Partial<QueryObserverLoadingResult<TData, Error>> = {},
): QueryObserverLoadingResult<TData, Error> {
  const base = {
    dataUpdatedAt: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    fetchStatus: 'fetching' as const,
    isFetched: false,
    isFetchedAfterMount: false,
    isFetching: true,
    isInitialLoading: true,
    isLoadingError: false,
    isPaused: false,
    isPlaceholderData: false,
    isRefetchError: false,
    isRefetching: false,
    isStale: false,
    refetch: () => Promise.resolve({} as UseQueryResult<TData, Error>),
  }

  return {
    ...base,
    data: undefined,
    error: null,
    isError: false,
    isLoading: true,
    isPending: true,
    isSuccess: false,
    status: 'pending' as const,
    ...overrides,
  } as QueryObserverLoadingResult<TData, Error>
}

/**
 * Creates a mock for an error query state
 */
export function createMockErrorQueryResult<TData = unknown>(
  error: Error = new Error('Mock error'),
  overrides: Partial<QueryObserverLoadingErrorResult<TData, Error>> = {},
): QueryObserverLoadingErrorResult<TData, Error> {
  const base = {
    dataUpdatedAt: 0,
    errorUpdatedAt: Date.now(),
    failureCount: 1,
    failureReason: error,
    fetchStatus: 'idle' as const,
    isFetched: true,
    isFetchedAfterMount: true,
    isFetching: false,
    isInitialLoading: false,
    isLoading: false,
    isPaused: false,
    isPlaceholderData: false,
    isRefetchError: false,
    isRefetching: false,
    isStale: false,
    refetch: () => Promise.resolve({} as UseQueryResult<TData, Error>),
  }

  return {
    ...base,
    data: undefined,
    error,
    isError: true,
    isLoadingError: true,
    isPending: false,
    isSuccess: false,
    status: 'error' as const,
    ...overrides,
  } as QueryObserverLoadingErrorResult<TData, Error>
}
