import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as useLessonFormModule from '@/hooks/useLessonForm'
import { createMockGroup, createMockStudent } from '@/test/factories'
import { renderWithProviders } from '@/test/testUtils'
import type { LessonHolder } from '@/types/types'
import { CreateLessonForm } from './CreateLessonForm.component'

// Mock modules
vi.mock('@/hooks/useLessonForm')
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

// Mock MiniLoader component
vi.mock('@/components/ui/MiniLoader.component', () => ({
  default: () => <div data-testid='mini-loader'>Loading...</div>,
}))

describe('CreateLessonForm', () => {
  const mockStudent = createMockStudent()
  const mockGroup = createMockGroup()

  const mockStudentHolder: LessonHolder = {
    type: 's',
    holder: mockStudent as any,
  }
  const mockGroupHolder: LessonHolder = { type: 'g', holder: mockGroup as any }

  const defaultMocks = {
    currentLessonHolder: mockStudentHolder,
    settings: {
      id: 1,
      created_at: new Date().toISOString(),
      user_id: 'test-user',
      lesson_main_layout: 'regular' as const,
    },
    handleDate: vi.fn(),
    date: new Date('2023-12-01'),
    isCreating: false,
    lessonType: 'held' as const,
    lessonContent: '',
    handleLessonContent: vi.fn(),
    homework: '',
    handleHomework: vi.fn(),
    absenceReason: '',
    handleAbsenceReason: vi.fn(),
    error: '',
    isDisabledSave: true,
    handleSave: vi.fn(),
    isUpdating: false,
    isLoading: false,
    handleLessonType: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Setup default mocks
    vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue(defaultMocks)
  })

  describe('Rendering', () => {
    it('should render form elements correctly', () => {
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        lessonContent: 'some content',
        isDisabledSave: false,
      })

      renderWithProviders(<CreateLessonForm />)

      expect(screen.getByText('Datum')).toBeInTheDocument()
      expect(screen.getByText('Lektion')).toBeInTheDocument()
      expect(screen.getByText('Hausaufgaben')).toBeInTheDocument()
      expect(screen.getByTestId('lesson-content')).toBeInTheDocument()
      expect(screen.getByTestId('homework')).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Speichern' }),
      ).toBeInTheDocument()
    })

    it('should not render when no current holder is available', () => {
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        currentLessonHolder: null,
      })

      const { container } = renderWithProviders(<CreateLessonForm />)
      expect(container.firstChild).toBeNull()
    })

    it('should not render when settings are not available', () => {
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        settings: null,
      })

      const { container } = renderWithProviders(<CreateLessonForm />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Form Interactions', () => {
    it('should call handleLessonContent when typing in lesson content', async () => {
      const user = userEvent.setup()
      const mockHandleLessonContent = vi.fn()
      
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        handleLessonContent: mockHandleLessonContent,
      })

      renderWithProviders(<CreateLessonForm />)

      const lessonInput = screen.getByTestId('lesson-content')
      await user.type(lessonInput, 'T')

      expect(mockHandleLessonContent).toHaveBeenCalledWith('T')
    })

    it('should call handleHomework when typing in homework field', async () => {
      const user = userEvent.setup()
      const mockHandleHomework = vi.fn()
      
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        handleHomework: mockHandleHomework,
      })

      renderWithProviders(<CreateLessonForm />)

      const homeworkInput = screen.getByTestId('homework')
      await user.type(homeworkInput, 'H')

      expect(mockHandleHomework).toHaveBeenCalledWith('H')
    })

    it('should call handleLessonContent to update draft when typing', async () => {
      const user = userEvent.setup()
      const mockHandleLessonContent = vi.fn()

      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        handleLessonContent: mockHandleLessonContent,
      })

      renderWithProviders(<CreateLessonForm />)

      const lessonInput = screen.getByTestId('lesson-content')
      await user.type(lessonInput, 'A')

      // Verify handler was called to update draft
      expect(mockHandleLessonContent).toHaveBeenCalledWith('A')
    })

    it('should show absence reason field when lesson type is absent', async () => {
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        lessonType: 'student_absent',
      })

      renderWithProviders(<CreateLessonForm />)

      expect(screen.getByText('Abwesenheitsgrund')).toBeInTheDocument()
      expect(screen.queryByText('Lektion')).not.toBeInTheDocument()
      expect(screen.queryByText('Hausaufgaben')).not.toBeInTheDocument()
    })
  })

  describe('Draft Management', () => {
    it('should load draft content when draft exists', () => {
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        lessonContent: 'Draft lesson content',
        homework: 'Draft homework',
      })

      renderWithProviders(<CreateLessonForm />)

      expect(screen.getByTestId('lesson-content')).toHaveValue(
        'Draft lesson content',
      )
      expect(screen.getByTestId('homework')).toHaveValue('Draft homework')
    })

    it('should clear fields when no draft exists', () => {
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        lessonContent: '',
        homework: '',
      })

      renderWithProviders(<CreateLessonForm />)

      expect(screen.getByTestId('lesson-content')).toHaveValue('')
      expect(screen.getByTestId('homework')).toHaveValue('')
    })

    it('should handle group type holder correctly', () => {
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        currentLessonHolder: mockGroupHolder,
        lessonContent: 'Group lesson content',
        homework: 'Group homework',
      })

      renderWithProviders(<CreateLessonForm />)

      expect(screen.getByTestId('lesson-content')).toHaveValue(
        'Group lesson content',
      )
      expect(screen.getByTestId('homework')).toHaveValue('Group homework')
    })
  })

  describe('Form Validation', () => {
    it('should disable save button when creating', () => {
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        isCreating: true,
        isDisabledSave: true,
      })

      renderWithProviders(<CreateLessonForm />)

      const saveButton = screen.getByRole('button', { name: 'Speichern' })
      expect(saveButton).toBeDisabled()
    })

    it('should disable save button when updating', () => {
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        isUpdating: true,
        isDisabledSave: true,
      })

      renderWithProviders(<CreateLessonForm />)

      const saveButton = screen.getByRole('button', { name: 'Speichern' })
      expect(saveButton).toBeDisabled()
    })

    it('should disable save button when no access', () => {
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        isDisabledSave: true,
      })

      renderWithProviders(<CreateLessonForm />)

      const saveButton = screen.getByRole('button', { name: 'Speichern' })
      expect(saveButton).toBeDisabled()
    })

    it('should disable save button when both lesson content and homework are empty', () => {
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        lessonContent: '',
        homework: '',
        isDisabledSave: true,
      })

      renderWithProviders(<CreateLessonForm />)

      const saveButton = screen.getByRole('button', { name: 'Speichern' })
      expect(saveButton).toBeDisabled()
    })

    it('should enable save button when lesson content is provided', async () => {
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        lessonContent: 'Some lesson content',
        isDisabledSave: false,
      })

      renderWithProviders(<CreateLessonForm />)

      const saveButton = screen.getByRole('button', { name: 'Speichern' })
      expect(saveButton).toBeEnabled()
    })

    it('should enable save button when homework is provided', async () => {
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        homework: 'Some homework',
        isDisabledSave: false,
      })

      renderWithProviders(<CreateLessonForm />)

      const saveButton = screen.getByRole('button', { name: 'Speichern' })
      expect(saveButton).toBeEnabled()
    })

    it('should disable save button when lesson is absent and reason is empty', async () => {
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        lessonType: 'student_absent',
        absenceReason: '',
        isDisabledSave: true,
      })

      renderWithProviders(<CreateLessonForm />)

      const saveButton = screen.getByRole('button', { name: 'Speichern' })
      expect(saveButton).toBeDisabled()
    })
  })

  describe('Lesson Creation', () => {
    it('should create lesson with correct data for student', async () => {
      const user = userEvent.setup()
      const mockHandleSave = vi.fn()
      
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        lessonContent: 'Test lesson',
        homework: 'Test homework',
        handleSave: mockHandleSave,
        isDisabledSave: false,
      })

      renderWithProviders(<CreateLessonForm />)

      const saveButton = screen.getByRole('button', { name: 'Speichern' })
      await user.click(saveButton)

      expect(mockHandleSave).toHaveBeenCalled()
    })

    it('should create lesson with correct data for group', async () => {
      const user = userEvent.setup()
      const mockHandleSave = vi.fn()
      
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        currentLessonHolder: mockGroupHolder,
        lessonContent: 'Group lesson',
        handleSave: mockHandleSave,
        isDisabledSave: false,
      })

      renderWithProviders(<CreateLessonForm />)

      const saveButton = screen.getByRole('button', { name: 'Speichern' })
      await user.click(saveButton)

      expect(mockHandleSave).toHaveBeenCalled()
    })

    it('should create an absent lesson with correct data', async () => {
      const user = userEvent.setup()
      const mockHandleSave = vi.fn()
      const mockHandleAbsenceReason = vi.fn()
      
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        lessonType: 'student_absent',
        absenceReason: '',
        handleSave: mockHandleSave,
        handleAbsenceReason: mockHandleAbsenceReason,
        isDisabledSave: false,
      })

      renderWithProviders(<CreateLessonForm />)

      const absenceReasonInput = screen.getByPlaceholderText(
        'Grund für die Abwesenheit...',
      )
      await user.type(absenceReasonInput, 'X')

      const saveButton = screen.getByRole('button', { name: 'Speichern' })
      await user.click(saveButton)

      expect(mockHandleAbsenceReason).toHaveBeenCalledWith('X')
      expect(mockHandleSave).toHaveBeenCalled()
    })
  })

  describe('Planned Lesson Update', () => {
    it('should update planned lesson when draft has prepared status', async () => {
      const user = userEvent.setup()
      const mockHandleSave = vi.fn()
      
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        lessonContent: 'Planned lesson content',
        homework: 'Planned homework',
        handleSave: mockHandleSave,
        isDisabledSave: false,
      })

      renderWithProviders(<CreateLessonForm />)

      const saveButton = screen.getByRole('button', { name: 'Speichern' })
      await user.click(saveButton)

      expect(mockHandleSave).toHaveBeenCalled()
    })

    it('should update a lesson to be an absent lesson', async () => {
      const user = userEvent.setup()
      const mockHandleSave = vi.fn()
      const mockHandleAbsenceReason = vi.fn()
      
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        lessonType: 'teacher_absent',
        absenceReason: '',
        handleSave: mockHandleSave,
        handleAbsenceReason: mockHandleAbsenceReason,
        isDisabledSave: false,
      })

      renderWithProviders(<CreateLessonForm />)

      const absenceReasonInput = screen.getByPlaceholderText(
        'Grund für die Abwesenheit...',
      )
      await user.type(absenceReasonInput, 'Y')

      const saveButton = screen.getByRole('button', { name: 'Speichern' })
      await user.click(saveButton)

      expect(mockHandleAbsenceReason).toHaveBeenCalledWith('Y')
      expect(mockHandleSave).toHaveBeenCalled()
    })
  })

  describe('Loading States', () => {
    it('should show loading indicator when creating', () => {
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        isCreating: true,
        isLoading: true,
      })

      renderWithProviders(<CreateLessonForm />)

      expect(screen.getByTestId('mini-loader')).toBeInTheDocument()
    })

    it('should show loading indicator when updating', () => {
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        isUpdating: true,
        isLoading: true,
      })

      renderWithProviders(<CreateLessonForm />)

      expect(screen.getByTestId('mini-loader')).toBeInTheDocument()
    })

    it('should disable form elements when creating', () => {
      vi.mocked(useLessonFormModule.useLessonForm).mockReturnValue({
        ...defaultMocks,
        isCreating: true,
        isLoading: true,
      })

      renderWithProviders(<CreateLessonForm />)

      expect(screen.getByTestId('lesson-content')).toBeDisabled()
      expect(screen.getByTestId('homework')).toBeDisabled()
    })
  })
})
