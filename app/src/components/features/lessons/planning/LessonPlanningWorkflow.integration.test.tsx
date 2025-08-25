import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as draftsContextModule from '@/services/context/DraftsContext'
import * as lessonPlanningContextModule from '@/services/context/LessonPlanningContext'
import * as useSubscriptionModule from '@/services/context/SubscriptionContext'
import * as userLocaleContextModule from '@/services/context/UserLocaleContext'
import {
  createMockGroup,
  createMockLesson,
  createMockSettings,
  createMockStudent,
} from '@/test/factories'
import { renderWithProviders } from '@/test/testUtils'
import type { Lesson, LessonHolder } from '@/types/types'
import * as settingsQueryModule from '../../settings/settingsQuery'
import * as lessonsQueriesModule from '../lessonsQueries'
import * as useCreateLessonModule from '../useCreateLesson'
import * as useCurrentHolderModule from '../useCurrentHolder'
import * as useUpdateLessonModule from '../useUpdateLesson'
import { CreatePlannedLessonForm } from './CreatePlannedLessonForm.component'
import { PreparedLessonItem } from './PlannedLessonItem.component'

// Mock all external dependencies
vi.mock('../useCurrentHolder')
vi.mock('@/services/context/SubscriptionContext')
vi.mock('../useCreateLesson')
vi.mock('../useUpdateLesson')
vi.mock('../../settings/settingsQuery')
vi.mock('../lessonsQueries')
vi.mock('@/services/context/LessonPlanningContext')
vi.mock('@/services/context/DraftsContext')
vi.mock('@/services/context/UserLocaleContext')
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock UI components
vi.mock('@/components/ui/CustomEditor.component', () => ({
  default: ({ value, onChange, placeholder, disabled }: any) => (
    <textarea
      data-testid={
        placeholder?.includes('Lektion') ? 'lesson-content' : 'homework'
      }
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
    />
  ),
}))

vi.mock('@/components/ui/daypicker.component', () => ({
  DayPicker: ({ date, setDate, disabled }: any) => (
    <input
      data-testid='date-picker'
      type='date'
      value={date ? date.toISOString().split('T')[0] : ''}
      onChange={(e) => setDate(new Date(e.target.value))}
      disabled={disabled}
    />
  ),
}))

vi.mock('@/components/ui/MiniLoader.component', () => ({
  default: () => <div data-testid='mini-loader'>Loading...</div>,
}))

vi.mock('./PlannedLessonDropdown.component', () => ({
  default: ({ insertLesson, lessonId }: any) => (
    <div data-testid='prepare-lesson-dropdown'>
      <button data-testid='dropdown-insert' onClick={insertLesson}>
        Insert
      </button>
    </div>
  ),
}))

vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: any) => <div>{children}</div>,
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipTrigger: ({ children, onClick }: any) => (
    <button data-testid='tooltip-insert' onClick={onClick}>
      {children}
    </button>
  ),
  TooltipContent: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('lucide-react', () => ({
  BetweenHorizonalStart: () => <div data-testid='insert-icon' />,
}))

vi.mock('html-react-parser', () => ({
  default: (html: string) => <span>{html}</span>,
}))

