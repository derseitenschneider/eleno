import type { Database } from '@/types/supabase'
import type { Group, Lesson, Note, Student, TTodoItem } from '@/types/types'

// Database table types for easier access
type DbStudent = Database['public']['Tables']['students']['Row']
type DbGroup = Database['public']['Tables']['groups']['Row']
type DbLesson = Database['public']['Tables']['lessons']['Row']
type DbNote = Database['public']['Tables']['notes']['Row']
type DbTodo = Database['public']['Tables']['todos']['Row']
type DbSettings = Database['public']['Tables']['settings']['Row']

// Student factory
export function createMockStudent(
  overrides: Partial<DbStudent> = {},
): DbStudent {
  return {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    instrument: 'Piano',
    archive: false,
    dayOfLesson: 'Montag',
    startOfLesson: '14:00',
    durationMinutes: 60,
    created_at: '2023-01-01T00:00:00Z',
    user_id: 'test-user-id',
    location: 'Studio A',
    endOfLesson: '15:00',
    homework_sharing_authorized: false,
    ...overrides,
  }
}

// Group factory
export function createMockGroup(overrides: Partial<DbGroup> = {}): DbGroup {
  return {
    id: 1,
    name: 'Beginner Piano',
    archive: false,
    dayOfLesson: 'Dienstag',
    startOfLesson: '16:00',
    durationMinutes: 45,
    created_at: '2023-01-01T00:00:00Z',
    user_id: 'test-user-id',
    location: 'Studio B',
    endOfLesson: '16:45',
    homework_sharing_authorized: false,
    students: [
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
      { name: 'Diana' },
    ],
    ...overrides,
  }
}

// Lesson factory with date as Date object for component compatibility
export function createMockLesson(overrides: Partial<any> = {}): any {
  return {
    id: 1,
    date: new Date('2023-12-01'),
    homework: 'Practice scales',
    lessonContent: 'Worked on Bach invention',
    expiration_base: '7d',
    homeworkKey: 'abc123',
    created_at: '2023-01-01T00:00:00Z',
    user_id: 'test-user-id',
    studentId: 1,
    groupId: null,
    status: 'documented',
    ...overrides,
  }
}

// Planned Lesson factory
export function createMockPlannedLesson(overrides: Partial<any> = {}): any {
  return {
    ...createMockLesson(),
    id: 2,
    status: 'prepared',
    date: new Date('2024-01-15'),
    homework: 'Review previous exercises',
    lessonContent: 'Plan to work on new piece',
    ...overrides,
  }
}

// Note factory
export function createMockNote(overrides: Partial<DbNote> = {}): DbNote {
  return {
    id: 1,
    text: 'This is a test note content',
    title: 'Test Note',
    backgroundColor: 'yellow',
    order: 1,
    created_at: '2023-01-01T00:00:00Z',
    user_id: 'test-user-id',
    studentId: 1,
    groupId: null,
    ...overrides,
  }
}

// Todo factory
export function createMockTodo(overrides: Partial<DbTodo> = {}): DbTodo {
  return {
    id: 1,
    text: 'Prepare lesson materials',
    completed: false,
    created_at: '2023-01-01T00:00:00Z',
    user_id: 'test-user-id',
    studentId: null,
    groupId: null,
    due: null,
    ...overrides,
  }
}

// Settings factory
export function createMockSettings(
  overrides: Partial<DbSettings> = {},
): DbSettings {
  return {
    id: 1,
    lesson_main_layout: 'regular',
    created_at: '2023-01-01T00:00:00Z',
    user_id: 'test-user-id',
    ...overrides,
  }
}

// Collections for testing multiple items
export function createMockStudents(count = 3): DbStudent[] {
  return Array.from({ length: count }, (_, index) =>
    createMockStudent({
      id: index + 1,
      firstName: `Student${index + 1}`,
      lastName: 'Lastname',
    }),
  )
}

export function createMockGroups(count = 2): DbGroup[] {
  return Array.from({ length: count }, (_, index) =>
    createMockGroup({
      id: index + 1,
      name: `Group ${index + 1}`,
    }),
  )
}

export function createMockLessons(count = 5): any[] {
  return Array.from({ length: count }, (_, index) =>
    createMockLesson({
      id: index + 1,
      date: new Date(`2023-12-${(index + 1).toString().padStart(2, '0')}`),
      studentId: (index % 3) + 1,
    }),
  )
}

export function createMockNotes(count = 4): DbNote[] {
  const colors: Array<Database['public']['Enums']['background_colors']> = [
    'yellow',
    'red',
    'blue',
    'green',
  ]
  return Array.from({ length: count }, (_, index) =>
    createMockNote({
      id: index + 1,
      text: `Note ${index + 1} content`,
      backgroundColor: colors[index % colors.length],
      order: index + 1,
    }),
  )
}

// Form data factories for testing forms
export function createMockLessonFormData() {
  return {
    date: '2023-12-01',
    homework: 'Practice scales',
    lessonContent: 'Worked on Bach invention',
    studentId: 1,
    groupId: undefined,
  }
}

export function createMockStudentFormData() {
  return {
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1987654321',
    dayOfLesson: 'wednesday' as const,
    startOfLesson: '15:00',
    durationMinutes: 45,
    location: 'Studio C',
  }
}

export function createMockGroupFormData() {
  return {
    name: 'Advanced Piano',
    dayOfLesson: 'thursday' as const,
    startOfLesson: '17:00',
    durationMinutes: 60,
    location: 'Studio D',
  }
}

// API response factories
export function createMockApiResponse<T>(data: T, error: any = null) {
  return {
    data,
    error,
    status: error ? 400 : 200,
    statusText: error ? 'Bad Request' : 'OK',
  }
}

export function createMockQueryResponse<T>(
  data: T,
  isLoading = false,
  error: any = null,
) {
  return {
    data,
    error,
    isLoading,
    isError: !!error,
    isSuccess: !error && !isLoading,
    refetch: () => Promise.resolve(),
    isFetching: isLoading,
    status: error ? 'error' : isLoading ? 'loading' : 'success',
  }
}
