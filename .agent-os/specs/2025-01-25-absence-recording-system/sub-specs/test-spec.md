# Test Specification - Absence Recording System

**Document Type**: Technical Sub-Specification  
**Parent Spec**: Absence Recording System  
**Created**: 2025-01-25  
**Last Updated**: 2025-01-25  

## Overview

This document outlines the comprehensive testing strategy for the Lesson Absence Recording System. The testing approach covers database migrations, API functions, React components, and end-to-end user workflows using the established testing infrastructure (Vitest, Playwright, MSW).

## Testing Infrastructure Context

**Existing Test Stack**:
- **Unit/Integration Tests**: Vitest with React Testing Library
- **E2E Tests**: Playwright
- **API Mocking**: MSW (Mock Service Worker)
- **Test Data**: Factory functions for generating test data
- **Coverage**: Comprehensive coverage tracking

**Test Command References**:
```bash
npm run test              # Run Vitest unit tests
npm run test:ui           # Run tests with Vitest UI
npm run test:cov          # Run tests with coverage
npm run pw                # Run Playwright E2E tests
npm run pw:local          # Run E2E tests against local dev server
```

## Test Categories

### 1. Database Migration Tests

**Objective**: Verify database schema changes work correctly and maintain data integrity.

#### Migration Test Suite

```typescript
// tests/database/absence-migration.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { supabase } from '@/lib/supabase'

describe('Absence Recording Migration', () => {
  beforeEach(async () => {
    // Setup test database state
    await setupTestDatabase()
  })

  afterEach(async () => {
    // Cleanup test data
    await cleanupTestDatabase()
  })

  it('creates lesson_status ENUM with correct values', async () => {
    const { data, error } = await supabase.rpc('get_enum_values', {
      enum_name: 'lesson_status'
    })
    
    expect(error).toBeNull()
    expect(data).toEqual(['held', 'student_absent', 'teacher_absent'])
  })

  it('adds lesson_status column with default value', async () => {
    // Create a test lesson before migration
    const { data: lesson } = await supabase
      .from('lessons')
      .insert({ 
        lessonContent: 'Test content',
        studentId: 1,
        user_id: 'test-user-id',
        date: '2025-01-25'
      })
      .select()
      .single()

    expect(lesson.lesson_status).toBe('held') // Default value
  })

  it('adds absence_reason column as nullable', async () => {
    const { data: lesson } = await supabase
      .from('lessons')
      .insert({
        lessonContent: 'Test content',
        studentId: 1,
        user_id: 'test-user-id',
        date: '2025-01-25',
        lesson_status: 'held'
      })
      .select()
      .single()

    expect(lesson.absence_reason).toBeNull()
  })

  it('maintains existing RLS policies', async () => {
    // Test that users can only access their own lessons
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('user_id', 'different-user-id')

    expect(data).toEqual([]) // Should not return other users' data
  })

  it('updates last_3_lessons view to include new columns', async () => {
    // Create test lessons with absence data
    await createTestLessonsWithAbsence()

    const { data: lessons, error } = await supabase
      .from('last_3_lessons')
      .select('lesson_status, absence_reason')
      .limit(1)

    expect(error).toBeNull()
    expect(lessons[0]).toHaveProperty('lesson_status')
    expect(lessons[0]).toHaveProperty('absence_reason')
  })
})

// Helper functions
const setupTestDatabase = async () => {
  // Create test user and student for testing
}

const cleanupTestDatabase = async () => {
  // Remove test data
}

const createTestLessonsWithAbsence = async () => {
  // Create test lessons with various absence statuses
}
```

### 2. API Layer Tests

**Objective**: Verify API functions handle absence data correctly and validate business rules.

#### API Function Tests

