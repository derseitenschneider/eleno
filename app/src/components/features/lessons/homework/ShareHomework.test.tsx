import { QueryClient } from '@tanstack/react-query'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/testUtils'
import {
  createMockLesson,
  createMockStudent,
  createMockGroup,
} from '@/test/factories'
import type { LessonHolder } from '@/types/types'
import ShareHomework from './ShareHomework.component'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'

// Mock hooks and modules
vi.mock('@/hooks/useIsMobileDevice', () => ({
  default: vi.fn(() => false),
}))

vi.mock('@/hooks/useShareHomework', () => ({
  useShareHomework: vi.fn(),
}))

vi.mock(
  '@/components/features/students/useAuthorizeStudentsHomeworkLink',
  () => ({
    useAuthorizeStudentHomeworkLink: vi.fn(() => ({
      authorizeStudent: vi.fn(),
      isAuthorizingStudents: false,
    })),
  }),
)

vi.mock(
  '@/components/features/students/useAuthorizeGroupsHomeworkLink',
  () => ({
    useAuthorizeGroupHomeworkLink: vi.fn(() => ({
      authorizeGroup: vi.fn(),
      isAuthorizingGroup: false,
    })),
  }),
)

vi.mock('@/config', () => ({
  appConfig: {
    apiUrl: 'https://test-api.eleno.net',
  },
}))

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
})

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}))

const mockUseShareHomework = vi.hoisted(() => vi.fn())
vi.mocked(mockUseShareHomework)

import { useShareHomework } from '@/hooks/useShareHomework'
const mockShareHomework = vi.mocked(useShareHomework)
const mockIsMobileDevice = vi.mocked(useIsMobileDevice)

