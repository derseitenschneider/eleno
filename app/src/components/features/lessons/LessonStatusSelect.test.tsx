import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { LessonStatusSelect } from './LessonStatusSelect.component'

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, value, disabled }: any) => (
    <select
      data-testid="lesson-status-select"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      disabled={disabled}
    >
      {children}
    </select>
  ),
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
}))

describe('LessonStatusSelect', () => {
  it('renders the select with the correct initial value', () => {
    render(<LessonStatusSelect value="held" onChange={() => {}} />)
    expect(screen.getByTestId('lesson-status-select')).toHaveValue('held')
  })

  it('calls the onChange handler when a new value is selected', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<LessonStatusSelect value="held" onChange={handleChange} />)

    await user.selectOptions(screen.getByTestId('lesson-status-select'), 'student_absent')

    expect(handleChange).toHaveBeenCalledWith('student_absent')
  })

  it('is disabled when the disabled prop is true', () => {
    render(<LessonStatusSelect value="held" onChange={() => {}} disabled />)
    expect(screen.getByTestId('lesson-status-select')).toBeDisabled()
  })
})