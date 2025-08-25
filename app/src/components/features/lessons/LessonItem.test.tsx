import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as useIsMobileDeviceModule from '@/hooks/useIsMobileDevice'
import * as useUserLocaleModule from '@/services/context/UserLocaleContext'
import { createMockLesson } from '@/test/factories'
import { renderWithProviders } from '@/test/testUtils'
import type { Lesson } from '@/types/types'
import { LessonItem } from './LessonItem.component'

// Mock modules
vi.mock('@/services/context/UserLocaleContext')
vi.mock('@/hooks/useIsMobileDevice')
vi.mock('./homework/ButtonShareHomework.component', () => ({
  default: ({ lessonId }: { lessonId: number }) => (
    <button data-testid={`share-homework-${lessonId}`}>Share Homework</button>
  ),
}))
vi.mock('./PreviousLessonDropDown.component', () => ({
  default: ({ lessonId }: { lessonId: number }) => (
    <button data-testid={`lesson-dropdown-${lessonId}`}>Lesson Options</button>
  ),
}))

// Mock html-react-parser - return the HTML as-is for testing
vi.mock('html-react-parser', () => ({
  default: (html: string) => html,
}))

// Mock sanitizeHTML utility
vi.mock('@/utils/sanitizeHTML', () => ({
  removeHTMLAttributes: (html: string) => html,
}))

