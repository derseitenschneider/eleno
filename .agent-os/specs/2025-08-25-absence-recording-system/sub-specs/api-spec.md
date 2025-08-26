# API Specification - Absence Recording System

**Document Type**: Technical Sub-Specification  
**Parent Spec**: Absence Recording System  
**Created**: 2025-08-25  
**Last Updated**: 2025-08-25  

## Overview

This document details the API layer changes required for the Lesson Absence Recording System. The implementation uses direct Supabase API calls (not PHP backend) and includes updates to TanStack Query hooks for data fetching and mutations.

## Current API Analysis

### Existing API Functions

Based on research of `app/src/services/api/lessons.api.ts`:

1. **`createLessonAPI`**: Creates new lessons via Supabase
2. **`updateLessonAPI`**: Updates existing lessons via Supabase
3. Additional functions: `deleteLessonAPI`, `fetchLessonsApi`, etc.

### Current TanStack Query Hooks

Located in `app/src/components/features/lessons/`:

1. **`useCreateLesson.ts`**: Mutation hook for lesson creation
2. **`useUpdateLesson.ts`**: Mutation hook for lesson updates  
3. **`lessonsQueries.ts`**: Query hooks for fetching lessons

## API Function Updates

### 1. Update `createLessonAPI`

**Current Implementation**:
```typescript
export const createLessonAPI = async (lesson: LessonPartial) => {
  const { date } = lesson
  const utcDate = new Date(`${date.toDateString()} UTC`)

  const { data: newLesson, error: errorLesson } = await supabase
    .from('lessons')
    .insert([
      {
        ...lesson,
        date: utcDate.toISOString(),
      },
    ])
    .select()
    .single()

  if (newLesson) {
    await supabase
      .from('profiles')
      .update({ last_lesson_creation: new Date().toUTCString() })
      .eq('id', newLesson?.user_id)
  }

  if (errorLesson) throw new Error(errorLesson.message)
  if (newLesson) return { ...newLesson, date: new Date(newLesson.date || '') }
}
```

**Updated Implementation**:
```typescript
export const createLessonAPI = async (lesson: LessonPartial) => {
  const { date } = lesson
  const utcDate = new Date(`${date.toDateString()} UTC`)

  // Validate lesson data based on lesson_type
  const validatedLesson = validateLessonData(lesson)

  const { data: newLesson, error: errorLesson } = await supabase
    .from('lessons')
    .insert([
      {
        ...validatedLesson,
        date: utcDate.toISOString(),
      },
    ])
    .select()
    .single()

  if (newLesson) {
    await supabase
      .from('profiles')
      .update({ last_lesson_creation: new Date().toUTCString() })
      .eq('id', newLesson?.user_id)
  }

  if (errorLesson) throw new Error(errorLesson.message)
  if (newLesson) return { ...newLesson, date: new Date(newLesson.date || '') }
}
```

### 2. Update `updateLessonAPI`

**Current Implementation**:
```typescript
export const updateLessonAPI = async (
  lesson: Lesson,
): Promise<LessonWithGroupId | LessonWithStudentId> => {
  const utcDate = new Date(`${lesson.date?.toDateString()} UTC`)
  const { data, error } = await supabase
    .from('lessons')
    .update({ ...lesson, date: utcDate.toISOString() })
    .eq('id', lesson.id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return { ...data, date: new Date(data.date || '') } as Lesson
}
```

**Updated Implementation**:
```typescript
export const updateLessonAPI = async (
  lesson: Lesson,
): Promise<LessonWithGroupId | LessonWithStudentId> => {
  const utcDate = new Date(`${lesson.date?.toDateString()} UTC`)
  
  // Validate and clean lesson data based on lesson_type
  const validatedLesson = validateLessonData(lesson)

  const { data, error } = await supabase
    .from('lessons')
    .update({ 
      ...validatedLesson, 
      date: utcDate.toISOString() 
    })
    .eq('id', lesson.id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return { ...data, date: new Date(data.date || '') } as Lesson
}
```

### 3. New Validation Function

