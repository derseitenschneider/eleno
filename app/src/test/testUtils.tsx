import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type RenderOptions, render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'

// Mock providers for testing
export function MockUserLocaleProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function MockLoadingProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function MockAuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function MockSubscriptionProvider({
  children,
}: { children: ReactNode }) {
  return <>{children}</>
}

export function MockMainContext({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function MockDarkModeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
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
