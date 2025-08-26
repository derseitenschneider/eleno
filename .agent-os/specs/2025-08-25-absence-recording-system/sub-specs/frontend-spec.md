# Frontend Specification - Absence Recording System

**Document Type**: Technical Sub-Specification  
**Parent Spec**: Absence Recording System  
**Created**: 2025-08-25  
**Last Updated**: 2025-08-25  

## Overview

This document details the frontend implementation requirements for the Lesson Absence Recording System. The implementation focuses on the `CreateLessonForm` component with a Shadcn/ui Select component for status selection and conditional rendering based on lesson status.

## Current Component Analysis

### Existing `CreateLessonForm` Component

**Location**: `app/src/components/features/lessons/CreateLessonForm.component.tsx`

**Key Features**:
- Date picker for lesson date
- WYSIWYG editors for lesson content and homework
- Form state management with React hooks
- Draft saving functionality
- Integration with TanStack Query for mutations

**Current UI Structure**:
```tsx
<div className='mb-3 items-center md:flex md:gap-2'>
  <div className='flex items-center gap-2'>
    <p>Datum</p>
    <DayPicker setDate={handleDate} date={date} disabled={isCreating} />
  </div>
  <div>
    <ButtonPlannedLessonAvailable date={date} />
  </div>
</div>
```

## Frontend Implementation Requirements

### 1. UI Component Structure

**Updated Layout**:
```tsx
<div className='mb-3 items-center md:flex md:gap-2'>
  <div className='flex items-center gap-2'>
    <p>Datum</p>
    <DayPicker setDate={handleDate} date={date} disabled={isCreating} />
  </div>
  
  {/* NEW: Lesson Type Select */}
  <div className='flex items-center gap-2'>
    <p>Status</p>
    <LessonTypeSelect 
      value={lessonType} 
      onValueChange={handleTypeChange}
      disabled={isCreating}
    />
  </div>

  <div>
    <ButtonPlannedLessonAvailable date={date} />
  </div>
</div>
```

### 2. New `LessonStatusSelect` Component