**`validateLessonData` Helper Function**:
```typescript
interface LessonValidationInput {
  lesson_type?: 'held' | 'student_absent' | 'teacher_absent'
  lessonContent?: string
  homework?: string
  absence_reason?: string
  [key: string]: any
}

export const validateLessonData = (lesson: LessonValidationInput) => {
  const { lesson_type = 'held', lessonContent, homework, absence_reason, ...rest } = lesson

  // Create base lesson object
  const validatedLesson = { ...rest, lesson_type }

  if (lesson_type === 'held') {
    // For held lessons: include content/homework, clear absence_reason
    validatedLesson.lessonContent = lessonContent
    validatedLesson.homework = homework
    validatedLesson.absence_reason = null
    
    // Validate that at least one content field is provided
    if (!lessonContent && !homework) {
      throw new Error('Die Lektion benötigt mindestens Inhalt oder Hausaufgaben.')
    }
  } else {
    // For absent lessons: clear content/homework, require absence_reason
    validatedLesson.lessonContent = null
    validatedLesson.homework = null
    validatedLesson.absence_reason = absence_reason

    // Validate that absence reason is provided
    if (!absence_reason || absence_reason.trim() === '') {
      throw new Error('Ein Grund für die Absenz ist erforderlich.')
    }
  }

  return validatedLesson
}
```

### 4. Update Fetch Functions

**Update `fetchLessonsApi` to include new fields**:
```typescript
export const fetchLessonsApi = async (
  studentId: number,
  userId: string,
): Promise<Lesson[]> => {
  const { data, error } = await supabase
    .from('lessons')
    .select(`
      id, 
      lessonContent, 
      homework, 
      studentId, 
      date, 
      user_id, 
      homeworkKey, 
      status,
      lesson_type,
      absence_reason,
      expiration_base,
      created_at
    `)
    .eq('studentId', studentId)
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  
  return data.map((lesson) => ({
    ...lesson,
    date: new Date(lesson.date || ''),
  }))
}
```

## TanStack Query Hook Updates

### 1. Update `useCreateLesson` Hook

**File**: `app/src/components/features/lessons/useCreateLesson.ts`

**Enhanced Implementation**:
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLessonAPI } from '@/services/api/lessons.api'
import type { LessonPartial, Lesson } from '@/types/types'
import { toast } from 'sonner'

export const useCreateLesson = () => {
  const queryClient = useQueryClient()

  const {
    mutate: createLesson,
    isLoading: isCreating,
    error,
  } = useMutation({
    mutationFn: (lesson: LessonPartial) => createLessonAPI(lesson),
    onSuccess: (newLesson: Lesson, variables: LessonPartial) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries(['lessons'])
      queryClient.invalidateQueries(['last_3_lessons'])
      
      // Optimistically update lessons cache if possible
      const queryKey = ['lessons', variables.studentId || variables.groupId]
      queryClient.setQueryData<Lesson[]>(queryKey, (old) => {
        if (!old) return [newLesson]
        return [newLesson, ...old]
      })

      // Success toast with contextual message
      const statusMessage = getSuccessMessage(newLesson.lesson_type)
      toast.success(statusMessage)
    },
    onError: (error: Error) => {
      // User-friendly error messages
      const errorMessage = getUserFriendlyErrorMessage(error.message)
      toast.error(errorMessage)
    },
  })

  return { createLesson, isCreating, error }
}

// Helper functions
const getSuccessMessage = (lessonType?: string) => {
  switch (lessonType) {
    case 'student_absent':
      return 'Schülerabsenz wurde gespeichert.'
    case 'teacher_absent':
      return 'Lehrerabsenz wurde gespeichert.'
    default:
      return 'Lektion wurde gespeichert.'
  }
}

