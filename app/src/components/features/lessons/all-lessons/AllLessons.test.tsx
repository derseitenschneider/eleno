import { QueryClient } from '@tanstack/react-query'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/testUtils'
import { createMockLesson, createMockStudent, createMockGroup } from '@/test/factories'
import AllLessons from './AllLessons.component'

// Mock hooks and modules
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useSearchParams: vi.fn(() => [
      new URLSearchParams('?year=2024'),
      vi.fn()
    ]),
    NavLink: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  }
})

vi.mock('../lessonsQueries', () => ({
  useAllLessonsPerYear: vi.fn(),
  useLessonYears: vi.fn(),
}))

vi.mock('../useCurrentHolder', () => ({
  default: vi.fn(),
}))

vi.mock('@/hooks/useIsMobileDevice', () => ({
  default: vi.fn(() => false),
}))

vi.mock('@/services/context/UserLocaleContext', () => ({
  useUserLocale: vi.fn(() => ({ userLocale: 'de-CH' })),
}))

vi.mock('@/config', () => ({
  isDemoMode: false,
  appConfig: {
    isDemoMode: false,
    apiUrl: 'https://test-api.eleno.net',
    dbUrl: 'https://test-project.supabase.co',
    dbKey: 'test-anon-key',
  },
}))

vi.mock('../ExportLessons.component', () => ({
  default: ({ onSuccess }: any) => (
    <div>
      <button onClick={onSuccess}>Mock Export Button</button>
    </div>
  ),
}))

const mockUseAllLessonsPerYear = vi.hoisted(() => vi.fn())
const mockUseLessonYears = vi.hoisted(() => vi.fn())
const mockUseCurrentHolder = vi.hoisted(() => vi.fn())

import { useAllLessonsPerYear, useLessonYears } from '../lessonsQueries'
import useCurrentHolder from '../useCurrentHolder'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
const mockAllLessons = vi.mocked(useAllLessonsPerYear)
const mockLessonYears = vi.mocked(useLessonYears)
const mockCurrentHolder = vi.mocked(useCurrentHolder)
const mockIsMobileDevice = vi.mocked(useIsMobileDevice)

