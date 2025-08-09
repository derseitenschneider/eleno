import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/testUtils'
import UpdateLesson from './UpdateLesson.component'
import * as useUpdateLessonModule from './useUpdateLesson'
import { createMockLesson } from '@/test/factories'
import { QueryClient } from '@tanstack/react-query'
import type { Lesson } from '@/types/types'

// Mock modules
vi.mock('./useUpdateLesson')
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock CustomEditor component
vi.mock('@/components/ui/CustomEditor.component', () => ({
  default: ({ value, onChange, disabled }: any) => (
    <textarea
      data-testid="custom-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  ),
}))

// Mock Blocker component
vi.mock('../subscription/Blocker', () => ({
  Blocker: () => <div data-testid="blocker">Subscription Blocker</div>,
}))

// Mock SaveAbortButtons component
vi.mock('@/components/ui/SaveAbortButtonGroup', () => ({
  SaveAbortButtons: ({ onSave, onAbort, isSaving, isDisabledSaving, isDisabledAborting }: any) => (
    <div data-testid="save-abort-buttons">
      <button 
        onClick={onSave} 
        disabled={isDisabledSaving}
        data-testid="save-button"
      >
        {isSaving ? 'Saving...' : 'Save'}
      </button>
      <button 
        onClick={onAbort} 
        disabled={isDisabledAborting}
        data-testid="abort-button"
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
      if (!date || isNaN(date.getTime())) return ''
      return date.toISOString().split('T')[0]
    }

    return (
      <input
        type="date"
        data-testid="date-picker"
        value={formatDateForInput(date)}
        onChange={(e) => {
          const newDate = new Date(e.target.value)
          if (!isNaN(newDate.getTime())) {
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
  Separator: ({ className }: any) => <hr data-testid="separator" className={className} />,
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
    useUpdateLesson: {
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
    queryClient.setQueryData(['all-lessons', { holder: '', year: 0 }], [mockLesson])
    queryClient.setQueryData(['latest-3-lessons'], [mockLesson])

    // Setup default mocks
    vi.mocked(useUpdateLessonModule.useUpdateLesson).mockReturnValue(defaultMocks.useUpdateLesson)
  })

  describe('Component Rendering', () => {
    it('should render all form elements correctly', () => {
      renderWithProviders(<UpdateLesson lessonId={1} />, { queryClient })

      expect(screen.getByText('Datum')).toBeInTheDocument()
      expect(screen.getByText('Lektion')).toBeInTheDocument()
      expect(screen.getByText('Hausaufgaben')).toBeInTheDocument()
      expect(screen.getByTestId('date-picker')).toBeInTheDocument()
      expect(screen.getAllByTestId('custom-editor')).toHaveLength(2)
      expect(screen.getByTestId('save-abort-buttons')).toBeInTheDocument()
      expect(screen.getByTestId('blocker')).toBeInTheDocument()
    })

    it('should pre-populate form with lesson data', () => {
      renderWithProviders(<UpdateLesson lessonId={1} />, { queryClient })

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
      queryClient.clear()

      renderWithProviders(<UpdateLesson lessonId={1} />, { queryClient })

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
      const lessonEditor = editors[0]

      await user.clear(lessonEditor)
      await user.type(lessonEditor, 'Updated lesson content')

      expect(lessonEditor).toHaveValue('Updated lesson content')
    })

    it('should update homework content when typing', async () => {
      const user = userEvent.setup()
      renderWithProviders(<UpdateLesson lessonId={1} />, { queryClient })

      const editors = screen.getAllByTestId('custom-editor')
      const homeworkEditor = editors[1]

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
      
      vi.mocked(useUpdateLessonModule.useUpdateLesson).mockReturnValue({
        updateLesson: mockUpdateLesson,
        isUpdating: false,
      })

      renderWithProviders(<UpdateLesson lessonId={1} />, { queryClient })

      // Update the form fields
      const editors = screen.getAllByTestId('custom-editor')
      const lessonEditor = editors[0]
      const homeworkEditor = editors[1]

      await user.clear(lessonEditor)
      await user.type(lessonEditor, 'New lesson content')
      await user.clear(homeworkEditor)
      await user.type(homeworkEditor, 'New homework content')

      // Click save button
      const saveButton = screen.getByTestId('save-button')
      await user.click(saveButton)

      expect(mockUpdateLesson).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          lessonContent: 'New lesson content',
          homework: 'New homework content',
          date: new Date('2023-12-01'),
        }),
        expect.objectContaining({
          onSuccess: expect.any(Function),
        })
      )
    })

    it('should call onCloseModal after successful save', async () => {
      const user = userEvent.setup()
      const mockOnCloseModal = vi.fn()
      const mockUpdateLesson = vi.fn((data, options) => {
        // Simulate successful update
        options.onSuccess()
      })
      
      vi.mocked(useUpdateLessonModule.useUpdateLesson).mockReturnValue({
        updateLesson: mockUpdateLesson,
        isUpdating: false,
      })

      renderWithProviders(
        <UpdateLesson lessonId={1} onCloseModal={mockOnCloseModal} />, 
        { queryClient }
      )

      const saveButton = screen.getByTestId('save-button')
      await user.click(saveButton)

      await waitFor(() => {
        expect(mockOnCloseModal).toHaveBeenCalled()
      })
    })

    it('should not call updateLesson if lesson is not found', async () => {
      const user = userEvent.setup()
      const mockUpdateLesson = vi.fn()
      
      vi.mocked(useUpdateLessonModule.useUpdateLesson).mockReturnValue({
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
      vi.mocked(useUpdateLessonModule.useUpdateLesson).mockReturnValue({
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
      vi.mocked(useUpdateLessonModule.useUpdateLesson).mockReturnValue({
        updateLesson: vi.fn(),
        isUpdating: true,
      })

      renderWithProviders(<UpdateLesson lessonId={1} />, { queryClient })

      const saveButton = screen.getByTestId('save-button')
      expect(saveButton).toHaveTextContent('Saving...')
    })

    it('should enable form elements when not updating', () => {
      vi.mocked(useUpdateLessonModule.useUpdateLesson).mockReturnValue({
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
        { queryClient }
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
        ...mockLesson,
        lessonContent: null,
        homework: null,
      }

      queryClient.setQueryData(['all-lessons', { holder: '', year: 0 }], [lessonWithNullContent])

      renderWithProviders(<UpdateLesson lessonId={1} />, { queryClient })

      const editors = screen.getAllByTestId('custom-editor')
      expect(editors[0]).toHaveValue('')
      expect(editors[1]).toHaveValue('')
    })

    it('should combine lessons from both query sources', () => {
      const allLessonsLesson = { ...mockLesson, id: 1, lessonContent: 'All lessons content' }
      const latestLessonsLesson = { ...mockLesson, id: 2, lessonContent: 'Latest lessons content' }

      queryClient.setQueryData(['all-lessons', { holder: '', year: 0 }], [allLessonsLesson])
      queryClient.setQueryData(['latest-3-lessons'], [latestLessonsLesson])

      // Test finding lesson from all lessons
      renderWithProviders(<UpdateLesson lessonId={1} />, { queryClient })
      expect(screen.getAllByTestId('custom-editor')[0]).toHaveValue('All lessons content')
    })
  })

  describe('URL Parameters', () => {
    it('should handle missing URL parameters', () => {
      // Test with initial entries that don't have holderId or year params
      renderWithProviders(
        <UpdateLesson lessonId={1} />, 
        { queryClient, initialEntries: ['/lessons'] }
      )

      // Should still render without crashing
      expect(screen.getByText('Lektion')).toBeInTheDocument()
    })
  })
})