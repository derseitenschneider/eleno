import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  createNewStudentSupabase,
  deactivateStudentsupabase,
  deleteStudentSupabase,
  reactivateStudentSupabase,
  resetStudentSupabase,
  updateStudentSupabase,
} from '../services/students.api'
import { ContextTypeStudents, TStudent } from '../types/types'

import { fetchLatestLessonsPerStudentSupabase } from '../services/lessons.api'
import { fetchNotesByStudent } from '../services/notes.api'
import { sortStudentsDateTime } from '../utils/sortStudents'
import { useLessons } from './LessonsContext'
import { useNotes } from './NotesContext'
import { useUser } from './UserContext'

export const StudentsContext = createContext<ContextTypeStudents>({
  students: [],
  setStudents: () => {},
  currentStudentIndex: 0,
  setCurrentStudentIndex: () => {},
  currentStudentId: 0,
  isPending: false,
  setIsPending: () => {},
  activeStudents: [],
  activeSortedStudentIds: [],
  inactiveStudents: [],
  resetLessonData: () => new Promise(() => {}),
  saveNewStudents: () => new Promise(() => {}),
  deactivateStudents: () => new Promise(() => {}),
  reactivateStudents: () => new Promise(() => {}),
  deleteStudents: () => new Promise(() => {}),
  updateStudent: () => new Promise(() => {}),
})

export function StudentsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const [students, setStudents] = useState([])
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0)
  const { setLessons } = useLessons()
  const { setNotes } = useNotes()

  const [isPending, setIsPending] = useState(false)

  const activeStudents = students.filter((student) => !student.archive)
  const inactiveStudents = students.filter((student) => student.archive)

  const activeSortedStudentIds: number[] = sortStudentsDateTime(
    students.filter((student) => !student.archive),
  ).map((student) => student.id)

  const currentStudentId = activeSortedStudentIds[currentStudentIndex]

  const resetLessonData = useCallback(
    async (studentIds: number[]) => {
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
          : student,
      )
      try {
        await resetStudentSupabase(studentIds)
        setStudents(newStudents)
      } catch (error) {
        throw new Error(error.message)
      }
    },
    [students],
  )

  const saveNewStudents = useCallback(
    async (newStudents: TStudent[]) => {
      setIsPending(true)
      try {
        const data = await createNewStudentSupabase(newStudents, user.id)
        setStudents((prev) => [...prev, ...data])
      } catch (error) {
        throw new Error(error.message)
      } finally {
        setIsPending(false)
      }
    },
    [user?.id],
  )

  const deactivateStudents = useCallback(
    async (studentIds: number[]) => {
      const newStudents = students.map((student) =>
        studentIds.includes(student.id)
          ? { ...student, archive: true }
          : student,
      )
      try {
        await deactivateStudentsupabase(studentIds)
        setStudents(newStudents)
      } catch (error) {
        throw new Error(error.message)
      }
    },
    [students],
  )

  const reactivateStudents = useCallback(
    async (studentIds: number[]) => {
      const newStudents = students.map((student) =>
        studentIds.includes(student.id)
          ? { ...student, archive: false }
          : student,
      )
      try {
        await reactivateStudentSupabase(studentIds)
        setStudents(newStudents)

        // Fetch latest lessons from reactivated student
        const reactivatedLessons =
          await fetchLatestLessonsPerStudentSupabase(studentIds)
        setLessons((prev) => [...prev, ...reactivatedLessons])

        // Fetch notes from reactivated student
        const reactivatedNotes = await fetchNotesByStudent(studentIds)
        setNotes((prev) => [...prev, ...reactivatedNotes])
      } catch (error) {
        throw new Error(error.message)
      }
    },
    [setLessons, students, setNotes],
  )

  const deleteStudents = useCallback(
    async (studentIds: number[]) => {
      const newStudents = students.filter(
        (student) => !studentIds.includes(student.id),
      )
      try {
        await deleteStudentSupabase(studentIds)
        setStudents(newStudents)
      } catch (error) {
        throw new Error(error.message)
      }
    },
    [students],
  )

  const updateStudent = useCallback(async (editStudent: TStudent) => {
    try {
      await updateStudentSupabase(editStudent)
      setStudents((prev) =>
        prev.map((student) =>
          student.id === editStudent.id ? editStudent : student,
        ),
      )
    } catch (error) {
      throw new Error(error.message)
    }
  }, [])

  const value = useMemo(
    () => ({
      students,
      setStudents,
      currentStudentIndex,
      setCurrentStudentIndex,
      currentStudentId,
      isPending,
      setIsPending,
      activeStudents,
      inactiveStudents,
      activeSortedStudentIds,
      resetLessonData,
      saveNewStudents,
      deactivateStudents,
      reactivateStudents,
      deleteStudents,
      updateStudent,
    }),
    [
      students,
      setStudents,
      currentStudentIndex,
      setCurrentStudentIndex,
      currentStudentId,
      isPending,
      setIsPending,
      activeStudents,
      inactiveStudents,
      activeSortedStudentIds,
      resetLessonData,
      saveNewStudents,
      deactivateStudents,
      reactivateStudents,
      deleteStudents,
      updateStudent,
    ],
  )

  return (
    <StudentsContext.Provider value={value}>
      {children}
    </StudentsContext.Provider>
  )
}

export const useStudents = () => useContext(StudentsContext)
