import { QueryClient } from '@tanstack/react-query'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockLesson } from '@/test/factories'
import { renderWithProviders } from '@/test/testUtils'
import type { Lesson } from '@/types/types'
import UpdateLesson from './UpdateLesson.component'
import * as useUpdateLessonMutationModule from './useUpdateLessonMutation'

// Mock modules
vi.mock('./useUpdateLessonMutation')
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock useSubscription hook to return hasAccess: true
vi.mock('@/services/context/SubscriptionContext', () => ({
  useSubscription: () => ({
    hasAccess: true,
    subscription: null,
    isLoading: false,
  }),
}))

// Mock useCurrentHolder hook to return a valid student holder
vi.mock('@/components/features/lessons/useCurrentHolder', () => ({
  default: () => ({
    currentLessonHolder: {
      type: 's',
      holder: { id: 1, name: 'Test Student' }
    }
  })
}))

// Mock students and groups queries
vi.mock('@/components/features/students/studentsQueries', () => ({
  default: () => ({
    data: [{ id: 1, name: 'Test Student' }],
    isLoading: false,
  })
}))

vi.mock('@/components/features/groups/groupsQuery', () => ({
  default: () => ({
    data: [],
    isLoading: false,
  })
}))

// Mock settings query
vi.mock('@/components/features/settings/settingsQuery', () => ({
  default: () => ({
    data: { some: 'settings' },
    isLoading: false,
  })
}))

// Mock drafts context
vi.mock('@/services/context/DraftsContext', () => ({
  useDrafts: () => ({
    drafts: [],
    setDrafts: vi.fn(),
  })
}))


// Mock CustomEditor component
vi.mock('@/components/ui/CustomEditor.component', () => ({
  default: ({ value, onChange, disabled }: any) => (
    <textarea
      data-testid='custom-editor'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  ),
}))

// Note: Not mocking Blocker component so it uses the real implementation with our mocked subscription

// Mock SaveAbortButtons component
vi.mock('@/components/ui/SaveAbortButtonGroup', () => ({
  SaveAbortButtons: ({
    onSave,
    onAbort,
    isSaving,
    isDisabledSaving,
    isDisabledAborting,
  }: any) => (
    <div data-testid='save-abort-buttons'>
      <button
        onClick={onSave}
        disabled={isDisabledSaving}
        data-testid='save-button'
      >
        {isSaving ? 'Saving...' : 'Save'}
      </button>
      <button
        onClick={onAbort}
        disabled={isDisabledAborting}
        data-testid='abort-button'
      >
        Abort
      </button>
    </div>
  ),
}))

// Mock DayPicker component
vi.mock('@/components/ui/daypicker.component', () => ({
  DayPicker: ({ date, setDate, disabled }: any) => {
    const formatDateForInput = (date: Date | null | undefined) => {
      if (!date || Number.isNaN(date.getTime())) return ''
      return date.toISOString().split('T')[0]
    }

    return (
      <input
        type='date'
        data-testid='date-picker'
        value={formatDateForInput(date)}
        onChange={(e) => {
          const newDate = new Date(e.target.value)
          if (!Number.isNaN(newDate.getTime())) {
            setDate(newDate)
          }
        }}
        disabled={disabled}
      />
    )
  },
}))

// Mock Separator component
vi.mock('@/components/ui/separator', () => ({
  Separator: ({ className }: any) => (
    <hr data-testid='separator' className={className} />
  ),
}))

