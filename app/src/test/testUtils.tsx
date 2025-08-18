import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type RenderOptions, render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'

// Mock providers for testing with proper context values
export function MockUserLocaleProvider({ children }: { children: ReactNode }) {
  const mockContextValue = {
    userLocale: 'de-DE' as const,
    setUserLocale: vi.fn(),
  }
  
  return (
    <div data-testid="mock-user-locale-provider" data-locale={mockContextValue.userLocale}>
      {children}
    </div>
  )
}

export function MockLoadingProvider({ children }: { children: ReactNode }) {
  return <div data-testid="mock-loading-provider">{children}</div>
}

export function MockAuthProvider({ children }: { children: ReactNode }) {
  return <div data-testid="mock-auth-provider">{children}</div>
}

export function MockSubscriptionProvider({
  children,
}: { children: ReactNode }) {
  return <div data-testid="mock-subscription-provider">{children}</div>
}

export function MockMainContext({ children }: { children: ReactNode }) {
  return <div data-testid="mock-main-context">{children}</div>
}

export function MockDarkModeProvider({ children }: { children: ReactNode }) {
  return <div data-testid="mock-dark-mode-provider">{children}</div>
}

interface TestProviderProps {
  children: ReactNode
  initialEntries?: string[]
  queryClient?: QueryClient
}

export function TestProviders({
  children,
  initialEntries = ['/'],
  queryClient,
}: TestProviderProps) {
  const defaultQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })

  const client = queryClient || defaultQueryClient

  return (
    <BrowserRouter>
      <QueryClientProvider client={client}>
        <MockUserLocaleProvider>
          <MockLoadingProvider>
            <MockAuthProvider>
              <MockSubscriptionProvider>
                <MockMainContext>
                  <MockDarkModeProvider>{children}</MockDarkModeProvider>
                </MockMainContext>
              </MockSubscriptionProvider>
            </MockAuthProvider>
          </MockLoadingProvider>
        </MockUserLocaleProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
  queryClient?: QueryClient
  wrapper?: React.ComponentType<any>
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {},
) {
  const {
    initialEntries,
    queryClient,
    wrapper: Wrapper,
    ...renderOptions
  } = options

  const AllTheProviders = ({ children }: { children: ReactNode }) => {
    if (Wrapper) {
      return (
        <TestProviders
          initialEntries={initialEntries}
          queryClient={queryClient}
        >
          <Wrapper>{children}</Wrapper>
        </TestProviders>
      )
    }
    return (
      <TestProviders initialEntries={initialEntries} queryClient={queryClient}>
        {children}
      </TestProviders>
    )
  }

  return render(ui, { wrapper: AllTheProviders, ...renderOptions })
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { renderWithProviders as render }

// Test utilities for flaky test prevention
export async function waitForStableRender(element: () => HTMLElement, timeout = 5000) {
  const startTime = Date.now()
  let lastHTML = ''
  
  while (Date.now() - startTime < timeout) {
    try {
      const currentHTML = element().innerHTML
      if (currentHTML === lastHTML && currentHTML !== '') {
        return element()
      }
      lastHTML = currentHTML
      await new Promise(resolve => setTimeout(resolve, 50))
    } catch (error) {
      // Element not found yet, continue waiting
      await new Promise(resolve => setTimeout(resolve, 50))
    }
  }
  
  throw new Error(`Element did not stabilize within ${timeout}ms`)
}

export function createIsolatedQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

export function flushPromises() {
  return new Promise(resolve => setTimeout(resolve, 0))
}