**Component Implementation**:
```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface LessonTypeSelectProps {
  value: 'held' | 'student_absent' | 'teacher_absent'
  onValueChange: (value: 'held' | 'student_absent' | 'teacher_absent') => void
  disabled?: boolean
}

export function LessonTypeSelect({ 
  value, 
  onValueChange, 
  disabled = false 
}: LessonTypeSelectProps) {
  return (
    <Select 
      value={value} 
      onValueChange={onValueChange} 
      disabled={disabled}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Status auswählen" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="held">Stattgefunden</SelectItem>
        <SelectItem value="student_absent">Schülerabsenz</SelectItem>
        <SelectItem value="teacher_absent">Lehrerabsenz</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

### 3. Form State Management

**Enhanced State Management**:
```tsx
export function CreateLessonForm() {
  // Existing state
  const [date, setDate] = useState<Date>(getInitialDate())
  const [lessonContent, setLessonContent] = useState('')
  const [homework, setHomework] = useState('')
  const [error, setError] = useState('')

  // NEW: Lesson type state
  const [lessonType, setLessonType] = useState<'held' | 'student_absent' | 'teacher_absent'>('held')
  const [absenceReason, setAbsenceReason] = useState('')

  // Enhanced form validation
  const isDisabledSave = useMemo(() => {
    if (isCreating || isUpdating || !hasAccess) return true
    
    if (lessonType === 'held') {
      return !lessonContent && !homework
    } else {
      return !absenceReason.trim()
    }
  }, [isCreating, isUpdating, hasAccess, lessonType, lessonContent, homework, absenceReason])

  // Type change handler
  const handleTypeChange = (newType: 'held' | 'student_absent' | 'teacher_absent') => {
    setLessonType(newType)
    setError('') // Clear any existing errors
    
    // Update drafts with new status
    setDrafts((prev) => {
      const existingDraft = prev.find(
        (draft) => draft[typeField] === currentLessonHolder?.holder.id,
      )
      
      if (existingDraft) {
        return prev.map((draft) =>
          draft[typeField] === currentLessonHolder?.holder.id
            ? { ...draft, lesson_type: newType, date }
            : draft,
        )
      }
      
      return [
        ...prev,
        {
          [typeField]: currentLessonHolder?.holder.id,
          lesson_type: newType,
          date,
        },
      ]
    })
  }

  // Absence reason handler
  const handleAbsenceReason = (reason: string) => {
    setAbsenceReason(reason)
    setError('')
    
    setDrafts((prev) => {
      const existingDraft = prev.find(
        (draft) => draft[typeField] === currentLessonHolder?.holder.id,
      )
      
      if (existingDraft) {
        return prev.map((draft) =>
          draft[typeField] === currentLessonHolder?.holder.id
            ? { ...draft, absence_reason: reason, date }
            : draft,
        )
      }
      
      return [
        ...prev,
        {
          [typeField]: currentLessonHolder?.holder.id,
          absence_reason: reason,
          date,
        },
      ]
    })
  }
```

### 4. Conditional Rendering Logic

**Main Content Area**:
```tsx
{/* Conditional Content Based on Status */}
<div className={cn(isCreating && 'opacity-50', 'grid gap-6')}>
  {lessonType === 'held' ? (
    // Existing WYSIWYG editors for held lessons
    <div className="grid min-[1148px]:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Lektionsinhalt</h3>
        <EditorComponent
          value={lessonContent}
          onChange={handleLessonContent}
          placeholder="Was wurde in der Lektion behandelt?"
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Hausaufgaben</h3>
        <EditorComponent
          value={homework}
          onChange={handleHomework}
          placeholder="Welche Hausaufgaben wurden aufgegeben?"
        />
      </div>
    </div>
  ) : (
    // NEW: Absence reason textarea for absent lessons
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2">
        {lessonType === 'student_absent' ? 'Grund für Schülerabsenz' : 'Grund für Lehrerabsenz'}
      </h3>
      <Textarea
        value={absenceReason}
        onChange={(e) => handleAbsenceReason(e.target.value)}
        placeholder={getAbsencePlaceholder(lessonType)}
        className="min-h-[120px]"
        disabled={isCreating}
      />
    </div>
  )}
</div>

// Helper function for placeholders
const getAbsencePlaceholder = (status: string) => {
  switch (status) {
    case 'student_absent':
      return 'Grund für die Schülerabsenz (z.B. krank, Urlaub, Notfall)...'
    case 'teacher_absent':
      return 'Grund für die Lehrerabsenz (z.B. krank, Termin, Notfall)...'
    default:
      return 'Grund für die Absenz...'
  }
}
```

### 5. Form Integration with react-hook-form

**Enhanced Form Setup**:
```tsx
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Updated Zod schema
const lessonFormSchema = z.object({
  date: z.date(),
  lesson_type: z.enum(['held', 'student_absent', 'teacher_absent']),
  lessonContent: z.string().optional(),
  homework: z.string().optional(),
  absence_reason: z.string().optional(),
}).refine((data) => {
  if (data.lesson_type === 'held') {
    return (data.lessonContent && data.lessonContent.trim()) || 
           (data.homework && data.homework.trim())
  } else {
    return data.absence_reason && data.absence_reason.trim()
  }
}, {
  message: "Erforderliche Felder müssen basierend auf dem Lektionsstatus ausgefüllt werden",
  path: ['root']
})

type LessonFormData = z.infer<typeof lessonFormSchema>

// Form implementation
export function CreateLessonForm() {
  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      date: new Date(),
      lesson_type: 'held',
      lessonContent: '',
      homework: '',
      absence_reason: '',
    }
  })

  const lessonType = form.watch('lesson_type')

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      {/* Date Picker */}
      <Controller
        name="date"
        control={form.control}
        render={({ field }) => (
          <DayPicker 
            setDate={field.onChange} 
            date={field.value} 
            disabled={isCreating} 
          />
        )}
      />

      {/* Lesson Status Select */}
      <Controller
        name="lesson_status"
        control={form.control}
        render={({ field }) => (
          <LessonStatusSelect
            value={field.value}
            onValueChange={field.onChange}
            disabled={isCreating}
          />
        )}
      />

      {/* Conditional Content */}
      {lessonStatus === 'held' ? (
        <>
          <Controller
            name="lessonContent"
            control={form.control}
            render={({ field }) => (
              <EditorComponent
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Was wurde in der Lektion behandelt?"
              />
            )}
          />
          <Controller
            name="homework"
            control={form.control}
            render={({ field }) => (
              <EditorComponent
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Welche Hausaufgaben wurden aufgegeben?"
              />
            )}
          />
        </>
      ) : (
        <Controller
          name="absence_reason"
          control={form.control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder={getAbsencePlaceholder(lessonStatus)}
              className="min-h-[120px]"
              disabled={isCreating}
            />
          )}
        />
      )}

      {/* Form Errors */}
      {form.formState.errors.root && (
        <p className="text-red-500 text-sm mt-2">
          {form.formState.errors.root.message}
        </p>
      )}

      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={form.formState.isSubmitting || !form.formState.isValid}
      >
        Speichern
      </Button>
    </form>
  )
}
```

### 6. Enhanced Save Handler

**Updated Save Logic**:
```tsx
const handleSave = async (data: LessonFormData) => {
  if (!currentLessonHolder?.holder.id) return

  try {
    const fieldType = currentLessonHolder.type === 's' ? 'studentId' : 'groupId'
    const currentDraft = drafts.find((draft) => draft[fieldType])

    // Prepare lesson data based on status
    const lessonData = {
      [fieldType]: currentLessonHolder.holder.id,
      date: data.date,
      lesson_status: data.lesson_status,
      expiration_base: new Date().toISOString(),
    }

    if (data.lesson_status === 'held') {
      lessonData.lessonContent = removeHTMLAttributes(data.lessonContent || '')
      lessonData.homework = removeHTMLAttributes(data.homework || '')
      lessonData.absence_reason = null
    } else {
      lessonData.lessonContent = null
      lessonData.homework = null
      lessonData.absence_reason = data.absence_reason
    }

    // Handle update vs create
    if (currentDraft && currentDraft.status === 'prepared') {
      const updatedLesson = { ...currentDraft, ...lessonData, status: 'documented' }
      await updateLesson(updatedLesson, {
        onSuccess: () => {
          toast.success(getSuccessMessage(data.lesson_status))
          form.reset()
          resetFields()
        },
      })
    } else {
      await createLesson({ ...lessonData, status: 'documented' }, {
        onSuccess: () => {
          form.reset()
          resetFields()
        }
      })
    }
  } catch (error) {
    console.error('Error saving lesson:', error)
    toast.error('Fehler beim Speichern der Lektion')
  }
}
```

## UI/UX Considerations

### 1. Visual Design

**Status Select Styling**:
```css
/* Custom styling for lesson status select */
.lesson-status-select {
  min-width: 180px;
  font-weight: 500;
}