```typescript
// tests/api/lessons.api.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createLessonAPI, updateLessonAPI, validateLessonData } from '@/services/api/lessons.api'
import type { LessonPartial, Lesson } from '@/types/types'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn() })) })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn() })) })) }))
    }))
  }
}))

describe('Lessons API - Absence Features', () => {
  describe('validateLessonData', () => {
    it('validates held lesson requires content or homework', () => {
      const lessonData = {
        lesson_status: 'held' as const,
        lessonContent: '',
        homework: '',
        absence_reason: ''
      }

      expect(() => validateLessonData(lessonData)).toThrow(
        'Die Lektion benötigt mindestens Inhalt oder Hausaufgaben.'
      )
    })

    it('validates absent lesson requires absence reason', () => {
      const lessonData = {
        lesson_status: 'student_absent' as const,
        lessonContent: 'Some content',
        homework: 'Some homework',
        absence_reason: ''
      }

      expect(() => validateLessonData(lessonData)).toThrow(
        'Ein Grund für die Absenz ist erforderlich.'
      )
    })

    it('clears content fields for absent lessons', () => {
      const lessonData = {
        lesson_status: 'teacher_absent' as const,
        lessonContent: 'Content to clear',
        homework: 'Homework to clear',
        absence_reason: 'Teacher was sick'
      }

      const result = validateLessonData(lessonData)

      expect(result.lessonContent).toBeNull()
      expect(result.homework).toBeNull()
      expect(result.absence_reason).toBe('Teacher was sick')
    })

    it('clears absence reason for held lessons', () => {
      const lessonData = {
        lesson_status: 'held' as const,
        lessonContent: 'Lesson content',
        homework: 'Homework',
        absence_reason: 'Previous absence reason'
      }

      const result = validateLessonData(lessonData)

      expect(result.lessonContent).toBe('Lesson content')
      expect(result.homework).toBe('Homework')
      expect(result.absence_reason).toBeNull()
    })
  })

  describe('createLessonAPI', () => {
    it('creates lesson with held status', async () => {
      const lessonData: LessonPartial = {
        lesson_status: 'held',
        lessonContent: 'Test content',
        homework: 'Test homework',
        studentId: 1,
        date: new Date(),
      }

      // Mock successful response
      const mockLesson = { ...lessonData, id: 1, user_id: 'test-user' }
      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({ data: mockLesson, error: null }))
          }))
        }))
      })

      const result = await createLessonAPI(lessonData)
      expect(result).toMatchObject(mockLesson)
    })

    it('creates lesson with absence status', async () => {
      const lessonData: LessonPartial = {
        lesson_status: 'student_absent',
        absence_reason: 'Student was sick',
        studentId: 1,
        date: new Date(),
      }

      const result = await createLessonAPI(lessonData)
      expect(result.lesson_status).toBe('student_absent')
      expect(result.absence_reason).toBe('Student was sick')
      expect(result.lessonContent).toBeNull()
      expect(result.homework).toBeNull()
    })

    it('handles validation errors correctly', async () => {
      const invalidLessonData: LessonPartial = {
        lesson_status: 'held',
        lessonContent: '',
        homework: '',
        studentId: 1,
        date: new Date(),
      }

      await expect(createLessonAPI(invalidLessonData)).rejects.toThrow(
        'Die Lektion benötigt mindestens Inhalt oder Hausaufgaben.'
      )
    })
  })

  describe('updateLessonAPI', () => {
    it('handles status transitions correctly', async () => {
      const existingLesson: Lesson = {
        id: 1,
        lesson_status: 'held',
        lessonContent: 'Original content',
        homework: 'Original homework',
        absence_reason: null,
        studentId: 1,
        date: new Date(),
        user_id: 'test-user',
        homeworkKey: 'test-key',
        status: 'documented',
        expiration_base: new Date().toISOString(),
        created_at: new Date().toISOString()
      }

      // Update to absent status
      const updatedLesson = {
        ...existingLesson,
        lesson_status: 'student_absent' as const,
        absence_reason: 'Student became sick'
      }

      const result = await updateLessonAPI(updatedLesson)
      
      expect(result.lesson_status).toBe('student_absent')
      expect(result.absence_reason).toBe('Student became sick')
      expect(result.lessonContent).toBeNull()
      expect(result.homework).toBeNull()
    })
  })
})
```

#### TanStack Query Hooks Tests