const getUserFriendlyErrorMessage = (error: string) => {
  if (error.includes('Inhalt oder Hausaufgaben')) {
    return 'Bitte geben Sie Lektionsinhalt oder Hausaufgaben ein.'
  }
  if (error.includes('Grund für die Absenz')) {
    return 'Bitte geben Sie einen Grund für die Absenz an.'
  }
  return 'Fehler beim Speichern der Lektion. Bitte versuchen Sie es erneut.'
}
```

### 2. Update `useUpdateLesson` Hook

**File**: `app/src/components/features/lessons/useUpdateLesson.ts`

**Enhanced Implementation**:
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateLessonAPI } from '@/services/api/lessons.api'
import type { Lesson } from '@/types/types'
import { toast } from 'sonner'

export const useUpdateLesson = () => {
  const queryClient = useQueryClient()

  const {
    mutate: updateLesson,
    isLoading: isUpdating,
    error,
  } = useMutation({
    mutationFn: (lesson: Lesson) => updateLessonAPI(lesson),
    onMutate: async (updatedLesson: Lesson) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['lessons'])
      
      // Snapshot previous value for rollback
      const previousLessons = queryClient.getQueryData(['lessons'])
      
      // Optimistically update cache
      const queryKey = ['lessons', updatedLesson.studentId || updatedLesson.groupId]
      queryClient.setQueryData<Lesson[]>(queryKey, (old) => {
        if (!old) return [updatedLesson]
        return old.map((lesson) => 
          lesson.id === updatedLesson.id ? updatedLesson : lesson
        )
      })

      return { previousLessons }
    },
    onError: (error: Error, variables, context) => {
      // Rollback optimistic update
      if (context?.previousLessons) {
        queryClient.setQueryData(['lessons'], context.previousLessons)
      }
      
      // Show error message
      const errorMessage = getUserFriendlyErrorMessage(error.message)
      toast.error(errorMessage)
    },
    onSuccess: (updatedLesson: Lesson) => {
      // Invalidate related queries
      queryClient.invalidateQueries(['lessons'])
      queryClient.invalidateQueries(['last_3_lessons'])
      
      // Success toast with contextual message
      const statusMessage = getUpdateSuccessMessage(updatedLesson.lesson_type)
      toast.success(statusMessage)
    },
    onSettled: () => {
      // Ensure cache consistency
      queryClient.invalidateQueries(['lessons'])
    },
  })

  return { updateLesson, isUpdating, error }
}

const getUpdateSuccessMessage = (lessonType?: string) => {
  switch (lessonType) {
    case 'student_absent':
      return 'Lektion als Schülerabsenz aktualisiert.'
    case 'teacher_absent':
      return 'Lektion als Lehrerabsenz aktualisiert.'
    default:
      return 'Lektion wurde aktualisiert.'
  }
}
```

### 3. Update `lessonsQueries.ts`

**File**: `app/src/components/features/lessons/lessonsQueries.ts`

**Enhanced Implementation**:
```typescript
import { useQuery } from '@tanstack/react-query'
import { fetchLessonsApi } from '@/services/api/lessons.api'
import type { Lesson } from '@/types/types'

export const useLessonsQuery = (
  studentId: number | undefined,
  userId: string | undefined,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['lessons', studentId],
    queryFn: () => fetchLessonsApi(studentId!, userId!),
    enabled: enabled && !!studentId && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    select: (data: Lesson[]) => {
      // Transform data if needed and sort by date
      return data
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    },
  })
}

// New query for absence statistics (future enhancement)
export const useAbsenceStatsQuery = (
  studentId: number | undefined,
  userId: string | undefined,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['absence-stats', studentId],
    queryFn: async () => {
      const lessons = await fetchLessonsApi(studentId!, userId!)
      return calculateAbsenceStats(lessons)
    },
    enabled: enabled && !!studentId && !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

const calculateAbsenceStats = (lessons: Lesson[]) => {
  const stats = {
    totalLessons: lessons.length,
    heldLessons: lessons.filter(l => l.lesson_type === 'held').length,
    studentAbsences: lessons.filter(l => l.lesson_type === 'student_absent').length,
    teacherAbsences: lessons.filter(l => l.lesson_type === 'teacher_absent').length,
  }
  
  return {
    ...stats,
    attendanceRate: stats.totalLessons > 0 
      ? (stats.heldLessons / stats.totalLessons * 100).toFixed(1)
      : '0.0'
  }
}
```

## API Validation Rules

### Client-Side Validation

**Form Validation (for frontend)**:
```typescript
const validateLessonForm = (data: LessonFormData) => {
  const errors: string[] = []

  if (data.lesson_type === 'held') {
    if (!data.lessonContent && !data.homework) {
      errors.push('Die Lektion benötigt mindestens Inhalt oder Hausaufgaben.')
    }
  } else {
    if (!data.absence_reason || data.absence_reason.trim() === '') {
      errors.push('Ein Grund für die Absenz ist erforderlich.')
    }
  }

  return errors
}
```

### Server-Side Validation

**Database Constraints Handled**:
- ENUM values enforced by PostgreSQL
- NOT NULL constraints on `lesson_status`
- Business logic validation in API functions

## Error Handling

### Error Types and Messages

```typescript
export const API_ERROR_MESSAGES = {
  VALIDATION: {
    CONTENT_REQUIRED: 'Die Lektion benötigt mindestens Inhalt oder Hausaufgaben.',
    ABSENCE_REASON_REQUIRED: 'Ein Grund für die Absenz ist erforderlich.',
    INVALID_STATUS: 'Ungültiger Lektionsstatus.',
  },
  NETWORK: {
    CONNECTION_ERROR: 'Verbindungsfehler. Bitte überprüfen Sie Ihre Internetverbindung.',
    TIMEOUT: 'Die Anfrage ist abgelaufen. Bitte versuchen Sie es erneut.',
    UNKNOWN: 'Ein unbekannter Fehler ist aufgetreten.',
  },
  PERMISSION: {
    UNAUTHORIZED: 'Sie sind nicht berechtigt, diese Aktion durchzuführen.',
    FORBIDDEN: 'Zugriff verweigert.',
  }
} as const
```