.lesson-status-select[data-state="open"] {
  border-color: var(--primary);
}

/* Status-specific colors */
.status-held { color: var(--success); }
.status-student-absent { color: var(--warning); }
.status-teacher-absent { color: var(--destructive); }
```

**Transition Effects**:
```css
/* Smooth transitions for content switching */
.lesson-content-container {
  transition: all 0.3s ease-in-out;
}

.lesson-content-enter {
  opacity: 0;
  transform: translateY(-10px);
}

.lesson-content-enter-active {
  opacity: 1;
  transform: translateY(0);
}
```

### 2. Responsive Design

**Mobile Layout**:
```tsx
<div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
  {/* Date picker - full width on mobile */}
  <div className="flex items-center gap-2">
    <p className="text-sm font-medium">Datum</p>
    <DayPicker 
      setDate={handleDate} 
      date={date} 
      disabled={isCreating}
      className="w-full md:w-auto"
    />
  </div>
  
  {/* Status select - full width on mobile */}
  <div className="flex items-center gap-2">
    <p className="text-sm font-medium">Status</p>
    <LessonStatusSelect 
      value={lessonStatus} 
      onValueChange={handleStatusChange}
      disabled={isCreating}
      className="w-full md:w-[180px]"
    />
  </div>
</div>
```

### 3. Accessibility

**ARIA Labels and Descriptions**:
```tsx
<LessonStatusSelect
  value={lessonStatus}
  onValueChange={handleStatusChange}
  disabled={isCreating}
  aria-label="Lektionsstatus auswählen"
  aria-describedby="status-help"
