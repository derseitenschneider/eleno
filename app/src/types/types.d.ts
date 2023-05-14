export type TUser = {
  id: string
  firstName: string
  lastName: string
  email: string
}

export type TProfile = {
  firstName: string
  lastName: string
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
  updateProfile: (data: TProfile) => Promise<void>
  updateEmail: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  deleteAccount: () => Promise<void>
}

export type ContextTypeTodos = {
  todos: TTodo[] | null
  setTodos: React.Dispatch<React.SetStateAction<TTodo[]>>
  saveTodo: (newTodo: TTodo) => Promise<void>
  deleteTodo: (id: number) => Promise<void>
  completeTodo: (id: number) => Promise<void>
  reactivateTodo: (id: number) => Promise<void>
  deleteAllCompleted: () => Promise<void>
  updateTodo: (editedTodo: TTodo) => Promise<void>
}

export type ContextTypeStudents = {
  students: TStudent[] | null
  setStudents: React.Dispatch<React.SetStateAction<TStudent[]>>
  studentIndex: number
  setStudentIndex: React.Dispatch<React.SetStateAction<number>>
  isPending: boolean
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>
  activeStudents: TStudent[] | null
  archivedStudents: TStudent[] | null
  resetLessonData: (ids: number[]) => Promise<void>
  saveNewStudents: (students: TStudent[]) => Promise<void>
  archivateStudents: (ids: number | number[]) => Promise<void>
  reactivateStudents: (ids: number | number[]) => Promise<void>
  deleteStudents: (ids: number | number[]) => voiPromise<void>
  updateStudent: (student: TStudent) => Promise<void>
}

export type ContextTypeLessons = {
  lessons: TLesson[] | null
  setLessons: React.Dispatch<React.SetStateAction<TLesson[]>>

  saveNewLesson: (input: {}, studentId: number, date: string) => Promise<void>
  deleteLesson: (id: number) => Promise<void>
  updateLesson: (lesson: TLesson) => Promise<void>
}

export type ContextTypeLoading = {
  loading: boolean | null
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export type ContextTypeNotes = {
  notes: TNotes[] | null
  setNotes: React.Dispatch<React.SetStateAction<TNotes[]>>
  saveNote: (note: TNotes) => Promise<void>
  deleteNote: (id: number) => Promise<void>
  updateNote: (note: TNotes) => Promise<void>
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
  handler: () => void
  type: 'normal' | 'warning'
}

export type TTimetableDay = {
  day: string
  students: TStudent[]
}

export type TTodo = {
  id?: number
  text: string
  due?: string
  studentId?: number
  completed: boolean
  userId: string
}

export type TDisplayForm = 'login' | 'signup' | 'forgotPassword'