### Error Handling Strategy

1. **Optimistic Updates**: Update UI immediately, rollback on error
2. **User Feedback**: Clear, actionable error messages in German
3. **Retry Logic**: Automatic retry for network errors
4. **Graceful Degradation**: Partial functionality if some operations fail

## Type Updates Required

### After Database Migration

**Run Type Generation**:
```bash
cd app && npm run generate-types:prod
```

**Expected Generated Types** (in `src/types/supabase.ts`):
```typescript
// New ENUM type
absence_type: 'held' | 'student_absent' | 'teacher_absent'

// Updated lessons table type
lessons: {
  Row: {
    // existing fields...
    lesson_type: Database['public']['Enums']['absence_type']
    absence_reason: string | null
  }
  Insert: {
    // existing fields...
    lesson_type?: Database['public']['Enums']['absence_type']
    absence_reason?: string | null
  }
  Update: {
    // existing fields...
    lesson_type?: Database['public']['Enums']['absence_type']
    absence_reason?: string | null
  }
}
```

## Testing Strategy

### Unit Tests

**API Function Tests**:
```typescript
describe('createLessonAPI', () => {
  it('creates lesson with held status', async () => {
    // Test held lesson creation
  })

  it('creates lesson with absence status', async () => {
    // Test absence lesson creation
  })

  it('validates lesson data correctly', () => {
    // Test validation logic
  })

  it('handles errors appropriately', async () => {
    // Test error scenarios
  })
})
```

**Hook Tests**:
```typescript
describe('useCreateLesson', () => {
  it('optimistically updates cache', () => {
    // Test optimistic updates
  })

  it('rolls back on error', () => {
    // Test error rollback
  })

  it('shows appropriate success messages', () => {
    // Test success feedback
  })
})
```

### Integration Tests

**API Integration**:
- Test actual Supabase calls
- Verify data persistence
- Test error scenarios
- Validate permissions

## Performance Considerations

### Caching Strategy

- **Stale-while-revalidate**: 5-minute stale time for lessons
- **Cache invalidation**: Smart invalidation on mutations
- **Optimistic updates**: Immediate UI feedback

### Query Optimization

- **Selective queries**: Only fetch necessary columns
- **Batching**: Group related queries when possible
- **Pagination**: For large lesson lists (future)

## Security Considerations

### Data Validation

- **Client and server validation**: Double validation for security
- **Input sanitization**: Clean user input before storage
- **SQL injection protection**: Supabase handles parameterization

### Access Control

- **RLS policies**: Inherit existing lesson table policies
- **User isolation**: Users can only access their own data
- **Permission checks**: Validate user permissions on mutations

## Migration Compatibility

### Backward Compatibility

- **Default values**: New columns have sensible defaults
- **Optional fields**: New fields are optional in existing API calls
- **Graceful fallbacks**: Handle missing data gracefully

### Forward Compatibility

- **Extensible design**: ENUM can be extended for future absence types
- **API versioning**: Consider API versioning for major changes
- **Schema evolution**: Plan for future schema changes

---

## Implementation Checklist

**API Functions**:
- [ ] Update `createLessonAPI` with validation
- [ ] Update `updateLessonAPI` with validation
- [ ] Add `validateLessonData` helper
- [ ] Update `fetchLessonsApi` to select new fields
- [ ] Add error handling and user-friendly messages

**TanStack Query Hooks**:
- [ ] Update `useCreateLesson` with optimistic updates
- [ ] Update `useUpdateLesson` with rollback logic
- [ ] Update `lessonsQueries.ts` with new fields
- [ ] Add absence statistics query (optional)
- [ ] Test cache invalidation strategies

**Type Safety**:
- [ ] Run type generation after database migration
- [ ] Update custom types in `types.ts`
- [ ] Verify type compatibility throughout codebase
- [ ] Update function signatures as needed

**Testing**:
- [ ] Write unit tests for API functions
- [ ] Write tests for TanStack Query hooks
- [ ] Integration tests for database operations
- [ ] Error scenario testing
- [ ] Performance testing

This API specification provides comprehensive coverage of all backend changes required for the Absence Recording System while maintaining compatibility with existing functionality.