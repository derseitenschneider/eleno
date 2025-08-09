import { vi } from 'vitest'
import type { User } from '@supabase/supabase-js'

// Supabase mocks
export const mockSupabaseUser: User = {
  id: 'test-user-id',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {
    first_name: 'Test',
    last_name: 'User',
  },
  aud: 'authenticated',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  phone: '',
  confirmed_at: '2023-01-01T00:00:00Z',
  email_confirmed_at: '2023-01-01T00:00:00Z',
  last_sign_in_at: '2023-01-01T00:00:00Z',
}

export const mockSupabaseClient = {
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: mockSupabaseUser }, error: null }),
    getSession: vi.fn().mockResolvedValue({ 
      data: { session: { user: mockSupabaseUser } }, 
      error: null 
    }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } }
    }),
  },
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue({ data: null, error: null }),
}

// React Query mocks
export const createMockQueryClient = () => {
  const mockQueryClient = {
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
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  }
  return mockQueryClient
}

// Router mocks
export const mockNavigate = vi.fn()
export const mockLocation = { pathname: '/test', search: '', hash: '', state: null }

// Hook mocks
export const mockUseQuery = vi.fn().mockReturnValue({
  data: undefined,
  error: null,
  isLoading: false,
  isError: false,
  isSuccess: true,
})

export const mockUseMutation = vi.fn().mockReturnValue({
  mutate: vi.fn(),
  mutateAsync: vi.fn(),
  isLoading: false,
  isError: false,
  isSuccess: false,
  error: null,
  data: undefined,
})

// Context mocks
export const mockUserContext = {
  user: mockSupabaseUser,
  deleteAccount: vi.fn(),
  logout: vi.fn(),
  recoverPassword: vi.fn(),
}

export const mockLoadingContext = {
  isLoading: false,
  setIsLoading: vi.fn(),
}

export const mockSubscriptionContext = {
  subscription: null,
  isLoading: false,
}

export const mockLessonHolderContext = {
  currentHolder: null,
  setCurrentHolder: vi.fn(),
  holders: [],
  currentHolderIndex: 0,
  setCurrentHolderIndex: vi.fn(),
}

// Form mocks
export const mockFormReturn = {
  register: vi.fn(),
  handleSubmit: vi.fn(),
  formState: {
    errors: {},
    isSubmitting: false,
    isValid: true,
    isDirty: false,
  },
  setValue: vi.fn(),
  getValues: vi.fn(),
  watch: vi.fn(),
  reset: vi.fn(),
  clearErrors: vi.fn(),
  setError: vi.fn(),
}

// Mock modules
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  }
})

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    useQuery: mockUseQuery,
    useMutation: mockUseMutation,
  }
})

vi.mock('@/services/api/supabase', () => ({
  default: mockSupabaseClient,
}))

vi.mock('react-hook-form', () => ({
  useForm: () => mockFormReturn,
  Controller: ({ render }: any) => render({ field: {}, fieldState: {}, formState: {} }),
}))

// Reset all mocks before each test
export function resetAllMocks() {
  vi.clearAllMocks()
  mockNavigate.mockClear()
  mockUseQuery.mockReturnValue({
    data: undefined,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: true,
  })
  mockUseMutation.mockReturnValue({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isLoading: false,
    isError: false,
    isSuccess: false,
    error: null,
    data: undefined,
  })
}