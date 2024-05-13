import type React from "react"

export type Weekday =
  | "Montag"
  | "Dienstag"
  | "Mittwoch"
  | "Donnerstag"
  | "Freitag"
  | "Samstag"
  | "Sonntag"

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
}

export type Profile = {
  firstName: string
  lastName: string
}

export type Student = {
  id: number
  user_id: string
  firstName: string
  lastName: string
  archive: boolean
  instrument: string
  durationMinutes: number | null
  dayOfLesson: Weekday | null
  startOfLesson: string | null
  endOfLesson: string | null
  location: string | null
}

export type Lesson = {
  id?: number
  date: string
  lessonContent?: string
  homework: string
  studentId: number
  homeworkKey?: string
}

export type Draft = {
  lessonContent?: string
  homework?: string
  date?: string
  studentId: number
}

export type NotesBackgrounds = "red" | "blue" | "yellow" | "green"

export type Note = {
  id?: number
  studentId: number
  title?: string
  text?: string
  order: number
  user_id: string
  backgroundColor: NotesBackgrounds
}

// CONTEXT TYPES
export type ContextTypeUser = {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User>>

  updateProfile: (data: Profile) => Promise<void>
  updateEmail: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  deleteAccount: () => Promise<void>
  logout: () => Promise<void>
  recoverPassword: (email: string) => Promise<void>
}

export type ContextTypeTodos = {
  todos: Todo[] | null
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  overdueTodos: Todo[] | null
  saveTodo: (newTodo: Todo) => Promise<void>
  deleteTodo: (id: number) => Promise<void>
  completeTodo: (id: number) => Promise<void>
  reactivateTodo: (id: number) => Promise<void>
  deleteAllCompleted: () => Promise<void>
  updateTodo: (editedTodo: Todo) => Promise<void>
}

export type ContextTypeStudents = {
  students: Student[] | null
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>
  currentStudentIndex: number
  setCurrentStudentIndex: React.Dispatch<React.SetStateAction<number>>
  currentStudentId: number
  isPending: boolean
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>
  activeStudents: Student[] | null
  inactiveStudents: Student[] | null
  activeSortedStudentIds: number[]
  resetLessonData: (ids: number[]) => Promise<void>
  saveNewStudents: (students: Student[]) => Promise<void>
  deactivateStudents: (ids: number | number[]) => Promise<void>
  reactivateStudents: (ids: number | number[]) => Promise<void>
  deleteStudents: (ids: number | number[]) => Promise<void>
  updateStudents: (student: Student[]) => Promise<void>
}

export type ContextTypeLessons = {
  lessons: Lesson[] | null
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>

  drafts: Draft[]
  setDrafts: React.Dispatch<React.SetStateAction<Draft[]>>

  saveNewLesson: (lesson: Lesson) => Promise<void>
  deleteLesson: (id: number) => Promise<void>
  updateLesson: (lesson: Lesson) => Promise<void>
  getAllLessons: (studentId: number) => Promise<Lesson[]>
}

export type ContextTypeLoading = {
  isLoading: boolean | null
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export type ContextTypeNotes = {
  notes: Note[] | null
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>
  saveNote: (note: Note) => Promise<void>
  deleteNote: (id: number) => Promise<void>
  updateNotes: (notes: Note[]) => Promise<void>
  duplicateNote: (original: Note) => Promise<void>
}

export type ContextTypeClosestStudent = {
  nearestStudentIndex: number
  setNearestStudentIndex: React.Dispatch<React.SetStateAction<number>>
}

export type ContextTypeDateToday = {
  dateToday: string
}

export type SortingMethods =
  | "firstName"
  | "lastName"
  | "instrument"
  | "dayOfLesson"
  | "location"
  | "duration"

export type Sorting = {
  sort: string
  ascending: string
}

export type DropdownSearchButton = {
  label: string
  handler: () => void
  type: "normal" | "warning"
}

export type TimetableDay = {
  day: string
  students: Student[]
}

export type Todo = {
  id?: number
  text: string
  due?: string
  studentId?: number
  completed: boolean
  userId: string
}

export type News = {
  date: string
  title: string
  text: string
}

export type ModalsActiveStudents = "add-student" | "reset"

export type RepertoireItem = {
  id?: number
  title: string
  startDate?: string
  endDate?: string
  studentId: number
  user_id?: string
}

export type ContextTypeRepertoire = {
  repertoire: RepertoireItem[]
  isLoading: boolean
  getRepertoire: (studentId: number) => Promise<RepertoireItem[]>
  addRepertoireItem: (item: RepertoireItem) => Promise<void>
  updateRepertoireItem: (item: RepertoireItem) => Promise<void>
  deleteRepertoireItem: (id: number) => Promise<void>
}