describe('LessonItem', () => {
  const mockLesson: Lesson = {
    ...createMockLesson(),
    id: 1,
    date: new Date('2023-12-01'),
    lessonContent: 'Test lesson content',
    homework: 'Test homework content',
  }

  const defaultMocks = {
    useUserLocale: {
      userLocale: 'en-US' as any,
      setUserLocale: vi.fn(),
    },
    useIsMobileDevice: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Setup default mocks
    vi.mocked(useUserLocaleModule.useUserLocale).mockReturnValue(
      defaultMocks.useUserLocale,
    )
    vi.mocked(useIsMobileDeviceModule.default).mockReturnValue(
      defaultMocks.useIsMobileDevice,
    )
  })

  describe('Basic Rendering', () => {
    it('should render lesson content and homework', () => {
      renderWithProviders(<LessonItem lesson={mockLesson} />)

      expect(screen.getByText('Lektion')).toBeInTheDocument()
      expect(screen.getByText('Hausaufgaben')).toBeInTheDocument()
      expect(screen.getByTestId('lessons-prev-lesson')).toHaveTextContent(
        'Test lesson content',
      )
      expect(screen.getByTestId('lessons-prev-homework')).toHaveTextContent(
        'Test homework content',
      )
    })

    it('should display formatted date', () => {
      renderWithProviders(<LessonItem lesson={mockLesson} />)

      // Date should be formatted according to locale
      expect(screen.getByText('12/01/2023')).toBeInTheDocument()
    })

    it('should render with German locale formatting', () => {
      vi.mocked(useUserLocaleModule.useUserLocale).mockReturnValue({
        userLocale: 'de-DE' as any,
        setUserLocale: vi.fn(),
      })

      renderWithProviders(<LessonItem lesson={mockLesson} />)

      // German date format
      expect(screen.getByText('01.12.2023')).toBeInTheDocument()
    })

    it('should handle empty lesson content', () => {
      const lessonWithEmptyContent = {
        ...mockLesson,
        lessonContent: '',
      }

      renderWithProviders(<LessonItem lesson={lessonWithEmptyContent} />)

      expect(screen.getByTestId('lessons-prev-lesson')).toHaveTextContent('—')
    })

    it('should handle empty homework content', () => {
      const lessonWithEmptyHomework = {
        ...mockLesson,
        homework: '',
      }

      renderWithProviders(<LessonItem lesson={lessonWithEmptyHomework} />)

      expect(screen.getByTestId('lessons-prev-homework')).toHaveTextContent('—')
    })

    it('should handle null lesson content', () => {
      const lessonWithNullContent = {
        ...mockLesson,
        lessonContent: null,
        homework: null,
      }

      renderWithProviders(<LessonItem lesson={lessonWithNullContent} />)

      expect(screen.getByTestId('lessons-prev-lesson')).toHaveTextContent('—')
      expect(screen.getByTestId('lessons-prev-homework')).toHaveTextContent('—')
    })
  })

  describe('Display Mode', () => {
    it('should hide date and action buttons in display-only mode', () => {
      renderWithProviders(<LessonItem lesson={mockLesson} isDisplayOnly />)

      // Date should not be visible
      expect(screen.queryByText('12/01/2023')).not.toBeInTheDocument()

      // Action buttons should not be visible
      expect(screen.queryByTestId('share-homework-1')).not.toBeInTheDocument()
      expect(screen.queryByTestId('lesson-dropdown-1')).not.toBeInTheDocument()
    })

    it('should show date and action buttons in normal mode', () => {
      renderWithProviders(<LessonItem lesson={mockLesson} />)

      // Date should be visible
      expect(screen.getByText('12/01/2023')).toBeInTheDocument()

      // Action buttons should be visible
      expect(screen.getByTestId('share-homework-1')).toBeInTheDocument()
      expect(screen.getByTestId('lesson-dropdown-1')).toBeInTheDocument()
    })
  })

  describe('Responsive Behavior', () => {
    it('should show action buttons on desktop', () => {
      vi.mocked(useIsMobileDeviceModule.default).mockReturnValue(false)

      renderWithProviders(<LessonItem lesson={mockLesson} />)

      expect(screen.getByTestId('share-homework-1')).toBeInTheDocument()
      expect(screen.getByTestId('lesson-dropdown-1')).toBeInTheDocument()
      expect(
        screen.queryByRole('img', { hidden: true }),
      ).not.toBeInTheDocument() // ChevronRightIcon
    })

    it('should show chevron icon on mobile', () => {
      vi.mocked(useIsMobileDeviceModule.default).mockReturnValue(true)

      renderWithProviders(<LessonItem lesson={mockLesson} />)

      // Action buttons should not be visible on mobile
      expect(screen.queryByTestId('share-homework-1')).not.toBeInTheDocument()
      expect(screen.queryByTestId('lesson-dropdown-1')).not.toBeInTheDocument()

      // Should show chevron icon instead (lucide icons are SVGs)
      expect(
        document.querySelector('.lucide-chevron-right'),
      ).toBeInTheDocument()
    })
  })

  describe('Content Rendering', () => {
    it('should render HTML content in lesson content', () => {
      const lessonWithHtml = {
        ...mockLesson,
        lessonContent: '<p>Lesson with <strong>bold</strong> text</p>',
      }

      renderWithProviders(<LessonItem lesson={lessonWithHtml} />)

      // Since we're mocking html-react-parser to return the string as-is
      expect(screen.getByTestId('lessons-prev-lesson')).toHaveTextContent(
        '<p>Lesson with <strong>bold</strong> text</p>',
      )
    })

    it('should render HTML content in homework', () => {
      const lessonWithHtml = {
        ...mockLesson,
        homework: '<ul><li>Practice scales</li><li>Review theory</li></ul>',
      }

      renderWithProviders(<LessonItem lesson={lessonWithHtml} />)

      // Since we're mocking html-react-parser to return the string as-is
      expect(screen.getByTestId('lessons-prev-homework')).toHaveTextContent(
        '<ul><li>Practice scales</li><li>Review theory</li></ul>',
      )
    })

    it('should apply correct CSS classes for content styling', () => {
      renderWithProviders(<LessonItem lesson={mockLesson} />)

      const lessonContent = screen.getByTestId('lessons-prev-lesson')
      const homeworkContent = screen.getByTestId('lessons-prev-homework')

      // Check for break-words class
      expect(lessonContent).toHaveClass('break-words')
      expect(homeworkContent).toHaveClass('break-words')

      // Check for text size
      expect(lessonContent).toHaveClass('text-sm')
      expect(homeworkContent).toHaveClass('text-sm')

      // Check for list styling classes
      expect(lessonContent).toHaveClass('[&_ul]:list-disc')
      expect(homeworkContent).toHaveClass('[&_ul]:list-disc')
    })
  })

  describe('Layout and Structure', () => {
    it('should have correct container structure', () => {
      const { container } = renderWithProviders(
        <LessonItem lesson={mockLesson} />,
      )

      // Find the main container div
      const mainContainer = container.querySelector(
        '.rounded-sm.border.border-hairline.bg-background100.p-3',
      )
      expect(mainContainer).toBeInTheDocument()
    })

    it('should have responsive grid layout for content', () => {
      const { container } = renderWithProviders(
        <LessonItem lesson={mockLesson} />,
      )

      // Find the grid container directly by its classes
      const contentGrid = container.querySelector(
        '.md\\:grid-cols-2.grid.gap-6',
      )
      expect(contentGrid).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should return null for falsy lesson', () => {
      const { container } = renderWithProviders(
        <LessonItem lesson={null as any} />,
      )
      expect(
        container.querySelector('[data-testid="lesson-item"]'),
      ).not.toBeInTheDocument()
    })

    it('should handle undefined lesson', () => {
      const { container } = renderWithProviders(
        <LessonItem lesson={undefined as any} />,
      )
      expect(
        container.querySelector('[data-testid="lesson-item"]'),
      ).not.toBeInTheDocument()
    })

    it('should render with minimal lesson data', () => {
      const minimalLesson = {
        ...createMockLesson(),
        id: 1,
        date: new Date('2023-12-01'),
        lessonContent: null,
        homework: null,
      }

      renderWithProviders(<LessonItem lesson={minimalLesson} />)

      expect(screen.getByText('Lektion')).toBeInTheDocument()
      expect(screen.getByText('Hausaufgaben')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      renderWithProviders(<LessonItem lesson={mockLesson} />)

      // Section headers should be present
      expect(screen.getByText('Lektion')).toBeInTheDocument()
      expect(screen.getByText('Hausaufgaben')).toBeInTheDocument()
    })

    it('should have proper test IDs for content areas', () => {
      renderWithProviders(<LessonItem lesson={mockLesson} />)

      expect(screen.getByTestId('lessons-prev-lesson')).toBeInTheDocument()
      expect(screen.getByTestId('lessons-prev-homework')).toBeInTheDocument()
    })
  })
})