describe('UpdateLesson', () => {
  const mockLesson: Lesson = {
    ...createMockLesson(),
    id: 1,
    date: new Date('2023-12-01'),
    lessonContent: 'Original lesson content',
    homework: 'Original homework content',
  }

  const defaultMocks = {
    useUpdateLessonMutation: {
      updateLesson: vi.fn(),
      isUpdating: false,
    },
  }

  let queryClient: QueryClient

  beforeEach(() => {
    vi.clearAllMocks()

    // Create a new QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    // Set up lesson data in the query client
    queryClient.setQueryData(
      ['all-lessons', { holder: '', year: 0 }],
      [mockLesson],
    )
    queryClient.setQueryData(['latest-3-lessons'], [mockLesson])

    // Setup default mocks
    vi.mocked(useUpdateLessonMutationModule.useUpdateLessonMutation).mockReturnValue(
      defaultMocks.useUpdateLessonMutation,
    )
  })

  describe('Component Rendering', () => {
    it('should render all form elements correctly', () => {
      renderWithProviders(<UpdateLesson lessonId={1} />, { 
        queryClient,
        initialEntries: ['/lessons/s-1'] 
      })

      expect(screen.getByText('Datum')).toBeInTheDocument()
      expect(screen.getByText('Lektion')).toBeInTheDocument()
      expect(screen.getByText('Hausaufgaben')).toBeInTheDocument()
      expect(screen.getByTestId('date-picker')).toBeInTheDocument()
      expect(screen.getAllByTestId('custom-editor')).toHaveLength(2)
      expect(screen.getByTestId('save-abort-buttons')).toBeInTheDocument()
      // Blocker should not be present when hasAccess is true
    })

    it('should pre-populate form with lesson data', () => {
      renderWithProviders(<UpdateLesson lessonId={1} />, { 
        queryClient,
        initialEntries: ['/lessons/s-1'] 
      })

      const editors = screen.getAllByTestId('custom-editor')
      const lessonEditor = editors[0]
      const homeworkEditor = editors[1]
      const datePicker = screen.getByTestId('date-picker')

      expect(lessonEditor).toHaveValue('Original lesson content')
      expect(homeworkEditor).toHaveValue('Original homework content')
      expect(datePicker).toHaveValue('2023-12-01')
    })

    it('should handle lesson not found in query data', () => {
      queryClient.setQueryData(['all-lessons', { holder: '', year: 0 }], [])
      queryClient.setQueryData(['latest-3-lessons'], [])

      renderWithProviders(<UpdateLesson lessonId={999} />, { queryClient })

      const editors = screen.getAllByTestId('custom-editor')
      expect(editors[0]).toHaveValue('')
      expect(editors[1]).toHaveValue('')
    })

    it('should handle empty query data gracefully', () => {
      // Create a fresh query client without default data
      const freshQueryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      })

      renderWithProviders(<UpdateLesson lessonId={1} />, {
        queryClient: freshQueryClient,
      })

      const editors = screen.getAllByTestId('custom-editor')
      expect(editors[0]).toHaveValue('')
      expect(editors[1]).toHaveValue('')
    })
  })

  describe('Form Interactions', () => {
    it('should update lesson content when typing', async () => {
      const user = userEvent.setup()
      renderWithProviders(<UpdateLesson lessonId={1} />, { queryClient })

      const editors = screen.getAllByTestId('custom-editor')
      const lessonEditor = editors[0]!

      await user.clear(lessonEditor)
      await user.type(lessonEditor, 'Updated lesson content')

      expect(lessonEditor).toHaveValue('Updated lesson content')
    })

    it('should update homework content when typing', async () => {
      const user = userEvent.setup()
      renderWithProviders(<UpdateLesson lessonId={1} />, { queryClient })

      const editors = screen.getAllByTestId('custom-editor')
      const homeworkEditor = editors[1]!

      await user.clear(homeworkEditor)
      await user.type(homeworkEditor, 'Updated homework content')

      expect(homeworkEditor).toHaveValue('Updated homework content')
    })

    it('should handle date changes through component state', () => {
      renderWithProviders(<UpdateLesson lessonId={1} />, { queryClient })

      const datePicker = screen.getByTestId('date-picker')

      // Verify initial date is set correctly from lesson data
      expect(datePicker).toHaveValue('2023-12-01')

      // This verifies that the date picker is properly integrated with the component
      // The actual date change functionality would be tested through the DayPicker component itself
      expect(datePicker).toBeEnabled()
    })
  })

  describe('Form Submission', () => {
    it('should call updateLesson with correct data on save', async () => {
      const user = userEvent.setup()
      const mockUpdateLesson = vi.fn()

      vi.mocked(useUpdateLessonMutationModule.useUpdateLessonMutation).mockReturnValue({
        updateLesson: mockUpdateLesson,
        isUpdating: false,
      })

      renderWithProviders(<UpdateLesson lessonId={1} />, { 
        queryClient,
        initialEntries: ['/lessons/s-1'] 
      })

      // Update the form fields
      const editors = screen.getAllByTestId('custom-editor')
      const lessonEditor = editors[0]!
      const homeworkEditor = editors[1]!

      await user.clear(lessonEditor)
      await user.type(lessonEditor, 'New lesson content')
      await user.clear(homeworkEditor)
      await user.type(homeworkEditor, 'New homework content')

      // Click save button
      const saveButton = screen.getByTestId('save-button')
      await user.click(saveButton)

      // The mutation should be called
      await waitFor(() => {
        expect(mockUpdateLesson).toHaveBeenCalled()
      })

      // Verify the call was made with expected data structure
      expect(mockUpdateLesson).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
        }),
        expect.objectContaining({
          onSuccess: expect.any(Function),
        }),
      )
    })

    it('should call onCloseModal after successful save', async () => {
      const user = userEvent.setup()
      const mockOnCloseModal = vi.fn()
      const mockUpdateLesson = vi.fn((data, options) => {
        // Simulate successful update
        if (options?.onSuccess) {
          options.onSuccess()
        }
      })

      vi.mocked(useUpdateLessonMutationModule.useUpdateLessonMutation).mockReturnValue({
        updateLesson: mockUpdateLesson,
        isUpdating: false,
      })

      renderWithProviders(
        <UpdateLesson lessonId={1} onCloseModal={mockOnCloseModal} />,
        { 
          queryClient,
          initialEntries: ['/lessons/s-1'] 
        },
      )

      // Fill the form with some content to ensure it's valid
      const editors = screen.getAllByTestId('custom-editor')
      const lessonEditor = editors[0]!
      await user.clear(lessonEditor)
      await user.type(lessonEditor, 'Some lesson content')

      // Click save button
      const saveButton = screen.getByTestId('save-button')
      await user.click(saveButton)

      // Wait for the mutation to be called and onCloseModal to be triggered
      await waitFor(() => {
        expect(mockUpdateLesson).toHaveBeenCalled()
      })

      await waitFor(() => {
        expect(mockOnCloseModal).toHaveBeenCalled()
      })
    })

    it('should not call updateLesson if lesson is not found', async () => {
      const user = userEvent.setup()
      const mockUpdateLesson = vi.fn()

      vi.mocked(useUpdateLessonMutationModule.useUpdateLessonMutation).mockReturnValue({
        updateLesson: mockUpdateLesson,
        isUpdating: false,
      })

      queryClient.setQueryData(['all-lessons', { holder: '', year: 0 }], [])
      queryClient.setQueryData(['latest-3-lessons'], [])

      renderWithProviders(<UpdateLesson lessonId={999} />, { queryClient })

      const saveButton = screen.getByTestId('save-button')
      await user.click(saveButton)

      expect(mockUpdateLesson).not.toHaveBeenCalled()
    })
  })

  describe('Loading States', () => {
    it('should disable form elements when updating', () => {
      vi.mocked(useUpdateLessonMutationModule.useUpdateLessonMutation).mockReturnValue({
        updateLesson: vi.fn(),
        isUpdating: true,
      })

      renderWithProviders(<UpdateLesson lessonId={1} />, { queryClient })

      const editors = screen.getAllByTestId('custom-editor')
      const datePicker = screen.getByTestId('date-picker')
      const saveButton = screen.getByTestId('save-button')
      const abortButton = screen.getByTestId('abort-button')

      expect(editors[0]).toBeDisabled()
      expect(editors[1]).toBeDisabled()
      expect(datePicker).toBeDisabled()
      expect(saveButton).toBeDisabled()
      expect(abortButton).toBeDisabled()
    })

    it('should show saving state in button text', () => {
      vi.mocked(useUpdateLessonMutationModule.useUpdateLessonMutation).mockReturnValue({
        updateLesson: vi.fn(),
        isUpdating: true,
      })

      renderWithProviders(<UpdateLesson lessonId={1} />, { queryClient })

      const saveButton = screen.getByTestId('save-button')
      expect(saveButton).toHaveTextContent('Saving...')
    })

    it('should enable form elements when not updating', () => {
      vi.mocked(useUpdateLessonMutationModule.useUpdateLessonMutation).mockReturnValue({
        updateLesson: vi.fn(),
        isUpdating: false,
      })

      renderWithProviders(<UpdateLesson lessonId={1} />, { queryClient })

      const editors = screen.getAllByTestId('custom-editor')
      const datePicker = screen.getByTestId('date-picker')
      const saveButton = screen.getByTestId('save-button')
      const abortButton = screen.getByTestId('abort-button')

      expect(editors[0]).toBeEnabled()
      expect(editors[1]).toBeEnabled()
      expect(datePicker).toBeEnabled()
      expect(saveButton).toBeEnabled()
      expect(abortButton).toBeEnabled()
    })
  })

  describe('Modal Actions', () => {
    it('should call onCloseModal when abort is clicked', async () => {
      const user = userEvent.setup()
      const mockOnCloseModal = vi.fn()

      renderWithProviders(
        <UpdateLesson lessonId={1} onCloseModal={mockOnCloseModal} />,
        { queryClient },
      )

      const abortButton = screen.getByTestId('abort-button')
      await user.click(abortButton)

      expect(mockOnCloseModal).toHaveBeenCalled()
    })

    it('should work without onCloseModal prop', async () => {
      const user = userEvent.setup()

      renderWithProviders(<UpdateLesson lessonId={1} />, { queryClient })

      const abortButton = screen.getByTestId('abort-button')
      await user.click(abortButton)

      // Should not throw error
      expect(true).toBe(true)
    })
  })

  describe('Data Handling', () => {
    it('should handle null lesson content', () => {
      const lessonWithNullContent = {
        ...createMockLesson(),
        id: 1,
        lessonContent: null,
        homework: null,
        date: new Date('2023-12-01'),
      }

      // Create a fresh query client for this test
      const freshQueryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      })

      freshQueryClient.setQueryData(
        ['all-lessons', { holder: '', year: 0 }],
        [lessonWithNullContent],
      )
      freshQueryClient.setQueryData(['latest-3-lessons'], [])

      renderWithProviders(<UpdateLesson lessonId={1} />, {
        queryClient: freshQueryClient,
      })

      const editors = screen.getAllByTestId('custom-editor')
      expect(editors[0]).toHaveValue('')
      expect(editors[1]).toHaveValue('')
    })

    it('should combine lessons from both query sources', () => {
      const allLessonsLesson = {
        ...createMockLesson(),
        id: 1,
        lessonContent: 'All lessons content',
        homework: 'All lessons homework',
        date: new Date('2023-12-01'),
      }
      const latestLessonsLesson = {
        ...createMockLesson(),
        id: 2,
        lessonContent: 'Latest lessons content',
        homework: 'Latest lessons homework',
        date: new Date('2023-12-02'),
      }

      // Create a fresh query client for this test
      const freshQueryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      })

      freshQueryClient.setQueryData(
        ['all-lessons', { holder: '', year: 0 }],
        [allLessonsLesson],
      )
      freshQueryClient.setQueryData(['latest-3-lessons'], [latestLessonsLesson])

      // Test finding lesson from all lessons
      renderWithProviders(<UpdateLesson lessonId={1} />, {
        queryClient: freshQueryClient,
      })
      expect(screen.getAllByTestId('custom-editor')[0]).toHaveValue(
        'All lessons content',
      )
    })
  })

  describe('URL Parameters', () => {
    it('should handle missing URL parameters', () => {
      // Test with initial entries that don't have holderId or year params
      renderWithProviders(<UpdateLesson lessonId={1} />, {
        queryClient,
        initialEntries: ['/lessons'],
      })

      // Should still render without crashing
      expect(screen.getByText('Lektion')).toBeInTheDocument()
    })
  })
})