```typescript
// tests/hooks/useCreateLesson.test.ts
import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCreateLesson } from '@/components/features/lessons/useCreateLesson'
import { toast } from 'sonner'

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe('useCreateLesson - Absence Features', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
    })
    
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }

  it('shows appropriate success message for absence lessons', async () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useCreateLesson(), { wrapper })

    const lessonData = {
      lesson_status: 'student_absent' as const,
      absence_reason: 'Student was sick',
      studentId: 1,
      date: new Date(),
    }

    result.current.createLesson(lessonData, {
      onSuccess: () => {
        expect(toast.success).toHaveBeenCalledWith('Schülerabsenz wurde gespeichert.')
      }
    })

    await waitFor(() => {
      expect(result.current.isCreating).toBe(false)
    })
  })

  it('optimistically updates cache with absence data', async () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useCreateLesson(), { wrapper })

    const lessonData = {
      lesson_status: 'teacher_absent' as const,
      absence_reason: 'Teacher had emergency',
      studentId: 1,
      date: new Date(),
    }

    // Mock successful creation
    result.current.createLesson(lessonData, {
      onSuccess: (newLesson) => {
        expect(newLesson.lesson_status).toBe('teacher_absent')
        expect(newLesson.absence_reason).toBe('Teacher had emergency')
        expect(toast.success).toHaveBeenCalledWith('Lehrerabsenz wurde gespeichert.')
      }
    })
  })

  it('shows user-friendly error messages', async () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useCreateLesson(), { wrapper })

    // Mock API error
    vi.mocked(createLessonAPI).mockRejectedValueOnce(
      new Error('Ein Grund für die Absenz ist erforderlich.')
    )

    result.current.createLesson({
      lesson_status: 'student_absent',
      absence_reason: '',
      studentId: 1,
      date: new Date(),
    }, {
      onError: () => {
        expect(toast.error).toHaveBeenCalledWith(
          'Bitte geben Sie einen Grund für die Absenz an.'
        )
      }
    })
  })
})
```

### 3. Component Tests

**Objective**: Verify React components render correctly and handle user interactions properly.

#### LessonStatusSelect Component Tests

```typescript
// tests/components/LessonStatusSelect.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LessonStatusSelect } from '@/components/features/lessons/LessonStatusSelect'

describe('LessonStatusSelect', () => {
  const defaultProps = {
    value: 'held' as const,
    onValueChange: vi.fn(),
  }

  it('renders with correct default value', () => {
    render(<LessonStatusSelect {...defaultProps} />)
    
    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('held')
    expect(screen.getByText('Stattgefunden')).toBeInTheDocument()
  })

  it('displays all status options when opened', async () => {
    render(<LessonStatusSelect {...defaultProps} />)
    
    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)
    
    expect(screen.getByText('Stattgefunden')).toBeInTheDocument()
    expect(screen.getByText('Schülerabsenz')).toBeInTheDocument()
    expect(screen.getByText('Lehrerabsenz')).toBeInTheDocument()
  })

  it('calls onValueChange when option is selected', async () => {
    const mockOnChange = vi.fn()
    render(<LessonStatusSelect {...defaultProps} onValueChange={mockOnChange} />)
    
    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)
    
    const studentAbsentOption = screen.getByText('Schülerabsenz')
    fireEvent.click(studentAbsentOption)
    
    expect(mockOnChange).toHaveBeenCalledWith('student_absent')
  })

  it('is disabled when disabled prop is true', () => {
    render(<LessonStatusSelect {...defaultProps} disabled />)
    
    const select = screen.getByRole('combobox')
    expect(select).toBeDisabled()
  })

  it('has proper accessibility attributes', () => {
    render(
      <LessonStatusSelect 
        {...defaultProps} 
        aria-label="Lesson status"
        aria-describedby="status-help"
      />
    )
    
    const select = screen.getByRole('combobox')
    expect(select).toHaveAttribute('aria-label', 'Lesson status')
    expect(select).toHaveAttribute('aria-describedby', 'status-help')
  })
})
```

#### CreateLessonForm Component Tests

