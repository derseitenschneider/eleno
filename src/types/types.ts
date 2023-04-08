export type TUser = {
  id: string
  firstName: string
  lastName: string
  email: string
}

export type TStudent = {
  id?: number
  firstName: string
  lastName: string
  instrument: string
  durationMinutes: number
  dayOfLesson?: string
  startOfLesson?: string
  endOfLesson?: string
  archive: boolean
  location: string
}

export type TLesson = {
  id?: number
  date: string
  lessonContent?: string
  homework: string
  studentId: number
}

export type TNotes = {
  id?: number
  studentId: number
  title?: string
  text?: string
}

// CONTEXT TYPES
export type ContextTypeUser = {
  user: TUser | null
  setUser: React.Dispatch<React.SetStateAction<TUser>>
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export type ContextTypeTodos = {
  todos: TTodo[] | null
  setTodos: React.Dispatch<React.SetStateAction<TTodo[]>>
  saveTodo: (newTodo: TTodo) => void
  deleteTodo: (id: number) => void
  completeTodo: (id: number) => void
  reactivateTodo: (id: number) => void
  deleteAllCompleted: () => void
}

export type ContextTypeStudents = {
  students: TStudent[] | null
  setStudents: React.Dispatch<React.SetStateAction<TStudent[]>>
  isPending: boolean
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>
  activeStudents: TStudent[] | null
  archivedStudents: TStudent[] | null
  resetLessonData: (ids: number[]) => void
  saveNewStudents: (students: TStudent[]) => void
  archivateStudents: (ids: number | number[]) => void
  reactivateStudents: (ids: number | number[]) => void
  deleteStudents: (ids: number | number[]) => void
  updateStudent: (student: TStudent) => void
}

export type ContextTypeLessons = {
  lessons: TLesson[] | null
  setLessons: React.Dispatch<React.SetStateAction<TLesson[]>>
  saveNewLesson: (input: {}, studentId: number, date: string) => void
  deleteLesson: (id: number) => void
  updateLesson: (lesson: TLesson) => void
}

export type ContextTypeLoading = {
  loading: boolean | null
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export type ContextTypeNotes = {
  notes: TNotes[] | null
  setNotes: React.Dispatch<React.SetStateAction<TNotes[]>>
  saveNote: (note: TNotes) => void
  deleteNote: (id: number) => void
  updateNote: (note: TNotes) => void
}

export type ContextTypeClosestStudent = {
  closestStudentIndex: number
  setClosestStudentIndex: React.Dispatch<React.SetStateAction<number>>
}

export type ContextTypeDateToday = {
  dateToday: string
}

export type TSortingMethods =
  | 'firstName'
  | 'lastName'
  | 'instrument'
  | 'dayOfLesson'
  | 'location'
  | 'duration'

export type TSorting = {
  method: TSortingMethods
  ascending: boolean
}

export type TDropdownButton = {
  label: string
  handler: (arg0?: number | string) => void
  type: 'normal' | 'warning'
}

export type TTimetableDay = {
  day: string
  location: string
  students: TStudent[]
}

export type TTodo = {
  id: number
  text: string
  due?: string
  studentId?: number
  completed: boolean
  userId: string
}
