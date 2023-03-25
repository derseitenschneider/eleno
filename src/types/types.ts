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
}

export type ContextTypeStudents = {
  students: TStudent[] | null
  setStudents: React.Dispatch<React.SetStateAction<TStudent[]>>
}

export type ContextTypeLessons = {
  lessons: TLesson[] | null
  setLessons: React.Dispatch<React.SetStateAction<TLesson[]>>
}

export type ContextTypeLoading = {
  loading: boolean | null
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export type ContextTypeNotes = {
  notes: TNotes[] | null
  setNotes: React.Dispatch<React.SetStateAction<TNotes[]>>
}

export type ContextTypeClosestStudent = {
  closestStudentIndex: number
  setClosestStudentIndex: React.Dispatch<React.SetStateAction<number>>
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
  handler: (e: React.MouseEvent) => void
  type: 'normal' | 'warning'
}

// export type TSelect = {
//   studentId: number
//   selected: boolean
// }

export type TTimetableDay = {
  day: string
  location: string
  students: TStudent[]
}