```typescript
// tests/components/CreateLessonForm.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CreateLessonForm } from '@/components/features/lessons/CreateLessonForm.component'
import { TestProviders } from '@/test/providers'

// Mock dependencies
vi.mock('@/components/features/lessons/useCreateLesson', () => ({
  useCreateLesson: () => ({
    createLesson: vi.fn(),
    isCreating: false,
    error: null
  })
}))

describe('CreateLessonForm - Absence Features', () => {
  const renderWithProviders = (component: React.ReactNode) => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    })
    
    return render(
      <QueryClientProvider client={queryClient}>
        <TestProviders>
          {component}
        </TestProviders>
      </QueryClientProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders lesson status select component', () => {
    renderWithProviders(<CreateLessonForm />)
    
    expect(screen.getByLabelText(/Lektionsstatus/i)).toBeInTheDocument()
    expect(screen.getByText('Stattgefunden')).toBeInTheDocument()
  })

  it('shows content editors when status is held', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CreateLessonForm />)
    
    // Default status should be 'held'
    expect(screen.getByPlaceholderText('Was wurde in der Lektion behandelt?')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Welche Hausaufgaben wurden aufgegeben?')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText(/Grund für/)).not.toBeInTheDocument()
  })

  it('shows absence reason textarea when status is student absent', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CreateLessonForm />)
    
    const statusSelect = screen.getByRole('combobox')
    await user.click(statusSelect)
    
    const studentAbsentOption = screen.getByText('Schülerabsenz')
    await user.click(studentAbsentOption)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Grund für die Schülerabsenz/)).toBeInTheDocument()
      expect(screen.queryByPlaceholderText('Was wurde in der Lektion behandelt?')).not.toBeInTheDocument()
      expect(screen.queryByPlaceholderText('Welche Hausaufgaben wurden aufgegeben?')).not.toBeInTheDocument()
    })
  })

  it('shows teacher absence textarea when status is teacher absent', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CreateLessonForm />)
    
    const statusSelect = screen.getByRole('combobox')
    await user.click(statusSelect)
    
    const teacherAbsentOption = screen.getByText('Lehrerabsenz')
    await user.click(teacherAbsentOption)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Grund für die Lehrerabsenz/)).toBeInTheDocument()
      expect(screen.queryByPlaceholderText('Was wurde in der Lektion behandelt?')).not.toBeInTheDocument()
    })
  })

  it('validates required fields based on status', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CreateLessonForm />)
    
    // Try to submit with held status but no content
    const submitButton = screen.getByText('Speichern')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/mindestens Inhalt oder Hausaufgaben/)).toBeInTheDocument()
    })
    
    // Switch to absent status and try to submit without reason
    const statusSelect = screen.getByRole('combobox')
    await user.click(statusSelect)
    await user.click(screen.getByText('Schülerabsenz'))
    
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Grund für die Absenz/)).toBeInTheDocument()
    })
  })

  it('submits correct data for held lessons', async () => {
    const mockCreateLesson = vi.fn()
    vi.mocked(useCreateLesson).mockReturnValue({
      createLesson: mockCreateLesson,
      isCreating: false,
      error: null
    })
    
    const user = userEvent.setup()
    renderWithProviders(<CreateLessonForm />)
    
    // Fill in lesson content
    const contentEditor = screen.getByPlaceholderText('Was wurde in der Lektion behandelt?')
    await user.type(contentEditor, 'Test lesson content')
    
    // Submit form
    await user.click(screen.getByText('Speichern'))
    
    await waitFor(() => {
      expect(mockCreateLesson).toHaveBeenCalledWith(
        expect.objectContaining({
          lesson_status: 'held',
          lessonContent: expect.stringContaining('Test lesson content'),
          absence_reason: null
        }),
        expect.any(Object)
      )
    })
  })

  it('submits correct data for absent lessons', async () => {
    const mockCreateLesson = vi.fn()
    vi.mocked(useCreateLesson).mockReturnValue({
      createLesson: mockCreateLesson,
      isCreating: false,
      error: null
    })
    
    const user = userEvent.setup()
    renderWithProviders(<CreateLessonForm />)
    
    // Switch to student absent
    const statusSelect = screen.getByRole('combobox')
    await user.click(statusSelect)
    await user.click(screen.getByText('Schülerabsenz'))
    
    // Fill absence reason
    const reasonTextarea = screen.getByPlaceholderText(/Grund für die Schülerabsenz/)
    await user.type(reasonTextarea, 'Student was sick')
    
    // Submit form
    await user.click(screen.getByText('Speichern'))
    
    await waitFor(() => {
      expect(mockCreateLesson).toHaveBeenCalledWith(
        expect.objectContaining({
          lesson_status: 'student_absent',
          absence_reason: 'Student was sick',
          lessonContent: null,
          homework: null
        }),
        expect.any(Object)
      )
    })
  })

  it('updates drafts when status changes', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CreateLessonForm />)
    
    // Change status to teacher absent
    const statusSelect = screen.getByRole('combobox')
    await user.click(statusSelect)
    await user.click(screen.getByText('Lehrerabsenz'))
    
    // Add absence reason
    const reasonTextarea = screen.getByPlaceholderText(/Grund für die Lehrerabsenz/)
    await user.type(reasonTextarea, 'Emergency meeting')
    
    // Verify draft is updated (this would need to be tested with the actual draft context)
    expect(screen.getByDisplayValue('Emergency meeting')).toBeInTheDocument()
  })

  it('handles loading states correctly', () => {
    vi.mocked(useCreateLesson).mockReturnValue({
      createLesson: vi.fn(),
      isCreating: true,
      error: null
    })
    
    renderWithProviders(<CreateLessonForm />)
    
    // Form should be disabled during creation
    expect(screen.getByRole('combobox')).toBeDisabled()
    expect(screen.getByText('Speichern')).toBeDisabled()
  })
})
```