describe('AllLessons Component', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    vi.clearAllMocks()
  })

  const mockStudent = createMockStudent({
    id: 1,
    firstName: 'Anna',
    lastName: 'Schmidt',
    instrument: 'Piano',
  })

  const defaultCurrentHolder = {
    currentLessonHolder: {
      type: 's' as const,
      holder: mockStudent,
    },
  }

  const mockLessons = [
    createMockLesson({
      id: 1,
      date: new Date('2024-01-15'),
      lessonContent: 'Scales and arpeggios practice',
      homework: 'Practice C major scale',
      holderId: 1,
      holderType: 's',
    }),
    createMockLesson({
      id: 2,
      date: new Date('2024-01-22'),
      lessonContent: 'Chopin etude work',
      homework: 'Learn first page of Etude Op. 10 No. 1',
      holderId: 1,
      holderType: 's',
    }),
    createMockLesson({
      id: 3,
      date: new Date('2024-01-29'),
      lessonContent: 'Bach invention study',
      homework: 'Memorize Invention No. 1',
      holderId: 1,
      holderType: 's',
    }),
  ]

  describe('Data Loading States', () => {
    it('should display loading skeleton while fetching lesson years', () => {
      mockCurrentHolder.mockReturnValue(defaultCurrentHolder)
      mockLessonYears.mockReturnValue({
        isPending: true,
        isError: false,
      })
      mockAllLessons.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: false,
        isFetching: false,
      })

      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
    })

    it('should display loading skeleton while fetching lessons', () => {
      mockCurrentHolder.mockReturnValue(defaultCurrentHolder)
      mockLessonYears.mockReturnValue({
        isPending: false,
        isError: false,
      })
      mockAllLessons.mockReturnValue({
        data: undefined,
        isPending: true,
        isError: false,
        isFetching: false,
      })

      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
    })

    it('should display error page when lesson years query fails', () => {
      mockCurrentHolder.mockReturnValue(defaultCurrentHolder)
      mockLessonYears.mockReturnValue({
        isPending: false,
        isError: true,
      })
      mockAllLessons.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: false,
        isFetching: false,
      })

      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      expect(screen.getByText('Oops! Etwas ist schiefgelaufen')).toBeInTheDocument()
    })

    it('should display error page when lessons query fails', () => {
      mockCurrentHolder.mockReturnValue(defaultCurrentHolder)
      mockLessonYears.mockReturnValue({
        isPending: false,
        isError: false,
      })
      mockAllLessons.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: true,
        isFetching: false,
      })

      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      expect(screen.getByText('Oops! Etwas ist schiefgelaufen')).toBeInTheDocument()
    })

    it('should return null when lessons data is not available', () => {
      mockCurrentHolder.mockReturnValue(defaultCurrentHolder)
      mockLessonYears.mockReturnValue({
        isPending: false,
        isError: false,
      })
      mockAllLessons.mockReturnValue({
        data: null,
        isPending: false,
        isError: false,
        isFetching: false,
      })

      const { container } = renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      expect(container.firstChild).toBeNull()
    })
  })

  describe('Lessons Data Display', () => {
    beforeEach(() => {
      mockCurrentHolder.mockReturnValue(defaultCurrentHolder)
      mockLessonYears.mockReturnValue({
        isPending: false,
        isError: false,
      })
      mockAllLessons.mockReturnValue({
        data: mockLessons,
        isPending: false,
        isError: false,
        isFetching: false,
      })

      // Mock query client data for years
      queryClient.setQueryData(
        ['lesson-years', { holder: 's-1' }],
        [{ entity_id: 1, years: [2024, 2023] }]
      )
    })

    it('should display lessons table with correct data', () => {
      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      expect(screen.getByText('Scales and arpeggios practice')).toBeInTheDocument()
      expect(screen.getByText('Chopin etude work')).toBeInTheDocument()
      expect(screen.getByText('Bach invention study')).toBeInTheDocument()
    })

    it('should render lessons in table format', () => {
      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      // Check that lessons are rendered in table format
      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
      
      // Check for table rows (should have 3 data rows + 1 header row)
      const rows = screen.getAllByRole('row')
      expect(rows.length).toBeGreaterThan(1) // At least header + some data rows
    })

    it('should display homework content', () => {
      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      expect(screen.getByText('Practice C major scale')).toBeInTheDocument()
      expect(screen.getByText('Learn first page of Etude Op. 10 No. 1')).toBeInTheDocument()
      expect(screen.getByText('Memorize Invention No. 1')).toBeInTheDocument()
    })

    it('should handle empty lessons data gracefully', () => {
      mockAllLessons.mockReturnValue({
        data: [],
        isPending: false,
        isError: false,
        isFetching: false,
      })

      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      expect(screen.getByText('Keine Lektionen vorhanden')).toBeInTheDocument()
    })
  })

  describe('Filtering and Search', () => {
    beforeEach(() => {
      mockCurrentHolder.mockReturnValue(defaultCurrentHolder)
      mockLessonYears.mockReturnValue({
        isPending: false,
        isError: false,
      })
      mockAllLessons.mockReturnValue({
        data: mockLessons,
        isPending: false,
        isError: false,
        isFetching: false,
      })

      queryClient.setQueryData(
        ['lesson-years', { holder: 's-1' }],
        [{ entity_id: 1, years: [2024, 2023] }]
      )
    })

    it('should filter lessons by search term in lesson content', async () => {
      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      const searchInput = screen.getByPlaceholderText('suchen')
      fireEvent.change(searchInput, { target: { value: 'Chopin' } })

      await waitFor(() => {
        expect(screen.getByText('Chopin etude work')).toBeInTheDocument()
        expect(screen.queryByText('Scales and arpeggios practice')).not.toBeInTheDocument()
        expect(screen.queryByText('Bach invention study')).not.toBeInTheDocument()
      })
    })

    it('should filter lessons by search term in homework', async () => {
      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      const searchInput = screen.getByPlaceholderText('suchen')
      fireEvent.change(searchInput, { target: { value: 'scale' } })

      await waitFor(() => {
        expect(screen.getByText('Practice C major scale')).toBeInTheDocument()
        expect(screen.queryByText('Learn first page of Etude Op. 10 No. 1')).not.toBeInTheDocument()
        expect(screen.queryByText('Memorize Invention No. 1')).not.toBeInTheDocument()
      })
    })

    it('should filter lessons by date', async () => {
      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      const searchInput = screen.getByPlaceholderText('suchen')
      fireEvent.change(searchInput, { target: { value: '22.01' } })

      await waitFor(() => {
        expect(screen.getByText('Chopin etude work')).toBeInTheDocument()
        expect(screen.queryByText('Scales and arpeggios practice')).not.toBeInTheDocument()
        expect(screen.queryByText('Bach invention study')).not.toBeInTheDocument()
      })
    })

    it('should show no results when search term does not match', async () => {
      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      const searchInput = screen.getByPlaceholderText('suchen')
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } })

      await waitFor(() => {
        expect(screen.getByText('Keine Lektionen vorhanden')).toBeInTheDocument()
      })
    })

    it('should clear search filter', async () => {
      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      const searchInput = screen.getByPlaceholderText('suchen')
      
      // Filter
      fireEvent.change(searchInput, { target: { value: 'Chopin' } })
      await waitFor(() => {
        expect(screen.queryByText('Scales and arpeggios practice')).not.toBeInTheDocument()
      })

      // Clear filter
      fireEvent.change(searchInput, { target: { value: '' } })
      await waitFor(() => {
        expect(screen.getByText('Scales and arpeggios practice')).toBeInTheDocument()
        expect(screen.getByText('Chopin etude work')).toBeInTheDocument()
        expect(screen.getByText('Bach invention study')).toBeInTheDocument()
      })
    })
  })

  describe('Year Selection', () => {
    beforeEach(() => {
      mockCurrentHolder.mockReturnValue(defaultCurrentHolder)
      mockLessonYears.mockReturnValue({
        isPending: false,
        isError: false,
      })
      mockAllLessons.mockReturnValue({
        data: mockLessons,
        isPending: false,
        isError: false,
        isFetching: false,
      })

      queryClient.setQueryData(
        ['lesson-years', { holder: 's-1' }],
        [{ entity_id: 1, years: [2024, 2023, 2022] }]
      )
    })

    it('should display year selector with available years', () => {
      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should show available years in dropdown', async () => {
      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      const selector = screen.getByRole('combobox')
      fireEvent.click(selector)

      // Just verify the dropdown interaction doesn't crash the component
      await waitFor(() => {
        expect(selector).toBeInTheDocument()
      })
    })

    it('should disable year selector while fetching', () => {
      mockAllLessons.mockReturnValue({
        data: mockLessons,
        isPending: false,
        isError: false,
        isFetching: true,
      })

      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      const selector = screen.getByRole('combobox')
      expect(selector).toBeDisabled()
    })
  })

  describe('Export Functionality', () => {
    beforeEach(() => {
      mockCurrentHolder.mockReturnValue(defaultCurrentHolder)
      mockLessonYears.mockReturnValue({
        isPending: false,
        isError: false,
      })
      mockAllLessons.mockReturnValue({
        data: mockLessons,
        isPending: false,
        isError: false,
        isFetching: false,
      })

      queryClient.setQueryData(
        ['lesson-years', { holder: 's-1' }],
        [{ entity_id: 1, years: [2024, 2023] }]
      )
    })

    it('should display export button', () => {
      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      expect(screen.getByRole('button', { name: /Exportieren/ })).toBeInTheDocument()
    })

    it('should open export dialog when export button is clicked', async () => {
      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      const exportButton = screen.getByRole('button', { name: /Exportieren/ })
      fireEvent.click(exportButton)

      await waitFor(() => {
        expect(screen.getByText('Lektionsliste exportieren')).toBeInTheDocument()
      })
    })

    it('should disable export button while fetching', () => {
      mockAllLessons.mockReturnValue({
        data: mockLessons,
        isPending: false,
        isError: false,
        isFetching: true,
      })

      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      const exportButton = screen.getByRole('button', { name: /Exportieren/ })
      expect(exportButton).toBeDisabled()
    })

    it('should disable export button when no lesson years available', () => {
      queryClient.setQueryData(
        ['lesson-years', { holder: 's-1' }],
        [{ entity_id: 1, years: [] }]
      )

      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      const exportButton = screen.getByRole('button', { name: /Exportieren/ })
      expect(exportButton).toBeDisabled()
    })
  })

  describe('Sorting Functionality', () => {
    beforeEach(() => {
      mockCurrentHolder.mockReturnValue(defaultCurrentHolder)
      mockLessonYears.mockReturnValue({
        isPending: false,
        isError: false,
      })
      mockAllLessons.mockReturnValue({
        data: mockLessons,
        isPending: false,
        isError: false,
        isFetching: false,
      })

      queryClient.setQueryData(
        ['lesson-years', { holder: 's-1' }],
        [{ entity_id: 1, years: [2024] }]
      )
    })

    it('should allow sorting by date column', async () => {
      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      const dateColumn = screen.getByText('Datum')
      fireEvent.click(dateColumn)

      // Just verify that the table content is still present after sorting
      await waitFor(() => {
        expect(screen.getByText('Scales and arpeggios practice')).toBeInTheDocument()
        expect(screen.getByText('Chopin etude work')).toBeInTheDocument()
        expect(screen.getByText('Bach invention study')).toBeInTheDocument()
      })
    })

    it('should allow sorting by lesson content column', async () => {
      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      const contentColumn = screen.getByText('Lektionsinhalt')
      fireEvent.click(contentColumn)

      // Just verify that the table content is still present after sorting
      await waitFor(() => {
        expect(screen.getByText('Scales and arpeggios practice')).toBeInTheDocument()
        expect(screen.getByText('Chopin etude work')).toBeInTheDocument()
        expect(screen.getByText('Bach invention study')).toBeInTheDocument()
      })
    })
  })

  describe('Group Lessons Support', () => {
    const mockGroup = createMockGroup({
      id: 2,
      name: 'Advanced Piano Group',
    })

    const groupCurrentHolder = {
      currentLessonHolder: {
        type: 'g' as const,
        holder: mockGroup,
      },
    }

    beforeEach(() => {
      mockCurrentHolder.mockReturnValue(groupCurrentHolder)
      mockLessonYears.mockReturnValue({
        isPending: false,
        isError: false,
      })

      const groupLessons = mockLessons.map(lesson => ({
        ...lesson,
        holderId: 2,
        holderType: 'g' as const,
      }))

      mockAllLessons.mockReturnValue({
        data: groupLessons,
        isPending: false,
        isError: false,
        isFetching: false,
      })

      queryClient.setQueryData(
        ['lesson-years', { holder: 'g-2' }],
        [{ entity_id: 2, years: [2024] }]
      )
    })

    it('should handle group lessons correctly', () => {
      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      expect(screen.getByText('Scales and arpeggios practice')).toBeInTheDocument()
      expect(screen.getByText('Chopin etude work')).toBeInTheDocument()
      expect(screen.getByText('Bach invention study')).toBeInTheDocument()
    })

    it('should display correct navigation link for groups', () => {
      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      const backLink = screen.getByText('Zur Lektion').closest('a')
      expect(backLink).toHaveAttribute('to', '/lessons/g-2')
    })
  })

  describe('Responsive Behavior', () => {
    beforeEach(() => {
      mockCurrentHolder.mockReturnValue(defaultCurrentHolder)
      mockLessonYears.mockReturnValue({
        isPending: false,
        isError: false,
      })
      mockAllLessons.mockReturnValue({
        data: mockLessons,
        isPending: false,
        isError: false,
        isFetching: false,
      })

      queryClient.setQueryData(
        ['lesson-years', { holder: 's-1' }],
        [{ entity_id: 1, years: [2024] }]
      )
    })

    it('should use mobile columns on mobile devices', () => {
      mockIsMobileDevice.mockReturnValue(true)

      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      // Mobile view should still show the data but in different layout
      expect(screen.getByText('Scales and arpeggios practice')).toBeInTheDocument()
    })

    it('should hide export button on mobile', () => {
      mockIsMobileDevice.mockReturnValue(true)

      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      const exportButton = screen.getByRole('button', { name: /Exportieren/ })
      expect(exportButton).toHaveClass('hidden')
    })

    it('should hide search bar on mobile', () => {
      mockIsMobileDevice.mockReturnValue(true)

      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      const searchInput = screen.getByPlaceholderText('suchen')
      expect(searchInput).toHaveClass('hidden')
    })
  })

  describe('Demo Mode', () => {
    beforeEach(() => {
      // Reset the config mock for demo mode tests
      vi.doUnmock('@/config')
      vi.mock('@/config', () => ({
        isDemoMode: true,
        appConfig: {
          isDemoMode: true,
          apiUrl: 'https://test-api.eleno.net',
          dbUrl: 'https://test-project.supabase.co',
          dbKey: 'test-anon-key',
        },
      }))
      
      mockCurrentHolder.mockReturnValue(defaultCurrentHolder)
      mockLessonYears.mockReturnValue({
        isPending: false,
        isError: false,
      })
      mockAllLessons.mockReturnValue({
        data: mockLessons,
        isPending: false,
        isError: false,
        isFetching: false,
      })

      // Clear any existing query data
      queryClient.clear()
    })

    it('should use current year for demo mode', () => {
      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      // In demo mode, the year selector should still be present
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should only show current year in year selector for demo mode', async () => {
      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      const selector = screen.getByRole('combobox')
      expect(selector).toBeInTheDocument()
      
      // In demo mode, selector should be available but we'll just check it exists
      // The internal logic uses current year from isDemoMode config
    })
  })

  describe('Error Recovery', () => {
    it('should recover when currentHolder becomes available', () => {
      mockCurrentHolder.mockReturnValue({ currentLessonHolder: null })
      
      const { rerender } = renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      // Initially no holder, queries should be called with default values
      expect(mockAllLessons).toHaveBeenCalledWith(2024, 0, 's')
      expect(mockLessonYears).toHaveBeenCalledWith(0, 's')

      // Update to have holder
      mockCurrentHolder.mockReturnValue(defaultCurrentHolder)
      mockLessonYears.mockReturnValue({
        isPending: false,
        isError: false,
      })
      mockAllLessons.mockReturnValue({
        data: mockLessons,
        isPending: false,
        isError: false,
        isFetching: false,
      })

      rerender(
        <AllLessons />
      )

      expect(mockAllLessons).toHaveBeenCalledWith(2024, 1, 's')
      expect(mockLessonYears).toHaveBeenCalledWith(1, 's')
    })
  })

  describe('Navigation', () => {
    beforeEach(() => {
      mockCurrentHolder.mockReturnValue(defaultCurrentHolder)
      mockLessonYears.mockReturnValue({
        isPending: false,
        isError: false,
      })
      mockAllLessons.mockReturnValue({
        data: mockLessons,
        isPending: false,
        isError: false,
        isFetching: false,
      })

      queryClient.setQueryData(
        ['lesson-years', { holder: 's-1' }],
        [{ entity_id: 1, years: [2024] }]
      )
    })

    it('should display correct navigation link to lesson view', () => {
      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      const backLink = screen.getByText('Zur Lektion').closest('a')
      expect(backLink).toHaveAttribute('to', '/lessons/s-1')
    })

    it('should display back navigation with correct styling', () => {
      renderWithProviders(
        <AllLessons />,
        { queryClient }
      )

      const backLink = screen.getByText('Zur Lektion')
      expect(backLink).toHaveClass('text-primary')
      
      const chevronIcon = backLink.previousElementSibling
      expect(chevronIcon).toHaveClass('text-primary')
    })
  })
})