/>

<div id="status-help" className="sr-only">
  Wählen Sie aus, ob die Lektion stattgefunden hat oder ob Schüler oder Lehrer abwesend waren
</div>

{/* Conditional content with proper headings */}
{lessonStatus === 'held' ? (
  <div role="region" aria-labelledby="content-heading">
    <h3 id="content-heading" className="text-lg font-semibold mb-2">
      Lektionsinhalt und Hausaufgaben
    </h3>
    {/* Content editors */}
  </div>
) : (
  <div role="region" aria-labelledby="absence-heading">
    <h3 id="absence-heading" className="text-lg font-semibold mb-2">
      {lessonStatus === 'student_absent' ? 'Grund für Schülerabsenz' : 'Grund für Lehrerabsenz'}
    </h3>
    <Textarea
      aria-describedby="absence-help"
      // ... other props
    />
    <div id="absence-help" className="sr-only">
      Geben Sie den Grund für die Absenz ein
    </div>
  </div>
)}
```

### 4. Loading States

**Enhanced Loading UX**:
```tsx
{/* Loading overlay for form */}
{isCreating && (
  <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
    <div className="flex items-center gap-2">
      <Spinner className="h-4 w-4" />
      <span>Speichere Lektion...</span>
    </div>
  </div>
)}

{/* Disabled state styling */}
<div className={cn(
  'grid gap-6 transition-opacity',
  isCreating && 'opacity-50 pointer-events-none'
)}>
```

## Type Definitions

### Component Props Types

```typescript
// LessonStatusSelect props
interface LessonStatusSelectProps {
  value: LessonStatus
  onValueChange: (value: LessonStatus) => void
  disabled?: boolean
  className?: string
  'aria-label'?: string
  'aria-describedby'?: string
}

// Form data types
type LessonStatus = 'held' | 'student_absent' | 'teacher_absent'

interface LessonFormData {
  date: Date
  lesson_status: LessonStatus
  lessonContent?: string
  homework?: string
  absence_reason?: string
}

// Extended Draft type
interface Draft {
  id?: number
  studentId?: number
  groupId?: number
  date?: Date
  lessonContent?: string
  homework?: string
  lesson_status?: LessonStatus
  absence_reason?: string
  status?: 'prepared' | 'documented'
}
```

## Performance Optimizations

### 1. Memoization

```tsx
// Memoize expensive computations
const isDisabledSave = useMemo(() => {
  if (isCreating || isUpdating || !hasAccess) return true
  
  if (lessonStatus === 'held') {
    return !lessonContent.trim() && !homework.trim()
  } else {
    return !absenceReason.trim()
  }
}, [isCreating, isUpdating, hasAccess, lessonStatus, lessonContent, homework, absenceReason])

// Memoize static elements
const statusOptions = useMemo(() => [
  { value: 'held', label: 'Stattgefunden' },
  { value: 'student_absent', label: 'Schülerabsenz' },
  { value: 'teacher_absent', label: 'Lehrerabsenz' },
], [])
```

### 2. Debounced Updates

```tsx
// Debounce draft updates
const debouncedUpdateDrafts = useMemo(
  () => debounce((updates: Partial<Draft>) => {
    setDrafts((prev) => updateDraftInArray(prev, currentLessonHolder?.holder.id, updates))
  }, 500),
  [currentLessonHolder?.holder.id]
)

const handleAbsenceReason = (reason: string) => {
  setAbsenceReason(reason)
  debouncedUpdateDrafts({ absence_reason: reason })
}
```

## Error Handling

### User-Friendly Error Messages

```typescript
const getErrorMessage = (error: unknown, lessonStatus: LessonStatus) => {
  if (error instanceof Error) {
    if (error.message.includes('Inhalt oder Hausaufgaben')) {
      return 'Bitte geben Sie Lektionsinhalt oder Hausaufgaben ein.'
    }
    if (error.message.includes('Grund für die Absenz')) {
      return lessonStatus === 'student_absent'
        ? 'Bitte geben Sie einen Grund für die Schülerabsenz an.'
        : 'Bitte geben Sie einen Grund für die Lehrerabsenz an.'
    }
  }
  return 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
}
```

### Form Validation Feedback

```tsx
{/* Real-time validation feedback */}
{form.formState.errors.absence_reason && (
  <p className="text-destructive text-sm mt-1">
    {form.formState.errors.absence_reason.message}
  </p>
)}