### 4. Integration Tests

**Objective**: Test complete workflows with mocked APIs and data flow.

```typescript
// tests/integration/absence-workflow.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { TestProviders } from '@/test/providers'
import { CreateLessonForm } from '@/components/features/lessons/CreateLessonForm.component'

// MSW server setup
const server = setupServer(
  rest.post('/rest/v1/lessons', (req, res, ctx) => {
    const lessonData = req.body
    return res(
      ctx.json({
        ...lessonData,
        id: 1,
        created_at: new Date().toISOString(),
        homeworkKey: 'test-key'
      })
    )
  }),
  
  rest.get('/rest/v1/lessons', (req, res, ctx) => {
    return res(ctx.json([]))
  })
)

describe('Absence Recording Integration', () => {
  beforeEach(() => {
    server.listen()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  it('completes full absence recording workflow', async () => {
    const user = userEvent.setup()
    
    render(
      <TestProviders>
        <CreateLessonForm />
      </TestProviders>
    )

    // Step 1: Select absence status
    const statusSelect = screen.getByRole('combobox')
    await user.click(statusSelect)
    await user.click(screen.getByText('Schülerabsenz'))

    // Step 2: Fill absence reason
    const reasonTextarea = screen.getByPlaceholderText(/Grund für die Schülerabsenz/)
    await user.type(reasonTextarea, 'Student reported feeling unwell')

    // Step 3: Submit form
    const submitButton = screen.getByText('Speichern')
    await user.click(submitButton)

    // Step 4: Verify success feedback
    await waitFor(() => {
      expect(screen.getByText(/Schülerabsenz wurde gespeichert/)).toBeInTheDocument()
    }, { timeout: 5000 })

    // Step 5: Verify form reset
    expect(screen.getByRole('combobox')).toHaveValue('held')
    expect(screen.queryByDisplayValue('Student reported feeling unwell')).not.toBeInTheDocument()
  })

  it('handles API errors gracefully', async () => {
    // Mock API error
    server.use(
      rest.post('/rest/v1/lessons', (req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ 
          message: 'Ein Grund für die Absenz ist erforderlich.' 
        }))
      })
    )

    const user = userEvent.setup()
    
    render(
      <TestProviders>
        <CreateLessonForm />
      </TestProviders>
    )

    // Try to submit absent lesson without reason
    const statusSelect = screen.getByRole('combobox')
    await user.click(statusSelect)
    await user.click(screen.getByText('Schülerabsenz'))

    const submitButton = screen.getByText('Speichern')
    await user.click(submitButton)

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText(/Bitte geben Sie einen Grund für die Absenz an/)).toBeInTheDocument()
    })
  })

  it('supports status transitions in edit mode', async () => {
    // Mock existing lesson data
    const existingLesson = {
      id: 1,
      lesson_status: 'held',
      lessonContent: 'Original content',
      homework: 'Original homework',
      absence_reason: null,
      date: '2025-01-25'
    }

    server.use(
      rest.get('/rest/v1/lessons', (req, res, ctx) => {
        return res(ctx.json([existingLesson]))
      }),
      
      rest.patch('/rest/v1/lessons', (req, res, ctx) => {
        const updates = req.body
        return res(ctx.json({ ...existingLesson, ...updates }))
      })
    )

    const user = userEvent.setup()
    
    render(
      <TestProviders>
        <CreateLessonForm />
      </TestProviders>
    )

    // Simulate loading existing lesson for editing
    // (This would typically come from clicking an edit button)
    
    // Change status from held to absent
    const statusSelect = screen.getByRole('combobox')
    await user.click(statusSelect)
    await user.click(screen.getByText('Schülerabsenz'))

    // Add absence reason
    const reasonTextarea = screen.getByPlaceholderText(/Grund für die Schülerabsenz/)
    await user.type(reasonTextarea, 'Student became sick during day')

    // Submit update
    await user.click(screen.getByText('Speichern'))

    await waitFor(() => {
      expect(screen.getByText(/Lektion als Schülerabsenz aktualisiert/)).toBeInTheDocument()
    })
  })
})
```

