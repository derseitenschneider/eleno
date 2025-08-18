/**
 * Lightweight Mock Alternatives for Simple Tests
 * 
 * This module provides ultra-fast, minimal mocks for tests that don't need
 * full mock functionality:
 * - Static mock data without dynamic generation
 * - Simplified mock implementations for common scenarios
 * - Zero-dependency mocks for unit tests
 * - Pre-serialized responses for fastest access
 * - Memory-efficient mock alternatives
 */

import { vi } from 'vitest'

// Pre-serialized static data for instant access
const STATIC_MOCK_DATA = Object.freeze({
  // Basic user data
  user: Object.freeze({
    id: 'test-user-id',
    email: 'test@example.com',
    app_metadata: Object.freeze({}),
    user_metadata: Object.freeze({
      first_name: 'Test',
      last_name: 'User',
    }),
    aud: 'authenticated',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    phone: '',
    confirmed_at: '2023-01-01T00:00:00Z',
    email_confirmed_at: '2023-01-01T00:00:00Z',
    last_sign_in_at: '2023-01-01T00:00:00Z',
  }),

  // Basic student data
  student: Object.freeze({
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    instrument: 'Piano',
    archive: false,
    dayOfLesson: 'Montag',
    startOfLesson: '14:00',
    durationMinutes: 60,
    created_at: '2023-01-01T00:00:00Z',
    user_id: 'test-user-id',
    location: 'Studio A',
    endOfLesson: '15:00',
    homework_sharing_authorized: false,
  }),

  // Basic group data
  group: Object.freeze({
    id: 1,
    name: 'Beginner Piano',
    archive: false,
    dayOfLesson: 'Dienstag',
    startOfLesson: '16:00',
    durationMinutes: 45,
    created_at: '2023-01-01T00:00:00Z',
    user_id: 'test-user-id',
    location: 'Studio B',
    endOfLesson: '16:45',
    homework_sharing_authorized: false,
    students: Object.freeze([
      Object.freeze({ name: 'Alice' }),
      Object.freeze({ name: 'Bob' }),
    ]),
  }),

  // Basic lesson data
  lesson: Object.freeze({
    id: 1,
    date: new Date('2023-12-01'),
    homework: 'Practice scales',
    lessonContent: 'Worked on Bach invention',
    expiration_base: '7d',
    homeworkKey: 'abc123',
    created_at: '2023-01-01T00:00:00Z',
    user_id: 'test-user-id',
    studentId: 1,
    groupId: null,
    status: 'documented',
  }),

  // Basic note data
  note: Object.freeze({
    id: 1,
    text: 'Test note',
    title: 'Test Note',
    backgroundColor: 'yellow' as const,
    order: 1,
    created_at: '2023-01-01T00:00:00Z',
    user_id: 'test-user-id',
    studentId: 1,
    groupId: null,
  }),

  // Empty arrays for lists
  emptyArray: Object.freeze([]),

  // Basic API responses
  successResponse: Object.freeze({ status: 200, data: null, error: null }),
  errorResponse: Object.freeze({ status: 400, data: null, error: 'Test error' }),
})

/**
 * Lightweight Supabase client mock with minimal functionality
 */
export const lightweightSupabaseClient = Object.freeze({
  auth: Object.freeze({
    getUser: vi.fn().mockResolvedValue({ 
      data: { user: STATIC_MOCK_DATA.user }, 
      error: null 
    }),
    getSession: vi.fn().mockResolvedValue({
      data: { session: { user: STATIC_MOCK_DATA.user } },
      error: null,
    }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    }),
  }),
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue(STATIC_MOCK_DATA.successResponse),
})

/**
 * Lightweight React Query client mock
 */
export const lightweightQueryClient = Object.freeze({
  getQueryData: vi.fn(),
  setQueryData: vi.fn(),
  invalidateQueries: vi.fn(),
  removeQueries: vi.fn(),
  clear: vi.fn(),
  refetchQueries: vi.fn(),
  cancelQueries: vi.fn(),
  resetQueries: vi.fn(),
  isFetching: vi.fn().mockReturnValue(false),
  isMutating: vi.fn().mockReturnValue(false),
  defaultOptions: Object.freeze({
    queries: Object.freeze({
      retry: false,
      gcTime: 0,
    }),
    mutations: Object.freeze({
      retry: false,
    }),
  }),
})

