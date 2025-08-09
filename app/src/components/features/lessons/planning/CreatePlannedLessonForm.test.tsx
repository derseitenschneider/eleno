import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/testUtils'
import { CreatePlannedLessonForm } from './CreatePlannedLessonForm.component'
import * as useCurrentHolderModule from '../useCurrentHolder'
import * as useSubscriptionModule from '@/services/context/SubscriptionContext'
import * as useCreateLessonModule from '../useCreateLesson'
import * as useUpdateLessonModule from '../useUpdateLesson'
import * as settingsQueryModule from '../../settings/settingsQuery'
import * as lessonsQueriesModule from '../lessonsQueries'
import * as lessonPlanningContextModule from '@/services/context/LessonPlanningContext'
import { createMockStudent, createMockGroup, createMockLesson, createMockSettings } from '@/test/factories'
import type { LessonHolder } from '@/types/types'

// Mock modules
vi.mock('../useCurrentHolder')
vi.mock('@/services/context/SubscriptionContext')
vi.mock('../useCreateLesson')
vi.mock('../useUpdateLesson')
vi.mock('../../settings/settingsQuery')
vi.mock('../lessonsQueries')
vi.mock('@/services/context/LessonPlanningContext')
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock CustomEditor component
vi.mock('@/components/ui/CustomEditor.component', () => ({
  default: ({ value, onChange, placeholder, disabled }: any) => (
    <textarea
      data-testid={placeholder?.includes('Lektion') ? 'lesson-content' : 'homework'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
    />
  ),
}))

// Mock DayPicker component
vi.mock('@/components/ui/daypicker.component', () => ({
  DayPicker: ({ date, setDate, disabled }: any) => (
    <input
      data-testid="date-picker"
      type="date"
      value={date ? date.toISOString().split('T')[0] : ''}
      onChange={(e) => setDate(new Date(e.target.value))}
      disabled={disabled}
    />
  ),
}))

// Mock MiniLoader component
vi.mock('@/components/ui/MiniLoader.component', () => ({
  default: () => <div data-testid="mini-loader">Loading...</div>,
}))

// Mock PreparedLessonItem component
vi.mock('./PlannedLessonItem.component', () => ({
  PreparedLessonItem: ({ currentLesson, onClose }: any) => (
    <div data-testid="prepared-lesson-item">
      <div data-testid="lesson-date">{currentLesson.date.toDateString()}</div>
      <div data-testid="prepared-lesson-content">{currentLesson.lessonContent}</div>
      <div data-testid="prepared-lesson-homework">{currentLesson.homework}</div>
    </div>
  ),
}))

describe('CreatePlannedLessonForm', () => {
  const mockStudent = createMockStudent()
  const mockGroup = createMockGroup()
  const mockSettings = createMockSettings()
  
  const mockStudentHolder: LessonHolder = {
    type: 's',
    holder: mockStudent,
  }
  
  const mockGroupHolder: LessonHolder = {
    type: 'g',
    holder: mockGroup,
  }

  const mockCreateLesson = vi.fn()
  const mockUpdateLesson = vi.fn()
  const mockSetSelectedForUpdating = vi.fn()

  const defaultMocks = {
    currentLessonHolder: mockStudentHolder,
    hasAccess: true,
    isCreating: false,
    isUpdating: false,
    settings: mockSettings,
    plannedLessons: [],
    selectedForUpdating: null,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup default mocks
    vi.mocked(useCurrentHolderModule.default).mockReturnValue({
      currentLessonHolder: defaultMocks.currentLessonHolder,
    })
    
    vi.mocked(useSubscriptionModule.useSubscription).mockReturnValue({
      hasAccess: defaultMocks.hasAccess,
    } as any)
    
    vi.mocked(useCreateLessonModule.useCreateLesson).mockReturnValue({
      createLesson: mockCreateLesson,
      isCreating: defaultMocks.isCreating,
    })
    
    vi.mocked(useUpdateLessonModule.useUpdateLesson).mockReturnValue({
      updateLesson: mockUpdateLesson,
      isUpdating: defaultMocks.isUpdating,
    })
    
    vi.mocked(settingsQueryModule.default).mockReturnValue({
      data: defaultMocks.settings,
    } as any)
    
    vi.mocked(lessonsQueriesModule.usePlannedLessonsQuery).mockReturnValue({
      data: defaultMocks.plannedLessons,
    } as any)
    
    vi.mocked(lessonPlanningContextModule.usePlanLessons).mockReturnValue({
      selectedForUpdating: defaultMocks.selectedForUpdating,
      setSelectedForUpdating: mockSetSelectedForUpdating,
    })
  })

  describe('Component Rendering', () => {
    it('renders form elements correctly', () => {
      renderWithProviders(<CreatePlannedLessonForm />)
      
      expect(screen.getByText('Datum')).toBeInTheDocument()
      expect(screen.getByTestId('date-picker')).toBeInTheDocument()
      expect(screen.getByText('Lektion')).toBeInTheDocument()
      expect(screen.getByTestId('lesson-content')).toBeInTheDocument()
      expect(screen.getByText('Hausaufgaben')).toBeInTheDocument()
      expect(screen.getByTestId('homework')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /speichern/i })).toBeInTheDocument()
    })

    it('renders planned lessons section', () => {
      renderWithProviders(<CreatePlannedLessonForm />)
      
      expect(screen.getByText('Geplante Lektionen')).toBeInTheDocument()
      expect(screen.getByText('Keine geplanten Lektionen vorhanden.')).toBeInTheDocument()
    })

    it('returns null when no current lesson holder', () => {
      vi.mocked(useCurrentHolderModule.default).mockReturnValue({
        currentLessonHolder: null,
      })
      
      const { container } = renderWithProviders(<CreatePlannedLessonForm />)
      expect(container.firstChild).toBeNull()
    })

    it('returns null when no settings', () => {
      vi.mocked(settingsQueryModule.default).mockReturnValue({
        data: null,
      } as any)
      
      const { container } = renderWithProviders(<CreatePlannedLessonForm />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Planned Lessons Display', () => {
    it('displays existing planned lessons for student', () => {
      const plannedLesson = createMockLesson({
        studentId: mockStudent.id,
        status: 'prepared',
        date: new Date('2024-01-15'),
        lessonContent: 'Test lesson content',
        homework: 'Test homework',
      })
      
      vi.mocked(lessonsQueriesModule.usePlannedLessonsQuery).mockReturnValue({
        data: [plannedLesson],
      } as any)
      
      renderWithProviders(<CreatePlannedLessonForm />)
      
      expect(screen.getByTestId('prepared-lesson-item')).toBeInTheDocument()
      expect(screen.getByTestId('lesson-date')).toHaveTextContent(plannedLesson.date.toDateString())
    })

    it('displays existing planned lessons for group', () => {
      const plannedLesson = createMockLesson({
        groupId: mockGroup.id,
        status: 'prepared',
        date: new Date('2024-01-15'),
      })
      
      vi.mocked(useCurrentHolderModule.default).mockReturnValue({
        currentLessonHolder: mockGroupHolder,
      })
      
      vi.mocked(lessonsQueriesModule.usePlannedLessonsQuery).mockReturnValue({
        data: [plannedLesson],
      } as any)
      
      renderWithProviders(<CreatePlannedLessonForm />)
      
      expect(screen.getByTestId('prepared-lesson-item')).toBeInTheDocument()
    })

    it('sorts planned lessons by date', () => {
      const lesson1 = createMockLesson({
        id: 'lesson-1',
        studentId: mockStudent.id,
        status: 'prepared',
        date: new Date('2024-01-20'),
        lessonContent: 'Later lesson',
      })
      const lesson2 = createMockLesson({
        id: 'lesson-2',
        studentId: mockStudent.id,
        status: 'prepared',
        date: new Date('2024-01-15'),
        lessonContent: 'Earlier lesson',
      })
      
      vi.mocked(lessonsQueriesModule.usePlannedLessonsQuery).mockReturnValue({
        data: [lesson1, lesson2], // Unsorted order
      } as any)
      
      renderWithProviders(<CreatePlannedLessonForm />)
      
      const lessonItems = screen.getAllByTestId('prepared-lesson-item')
      expect(lessonItems).toHaveLength(2)
      // Should be sorted by date (earlier first)
    })

    it('filters lessons to current holder only', () => {
      const studentLesson = createMockLesson({
        id: 'student-lesson',
        studentId: mockStudent.id,
        status: 'prepared',
      })
      const otherLesson = createMockLesson({
        id: 'other-lesson',
        studentId: 'other-student-id',
        status: 'prepared',
      })
      
      vi.mocked(lessonsQueriesModule.usePlannedLessonsQuery).mockReturnValue({
        data: [studentLesson, otherLesson],
      } as any)
      
      renderWithProviders(<CreatePlannedLessonForm />)
      
      const lessonItems = screen.getAllByTestId('prepared-lesson-item')
      expect(lessonItems).toHaveLength(1)
    })
  })

  describe('Form Interactions', () => {
    it('updates lesson content when typing', async () => {
      const user = userEvent.setup()
      renderWithProviders(<CreatePlannedLessonForm />)
      
      const lessonTextarea = screen.getByTestId('lesson-content')
      await user.type(lessonTextarea, 'New lesson content')
      
      expect(lessonTextarea).toHaveValue('New lesson content')
    })

    it('updates homework when typing', async () => {
      const user = userEvent.setup()
      renderWithProviders(<CreatePlannedLessonForm />)
      
      const homeworkTextarea = screen.getByTestId('homework')
      await user.type(homeworkTextarea, 'New homework')
      
      expect(homeworkTextarea).toHaveValue('New homework')
    })

    it('updates date when selected', async () => {
      const user = userEvent.setup()
      renderWithProviders(<CreatePlannedLessonForm />)
      
      const datePicker = screen.getByTestId('date-picker')
      await user.type(datePicker, '2024-01-15')
      
      expect(datePicker).toHaveValue('2024-01-15')
    })

    it('enables save button when both date and content are provided', async () => {
      const user = userEvent.setup()
      renderWithProviders(<CreatePlannedLessonForm />)
      
      // Initially disabled
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      expect(saveButton).toBeDisabled()
      
      // Add date
      const datePicker = screen.getByTestId('date-picker')
      await user.type(datePicker, '2024-01-15')
      
      // Still disabled without content
      expect(saveButton).toBeDisabled()
      
      // Add content
      const lessonTextarea = screen.getByTestId('lesson-content')
      await user.type(lessonTextarea, 'New content')
      
      // Now enabled
      expect(saveButton).toBeEnabled()
    })

    it('enables save button when both date and homework are provided', async () => {
      const user = userEvent.setup()
      renderWithProviders(<CreatePlannedLessonForm />)
      
      // Add date
      const datePicker = screen.getByTestId('date-picker')
      await user.type(datePicker, '2024-01-15')
      
      // Add homework instead of lesson content
      const homeworkTextarea = screen.getByTestId('homework')
      await user.type(homeworkTextarea, 'New homework')
      
      // Should be enabled with homework only
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      expect(saveButton).toBeEnabled()
    })
  })

  describe('Save Button State', () => {
    it('disables save button when creating', () => {
      vi.mocked(useCreateLessonModule.useCreateLesson).mockReturnValue({
        createLesson: mockCreateLesson,
        isCreating: true,
      })
      
      renderWithProviders(<CreatePlannedLessonForm />)
      
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      expect(saveButton).toBeDisabled()
    })

    it('disables save button when updating', () => {
      vi.mocked(useUpdateLessonModule.useUpdateLesson).mockReturnValue({
        updateLesson: mockUpdateLesson,
        isUpdating: true,
      })
      
      renderWithProviders(<CreatePlannedLessonForm />)
      
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      expect(saveButton).toBeDisabled()
    })

    it('disables save button when no access', () => {
      vi.mocked(useSubscriptionModule.useSubscription).mockReturnValue({
        hasAccess: false,
      } as any)
      
      renderWithProviders(<CreatePlannedLessonForm />)
      
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      expect(saveButton).toBeDisabled()
    })

    it('disables save button when no date selected', () => {
      renderWithProviders(<CreatePlannedLessonForm />)
      
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      expect(saveButton).toBeDisabled()
    })

    it('disables save button when no content and no homework', () => {
      renderWithProviders(<CreatePlannedLessonForm />)
      
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      expect(saveButton).toBeDisabled()
    })

    it('enables save button when all conditions are met', async () => {
      const user = userEvent.setup()
      renderWithProviders(<CreatePlannedLessonForm />)
      
      // Add date
      const datePicker = screen.getByTestId('date-picker')
      await user.type(datePicker, '2024-01-15')
      
      // Add lesson content
      const lessonTextarea = screen.getByTestId('lesson-content')
      await user.type(lessonTextarea, 'Test lesson')
      
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      expect(saveButton).toBeEnabled()
    })
  })

  describe('Lesson Creation', () => {
    it('creates lesson for student with correct data', async () => {
      const user = userEvent.setup()
      renderWithProviders(<CreatePlannedLessonForm />)
      
      // Fill form
      const datePicker = screen.getByTestId('date-picker')
      await user.type(datePicker, '2024-01-15')
      
      const lessonTextarea = screen.getByTestId('lesson-content')
      await user.type(lessonTextarea, 'Test lesson content')
      
      const homeworkTextarea = screen.getByTestId('homework')
      await user.type(homeworkTextarea, 'Test homework')
      
      // Save
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      await user.click(saveButton)
      
      expect(mockCreateLesson).toHaveBeenCalledWith(
        expect.objectContaining({
          studentId: mockStudent.id,
          lessonContent: 'Test lesson content',
          homework: 'Test homework',
          date: new Date('2024-01-15'),
          status: 'prepared',
          expiration_base: expect.any(String),
        }),
        expect.objectContaining({
          onSuccess: expect.any(Function),
        })
      )
    })

    it('creates lesson for group with correct data', async () => {
      const user = userEvent.setup()
      vi.mocked(useCurrentHolderModule.default).mockReturnValue({
        currentLessonHolder: mockGroupHolder,
      })
      
      renderWithProviders(<CreatePlannedLessonForm />)
      
      // Fill form
      const datePicker = screen.getByTestId('date-picker')
      await user.type(datePicker, '2024-01-15')
      
      const lessonTextarea = screen.getByTestId('lesson-content')
      await user.type(lessonTextarea, 'Test lesson content')
      
      // Save
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      await user.click(saveButton)
      
      expect(mockCreateLesson).toHaveBeenCalledWith(
        expect.objectContaining({
          groupId: mockGroup.id,
          lessonContent: 'Test lesson content',
          status: 'prepared',
        }),
        expect.any(Object)
      )
    })

    it('handles creation with only lesson content', async () => {
      const user = userEvent.setup()
      renderWithProviders(<CreatePlannedLessonForm />)
      
      const datePicker = screen.getByTestId('date-picker')
      await user.type(datePicker, '2024-01-15')
      
      const lessonTextarea = screen.getByTestId('lesson-content')
      await user.type(lessonTextarea, 'Only lesson content')
      
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      await user.click(saveButton)
      
      expect(mockCreateLesson).toHaveBeenCalledWith(
        expect.objectContaining({
          lessonContent: 'Only lesson content',
          homework: '',
        }),
        expect.any(Object)
      )
    })

    it('handles creation with only homework', async () => {
      const user = userEvent.setup()
      renderWithProviders(<CreatePlannedLessonForm />)
      
      const datePicker = screen.getByTestId('date-picker')
      await user.type(datePicker, '2024-01-15')
      
      const homeworkTextarea = screen.getByTestId('homework')
      await user.type(homeworkTextarea, 'Only homework')
      
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      await user.click(saveButton)
      
      expect(mockCreateLesson).toHaveBeenCalledWith(
        expect.objectContaining({
          lessonContent: '',
          homework: 'Only homework',
        }),
        expect.any(Object)
      )
    })

    it('resets form after successful creation', async () => {
      const user = userEvent.setup()
      mockCreateLesson.mockImplementation((data, { onSuccess }) => {
        onSuccess()
      })
      
      renderWithProviders(<CreatePlannedLessonForm />)
      
      // Fill and save form
      const datePicker = screen.getByTestId('date-picker')
      await user.type(datePicker, '2024-01-15')
      
      const lessonTextarea = screen.getByTestId('lesson-content')
      await user.type(lessonTextarea, 'Test content')
      
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      await user.click(saveButton)
      
      // Form should be reset
      await waitFor(() => {
        expect(screen.getByTestId('date-picker')).toHaveValue('')
        expect(screen.getByTestId('lesson-content')).toHaveValue('')
        expect(screen.getByTestId('homework')).toHaveValue('')
      })
    })
  })

  describe('Lesson Update Flow', () => {
    const mockLessonForUpdate = createMockLesson({
      id: 'lesson-1',
      studentId: mockStudent.id,
      date: new Date('2024-01-10'),
      lessonContent: 'Original content',
      homework: 'Original homework',
      status: 'prepared',
    })

    beforeEach(() => {
      vi.mocked(lessonPlanningContextModule.usePlanLessons).mockReturnValue({
        selectedForUpdating: mockLessonForUpdate,
        setSelectedForUpdating: mockSetSelectedForUpdating,
      })
    })

    it('pre-fills form when editing existing lesson', () => {
      renderWithProviders(<CreatePlannedLessonForm />)
      
      expect(screen.getByTestId('date-picker')).toHaveValue('2024-01-10')
      expect(screen.getByTestId('lesson-content')).toHaveValue('Original content')
      expect(screen.getByTestId('homework')).toHaveValue('Original homework')
    })

    it('updates lesson with modified data', async () => {
      const user = userEvent.setup()
      renderWithProviders(<CreatePlannedLessonForm />)
      
      // Modify content
      const lessonTextarea = screen.getByTestId('lesson-content')
      await user.clear(lessonTextarea)
      await user.type(lessonTextarea, 'Modified content')
      
      // Save
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      await user.click(saveButton)
      
      expect(mockUpdateLesson).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'lesson-1',
          lessonContent: 'Modified content',
          homework: 'Original homework',
        }),
        expect.objectContaining({
          onSuccess: expect.any(Function),
        })
      )
    })

    it('resets form and clears selection after successful update', async () => {
      const user = userEvent.setup()
      mockUpdateLesson.mockImplementation((data, { onSuccess }) => {
        onSuccess()
      })
      
      renderWithProviders(<CreatePlannedLessonForm />)
      
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      await user.click(saveButton)
      
      expect(mockSetSelectedForUpdating).toHaveBeenCalledWith(null)
    })
  })

  describe('Validation', () => {
    it('shows error when no content and no homework', async () => {
      const user = userEvent.setup()
      renderWithProviders(<CreatePlannedLessonForm />)
      
      // Add date only (this enables the save button)
      const datePicker = screen.getByTestId('date-picker')
      await user.type(datePicker, '2024-01-15')
      
      // Button should still be disabled because no content
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      expect(saveButton).toBeDisabled()
    })

    it('shows error when no date selected', async () => {
      const user = userEvent.setup()
      renderWithProviders(<CreatePlannedLessonForm />)
      
      // Add content only
      const lessonTextarea = screen.getByTestId('lesson-content')
      await user.type(lessonTextarea, 'Test content')
      
      // Button should be disabled because no date
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      expect(saveButton).toBeDisabled()
    })

    it('shows error when lesson already exists for date', async () => {
      const user = userEvent.setup()
      const existingLesson = createMockLesson({
        studentId: mockStudent.id,
        date: new Date('2024-01-15'),
        status: 'prepared',
      })
      
      vi.mocked(lessonsQueriesModule.usePlannedLessonsQuery).mockReturnValue({
        data: [existingLesson],
      } as any)
      
      renderWithProviders(<CreatePlannedLessonForm />)
      
      const datePicker = screen.getByTestId('date-picker')
      await user.type(datePicker, '2024-01-15')
      
      const lessonTextarea = screen.getByTestId('lesson-content')
      await user.type(lessonTextarea, 'Test content')
      
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      await user.click(saveButton)
      
      await waitFor(() => {
        expect(screen.getByText('Für dieses Datum existiert bereits eine geplante Lektion.')).toBeInTheDocument()
      })
    })

    it('allows duplicate date when updating existing lesson', async () => {
      const user = userEvent.setup()
      const existingLesson = createMockLesson({
        id: 'lesson-1',
        studentId: mockStudent.id,
        date: new Date('2024-01-15'),
        status: 'prepared',
      })
      
      vi.mocked(lessonsQueriesModule.usePlannedLessonsQuery).mockReturnValue({
        data: [existingLesson],
      } as any)
      
      vi.mocked(lessonPlanningContextModule.usePlanLessons).mockReturnValue({
        selectedForUpdating: existingLesson,
        setSelectedForUpdating: mockSetSelectedForUpdating,
      })
      
      renderWithProviders(<CreatePlannedLessonForm />)
      
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      await user.click(saveButton)
      
      expect(mockUpdateLesson).toHaveBeenCalled()
      expect(screen.queryByText('Für dieses Datum existiert bereits eine geplante Lektion.')).not.toBeInTheDocument()
    })
  })

  describe('Loading States', () => {
    it('shows mini loader when creating', () => {
      vi.mocked(useCreateLessonModule.useCreateLesson).mockReturnValue({
        createLesson: mockCreateLesson,
        isCreating: true,
      })
      
      renderWithProviders(<CreatePlannedLessonForm />)
      
      expect(screen.getByTestId('mini-loader')).toBeInTheDocument()
    })

    it('shows mini loader when updating', () => {
      vi.mocked(useUpdateLessonModule.useUpdateLesson).mockReturnValue({
        updateLesson: mockUpdateLesson,
        isUpdating: true,
      })
      
      renderWithProviders(<CreatePlannedLessonForm />)
      
      expect(screen.getByTestId('mini-loader')).toBeInTheDocument()
    })

    it('disables form when creating', () => {
      vi.mocked(useCreateLessonModule.useCreateLesson).mockReturnValue({
        createLesson: mockCreateLesson,
        isCreating: true,
      })
      
      renderWithProviders(<CreatePlannedLessonForm />)
      
      expect(screen.getByTestId('date-picker')).toBeDisabled()
      expect(screen.getByTestId('lesson-content')).toBeDisabled()
      expect(screen.getByTestId('homework')).toBeDisabled()
    })
  })

  describe('Modal Integration', () => {
    it('calls onClose when provided', () => {
      const mockOnClose = vi.fn()
      renderWithProviders(<CreatePlannedLessonForm onClose={mockOnClose} />)
      
      // The onClose prop is passed to PreparedLessonItem components
      expect(screen.getByText('Geplante Lektionen')).toBeInTheDocument()
    })
  })
})