### 5. End-to-End Tests

**Objective**: Test complete user journeys in a real browser environment.

```typescript
// e2e/absence-recording.spec.ts
import { test, expect } from '@playwright/test'
import { loginAsTestUser, createTestStudent } from './helpers/auth'

test.describe('Absence Recording E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Setup test user and student
    await loginAsTestUser(page)
    await createTestStudent(page, 'Test Student')
    
    // Navigate to lesson creation
    await page.goto('/lessons/create')
    await page.waitForLoadState('networkidle')
  })

  test('can create lesson with student absence', async ({ page }) => {
    // Select student absent status
    await page.getByLabel('Lektionsstatus auswählen').click()
    await page.getByText('Schülerabsenz').click()

    // Verify UI changes
    await expect(page.getByPlaceholder('Grund für die Schülerabsenz')).toBeVisible()
    await expect(page.getByPlaceholder('Was wurde in der Lektion behandelt?')).not.toBeVisible()

    // Fill absence reason
    await page.getByPlaceholder('Grund für die Schülerabsenz').fill('Schüler war krank mit Fieber')

    // Submit form
    await page.getByText('Speichern').click()

    // Verify success
    await expect(page.getByText('Schülerabsenz wurde gespeichert')).toBeVisible()

    // Verify lesson appears in lesson list
    await page.goto('/lessons')
    await expect(page.getByText('Schülerabsenz')).toBeVisible()
    await expect(page.getByText('Schüler war krank mit Fieber')).toBeVisible()
  })

  test('can create lesson with teacher absence', async ({ page }) => {
    // Select teacher absent status
    await page.getByLabel('Lektionsstatus auswählen').click()
    await page.getByText('Lehrerabsenz').click()

    // Fill absence reason
    await page.getByPlaceholder('Grund für die Lehrerabsenz').fill('Notfall in der Familie')

    // Submit form
    await page.getByText('Speichern').click()

    // Verify success
    await expect(page.getByText('Lehrerabsenz wurde gespeichert')).toBeVisible()
  })

  test('can change lesson status after creation', async ({ page }) => {
    // First create a held lesson
    await page.getByPlaceholder('Was wurde in der Lektion behandelt?').fill('Scales and arpeggios')
    await page.getByText('Speichern').click()
    await expect(page.getByText('Lektion wurde gespeichert')).toBeVisible()

    // Navigate to lesson list and edit the lesson
    await page.goto('/lessons')
    await page.getByText('Bearbeiten').first().click()

    // Change to student absent
    await page.getByLabel('Lektionsstatus auswählen').click()
    await page.getByText('Schülerabsenz').click()

    // Add absence reason
    await page.getByPlaceholder('Grund für die Schülerabsenz').fill('Schüler musste früh gehen')

    // Update lesson
    await page.getByText('Aktualisieren').click()

    // Verify update
    await expect(page.getByText('Lektion als Schülerabsenz aktualisiert')).toBeVisible()
  })

  test('validates required fields correctly', async ({ page }) => {
    // Try to submit held lesson without content
    await page.getByText('Speichern').click()
    
    await expect(page.getByText('Die Lektion benötigt mindestens Inhalt oder Hausaufgaben')).toBeVisible()

    // Switch to absent status and try without reason
    await page.getByLabel('Lektionsstatus auswählen').click()
    await page.getByText('Schülerabsenz').click()
    await page.getByText('Speichern').click()

    await expect(page.getByText('Ein Grund für die Absenz ist erforderlich')).toBeVisible()
  })

  test('works correctly on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Verify mobile layout
    await expect(page.getByLabel('Lektionsstatus auswählen')).toBeVisible()

    // Test mobile interaction
    await page.getByLabel('Lektionsstatus auswählen').tap()
    await page.getByText('Schülerabsenz').tap()

    // Verify mobile form submission
    await page.getByPlaceholder('Grund für die Schülerabsenz').fill('Mobile test absence')
    await page.getByText('Speichern').tap()

    await expect(page.getByText('Schülerabsenz wurde gespeichert')).toBeVisible()
  })

  test('maintains data during session', async ({ page }) => {
    // Start filling form
    await page.getByLabel('Lektionsstatus auswählen').click()
    await page.getByText('Lehrerabsenz').click()
    await page.getByPlaceholder('Grund für die Lehrerabsenz').fill('Teilweise ausgefüllt')

    // Navigate away and back
    await page.goto('/students')
    await page.goto('/lessons/create')

    // Verify draft was saved (if draft functionality is implemented)
    await expect(page.getByDisplayValue('Teilweise ausgefüllt')).toBeVisible()
  })
})

// Helper functions for E2E tests
async function loginAsTestUser(page) {
  // Implementation for test user login
}

async function createTestStudent(page, studentName) {
  // Implementation for creating test student
}
```