/**
 * Lightweight router mocks
 */
export const lightweightNavigate = vi.fn()
export const lightweightLocation = Object.freeze({
  pathname: '/test',
  search: '',
  hash: '',
  state: null,
})

/**
 * Lightweight hook mocks with static returns
 */
export const lightweightUseQuery = vi.fn().mockReturnValue(Object.freeze({
  data: undefined,
  error: null,
  isLoading: false,
  isError: false,
  isSuccess: true,
}))

export const lightweightUseMutation = vi.fn().mockReturnValue(Object.freeze({
  mutate: vi.fn(),
  mutateAsync: vi.fn(),
  isLoading: false,
  isError: false,
  isSuccess: false,
  error: null,
  data: undefined,
}))

/**
 * Lightweight context mocks
 */
export const lightweightUserContext = Object.freeze({
  user: STATIC_MOCK_DATA.user,
  deleteAccount: vi.fn(),
  logout: vi.fn(),
  recoverPassword: vi.fn(),
})

export const lightweightLoadingContext = Object.freeze({
  isLoading: false,
  setIsLoading: vi.fn(),
})

export const lightweightSubscriptionContext = Object.freeze({
  subscription: null,
  isLoading: false,
})

export const lightweightLessonHolderContext = Object.freeze({
  currentHolder: null,
  setCurrentHolder: vi.fn(),
  holders: STATIC_MOCK_DATA.emptyArray,
  currentHolderIndex: 0,
  setCurrentHolderIndex: vi.fn(),
})

/**
 * Lightweight form mock
 */
export const lightweightFormReturn = Object.freeze({
  register: vi.fn(),
  handleSubmit: vi.fn(),
  formState: Object.freeze({
    errors: Object.freeze({}),
    isSubmitting: false,
    isValid: true,
    isDirty: false,
  }),
  setValue: vi.fn(),
  getValues: vi.fn(),
  watch: vi.fn(),
  reset: vi.fn(),
  clearErrors: vi.fn(),
  setError: vi.fn(),
})

/**
 * Ultra-fast static data accessors
 */
export const getStaticUser = () => STATIC_MOCK_DATA.user
export const getStaticStudent = () => STATIC_MOCK_DATA.student
export const getStaticGroup = () => STATIC_MOCK_DATA.group
export const getStaticLesson = () => STATIC_MOCK_DATA.lesson
export const getStaticNote = () => STATIC_MOCK_DATA.note
export const getEmptyArray = () => STATIC_MOCK_DATA.emptyArray

/**
 * Simple data variants for common test scenarios
 */
export const createSimpleStudent = (id = 1) => ({
  id,
  firstName: 'Test',
  lastName: 'Student',
  instrument: 'Piano',
})

export const createSimpleGroup = (id = 1) => ({
  id,
  name: 'Test Group',
})

export const createSimpleLesson = (id = 1) => ({
  id,
  date: new Date('2023-12-01'),
  status: 'documented',
})

export const createSimpleNote = (id = 1) => ({
  id,
  text: 'Test note',
  backgroundColor: 'yellow' as const,
})

/**
 * Minimal collections for testing
 */
export const getSimpleStudents = (count = 3) => 
  Array.from({ length: count }, (_, i) => createSimpleStudent(i + 1))

export const getSimpleGroups = (count = 2) => 
  Array.from({ length: count }, (_, i) => createSimpleGroup(i + 1))

export const getSimpleLessons = (count = 5) => 
  Array.from({ length: count }, (_, i) => createSimpleLesson(i + 1))

export const getSimpleNotes = (count = 4) => 
  Array.from({ length: count }, (_, i) => createSimpleNote(i + 1))

/**
 * Lightweight API response generators
 */
export const createSimpleSuccess = <T>(data: T) => ({ 
  data, 
  error: null, 
  status: 200 
})

export const createSimpleError = (message = 'Test error') => ({ 
  data: null, 
  error: message, 
  status: 400 
})

export const createSimpleQuery = <T>(data: T, loading = false) => ({
  data,
  error: null,
  isLoading: loading,
  isError: false,
  isSuccess: !loading,
})

/**
 * No-op functions for tests that don't need actual functionality
 */