describe('ShareHomework Component', () => {
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

  const defaultHookReturn = {
    currentHolder: {
      type: 's' as const,
      holder: createMockStudent({
        id: 1,
        firstName: 'Anna',
        lastName: 'Schmidt',
        instrument: 'Piano',
        homework_sharing_authorized: false,
      }),
    } satisfies LessonHolder,
    sharingAuthorized: false,
    isAuthorizingStudents: false,
    isAuthorizingGroup: false,
    handleShareAuthorization: vi.fn(),
    url: 'https://test-api.eleno.net/homework/1/test-homework-key',
    isCopied: false,
    lessonDate: '01.12.23',
    copyToClipboard: vi.fn(),
    bodyText:
      'Hallo Anna%0D%0A %0D%0AUnter folgendem Link findest du deine Hausaufgaben vom 01.12.23',
    subjectText: 'Hausaufgaben Piano vom 01.12.23',
  }

  describe('GDPR Consent Section', () => {
    it('should render consent checkbox', () => {
      mockShareHomework.mockReturnValue(defaultHookReturn)

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      expect(
        screen.getByText('Einwilligung zum Teilen bestätigt'),
      ).toBeInTheDocument()
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
      expect(screen.getByRole('checkbox')).not.toBeChecked()
    })

    it('should show consent checkbox as checked when sharing is authorized', () => {
      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        sharingAuthorized: true,
      })

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      expect(screen.getByRole('checkbox')).toBeChecked()
    })

    it('should call handleShareAuthorization when checkbox is clicked', async () => {
      const handleShareAuthorization = vi.fn()
      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        handleShareAuthorization,
      })

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      const checkbox = screen.getByRole('checkbox')
      fireEvent.click(checkbox)

      expect(handleShareAuthorization).toHaveBeenCalledWith(true)
    })

    it('should expand GDPR info when info icon is clicked', async () => {
      mockShareHomework.mockReturnValue(defaultHookReturn)

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      // Initially GDPR content should not be visible
      expect(
        screen.queryByText(
          'Mit dem Setzen dieser Checkbox bestätigst du, dass:',
        ),
      ).not.toBeInTheDocument()

      // Click info button to expand
      const infoButton = screen.getByRole('button')
      fireEvent.click(infoButton)

      await waitFor(() => {
        expect(
          screen.getByText(
            'Mit dem Setzen dieser Checkbox bestätigst du, dass:',
          ),
        ).toBeInTheDocument()
        expect(
          screen.getByText('diese Schüler:innen volljährig sind, ODER'),
        ).toBeInTheDocument()
        expect(
          screen.getByText(
            /du die ausdrückliche Einwilligung der Erziehungsberechtigten hast/,
          ),
        ).toBeInTheDocument()
      })
    })

    it('should display terms and conditions link in GDPR section', async () => {
      mockShareHomework.mockReturnValue(defaultHookReturn)

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      // Expand GDPR section
      const infoButton = screen.getByRole('button')
      fireEvent.click(infoButton)

      await waitFor(() => {
        const termsLink = screen.getByRole('link', {
          name: /Allgemeiner Geschäftsbedingungen/,
        })
        expect(termsLink).toHaveAttribute(
          'href',
          'https://eleno.net/terms-conditions/#sharing-homework',
        )
        expect(termsLink).toHaveAttribute('target', '_blank')
        expect(termsLink).toHaveAttribute('rel', 'noreferrer')
      })
    })

    it('should close GDPR info when close button is clicked', async () => {
      mockShareHomework.mockReturnValue(defaultHookReturn)

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      // Expand GDPR section
      const infoButton = screen.getByRole('button')
      fireEvent.click(infoButton)

      await waitFor(() => {
        expect(
          screen.getByText(
            'Mit dem Setzen dieser Checkbox bestätigst du, dass:',
          ),
        ).toBeInTheDocument()
      })

      // Click close button
      const buttons = screen.getAllByRole('button')
      const closeButton = buttons[1] // Second button is the close button
      expect(closeButton).toBeInTheDocument()
      if (closeButton) {
        fireEvent.click(closeButton)
      }

      await waitFor(() => {
        expect(
          screen.queryByText(
            'Mit dem Setzen dieser Checkbox bestätigst du, dass:',
          ),
        ).not.toBeInTheDocument()
      })
    })
  })

  describe('Link Generation and Display', () => {
    it('should display homework link when sharing is authorized', () => {
      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        sharingAuthorized: true,
      })

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      expect(screen.getByText(/Mit diesem Link kann/)).toBeInTheDocument()
      expect(screen.getByText('Anna Schmidt')).toBeInTheDocument()
      expect(screen.getByText(/auf die Hausaufgaben vom/)).toBeInTheDocument()
      expect(screen.getByText('01.12.23')).toBeInTheDocument()

      const link = screen.getByRole('link', { name: defaultHookReturn.url })
      expect(link).toHaveAttribute('href', defaultHookReturn.url)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noreferrer')
    })

    it('should display group name for group lessons', () => {
      const mockGroupData = createMockGroup({
        id: 1,
        name: 'Advanced Piano Group',
        homework_sharing_authorized: true,
      })

      // Convert to the correct Group type expected by LessonHolder
      const groupHolder: LessonHolder = {
        type: 'g' as const,
        holder: {
          ...mockGroupData,
          students: (mockGroupData.students || []).map((student) => ({
            name:
              typeof student === 'object' &&
              student !== null &&
              'name' in student
                ? String(student.name)
                : String(student),
          })),
        },
      }

      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        currentHolder: groupHolder,
        sharingAuthorized: true,
      })

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      expect(screen.getByText('Advanced Piano Group')).toBeInTheDocument()
    })

    it('should not display sharing section when sharing is not authorized', () => {
      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        sharingAuthorized: false,
      })

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      expect(screen.queryByText(/Mit diesem Link kann/)).not.toBeInTheDocument()
      expect(screen.queryByText('Link kopieren')).not.toBeInTheDocument()
    })

    it('should show loading state when authorizing sharing', () => {
      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        sharingAuthorized: true,
        isAuthorizingStudents: true,
      })

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      const linkSection = screen
        .getByText(/Mit diesem Link kann/)
        .closest('div')
      expect(linkSection).toHaveClass('opacity-50', 'pointer-events-none')
    })
  })

  describe('Clipboard Functionality', () => {
    it('should copy link to clipboard when copy button is clicked (desktop)', async () => {
      const copyToClipboard = vi.fn()
      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        sharingAuthorized: true,
        copyToClipboard,
      })

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      const copyButton = screen.getByRole('button', { name: /Link kopieren/ })
      fireEvent.click(copyButton)

      expect(copyToClipboard).toHaveBeenCalled()
    })

    it('should show copied state with green checkmark', () => {
      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        sharingAuthorized: true,
        isCopied: true,
      })

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      // Should show check icon instead of clipboard icon
      expect(screen.queryByText('Link kopieren')).not.toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /Link kopiert/ }),
      ).toBeInTheDocument()
    })

    it('should display mobile copy button layout on mobile', () => {
      mockIsMobileDevice.mockReturnValue(true)

      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        sharingAuthorized: true,
      })

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      const copyButton = screen.getByRole('button', { name: /Link kopieren/ })
      expect(copyButton).toHaveClass('mt-4', 'flex', 'items-center', 'gap-1')
    })
  })

  describe('Platform Sharing Links', () => {
    beforeEach(() => {
      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        sharingAuthorized: true,
        bodyText: 'Hallo Anna%0D%0ATest message',
        subjectText: 'Hausaufgaben Test',
      })
    })

    it('should render all platform sharing buttons', () => {
      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      expect(
        screen.getByTitle('Link per Telegram verschicken'),
      ).toBeInTheDocument()
      expect(
        screen.getByTitle('Link per Threema verschicken'),
      ).toBeInTheDocument()
      expect(
        screen.getByTitle('Link per Whatsapp verschicken'),
      ).toBeInTheDocument()
      expect(screen.getByTitle('Link per SMS verschicken')).toBeInTheDocument()
      expect(
        screen.getByTitle('Link per E-Mail verschicken'),
      ).toBeInTheDocument()
    })

    it('should generate correct Telegram sharing link', () => {
      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      const telegramLink = screen.getByTitle('Link per Telegram verschicken')
      const expectedUrl = `https://t.me/share/url?url=${defaultHookReturn.url}&text=Hallo Anna%0D%0ATest message`
      expect(telegramLink).toHaveAttribute('href', expectedUrl)
      expect(telegramLink).toHaveAttribute('target', '_blank')
      expect(telegramLink).toHaveAttribute('rel', 'noreferrer')
    })

    it('should generate correct Threema sharing link', () => {
      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      const threemaLink = screen.getByTitle('Link per Threema verschicken')
      const expectedUrl =
        'https://threema.id/compose?text=Hallo Anna%0D%0ATest message'
      expect(threemaLink).toHaveAttribute('href', expectedUrl)
      expect(threemaLink).toHaveAttribute('target', '_blank')
      expect(threemaLink).toHaveAttribute('rel', 'noreferrer')
    })

    it('should generate correct WhatsApp sharing link', () => {
      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      const whatsappLink = screen.getByTitle('Link per Whatsapp verschicken')
      const expectedUrl = 'https://wa.me/?text=Hallo Anna%0D%0ATest message'
      expect(whatsappLink).toHaveAttribute('href', expectedUrl)
      expect(whatsappLink).toHaveAttribute('target', '_blank')
      expect(whatsappLink).toHaveAttribute('rel', 'noreferrer')
    })

    it('should generate correct SMS sharing link', () => {
      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      const smsLink = screen.getByTitle('Link per SMS verschicken')
      const expectedUrl = 'sms://?&body=Hallo Anna%0D%0ATest message'
      expect(smsLink).toHaveAttribute('href', expectedUrl)
    })

    it('should generate correct Email sharing link', () => {
      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      const emailLink = screen.getByTitle('Link per E-Mail verschicken')
      const expectedUrl =
        'mailto:?subject=Hausaufgaben Test&body=Hallo Anna%0D%0ATest message'
      expect(emailLink).toHaveAttribute('href', expectedUrl)
    })

    it('should display platform names on mobile', () => {
      mockIsMobileDevice.mockReturnValue(true)

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      expect(screen.getByText('Telegram')).toBeInTheDocument()
      expect(screen.getByText('Threema')).toBeInTheDocument()
      expect(screen.getByText('WhatsApp')).toBeInTheDocument()
      expect(screen.getByText('SMS')).toBeInTheDocument()
      expect(screen.getByText('E-Mail')).toBeInTheDocument()
    })

    it('should apply correct styling classes to platform buttons', () => {
      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      const telegramLink = screen.getByTitle('Link per Telegram verschicken')
      expect(telegramLink).toHaveClass('text-[#2aabee]')

      const whatsappLink = screen.getByTitle('Link per Whatsapp verschicken')
      expect(whatsappLink).toHaveClass('text-[#25d366]')
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('should return null when currentHolder is not available', () => {
      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        currentHolder: undefined,
      })

      const { container } = renderWithProviders(
        <ShareHomework lessonId={1} />,
        {
          queryClient,
        },
      )

      expect(container.firstChild).toBeNull()
    })

    it('should handle missing lesson data gracefully', () => {
      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        lessonDate: undefined,
        url: '',
      })

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      // Component should still render but with empty values
      expect(
        screen.getByText('Einwilligung zum Teilen bestätigt'),
      ).toBeInTheDocument()
    })

    it('should disable sharing section during authorization process', () => {
      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        sharingAuthorized: true,
        isAuthorizingStudents: true,
      })

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      const sharingSection = screen
        .getByText(/Mit diesem Link kann/)
        .closest('div')
      expect(sharingSection).toHaveClass('opacity-50', 'pointer-events-none')
    })

    it('should handle clipboard API errors gracefully', async () => {
      const copyToClipboard = vi
        .fn()
        .mockRejectedValue(new Error('Clipboard error'))
      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        sharingAuthorized: true,
        copyToClipboard,
      })

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      const copyButton = screen.getByRole('button', { name: /Link kopieren/ })
      fireEvent.click(copyButton)

      expect(copyToClipboard).toHaveBeenCalled()
      // Component should not crash on clipboard errors
    })
  })

  describe('Responsive Behavior', () => {
    it('should adjust button layout for mobile view', () => {
      mockIsMobileDevice.mockReturnValue(true)

      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        sharingAuthorized: true,
      })

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      // Platform links should have outline variant styling on mobile
      const telegramLink = screen.getByTitle('Link per Telegram verschicken')
      expect(telegramLink).toHaveClass('border', 'border-primary')

      // Copy button should have mobile styling
      const copyButton = screen.getByRole('button', { name: /Link kopieren/ })
      expect(copyButton).toHaveClass('mt-4')
    })

    it('should use ghost variant for buttons on desktop', () => {
      mockIsMobileDevice.mockReturnValue(false)

      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        sharingAuthorized: true,
      })

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      const telegramLink = screen.getByTitle('Link per Telegram verschicken')
      // Ghost variant on desktop doesn't have border classes
      expect(telegramLink).not.toHaveClass('border', 'border-primary')
    })

    it('should show separator on mobile only', () => {
      mockIsMobileDevice.mockReturnValue(true)

      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        sharingAuthorized: true,
      })

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      // The separator is hidden on desktop (sm:hidden class)
      const separator = document.querySelector(
        '[data-orientation="horizontal"]',
      )
      expect(separator).toHaveClass('sm:hidden')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels for interactive elements', () => {
      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        sharingAuthorized: true,
      })

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('id', 'authorization')

      const label = screen.getByLabelText('Einwilligung zum Teilen bestätigt')
      expect(label).toBeInTheDocument()
    })

    it('should have descriptive titles for sharing buttons', () => {
      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        sharingAuthorized: true,
      })

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      expect(
        screen.getByTitle('Link per Telegram verschicken'),
      ).toBeInTheDocument()
      expect(
        screen.getByTitle('Link per Threema verschicken'),
      ).toBeInTheDocument()
      expect(
        screen.getByTitle('Link per Whatsapp verschicken'),
      ).toBeInTheDocument()
      expect(screen.getByTitle('Link per SMS verschicken')).toBeInTheDocument()
      expect(
        screen.getByTitle('Link per E-Mail verschicken'),
      ).toBeInTheDocument()
    })

    it('should support keyboard navigation', async () => {
      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        sharingAuthorized: true,
      })

      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      const checkbox = screen.getByRole('checkbox')
      checkbox.focus()
      expect(checkbox).toHaveFocus()

      // Tab to next focusable element (copy button)
      const copyButton = screen.getByRole('button', { name: /Link kopieren/ })
      copyButton.focus()
      expect(copyButton).toHaveFocus()
    })
  })
})
