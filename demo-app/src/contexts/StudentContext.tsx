import { ContextTypeStudents, TStudent } from '../../../app/src/types/types'
import { createContext, useContext, useState } from 'react'

// import { toast } from 'react-toastify'

// import { useLessons } from './LessonsContext'

// import { useNotes } from './NotesContext'

export const StudentsContext = createContext<ContextTypeStudents>({
  students: [],
  setStudents: () => {},
  studentIndex: 0,
  setStudentIndex: () => {},
  isPending: false,
  setIsPending: () => {},
  activeStudents: [],
  archivedStudents: [],
  resetLessonData: () => new Promise(() => {}),
  saveNewStudents: () => new Promise(() => {}),
  archivateStudents: () => new Promise(() => {}),
  reactivateStudents: () => new Promise(() => {}),
  deleteStudents: () => new Promise(() => {}),
  updateStudent: () => new Promise(() => {}),
})

export const StudentsProvider = ({ children }) => {
  const [students, setStudents] = useState<TStudent[]>([])
  const [studentIndex, setStudentIndex] = useState(0)
  // const { setLessons } = useLessons()
  // const { setNotes } = useNotes()

  const [isPending, setIsPending] = useState(false)

  const activeStudents = students.filter((student) => !student.archive)
  const archivedStudents = students.filter((student) => student.archive)

  const resetLessonData = (studentIds: number[]) => {
    const newStudents = students.map((student) =>
      studentIds.includes(student.id)
        ? {
            ...student,
            dayOfLesson: '',
            startOfLesson: '',
            endOfLesson: '',
            durationMinutes: 0,
            location: '',
          }
        : student
    )
    setStudents(newStudents)
  }

  const saveNewStudents = (newStudents: TStudent[]) => {
    setStudents((students) => [...students, ...newStudents])
  }

  const archivateStudents = (studentIds: number[]) => {
    const newStudents = students.map((student) =>
      studentIds.includes(student.id) ? { ...student, archive: true } : student
    )
    setStudents(newStudents)
  }

  const reactivateStudents = (studentIds: number[]) => {
    const newStudents = students.map((student) =>
      studentIds.includes(student.id) ? { ...student, archive: false } : student
    )
    setStudents(newStudents)
  }

  const deleteStudents = (studentIds: number[]) => {
    const newStudents = students.filter(
      (student) => !studentIds.includes(student.id)
    )
    setStudents(newStudents)
  }

  const updateStudent = (editStudent: TStudent) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === editStudent.id ? editStudent : student
      )
    )
  }

  const value = {
    students,
    setStudents,
    studentIndex,
    setStudentIndex,
    isPending,
    setIsPending,
    activeStudents,
    archivedStudents,
    resetLessonData,
    saveNewStudents,
    archivateStudents,
    reactivateStudents,
    deleteStudents,
    updateStudent,
  }

  return (
    <StudentsContext.Provider value={value}>
      {children}
    </StudentsContext.Provider>
  )
}

export const useStudents = () => useContext(StudentsContext)
