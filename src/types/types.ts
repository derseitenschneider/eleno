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

export type TSorting =
  | 'firstName'
  | 'lastName'
  | 'instrument'
  | 'dayOfLesson'
  | 'location'