{form.formState.errors.root && (
  <Alert variant="destructive" className="mt-4">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Validierungsfehler</AlertTitle>
    <AlertDescription>
      {form.formState.errors.root.message}
    </AlertDescription>
  </Alert>
)}
```

## Testing Strategy

### Component Testing

```typescript
// Test lesson status selection
describe('CreateLessonForm', () => {
  it('shows content editors when status is held', () => {
    render(<CreateLessonForm />)
    
    const statusSelect = screen.getByLabelText('Lektionsstatus auswählen')
    fireEvent.change(statusSelect, { target: { value: 'held' } })
    
    expect(screen.getByPlaceholderText('Was wurde in der Lektion behandelt?')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Welche Hausaufgaben wurden aufgegeben?')).toBeInTheDocument()
  })

  it('shows absence reason textarea when status is absent', () => {
    render(<CreateLessonForm />)
    
    const statusSelect = screen.getByLabelText('Lektionsstatus auswählen')
    fireEvent.change(statusSelect, { target: { value: 'student_absent' } })
    
    expect(screen.getByPlaceholderText(/Grund für die Schülerabsenz/)).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Was wurde in der Lektion behandelt?')).not.toBeInTheDocument()
  })

  it('validates required fields based on status', async () => {
    render(<CreateLessonForm />)
    
    // Test validation for held lesson
    const statusSelect = screen.getByLabelText('Lektionsstatus auswählen')
    fireEvent.change(statusSelect, { target: { value: 'held' } })
    
    const submitButton = screen.getByText('Speichern')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/mindestens Inhalt oder Hausaufgaben/)).toBeInTheDocument()
    })
  })
})
```

### Integration Testing

```typescript
// Test form submission with different statuses
describe('CreateLessonForm Integration', () => {
  it('creates lesson with absence status', async () => {
    const mockCreateLesson = jest.fn()
    render(<CreateLessonForm />, {
      wrapper: ({ children }) => (
        <QueryClient>
          <MockProvider createLesson={mockCreateLesson}>
            {children}
          </MockProvider>
        </QueryClient>
      )
    })

    // Select absence status
    fireEvent.change(screen.getByLabelText('Lektionsstatus auswählen'), 
      { target: { value: 'student_absent' } })
    
    // Fill absence reason
    fireEvent.change(screen.getByPlaceholderText(/Grund für die Schülerabsenz/), 
      { target: { value: 'Schüler ist krank' } })
    
    // Submit form
    fireEvent.click(screen.getByText('Speichern'))
    
    await waitFor(() => {
      expect(mockCreateLesson).toHaveBeenCalledWith(
        expect.objectContaining({
          lesson_status: 'student_absent',
          absence_reason: 'Schüler ist krank',
          lessonContent: null,
          homework: null,
        })
      )
    })
  })
})
```

---

## Implementation Checklist

**Component Updates**:
- [ ] Create `LessonStatusSelect` component
- [ ] Update `CreateLessonForm` with status selection
- [ ] Implement conditional rendering logic
- [ ] Add form validation with Zod schema
- [ ] Update save handler for new fields

**State Management**:
- [ ] Add lesson status and absence reason to component state
- [ ] Update draft saving to include new fields
- [ ] Implement status change handlers
- [ ] Add form reset functionality

**UI/UX**:
- [ ] Responsive design for mobile devices
- [ ] Accessibility improvements (ARIA labels, etc.)
- [ ] Loading states and error handling
- [ ] Smooth transitions between UI states

**Type Safety**:
- [ ] Update TypeScript interfaces
- [ ] Add proper type guards
- [ ] Update prop types for enhanced components
- [ ] Ensure type compatibility with generated types

**Testing**:
- [ ] Unit tests for component rendering
- [ ] Integration tests for form submission
- [ ] Accessibility testing
- [ ] Mobile responsiveness testing

This frontend specification provides comprehensive guidance for implementing the absence recording UI while maintaining consistency with the existing Eleno design system and user experience patterns.