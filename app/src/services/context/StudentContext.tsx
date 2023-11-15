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
} from '../api/students.api'
import { ContextTypeStudents, TStudent } from '../../types/types'

import { fetchLatestLessonsPerStudentSupabase } from '../api/lessons.api'
import { fetchNotesByStudent } from '../api/notes.api'
import { sortStudentsDateTime } from '../../utils/sortStudents'
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
  const mode = import.meta.env.VITE_MODE

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
      if (mode === 'demo') {
        setStudents(newStudents)
        return
      }
      try {
        await resetStudentSupabase(studentIds)
        setStudents(newStudents)
      } catch (error) {
        throw new Error(error.message)
      }
    },
    [students, mode],
  )

  const saveNewStudents = useCallback(
    async (newStudents: TStudent[]) => {
      setIsPending(true)
      if (mode === 'demo') {
        const studentsWithIds = newStudents.map((student, index) => ({
          ...student,
          id: students.length + 1 + index,
        }))
        setStudents((prev) => [...prev, ...studentsWithIds])
        setIsPending(false)
        return
      }
      try {
        const data = await createNewStudentSupabase(newStudents, user.id)
        setStudents((prev) => [...prev, ...data])
      } catch (error) {
        throw new Error(error.message)
      } finally {
        setIsPending(false)
      }
    },
    [user?.id, mode, students.length],
  )

  const deactivateStudents = useCallback(
    async (studentIds: number[]) => {
      const newStudents = students.map((student) =>
        studentIds.includes(student.id)
          ? { ...student, archive: true }
          : student,
      )
      if (mode === 'demo') {
        setStudents(newStudents)
        return
      }
      try {
        await deactivateStudentsupabase(studentIds)
        setStudents(newStudents)
      } catch (error) {
        throw new Error(error.message)
      }
    },
    [students, mode],
  )

  const reactivateStudents = useCallback(
    async (studentIds: number[]) => {
      const newStudents = students.map((student) =>
        studentIds.includes(student.id)
          ? { ...student, archive: false }
          : student,
      )
      if (mode === 'demo') {
        setStudents(newStudents)
        return
      }
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
    [setLessons, students, setNotes, mode],
  )

  const deleteStudents = useCallback(
    async (studentIds: number[]) => {
      const newStudents = students.filter(
        (student) => !studentIds.includes(student.id),
      )
      if (mode === 'demo') {
        setStudents(newStudents)
        return
      }
      try {
        await deleteStudentSupabase(studentIds)
        setStudents(newStudents)
      } catch (error) {
        throw new Error(error.message)
      }
    },
    [students, mode],
  )

  const updateStudent = useCallback(
    async (editStudent: TStudent) => {
      if (mode === 'demo') {
        setStudents((prev) =>
          prev.map((student) =>
            student.id === editStudent.id ? editStudent : student,
          ),
        )
        return
      }
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
    },
    [mode],
  )

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
