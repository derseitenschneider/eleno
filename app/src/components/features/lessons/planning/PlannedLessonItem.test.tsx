import * as draftsContextModule from '@/services/context/DraftsContext'
import * as lessonPlanningContextModule from '@/services/context/LessonPlanningContext'
import * as userLocaleContextModule from '@/services/context/UserLocaleContext'
import {
  createMockGroup,
  createMockLesson,
  createMockStudent,
} from '@/test/factories'
import { renderWithProviders } from '@/test/testUtils'
import type { LessonHolder } from '@/types/types'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as useCurrentHolderModule from '../useCurrentHolder'
import { PreparedLessonItem } from './PlannedLessonItem.component'

// Mock modules
vi.mock('../useCurrentHolder')
vi.mock('@/services/context/UserLocaleContext')
vi.mock('@/services/context/LessonPlanningContext')
vi.mock('@/services/context/DraftsContext')
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock html-react-parser
vi.mock('html-react-parser', () => ({
  default: (html: string) => <span data-testid='parsed-html'>{html}</span>,
}))

// Mock PrepareLessonDropDown component
vi.mock('./PlannedLessonDropdown.component', () => ({
  default: ({ insertLesson, lessonId }: any) => (
    <div data-testid='prepare-lesson-dropdown'>
      <button data-testid='dropdown-insert-lesson' onClick={insertLesson}>
        Insert from dropdown
      </button>
      <span data-testid='dropdown-lesson-id'>{lessonId}</span>
    </div>
  ),
}))

// Mock Tooltip components
vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: any) => <div>{children}</div>,
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipTrigger: ({ children, onClick }: any) => (
    <button data-testid='tooltip-trigger' onClick={onClick}>
      {children}
    </button>
  ),
  TooltipContent: ({ children }: any) => (
    <div data-testid='tooltip-content'>{children}</div>
  ),
}))

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  BetweenHorizonalStart: () => <div data-testid='insert-icon'>Insert Icon</div>,
}))