### 6. Accessibility Tests

**Objective**: Ensure the absence recording features are accessible to all users.

```typescript
// tests/accessibility/absence-a11y.test.ts
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { CreateLessonForm } from '@/components/features/lessons/CreateLessonForm.component'
import { TestProviders } from '@/test/providers'

expect.extend(toHaveNoViolations)

describe('Absence Recording Accessibility', () => {
  const renderWithProviders = (component) => {
    return render(
      <TestProviders>
        {component}
      </TestProviders>
    )
  }

  it('has no accessibility violations in default state', async () => {
    const { container } = renderWithProviders(<CreateLessonForm />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has no accessibility violations with absence status selected', async () => {
    const { container } = renderWithProviders(<CreateLessonForm />)
    
    // Change to absence status to test different UI state
    const statusSelect = container.querySelector('[role="combobox"]')
    statusSelect.value = 'student_absent'
    statusSelect.dispatchEvent(new Event('change', { bubbles: true }))

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('provides proper keyboard navigation', async () => {
    const { container } = renderWithProviders(<CreateLessonForm />)
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    expect(focusableElements.length).toBeGreaterThan(0)
    
    // Each focusable element should be reachable
    focusableElements.forEach(element => {
      expect(element).toHaveAttribute('tabindex')
    })
  })

  it('provides proper ARIA labels and descriptions', () => {
    const { container } = renderWithProviders(<CreateLessonForm />)
    
    const statusSelect = container.querySelector('[role="combobox"]')
    expect(statusSelect).toHaveAttribute('aria-label')
    
    const textareas = container.querySelectorAll('textarea')
    textareas.forEach(textarea => {
      expect(textarea).toHaveAttribute('aria-describedby')
    })
  })

  it('announces status changes to screen readers', async () => {
    const { container } = renderWithProviders(<CreateLessonForm />)
    
    // Look for live regions that would announce changes
    const liveRegions = container.querySelectorAll('[aria-live]')
    expect(liveRegions.length).toBeGreaterThan(0)
  })
})
```

### 7. Performance Tests

**Objective**: Ensure absence recording features don't degrade performance.

```typescript
// tests/performance/absence-performance.test.ts
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { performance } from 'perf_hooks'
import { CreateLessonForm } from '@/components/features/lessons/CreateLessonForm.component'
import { TestProviders } from '@/test/providers'

describe('Absence Recording Performance', () => {
  it('renders within acceptable time', () => {
    const startTime = performance.now()
    
    render(
      <TestProviders>
        <CreateLessonForm />
      </TestProviders>
    )
    
    const renderTime = performance.now() - startTime
    expect(renderTime).toBeLessThan(100) // Should render in less than 100ms
  })

  it('handles status changes without performance degradation', () => {
    const { rerender } = render(
      <TestProviders>
        <CreateLessonForm />
      </TestProviders>
    )

    // Measure multiple re-renders
    const startTime = performance.now()
    
    for (let i = 0; i < 10; i++) {
      rerender(
        <TestProviders>
          <CreateLessonForm />
        </TestProviders>
      )
    }
    
    const avgRerenderTime = (performance.now() - startTime) / 10
    expect(avgRerenderTime).toBeLessThan(50) // Average under 50ms per rerender
  })

  it('validates form without blocking UI', async () => {
    const mockValidation = vi.fn()
    vi.mocked(validateLessonData).mockImplementation(mockValidation)
    
    const startTime = performance.now()
    
    // Simulate form validation
    mockValidation({
      lesson_status: 'student_absent',
      absence_reason: 'Test reason'
    })
    
    const validationTime = performance.now() - startTime
    expect(validationTime).toBeLessThan(10) // Validation should be very fast
  })
})
```

## Test Data Management

### Test Data Factories

