import { Button } from '@/components/ui/button'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createMockStudent } from './factories'
import { renderWithProviders } from './testUtils'

// Simple test component to verify the testing setup
function TestComponent() {
  const handleClick = vi.fn()

  return (
    <div>
      <h1>Test Component</h1>
      <Button onClick={handleClick} data-testid='test-button'>
        Click me
      </Button>
      <p>Testing infrastructure is working!</p>
    </div>
  )
}

describe('Testing Infrastructure Integration', () => {
  it('should render a component with providers', () => {
    renderWithProviders(<TestComponent />)

    expect(
      screen.getByRole('heading', { name: 'Test Component' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Testing infrastructure is working!'),
    ).toBeInTheDocument()
    expect(screen.getByTestId('test-button')).toBeInTheDocument()
  })

  it('should support user interactions', async () => {
    const user = userEvent.setup()
    renderWithProviders(<TestComponent />)

    const button = screen.getByTestId('test-button')

    expect(button).toBeInTheDocument()
    expect(button).toBeEnabled()

    await user.click(button)

    // Button should still be visible after click
    expect(button).toBeInTheDocument()
  })

  it('should work with mock data factories', () => {
    const student = createMockStudent({ firstName: 'Test Student' })

    expect(student.firstName).toBe('Test Student')
    expect(student.id).toBeDefined()
    expect(student.instrument).toBeDefined()
  })

  it('should handle routing context', () => {
    renderWithProviders(
      <div>
        <span>Router context is working</span>
      </div>,
      { initialEntries: ['/test-route'] },
    )

    expect(screen.getByText('Router context is working')).toBeInTheDocument()
  })
})
