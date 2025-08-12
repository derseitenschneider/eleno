import { QueryClient } from '@tanstack/react-query'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/testUtils'
import { createMockLesson, createMockStudent, createMockGroup } from '@/test/factories'
import ShareHomework from './ShareHomework.component'

// Mock hooks and modules
vi.mock('@/hooks/useIsMobileDevice', () => ({
  default: vi.fn(() => false),
}))

vi.mock('@/hooks/useShareHomework', () => ({
  useShareHomework: vi.fn(),
}))

vi.mock('@/components/features/students/useAuthorizeStudentsHomeworkLink', () => ({
  useAuthorizeStudentHomeworkLink: vi.fn(() => ({
    authorizeStudent: vi.fn(),
    isAuthorizingStudents: false,
  })),
}))

vi.mock('@/components/features/students/useAuthorizeGroupsHomeworkLink', () => ({
  useAuthorizeGroupHomeworkLink: vi.fn(() => ({
    authorizeGroup: vi.fn(),
    isAuthorizingGroup: false,
  })),
}))

vi.mock('@/config', () => ({
  appConfig: {
    isDemoMode: false,
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
    },
    sharingAuthorized: false,
    isAuthorizingStudents: false,
    isAuthorizingGroup: false,
    handleShareAuthorization: vi.fn(),
    url: 'https://test-api.eleno.net/homework/1/test-homework-key',
    isCopied: false,
    lessonDate: '01.12.23',
    copyToClipboard: vi.fn(),
    bodyText: 'Hallo Anna%0D%0A %0D%0AUnter folgendem Link findest du deine Hausaufgaben vom 01.12.23',
    subjectText: 'Hausaufgaben Piano vom 01.12.23',
  }

  describe('Demo Mode', () => {
    beforeEach(() => {
      vi.mocked(vi.importActual('@/config')).appConfig = {
        isDemoMode: true,
        apiUrl: 'https://test-api.eleno.net',
      }
    })

    it('should display demo mode message when isDemoMode is true', () => {
      mockShareHomework.mockReturnValue(defaultHookReturn)
      
      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      expect(screen.getByText('Diese Funktion ist in der Demoversion leider nicht verfügbar.')).toBeInTheDocument()
      expect(screen.queryByText('Einwilligung zum Teilen bestätigt')).not.toBeInTheDocument()
    })
  })

  describe('GDPR Consent Section', () => {
    beforeEach(() => {
      vi.mocked(vi.importActual('@/config')).appConfig = {
        isDemoMode: false,
        apiUrl: 'https://test-api.eleno.net',
      }
    })

    it('should render consent checkbox when not in demo mode', () => {
      mockShareHomework.mockReturnValue(defaultHookReturn)
      
      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      expect(screen.getByText('Einwilligung zum Teilen bestätigt')).toBeInTheDocument()
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
      expect(screen.queryByText('Mit dem Setzen dieser Checkbox bestätigst du, dass:')).not.toBeInTheDocument()

      // Click info button to expand
      const infoButton = screen.getByRole('button')
      fireEvent.click(infoButton)

      await waitFor(() => {
        expect(screen.getByText('Mit dem Setzen dieser Checkbox bestätigst du, dass:')).toBeInTheDocument()
        expect(screen.getByText('diese Schüler:innen volljährig sind, ODER')).toBeInTheDocument()
        expect(screen.getByText(/du die ausdrückliche Einwilligung der Erziehungsberechtigten hast/)).toBeInTheDocument()
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
        const termsLink = screen.getByRole('link', { name: /Allgemeiner Geschäftsbedingungen/ })
        expect(termsLink).toHaveAttribute('href', 'https://eleno.net/terms-conditions/#sharing-homework')
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
        expect(screen.getByText('Mit dem Setzen dieser Checkbox bestätigst du, dass:')).toBeInTheDocument()
      })

      // Click close button
      const closeButton = screen.getAllByRole('button')[1] // Second button is the close button
      fireEvent.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByText('Mit dem Setzen dieser Checkbox bestätigst du, dass:')).not.toBeInTheDocument()
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
      const groupHolder = {
        type: 'g' as const,
        holder: createMockGroup({
          id: 1,
          name: 'Advanced Piano Group',
          homework_sharing_authorized: true,
        }),
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

      const linkSection = screen.getByText(/Mit diesem Link kann/).closest('div')
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
      expect(screen.getByRole('button', { name: /Link kopiert/ })).toBeInTheDocument()
    })

    it('should display mobile copy button layout on mobile', () => {
      vi.mocked(vi.importActual('@/hooks/useIsMobileDevice')).default.mockReturnValue(true)
      
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

      expect(screen.getByTitle('Link per Telegram verschicken')).toBeInTheDocument()
      expect(screen.getByTitle('Link per Threema verschicken')).toBeInTheDocument()
      expect(screen.getByTitle('Link per Whatsapp verschicken')).toBeInTheDocument()
      expect(screen.getByTitle('Link per SMS verschicken')).toBeInTheDocument()
      expect(screen.getByTitle('Link per E-Mail verschicken')).toBeInTheDocument()
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
      const expectedUrl = 'https://threema.id/compose?text=Hallo Anna%0D%0ATest message'
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
      const expectedUrl = 'mailto:?subject=Hausaufgaben Test&body=Hallo Anna%0D%0ATest message'
      expect(emailLink).toHaveAttribute('href', expectedUrl)
    })

    it('should display platform names on mobile', () => {
      vi.mocked(vi.importActual('@/hooks/useIsMobileDevice')).default.mockReturnValue(true)
      
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
        currentHolder: null,
      })
      
      const { container } = renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

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
      expect(screen.getByText('Einwilligung zum Teilen bestätigt')).toBeInTheDocument()
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

      const sharingSection = screen.getByText(/Mit diesem Link kann/).closest('div')
      expect(sharingSection).toHaveClass('opacity-50', 'pointer-events-none')
    })

    it('should handle clipboard API errors gracefully', async () => {
      const copyToClipboard = vi.fn().mockRejectedValue(new Error('Clipboard error'))
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
      vi.mocked(vi.importActual('@/hooks/useIsMobileDevice')).default.mockReturnValue(true)
      
      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        sharingAuthorized: true,
      })
      
      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      // Platform buttons should have outline variant on mobile
      const telegramButton = screen.getByTitle('Link per Telegram verschicken').closest('button')
      expect(telegramButton).toHaveAttribute('data-variant', 'outline')
      
      // Copy button should have mobile styling
      const copyButton = screen.getByRole('button', { name: /Link kopieren/ })
      expect(copyButton).toHaveClass('mt-4')
    })

    it('should use ghost variant for buttons on desktop', () => {
      vi.mocked(vi.importActual('@/hooks/useIsMobileDevice')).default.mockReturnValue(false)
      
      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        sharingAuthorized: true,
      })
      
      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      const telegramButton = screen.getByTitle('Link per Telegram verschicken').closest('button')
      expect(telegramButton).toHaveAttribute('data-variant', 'ghost')
    })

    it('should show separator on mobile only', () => {
      vi.mocked(vi.importActual('@/hooks/useIsMobileDevice')).default.mockReturnValue(true)
      
      mockShareHomework.mockReturnValue({
        ...defaultHookReturn,
        sharingAuthorized: true,
      })
      
      renderWithProviders(<ShareHomework lessonId={1} />, {
        queryClient,
      })

      const separator = screen.getByRole('separator')
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

      expect(screen.getByTitle('Link per Telegram verschicken')).toBeInTheDocument()
      expect(screen.getByTitle('Link per Threema verschicken')).toBeInTheDocument()
      expect(screen.getByTitle('Link per Whatsapp verschicken')).toBeInTheDocument()
      expect(screen.getByTitle('Link per SMS verschicken')).toBeInTheDocument()
      expect(screen.getByTitle('Link per E-Mail verschicken')).toBeInTheDocument()
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