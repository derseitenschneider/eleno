import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LessonStatusSelect } from './LessonStatusSelect.component'

// Mock the useIsMobileDevice hook
vi.mock('@/hooks/useIsMobileDevice', () => ({
  default: vi.fn(() => false)
}))

describe('LessonStatusSelect', () => {
  it('renders the select trigger (kebab icon) and shows proper badge when value changes', () => {
    const handleChange = vi.fn()
    
    // Test with held value - no badge should show
    const { rerender } = render(<LessonStatusSelect value="held" onChange={handleChange} />)
    
    // Verify the kebab icon is present (trigger button with role combobox)
    const trigger = screen.getByRole('combobox')
    expect(trigger).toBeInTheDocument()
    expect(screen.queryByText('Schülerabsenz (entschuldigt)')).not.toBeInTheDocument()
    expect(screen.queryByText('Schülerabsenz (unentschuldigt)')).not.toBeInTheDocument()
    expect(screen.queryByText('Lehrerabsenz')).not.toBeInTheDocument()

    // Test with student_absent_excused value - badge should show
    rerender(<LessonStatusSelect value="student_absent_excused" onChange={handleChange} />)
    expect(screen.getByText('Schülerabsenz (entschuldigt)')).toBeInTheDocument()

    // Test with teacher_absent value - badge should show
    rerender(<LessonStatusSelect value="teacher_absent" onChange={handleChange} />)
    expect(screen.getByText('Lehrerabsenz')).toBeInTheDocument()
  })

  it('is disabled when the disabled prop is true', () => {
    render(<LessonStatusSelect value="held" onChange={() => {}} disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('displays the correct badges for different absence types', () => {
    const handleChange = vi.fn()
    
    // Test student_absent_excused - should show student absence badge
    const { rerender } = render(<LessonStatusSelect value="student_absent_excused" onChange={handleChange} />)
    expect(screen.getByText('Schülerabsenz (entschuldigt)')).toBeInTheDocument()

    // Test student_absent_not_excused - should show student absence badge
    rerender(<LessonStatusSelect value="student_absent_not_excused" onChange={handleChange} />)
    expect(screen.getByText('Schülerabsenz (unentschuldigt)')).toBeInTheDocument()

    // Test teacher_absent - should show teacher absence badge
    rerender(<LessonStatusSelect value="teacher_absent" onChange={handleChange} />)
    expect(screen.getByText('Lehrerabsenz')).toBeInTheDocument()
  })

  it('does not display a badge when value is held', () => {
    render(<LessonStatusSelect value="held" onChange={() => {}} />)
    expect(screen.queryByText('Schülerabsenz (entschuldigt)')).not.toBeInTheDocument()
    expect(screen.queryByText('Schülerabsenz (unentschuldigt)')).not.toBeInTheDocument()
    expect(screen.queryByText('Lehrerabsenz')).not.toBeInTheDocument()
  })
})