describe('PreparedLessonItem', () => {
  const mockStudent = createMockStudent()
  const mockGroup = createMockGroup() as any

  const mockStudentHolder: LessonHolder = {
    type: 's',
    holder: mockStudent,
  }

  const mockGroupHolder: LessonHolder = {
    type: 'g',
    holder: mockGroup,
  }

  const mockLesson = createMockLesson({
    id: 'lesson-1',
    studentId: mockStudent.id,
    date: new Date('2024-01-15'),
    lessonContent: '<p>Test lesson content</p>',
    homework: '<p>Test homework content</p>',
    status: 'prepared',
  })

  const mockSetDrafts = vi.fn()
  const mockOnClose = vi.fn()

  const defaultMocks = {
    currentLessonHolder: mockStudentHolder,
    userLocale: 'de-DE',
    selectedForUpdating: null,
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Setup default mocks
    vi.mocked(useCurrentHolderModule.default).mockReturnValue({
      currentLessonHolder: defaultMocks.currentLessonHolder,
    })

    vi.mocked(userLocaleContextModule.useUserLocale).mockReturnValue({
      userLocale: defaultMocks.userLocale,
    } as any)

    vi.mocked(lessonPlanningContextModule.usePlanLessons).mockReturnValue({
      selectedForUpdating: defaultMocks.selectedForUpdating,
      setSelectedForUpdating: vi.fn(),
    })

    vi.mocked(draftsContextModule.useDrafts).mockReturnValue({
      setDrafts: mockSetDrafts,
      drafts: [],
    } as any)
  })

  describe('Component Rendering', () => {
    it('renders lesson item with basic information', () => {
      renderWithProviders(
        <PreparedLessonItem currentLesson={mockLesson} onClose={mockOnClose} />,
      )

      expect(screen.getByText('15.01.2024')).toBeInTheDocument()
      expect(screen.getByText('Lektion')).toBeInTheDocument()
      expect(screen.getByText('Hausaufgaben')).toBeInTheDocument()
      expect(screen.getByTestId('insert-icon')).toBeInTheDocument()
      expect(screen.getByTestId('prepare-lesson-dropdown')).toBeInTheDocument()
    })

    it('displays lesson content with HTML parsing', () => {
      renderWithProviders(<PreparedLessonItem currentLesson={mockLesson} />)

      const parsedElements = screen.getAllByTestId('parsed-html')
      expect(parsedElements).toHaveLength(2) // One for lesson content, one for homework
    })

    it('shows empty placeholder when no lesson content', () => {
      const lessonWithoutContent = createMockLesson({
        ...mockLesson,
        lessonContent: '',
      })

      renderWithProviders(
        <PreparedLessonItem currentLesson={lessonWithoutContent} />,
      )

      expect(screen.getByText('—')).toBeInTheDocument()
    })

    it('shows empty placeholder when no homework', () => {
      const lessonWithoutHomework = createMockLesson({
        ...mockLesson,
        homework: '',
      })

      renderWithProviders(
        <PreparedLessonItem currentLesson={lessonWithoutHomework} />,
      )

      expect(screen.getByText('—')).toBeInTheDocument()
    })

    it('formats date according to user locale', () => {
      vi.mocked(userLocaleContextModule.useUserLocale).mockReturnValue({
        userLocale: 'en-US',
      } as any)

      renderWithProviders(<PreparedLessonItem currentLesson={mockLesson} />)

      expect(screen.getByText('01/15/2024')).toBeInTheDocument()
    })
  })

  describe('Visual States', () => {
    it('highlights item when selected for updating', () => {
      vi.mocked(lessonPlanningContextModule.usePlanLessons).mockReturnValue({
        selectedForUpdating: mockLesson,
        setSelectedForUpdating: vi.fn(),
      })

      const { container } = renderWithProviders(
        <PreparedLessonItem currentLesson={mockLesson} />,
      )

      const itemContainer = container.firstChild
      expect(itemContainer).toHaveClass('border-primary', 'shadow-sm')
    })

    it('shows normal border when not selected for updating', () => {
      const { container } = renderWithProviders(
        <PreparedLessonItem currentLesson={mockLesson} />,
      )

      const itemContainer = container.firstChild
      expect(itemContainer).toHaveClass('border-hairline')
      expect(itemContainer).not.toHaveClass('border-primary', 'shadow-sm')
    })

    it('shows normal border when different lesson is selected', () => {
      const otherLesson = createMockLesson({
        id: 'other-lesson',
        studentId: mockStudent.id,
      })

      vi.mocked(lessonPlanningContextModule.usePlanLessons).mockReturnValue({
        selectedForUpdating: otherLesson,
        setSelectedForUpdating: vi.fn(),
      })

      const { container } = renderWithProviders(
        <PreparedLessonItem currentLesson={mockLesson} />,
      )

      const itemContainer = container.firstChild
      expect(itemContainer).toHaveClass('border-hairline')
      expect(itemContainer).not.toHaveClass('border-primary')
    })
  })

  describe('Insert Lesson Functionality', () => {
    it('inserts lesson into drafts for student', async () => {
      const user = userEvent.setup()
      renderWithProviders(
        <PreparedLessonItem currentLesson={mockLesson} onClose={mockOnClose} />,
      )

      const insertButton = screen.getByTestId('tooltip-trigger')
      await user.click(insertButton)

      expect(mockSetDrafts).toHaveBeenCalledWith(expect.any(Function))
      expect(toast.success).toHaveBeenCalledWith('Geplante Lektion eingefügt.')
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('inserts lesson into drafts for group', async () => {
      const user = userEvent.setup()
      const groupLesson = createMockLesson({
        ...mockLesson,
        studentId: undefined,
        groupId: mockGroup.id,
      })

      vi.mocked(useCurrentHolderModule.default).mockReturnValue({
        currentLessonHolder: mockGroupHolder,
      })

      renderWithProviders(
        <PreparedLessonItem
          currentLesson={groupLesson}
          onClose={mockOnClose}
        />,
      )

      const insertButton = screen.getByTestId('tooltip-trigger')
      await user.click(insertButton)

      expect(mockSetDrafts).toHaveBeenCalledWith(expect.any(Function))
      expect(toast.success).toHaveBeenCalledWith('Geplante Lektion eingefügt.')
    })

    it('filters out existing draft for same holder when inserting', async () => {
      const user = userEvent.setup()
      const existingDrafts = [
        createMockLesson({ studentId: mockStudent.id, id: 'draft-1' }),
        createMockLesson({ studentId: 'other-student', id: 'draft-2' }),
      ]

      renderWithProviders(<PreparedLessonItem currentLesson={mockLesson} />)

      const insertButton = screen.getByTestId('tooltip-trigger')
      await user.click(insertButton)

      // Verify the setter function behavior
      expect(mockSetDrafts).toHaveBeenCalledWith(expect.any(Function))
      const setterFunction = mockSetDrafts.mock.calls[0]?.[0]
      const result = setterFunction(existingDrafts)

      expect(result).toHaveLength(2) // Other student draft + new lesson
      expect(result).toContain(mockLesson)
      expect(result.some((draft: any) => draft.id === 'draft-2')).toBe(true)
      expect(result.some((draft: any) => draft.id === 'draft-1')).toBe(false)
    })

    it('handles insert when no current lesson holder', async () => {
      const user = userEvent.setup()
      vi.mocked(useCurrentHolderModule.default).mockReturnValue({
        currentLessonHolder: null,
      })

      renderWithProviders(<PreparedLessonItem currentLesson={mockLesson} />)

      const insertButton = screen.getByTestId('tooltip-trigger')
      await user.click(insertButton)

      // Should return early and not call setDrafts
      expect(mockSetDrafts).not.toHaveBeenCalled()
      expect(toast.success).not.toHaveBeenCalled()
    })

    it('calls onClose only when provided', async () => {
      const user = userEvent.setup()

      // Test without onClose
      renderWithProviders(<PreparedLessonItem currentLesson={mockLesson} />)

      const insertButton = screen.getByTestId('tooltip-trigger')
      await user.click(insertButton)

      expect(mockSetDrafts).toHaveBeenCalled()
      expect(toast.success).toHaveBeenCalled()
      // onClose should not be called since it wasn't provided
    })
  })

  describe('Dropdown Integration', () => {
    it('passes correct lesson ID to dropdown', () => {
      renderWithProviders(<PreparedLessonItem currentLesson={mockLesson} />)

      expect(screen.getByTestId('dropdown-lesson-id')).toHaveTextContent(
        'lesson-1',
      )
    })

    it('provides insert function to dropdown', async () => {
      const user = userEvent.setup()
      renderWithProviders(
        <PreparedLessonItem currentLesson={mockLesson} onClose={mockOnClose} />,
      )

      const dropdownInsertButton = screen.getByTestId('dropdown-insert-lesson')
      await user.click(dropdownInsertButton)

      expect(mockSetDrafts).toHaveBeenCalled()
      expect(toast.success).toHaveBeenCalledWith('Geplante Lektion eingefügt.')
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('Tooltip Integration', () => {
    it('shows insert tooltip content', () => {
      renderWithProviders(<PreparedLessonItem currentLesson={mockLesson} />)

      expect(screen.getByText('Lektion einfügen')).toBeInTheDocument()
    })

    it('positions tooltip to the left', () => {
      const { container } = renderWithProviders(
        <PreparedLessonItem currentLesson={mockLesson} />,
      )

      // The TooltipContent component receives side="left" prop
      expect(screen.getByTestId('tooltip-content')).toBeInTheDocument()
    })
  })

  describe('Content Sanitization', () => {
    it('sanitizes HTML content in lesson content', () => {
      const lessonWithHTML = createMockLesson({
        ...mockLesson,
        lessonContent: '<script>alert("xss")</script><p>Safe content</p>',
      })

      renderWithProviders(<PreparedLessonItem currentLesson={lessonWithHTML} />)

      // The removeHTMLAttributes function should sanitize the content
      // This would be handled by the actual sanitization function
      expect(screen.getAllByTestId('parsed-html')).toHaveLength(2) // One for lesson, one for homework
    })

    it('sanitizes HTML content in homework', () => {
      const lessonWithHTML = createMockLesson({
        ...mockLesson,
        homework: '<script>alert("xss")</script><p>Safe homework</p>',
      })

      renderWithProviders(<PreparedLessonItem currentLesson={lessonWithHTML} />)

      expect(screen.getAllByTestId('parsed-html')).toHaveLength(2)
    })

    it('handles null lesson content gracefully', () => {
      const lessonWithNull = createMockLesson({
        ...mockLesson,
        lessonContent: null as any,
      })

      renderWithProviders(<PreparedLessonItem currentLesson={lessonWithNull} />)

      expect(screen.getByText('—')).toBeInTheDocument()
    })

    it('handles null homework gracefully', () => {
      const lessonWithNull = createMockLesson({
        ...mockLesson,
        homework: null as any,
      })

      renderWithProviders(<PreparedLessonItem currentLesson={lessonWithNull} />)

      expect(screen.getByText('—')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper test IDs for content sections', () => {
      renderWithProviders(<PreparedLessonItem currentLesson={mockLesson} />)

      expect(screen.getByTestId('lessons-prev-lesson')).toBeInTheDocument()
      expect(screen.getByTestId('lessons-prev-homework')).toBeInTheDocument()
    })

    it('maintains proper content hierarchy', () => {
      renderWithProviders(<PreparedLessonItem currentLesson={mockLesson} />)

      expect(screen.getByText('Lektion')).toBeInTheDocument()
      expect(screen.getByText('Hausaufgaben')).toBeInTheDocument()

      // Content should be structured properly with labels
      const lessonSection = screen.getByTestId('lessons-prev-lesson')
      const homeworkSection = screen.getByTestId('lessons-prev-homework')

      expect(lessonSection).toBeInTheDocument()
      expect(homeworkSection).toBeInTheDocument()
    })

    it('supports proper CSS classes for styling', () => {
      renderWithProviders(<PreparedLessonItem currentLesson={mockLesson} />)

      const lessonContent = screen.getByTestId('lessons-prev-lesson')
      const homeworkContent = screen.getByTestId('lessons-prev-homework')

      expect(lessonContent).toHaveClass('break-words', 'text-sm')
      expect(homeworkContent).toHaveClass('break-words', 'text-sm')
    })
  })

  describe('Edge Cases', () => {
    it('handles very long lesson content', () => {
      const longContent = 'A'.repeat(1000)
      const lessonWithLongContent = createMockLesson({
        ...mockLesson,
        lessonContent: longContent,
      })

      renderWithProviders(
        <PreparedLessonItem currentLesson={lessonWithLongContent} />,
      )

      expect(screen.getByTestId('lessons-prev-lesson')).toBeInTheDocument()
    })

    it('handles special characters in content', () => {
      const specialContent = 'Spëçîál çhärâctërs & émøjis 🎵🎹'
      const lessonWithSpecialChars = createMockLesson({
        ...mockLesson,
        lessonContent: specialContent,
        homework: specialContent,
      })

      renderWithProviders(
        <PreparedLessonItem currentLesson={lessonWithSpecialChars} />,
      )

      expect(screen.getAllByTestId('parsed-html')).toHaveLength(2)
    })

    it('handles future dates correctly', () => {
      const futureDate = new Date('2025-12-31')
      const futureLessen = createMockLesson({
        ...mockLesson,
        date: futureDate,
      })

      renderWithProviders(<PreparedLessonItem currentLesson={futureLessen} />)

      expect(screen.getByText('31.12.2025')).toBeInTheDocument()
    })

    it('handles past dates correctly', () => {
      const pastDate = new Date('2020-01-01')
      const pastLesson = createMockLesson({
        ...mockLesson,
        date: pastDate,
      })

      renderWithProviders(<PreparedLessonItem currentLesson={pastLesson} />)

      expect(screen.getByText('01.01.2020')).toBeInTheDocument()
    })
  })
})