```typescript
// tests/factories/lessonFactory.ts
import { faker } from '@faker-js/faker'
import type { Lesson, LessonPartial } from '@/types/types'

export const createMockLesson = (overrides?: Partial<Lesson>): Lesson => ({
  id: faker.number.int({ min: 1, max: 1000 }),
  lessonContent: faker.lorem.paragraph(),
  homework: faker.lorem.sentence(),
  studentId: faker.number.int({ min: 1, max: 100 }),
  groupId: null,
  date: faker.date.recent(),
  user_id: faker.string.uuid(),
  homeworkKey: faker.string.uuid(),
  status: 'documented',
  lesson_status: 'held',
  absence_reason: null,
  expiration_base: faker.date.recent().toISOString(),
  created_at: faker.date.recent().toISOString(),
  ...overrides,
})

export const createMockAbsentLesson = (
  status: 'student_absent' | 'teacher_absent',
  overrides?: Partial<Lesson>
): Lesson => ({
  ...createMockLesson(),
  lesson_status: status,
  lessonContent: null,
  homework: null,
  absence_reason: faker.lorem.sentence(),
  ...overrides,
})

export const createMockLessonPartial = (overrides?: Partial<LessonPartial>): LessonPartial => ({
  lessonContent: faker.lorem.paragraph(),
  homework: faker.lorem.sentence(),
  studentId: faker.number.int({ min: 1, max: 100 }),
  date: faker.date.recent(),
  lesson_status: 'held',
  absence_reason: null,
  expiration_base: faker.date.recent().toISOString(),
  status: 'documented',
  ...overrides,
})

// Test scenarios
export const testScenarios = {
  heldLesson: {
    lesson_status: 'held',
    lessonContent: 'Worked on scales and sight reading',
    homework: 'Practice major scales, 60 BPM',
    absence_reason: null,
  },
  studentAbsent: {
    lesson_status: 'student_absent',
    lessonContent: null,
    homework: null,
    absence_reason: 'Student was sick with flu',
  },
  teacherAbsent: {
    lesson_status: 'teacher_absent',
    lessonContent: null,
    homework: null,
    absence_reason: 'Teacher had family emergency',
  },
} as const
```

## Test Configuration

### Vitest Configuration Updates

```typescript
// vitest.config.ts - additions for absence testing
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
        // Specific thresholds for absence features
        'src/components/features/lessons/': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
      },
    },
  },
})
```

### Playwright Configuration Updates

```typescript
// playwright.config.ts - additions for absence testing
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
})
```

## Test Execution Strategy

### CI/CD Integration

```yaml
# .github/workflows/absence-tests.yml
name: Absence Recording Tests

on:
  push:
    paths:
      - 'app/src/components/features/lessons/**'
      - 'app/src/services/api/lessons.api.ts'
      - 'app/src/types/types.ts'
  pull_request:
    paths:
      - 'app/src/components/features/lessons/**'
      - 'app/src/services/api/lessons.api.ts'

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test -- --coverage
      - run: npm run test:absence-features

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run pw:absence-features

  accessibility-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:a11y
```

### Test Commands

```json
// package.json - additional test commands
{
  "scripts": {
    "test:absence-features": "vitest run tests/components/lessons tests/api/lessons",
    "test:absence-integration": "vitest run tests/integration/absence-workflow.test.ts",
    "test:a11y": "vitest run tests/accessibility",
    "pw:absence-features": "playwright test e2e/absence-recording.spec.ts",
    "test:performance": "vitest run tests/performance"
  }
}
```

---

## Testing Success Criteria

### Coverage Targets

- **Unit Test Coverage**: >90% for absence-related components and functions
- **Integration Test Coverage**: All critical workflows covered
- **E2E Test Coverage**: Complete user journeys tested
- **Accessibility Compliance**: WCAG 2.1 AA standards met

### Quality Metrics

- **Test Reliability**: <2% flaky test rate
- **Test Performance**: Unit tests <5s, E2E tests <2min
- **Maintainability**: Clear test structure and documentation
- **Cross-browser Compatibility**: Chrome, Safari, Firefox

### Acceptance Criteria

- [ ] All database migration tests pass
- [ ] API validation logic is thoroughly tested
- [ ] Component rendering works for all status states
- [ ] Form validation prevents invalid submissions
- [ ] Optimistic updates work correctly
- [ ] Error handling provides user-friendly messages
- [ ] Mobile responsiveness is verified
- [ ] Accessibility requirements are met
- [ ] Performance targets are achieved
- [ ] E2E workflows complete successfully

This comprehensive testing specification ensures that the Absence Recording System is thoroughly validated at all levels, from database integrity to user experience, maintaining the high quality standards of the Eleno application.