export const noOp = () => {}
export const noOpAsync = async () => {}
export const noOpPromise = Promise.resolve()

/**
 * Static mock configurations
 */
export const lightweightMockConfigs = Object.freeze({
  // Minimal query client config
  minimalQueryClient: Object.freeze({
    retry: false,
    gcTime: 0,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  }),

  // Test-only provider config
  testProviders: Object.freeze({
    enableAuth: false,
    enableSubscription: false,
    enableLoading: false,
    enableDarkMode: false,
    enableMainContext: false,
    enableUserLocale: false,
  }),
})

/**
 * Preset mock bundles for common scenarios
 */
export const lightweightMockBundles = Object.freeze({
  // For component unit tests
  unitTest: Object.freeze({
    user: STATIC_MOCK_DATA.user,
    queryClient: lightweightQueryClient,
    navigate: lightweightNavigate,
    location: lightweightLocation,
  }),

  // For form tests
  formTest: Object.freeze({
    form: lightweightFormReturn,
    user: STATIC_MOCK_DATA.user,
  }),

  // For list/table tests
  listTest: Object.freeze({
    students: [STATIC_MOCK_DATA.student],
    groups: [STATIC_MOCK_DATA.group],
    lessons: [STATIC_MOCK_DATA.lesson],
    notes: [STATIC_MOCK_DATA.note],
  }),
})

/**
 * Performance helpers for lightweight mocks
 */
export const measureLightweightAccess = <T>(accessor: () => T, iterations = 1000): T => {
  const start = performance.now()
  let result: T
  
  for (let i = 0; i < iterations; i++) {
    result = accessor()
  }
  
  const end = performance.now()
  console.log(`🏃‍♂️ Lightweight access (${iterations}x): ${(end - start).toFixed(2)}ms`)
  
  return result!
}

/**
 * Bulk data generators using static templates
 */
export const generateBulkStaticData = <T>(
  template: T,
  count: number,
  modifier?: (item: T, index: number) => Partial<T>
): T[] => {
  const result: T[] = []
  
  for (let i = 0; i < count; i++) {
    if (modifier) {
      result.push({ ...template, ...modifier(template, i) })
    } else {
      result.push(template)
    }
  }
  
  return result
}

/**
 * Reset lightweight mocks (instant operation)
 */
export function resetLightweightMocks() {
  // Reset Vitest mocks only (no cache clearing needed)
  lightweightNavigate.mockClear()
  lightweightUseQuery.mockReturnValue({
    data: undefined,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: true,
  })
  lightweightUseMutation.mockReturnValue({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isLoading: false,
    isError: false,
    isSuccess: false,
    error: null,
    data: undefined,
  })
}

/**
 * Global lightweight setup for test environments
 */
export function setupLightweightMocks() {
  // Setup global mocks with lightweight implementations
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
      ...actual,
      useNavigate: () => lightweightNavigate,
      useLocation: () => lightweightLocation,
    }
  })

  vi.mock('@tanstack/react-query', async () => {
    const actual = await vi.importActual('@tanstack/react-query')
    return {
      ...actual,
      useQuery: lightweightUseQuery,
      useMutation: lightweightUseMutation,
    }
  })

  vi.mock('@/services/api/supabase', () => ({
    default: lightweightSupabaseClient,
  }))

  vi.mock('react-hook-form', () => ({
    useForm: () => lightweightFormReturn,
    Controller: ({ render }: any) =>
      render({ field: {}, fieldState: {}, formState: {} }),
    FormProvider: ({ children }: { children: React.ReactNode }) => children,
  }))
}

/**
 * Comparison utilities to demonstrate performance gains
 */
export function compareLightweightPerformance() {
  console.log('\n⚡ Lightweight Mock Performance Comparison:')
  
  // Test static data access
  const staticResult = measureLightweightAccess(getStaticUser, 10000)
  
  // Test simple creation
  const creationStart = performance.now()
  for (let i = 0; i < 1000; i++) {
    createSimpleStudent(i)
  }
  const creationEnd = performance.now()
  
  console.log(`🏗️  Simple creation (1000x): ${(creationEnd - creationStart).toFixed(2)}ms`)
  console.log(`📦 Static data is ${typeof staticResult === 'object' ? 'ready' : 'invalid'}`)
}