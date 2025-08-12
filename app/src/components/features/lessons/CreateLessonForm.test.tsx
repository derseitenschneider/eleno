import * as useDraftsModule from '@/services/context/DraftsContext'
import * as useSubscriptionModule from '@/services/context/SubscriptionContext'
import { createMockGroup, createMockStudent } from '@/test/factories'
import { renderWithProviders } from '@/test/testUtils'
import type { LessonHolder } from '@/types/types'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as settingsQueryModule from '../settings/settingsQuery'
import { CreateLessonForm } from './CreateLessonForm.component'
import * as useCreateLessonModule from './useCreateLesson'
import * as useCurrentHolderModule from './useCurrentHolder'
import * as useUpdateLessonModule from './useUpdateLesson'

// Mock modules
vi.mock('./useCurrentHolder')
vi.mock('@/services/context/DraftsContext')
vi.mock('@/services/context/SubscriptionContext')
vi.mock('./useCreateLesson')
vi.mock('./useUpdateLesson')
vi.mock('../settings/settingsQuery')
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
    useCurrentHolder: {
      currentLessonHolder: mockStudentHolder,
    },
    useDrafts: {
      drafts: [],
      setDrafts: vi.fn(),
    },
    useSubscription: {
      hasAccess: true,
      plan: 'Monatlich' as const,
      subscriptionState: 'active' as any,
      subscription: undefined,
      periodStartLocalized: '',
      periodEndLocalized: '',
    },
    useCreateLesson: {
      createLesson: vi.fn(),
      isCreating: false,
    },
    useUpdateLesson: {
      updateLesson: vi.fn(),
      isUpdating: false,
    },
    useSettingsQuery: {
      data: {
        id: 1,
        created_at: new Date().toISOString(),
        user_id: 'test-user',
        lesson_main_layout: 'regular' as const,
      },
    } as any,
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Setup default mocks
    vi.mocked(useCurrentHolderModule.default).mockReturnValue(
      defaultMocks.useCurrentHolder,
    )
    vi.mocked(useDraftsModule.useDrafts).mockReturnValue(defaultMocks.useDrafts)
    vi.mocked(useSubscriptionModule.useSubscription).mockReturnValue(
      defaultMocks.useSubscription,
    )
    vi.mocked(useCreateLessonModule.useCreateLesson).mockReturnValue(
      defaultMocks.useCreateLesson,
    )
    vi.mocked(useUpdateLessonModule.useUpdateLesson).mockReturnValue(
      defaultMocks.useUpdateLesson,
    )
    vi.mocked(settingsQueryModule.default).mockReturnValue(
      defaultMocks.useSettingsQuery,
    )
  })

  describe('Rendering', () => {
    it('should render form elements correctly', () => {
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
      vi.mocked(useCurrentHolderModule.default).mockReturnValue({
        currentLessonHolder: null,
      })

      const { container } = renderWithProviders(<CreateLessonForm />)
      expect(container.firstChild).toBeNull()
    })

    it('should not render when settings are not available', () => {
      vi.mocked(settingsQueryModule.default).mockReturnValue({
        data: null,
      } as any)

      const { container } = renderWithProviders(<CreateLessonForm />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Form Interactions', () => {
    it('should update lesson content when typing', async () => {
      const user = userEvent.setup()
      const mockSetDrafts = vi.fn()
      vi.mocked(useDraftsModule.useDrafts).mockReturnValue({
        drafts: [],
        setDrafts: mockSetDrafts,
      })

      renderWithProviders(<CreateLessonForm />)

      const lessonInput = screen.getByTestId('lesson-content')
      await user.type(lessonInput, 'Test lesson content')

      expect(lessonInput).toHaveValue('Test lesson content')
      expect(mockSetDrafts).toHaveBeenCalled()
    })

    it('should update homework when typing', async () => {
      const user = userEvent.setup()
      const mockSetDrafts = vi.fn()
      vi.mocked(useDraftsModule.useDrafts).mockReturnValue({
        drafts: [],
        setDrafts: mockSetDrafts,
      })

      renderWithProviders(<CreateLessonForm />)

      const homeworkInput = screen.getByTestId('homework')
      await user.type(homeworkInput, 'Test homework')

      expect(homeworkInput).toHaveValue('Test homework')
      expect(mockSetDrafts).toHaveBeenCalled()
    })

    it('should update draft when typing in lesson content', async () => {
      const user = userEvent.setup()
      const mockSetDrafts = vi.fn()

      vi.mocked(useDraftsModule.useDrafts).mockReturnValue({
        drafts: [],
        setDrafts: mockSetDrafts,
      })

      renderWithProviders(<CreateLessonForm />)

      const lessonInput = screen.getByTestId('lesson-content')
      await user.type(lessonInput, 'Some lesson content')

      // Verify content was typed
      expect(lessonInput).toHaveValue('Some lesson content')

      // Verify draft was updated
      expect(mockSetDrafts).toHaveBeenCalled()
    })
  })

  describe('Draft Management', () => {
    it('should load draft content when draft exists', () => {
      const mockDraft = {
        studentId: mockStudent.id,
        lessonContent: 'Draft lesson content',
        homework: 'Draft homework',
        date: new Date('2023-12-01'),
      }

      vi.mocked(useDraftsModule.useDrafts).mockReturnValue({
        drafts: [mockDraft],
        setDrafts: vi.fn(),
      })

      renderWithProviders(<CreateLessonForm />)

      expect(screen.getByTestId('lesson-content')).toHaveValue(
        'Draft lesson content',
      )
      expect(screen.getByTestId('homework')).toHaveValue('Draft homework')
    })

    it('should clear fields when no draft exists', () => {
      vi.mocked(useDraftsModule.useDrafts).mockReturnValue({
        drafts: [],
        setDrafts: vi.fn(),
      })

      renderWithProviders(<CreateLessonForm />)

      expect(screen.getByTestId('lesson-content')).toHaveValue('')
      expect(screen.getByTestId('homework')).toHaveValue('')
    })

    it('should handle group type holder correctly', () => {
      const mockDraft = {
        groupId: mockGroup.id,
        lessonContent: 'Group lesson content',
        homework: 'Group homework',
        date: new Date('2023-12-01'),
      }

      vi.mocked(useCurrentHolderModule.default).mockReturnValue({
        currentLessonHolder: mockGroupHolder,
      })
      vi.mocked(useDraftsModule.useDrafts).mockReturnValue({
        drafts: [mockDraft],
        setDrafts: vi.fn(),
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
      vi.mocked(useCreateLessonModule.useCreateLesson).mockReturnValue({
        createLesson: vi.fn(),
        isCreating: true,
      })

      renderWithProviders(<CreateLessonForm />)

      const saveButton = screen.getByRole('button', { name: 'Speichern' })
      expect(saveButton).toBeDisabled()
    })

    it('should disable save button when updating', () => {
      vi.mocked(useUpdateLessonModule.useUpdateLesson).mockReturnValue({
        updateLesson: vi.fn(),
        isUpdating: true,
      })

      renderWithProviders(<CreateLessonForm />)

      const saveButton = screen.getByRole('button', { name: 'Speichern' })
      expect(saveButton).toBeDisabled()
    })

    it('should disable save button when no access', () => {
      vi.mocked(useSubscriptionModule.useSubscription).mockReturnValue({
        hasAccess: false,
        plan: '—',
        subscriptionState: 'active' as any,
        subscription: undefined,
        periodStartLocalized: '',
        periodEndLocalized: '',
      })

      renderWithProviders(<CreateLessonForm />)

      const saveButton = screen.getByRole('button', { name: 'Speichern' })
      expect(saveButton).toBeDisabled()
    })

    it('should disable save button when both lesson content and homework are empty', () => {
      renderWithProviders(<CreateLessonForm />)

      const saveButton = screen.getByRole('button', { name: 'Speichern' })
      expect(saveButton).toBeDisabled()
    })

    it('should enable save button when lesson content is provided', async () => {
      const user = userEvent.setup()
      renderWithProviders(<CreateLessonForm />)

      const lessonInput = screen.getByTestId('lesson-content')
      await user.type(lessonInput, 'Some lesson content')

      const saveButton = screen.getByRole('button', { name: 'Speichern' })
      expect(saveButton).toBeEnabled()
    })

    it('should enable save button when homework is provided', async () => {
      const user = userEvent.setup()
      renderWithProviders(<CreateLessonForm />)

      const homeworkInput = screen.getByTestId('homework')
      await user.type(homeworkInput, 'Some homework')

      const saveButton = screen.getByRole('button', { name: 'Speichern' })
      expect(saveButton).toBeEnabled()
    })
  })

  describe('Lesson Creation', () => {
    it('should create lesson with correct data for student', async () => {
      const user = userEvent.setup()
      const mockCreateLesson = vi.fn()
      vi.mocked(useCreateLessonModule.useCreateLesson).mockReturnValue({
        createLesson: mockCreateLesson,
        isCreating: false,
      })

      renderWithProviders(<CreateLessonForm />)

      const lessonInput = screen.getByTestId('lesson-content')
      const homeworkInput = screen.getByTestId('homework')
      await user.type(lessonInput, 'Test lesson')
      await user.type(homeworkInput, 'Test homework')

      const saveButton = screen.getByRole('button', { name: 'Speichern' })
      await user.click(saveButton)

      expect(mockCreateLesson).toHaveBeenCalledWith(
        expect.objectContaining({
          lessonContent: 'Test lesson',
          homework: 'Test homework',
          studentId: mockStudent.id,
          status: 'documented',
        }),
        expect.objectContaining({
          onSuccess: expect.any(Function),
        }),
      )
    })

    it('should create lesson with correct data for group', async () => {
      const user = userEvent.setup()
      const mockCreateLesson = vi.fn()
      vi.mocked(useCurrentHolderModule.default).mockReturnValue({
        currentLessonHolder: mockGroupHolder,
      })
      vi.mocked(useCreateLessonModule.useCreateLesson).mockReturnValue({
        createLesson: mockCreateLesson,
        isCreating: false,
      })

      renderWithProviders(<CreateLessonForm />)

      const lessonInput = screen.getByTestId('lesson-content')
      await user.type(lessonInput, 'Group lesson')

      const saveButton = screen.getByRole('button', { name: 'Speichern' })
      await user.click(saveButton)

      expect(mockCreateLesson).toHaveBeenCalledWith(
        expect.objectContaining({
          lessonContent: 'Group lesson',
          groupId: mockGroup.id,
          status: 'documented',
        }),
        expect.any(Object),
      )
    })
  })

  describe('Planned Lesson Update', () => {
    it('should update planned lesson when draft has prepared status', async () => {
      const user = userEvent.setup()
      const mockUpdateLesson = vi.fn()
      const mockDraft = {
        studentId: mockStudent.id,
        lessonContent: 'Planned lesson content',
        homework: 'Planned homework',
        date: new Date('2023-12-01'),
        status: 'prepared' as const,
        id: 1,
      }

      vi.mocked(useDraftsModule.useDrafts).mockReturnValue({
        drafts: [mockDraft],
        setDrafts: vi.fn(),
      })
      vi.mocked(useUpdateLessonModule.useUpdateLesson).mockReturnValue({
        updateLesson: mockUpdateLesson,
        isUpdating: false,
      })

      renderWithProviders(<CreateLessonForm />)

      const saveButton = screen.getByRole('button', { name: 'Speichern' })
      await user.click(saveButton)

      expect(mockUpdateLesson).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          status: 'documented',
          lessonContent: 'Planned lesson content',
          homework: 'Planned homework',
        }),
        expect.objectContaining({
          onSuccess: expect.any(Function),
        }),
      )
    })
  })

  describe('Loading States', () => {
    it('should show loading indicator when creating', () => {
      vi.mocked(useCreateLessonModule.useCreateLesson).mockReturnValue({
        createLesson: vi.fn(),
        isCreating: true,
      })

      renderWithProviders(<CreateLessonForm />)

      expect(screen.getByTestId('mini-loader')).toBeInTheDocument()
    })

    it('should show loading indicator when updating', () => {
      vi.mocked(useUpdateLessonModule.useUpdateLesson).mockReturnValue({
        updateLesson: vi.fn(),
        isUpdating: true,
      })

      renderWithProviders(<CreateLessonForm />)

      expect(screen.getByTestId('mini-loader')).toBeInTheDocument()
    })

    it('should disable form elements when creating', () => {
      vi.mocked(useCreateLessonModule.useCreateLesson).mockReturnValue({
        createLesson: vi.fn(),
        isCreating: true,
      })

      renderWithProviders(<CreateLessonForm />)

      expect(screen.getByTestId('lesson-content')).toBeDisabled()
      expect(screen.getByTestId('homework')).toBeDisabled()
    })
  })
})