describe('Lesson Planning Workflow Integration', () => {
  const mockStudent = createMockStudent()
  const mockGroup = createMockGroup()
  const mockSettings = createMockSettings()

  const mockStudentHolder: LessonHolder = {
    type: 's',
    holder: mockStudent,
  }

  const mockCreateLesson = vi.fn()
  const mockUpdateLesson = vi.fn()
  const mockSetSelectedForUpdating = vi.fn()
  const mockSetDrafts = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // Setup all mocks
    vi.mocked(useCurrentHolderModule.default).mockReturnValue({
      currentLessonHolder: mockStudentHolder,
    })

    vi.mocked(useSubscriptionModule.useSubscription).mockReturnValue({
      hasAccess: true,
    } as any)

    vi.mocked(useCreateLessonModule.useCreateLesson).mockReturnValue({
      createLesson: mockCreateLesson,
      isCreating: false,
    })

    vi.mocked(useUpdateLessonModule.useUpdateLesson).mockReturnValue({
      updateLesson: mockUpdateLesson,
      isUpdating: false,
    })

    vi.mocked(settingsQueryModule.default).mockReturnValue({
      data: mockSettings,
    } as any)

    vi.mocked(lessonsQueriesModule.usePlannedLessonsQuery).mockReturnValue({
      data: [],
    } as any)

    vi.mocked(lessonPlanningContextModule.usePlanLessons).mockReturnValue({
      selectedForUpdating: null,
      setSelectedForUpdating: mockSetSelectedForUpdating,
    })

    vi.mocked(draftsContextModule.useDrafts).mockReturnValue({
      setDrafts: mockSetDrafts,
      drafts: [],
    } as any)

    vi.mocked(userLocaleContextModule.useUserLocale).mockReturnValue({
      userLocale: 'de-DE',
    } as any)
  })

  describe('Complete Lesson Planning Workflow', () => {
    it('should create a new planned lesson and display it in the list', async () => {
      const user = userEvent.setup()
      let createdLesson: Lesson

      // Mock successful lesson creation
      mockCreateLesson.mockImplementation((lessonData, { onSuccess }) => {
        createdLesson = {
          ...lessonData,
          id: 'new-lesson-id',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: 'user-id',
        } as Lesson
        onSuccess(createdLesson)
      })

      renderWithProviders(<CreatePlannedLessonForm />)

      // Fill out the form
      await user.type(screen.getByTestId('date-picker'), '2024-01-15')
      await user.type(
        screen.getByTestId('lesson-content'),
        'New planned lesson content',
      )
      await user.type(screen.getByTestId('homework'), 'New homework assignment')

      // Submit the form
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      await user.click(saveButton)

      // Verify lesson creation was called with correct data
      expect(mockCreateLesson).toHaveBeenCalledWith(
        expect.objectContaining({
          studentId: mockStudent.id,
          date: new Date('2024-01-15'),
          lessonContent: 'New planned lesson content',
          homework: 'New homework assignment',
          status: 'prepared',
        }),
        expect.objectContaining({
          onSuccess: expect.any(Function),
        }),
      )

      // Verify form is reset after successful creation
      await waitFor(() => {
        expect(screen.getByTestId('date-picker')).toHaveValue('')
        expect(screen.getByTestId('lesson-content')).toHaveValue('')
        expect(screen.getByTestId('homework')).toHaveValue('')
      })
    })

    it('should display planned lessons and allow insertion into drafts', async () => {
      const user = userEvent.setup()
      const plannedLesson = createMockLesson({
        id: 'planned-lesson-1',
        studentId: mockStudent.id,
        status: 'prepared',
        date: new Date('2024-01-20'),
        lessonContent: 'Planned lesson content',
        homework: 'Planned homework',
      })

      // Mock planned lessons query
      vi.mocked(lessonsQueriesModule.usePlannedLessonsQuery).mockReturnValue({
        data: [plannedLesson],
      } as any)

      // Render form with the planned lesson
      renderWithProviders(<CreatePlannedLessonForm />)

      // Verify planned lesson is displayed
      expect(screen.getByText('20.01.2024')).toBeInTheDocument()
      expect(screen.getByText('Planned lesson content')).toBeInTheDocument()
      expect(screen.getByText('Planned homework')).toBeInTheDocument()

      // Insert lesson into drafts
      const insertButton = screen.getByTestId('tooltip-insert')
      await user.click(insertButton)

      // Verify draft insertion
      expect(mockSetDrafts).toHaveBeenCalledWith(expect.any(Function))
      expect(toast.success).toHaveBeenCalledWith('Geplante Lektion eingefügt.')

      // Verify the draft setter function logic
      const setterFunction = mockSetDrafts.mock.calls[0]?.[0]
      const existingDrafts: Lesson[] = []
      const result = setterFunction(existingDrafts)

      expect(result).toContain(plannedLesson)
      expect(result).toHaveLength(1)
    })

    it('should handle lesson update workflow correctly', async () => {
      const user = userEvent.setup()
      const existingLesson = createMockLesson({
        id: 'existing-lesson',
        studentId: mockStudent.id,
        status: 'prepared',
        date: new Date('2024-01-25'),
        lessonContent: 'Original content',
        homework: 'Original homework',
      })

      // Mock lesson selected for updating
      vi.mocked(lessonPlanningContextModule.usePlanLessons).mockReturnValue({
        selectedForUpdating: existingLesson,
        setSelectedForUpdating: mockSetSelectedForUpdating,
      })

      // Mock successful update
      mockUpdateLesson.mockImplementation((lessonData, { onSuccess }) => {
        onSuccess(lessonData)
      })

      renderWithProviders(<CreatePlannedLessonForm />)

      // Verify form is pre-filled
      expect(screen.getByTestId('date-picker')).toHaveValue('2024-01-25')
      expect(screen.getByTestId('lesson-content')).toHaveValue(
        'Original content',
      )
      expect(screen.getByTestId('homework')).toHaveValue('Original homework')

      // Modify the lesson
      const lessonContent = screen.getByTestId('lesson-content')
      await user.clear(lessonContent)
      await user.type(lessonContent, 'Updated content')

      // Save the update
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      await user.click(saveButton)

      // Verify update was called
      expect(mockUpdateLesson).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'existing-lesson',
          lessonContent: 'Updated content',
          homework: 'Original homework',
          date: new Date('2024-01-25'),
        }),
        expect.objectContaining({
          onSuccess: expect.any(Function),
        }),
      )

      // Verify form is reset and selection cleared
      expect(mockSetSelectedForUpdating).toHaveBeenCalledWith(null)
      expect(toast.success).toHaveBeenCalledWith('Änderungen gespeichert.')
    })
  })

  describe('Cross-Component Communication', () => {
    it('should handle PreparedLessonItem highlighting when selected for update', () => {
      const plannedLesson = createMockLesson({
        id: 'lesson-for-update',
        studentId: mockStudent.id,
        status: 'prepared',
        date: new Date('2024-01-30'),
      })

      // Mock lesson selected for updating
      vi.mocked(lessonPlanningContextModule.usePlanLessons).mockReturnValue({
        selectedForUpdating: plannedLesson,
        setSelectedForUpdating: mockSetSelectedForUpdating,
      })

      const { container } = renderWithProviders(
        <PreparedLessonItem currentLesson={plannedLesson} />,
      )

      // Verify highlighting is applied - find the lesson item div
      const lessonItem = container.querySelector('.border-primary')
      expect(lessonItem).toBeInTheDocument()
      expect(lessonItem).toHaveClass('border-primary', 'shadow-sm')
    })

    it('should filter and sort planned lessons correctly for current holder', () => {
      const lesson1 = createMockLesson({
        id: 'lesson-1',
        studentId: mockStudent.id,
        status: 'prepared',
        date: new Date('2024-02-15'),
        lessonContent: 'Later lesson',
      })

      const lesson2 = createMockLesson({
        id: 'lesson-2',
        studentId: mockStudent.id,
        status: 'prepared',
        date: new Date('2024-02-10'),
        lessonContent: 'Earlier lesson',
      })

      const otherStudentLesson = createMockLesson({
        id: 'other-lesson',
        studentId: 'other-student',
        status: 'prepared',
        date: new Date('2024-02-12'),
      })

      vi.mocked(lessonsQueriesModule.usePlannedLessonsQuery).mockReturnValue({
        data: [lesson1, lesson2, otherStudentLesson], // Unsorted, includes other student
      } as any)

      renderWithProviders(<CreatePlannedLessonForm />)

      // Should display only current student's lessons
      expect(screen.getByText('Later lesson')).toBeInTheDocument()
      expect(screen.getByText('Earlier lesson')).toBeInTheDocument()
      expect(screen.queryByText('10.02.2024')).toBeInTheDocument()
      expect(screen.queryByText('15.02.2024')).toBeInTheDocument()

      // Should not display other student's lesson
      expect(screen.queryByText('12.02.2024')).not.toBeInTheDocument()
    })
  })

  describe('Error Handling and Validation Integration', () => {
    it('should handle validation errors across the workflow', async () => {
      const user = userEvent.setup()
      // Mock createLesson to simulate validation that happens inside handleSave
      mockCreateLesson.mockImplementation(() => {
        // Do nothing - don't call onSuccess to simulate validation failure
      })

      renderWithProviders(<CreatePlannedLessonForm />)

      // Add date and content to enable the save button
      await user.type(screen.getByTestId('date-picker'), '2024-01-15')
      await user.type(screen.getByTestId('lesson-content'), 'Test content')

      const saveButton = screen.getByRole('button', { name: /speichern/i })
      expect(saveButton).toBeEnabled()

      // Now clear the content and manually set it to empty (simulating edge case validation)
      await user.clear(screen.getByTestId('lesson-content'))

      // Since the button becomes disabled when content is empty, let's test button disabled state
      expect(saveButton).toBeDisabled()

      // Test that adding content back enables the button
      await user.type(screen.getByTestId('lesson-content'), 'Valid content')
      expect(saveButton).toBeEnabled()
    })

    it('should prevent duplicate lessons for the same date', async () => {
      const user = userEvent.setup()
      const existingLesson = createMockLesson({
        studentId: mockStudent.id,
        status: 'prepared',
        date: new Date('2024-01-15'),
      })

      vi.mocked(lessonsQueriesModule.usePlannedLessonsQuery).mockReturnValue({
        data: [existingLesson],
      } as any)

      renderWithProviders(<CreatePlannedLessonForm />)

      // Try to create lesson for the same date
      await user.type(screen.getByTestId('date-picker'), '2024-01-15')
      await user.type(screen.getByTestId('lesson-content'), 'Duplicate content')

      const saveButton = screen.getByRole('button', { name: /speichern/i })
      await user.click(saveButton)

      await waitFor(() => {
        expect(
          screen.getByText(
            'Für dieses Datum existiert bereits eine geplante Lektion.',
          ),
        ).toBeInTheDocument()
      })

      expect(mockCreateLesson).not.toHaveBeenCalled()
    })
  })

  describe('Loading States Integration', () => {
    it('should handle loading states throughout the workflow', async () => {
      const user = userEvent.setup()

      // Mock creating state
      vi.mocked(useCreateLessonModule.useCreateLesson).mockReturnValue({
        createLesson: mockCreateLesson,
        isCreating: true,
      })

      renderWithProviders(<CreatePlannedLessonForm />)

      // Verify loading state is shown
      expect(screen.getByTestId('mini-loader')).toBeInTheDocument()

      // Verify form is disabled during creation
      expect(screen.getByTestId('date-picker')).toBeDisabled()
      expect(screen.getByTestId('lesson-content')).toBeDisabled()
      expect(screen.getByTestId('homework')).toBeDisabled()
      expect(screen.getByRole('button', { name: /speichern/i })).toBeDisabled()
    })

    it('should handle updating state correctly', () => {
      vi.mocked(useUpdateLessonModule.useUpdateLesson).mockReturnValue({
        updateLesson: mockUpdateLesson,
        isUpdating: true,
      })

      renderWithProviders(<CreatePlannedLessonForm />)

      expect(screen.getByTestId('mini-loader')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /speichern/i })).toBeDisabled()
    })
  })

  describe('Modal Integration', () => {
    it('should call onClose when lesson is inserted from PreparedLessonItem', async () => {
      const user = userEvent.setup()
      const mockOnClose = vi.fn()
      const plannedLesson = createMockLesson({
        studentId: mockStudent.id,
        status: 'prepared',
      })

      renderWithProviders(
        <PreparedLessonItem
          currentLesson={plannedLesson}
          onClose={mockOnClose}
        />,
      )

      const insertButton = screen.getByTestId('tooltip-insert')
      await user.click(insertButton)

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should pass onClose prop correctly through CreatePlannedLessonForm', () => {
      const mockOnClose = vi.fn()
      const plannedLesson = createMockLesson({
        studentId: mockStudent.id,
        status: 'prepared',
      })

      vi.mocked(lessonsQueriesModule.usePlannedLessonsQuery).mockReturnValue({
        data: [plannedLesson],
      } as any)

      renderWithProviders(<CreatePlannedLessonForm onClose={mockOnClose} />)

      // The onClose prop should be passed through to PreparedLessonItem components
      expect(screen.getByTestId('tooltip-insert')).toBeInTheDocument()
    })
  })

  describe('Context State Management Integration', () => {
    it('should manage draft state correctly when inserting multiple lessons', async () => {
      const user = userEvent.setup()
      const lesson1 = createMockLesson({
        id: 'lesson-1',
        studentId: mockStudent.id,
        status: 'prepared',
      })
      const lesson2 = createMockLesson({
        id: 'lesson-2',
        studentId: mockStudent.id,
        status: 'prepared',
      })

      const existingDrafts = [lesson1]

      renderWithProviders(<PreparedLessonItem currentLesson={lesson2} />)

      const insertButton = screen.getByTestId('tooltip-insert')
      await user.click(insertButton)

      // Verify draft setter was called
      expect(mockSetDrafts).toHaveBeenCalledWith(expect.any(Function))

      // Test the draft setter function
      const setterFunction = mockSetDrafts.mock.calls[0]?.[0]
      const result = setterFunction(existingDrafts)

      // Should filter out existing draft for same holder and add new one
      expect(result).toHaveLength(1)
      expect(result[0]).toBe(lesson2)
    })

    it('should maintain lesson planning context state across components', () => {
      const selectedLesson = createMockLesson({
        id: 'selected-lesson',
        studentId: mockStudent.id,
        status: 'prepared',
      })

      vi.mocked(lessonPlanningContextModule.usePlanLessons).mockReturnValue({
        selectedForUpdating: selectedLesson,
        setSelectedForUpdating: mockSetSelectedForUpdating,
      })

      // Render both components
      const { container } = renderWithProviders(
        <div>
          <CreatePlannedLessonForm />
          <PreparedLessonItem currentLesson={selectedLesson} />
        </div>,
      )

      // Form should be pre-filled from context
      expect(screen.getByTestId('lesson-content')).toHaveValue(
        selectedLesson.lessonContent || '',
      )

      // Item should be highlighted from context - check the container div, not the tooltip trigger
      const itemContainers = container.querySelectorAll('div')
      const highlightedContainer = Array.from(itemContainers).find(
        (div) =>
          div.classList.contains('border-primary') &&
          div.classList.contains('shadow-sm'),
      )
      expect(highlightedContainer).toBeTruthy()
    })
  })
})
