import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import {
  createNewStudentSupabase,
  deactivateStudentsupabase,
  deleteStudentSupabase,
  reactivateStudentSupabase,
  resetStudentSupabase,
  updateStudentsSupabase,
} from "../api/students.api"
import type { ContextTypeStudents, Student } from "../../types/types"

import { fetchLatestLessonsPerStudentSupabase } from "../api/lessons.api"
import { fetchNotesByStudent } from "../api/notes.api"
import { sortStudentsDateTime } from "../../utils/sortStudents"
import { useLessons } from "./LessonsContext"
import { useNotes } from "./NotesContext"
import { useUser } from "./UserContext"

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
  updateStudents: () => new Promise(() => {}),
})

export function StudentsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const [students, setStudents] = useState<Array<Student>>([])
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0)

  const { setLessons } = useLessons()
  const { setNotes } = useNotes()
  const [isPending, setIsPending] = useState(false)
  const _MODE = import.meta.env.VITE_MODE

  const activeStudents = students.filter((student) => !student.archive)
  const inactiveStudents = students.filter((student) => student.archive)

  const activeSortedStudentIds: number[] = sortStudentsDateTime(
    students.filter((student) => !student.archive),
  ).map((student) => student.id || 0)

  const currentStudentId = activeSortedStudentIds[currentStudentIndex]

  const resetLessonData = useCallback(
    async (studentIds: number[]) => {
      const newStudents: Array<Student> = students.map((student) => {
        if (!student.id || !studentIds.includes(student.id)) return student
        return {
          ...student,
          dayOfLesson: null,
          startOfLesson: null,
          endOfLesson: null,
          durationMinutes: null,
          location: null,
        }
      })
      if (_MODE === "demo") {
        setStudents(newStudents)
        return
      }
      try {
        await resetStudentSupabase(studentIds)
        setStudents(newStudents)
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message)
        throw new Error("Unknown error in resetLessonData function.")
      }
    },
    [students],
  )

  const saveNewStudents = useCallback(
    async (newStudents: Student[]) => {
      setIsPending(true)
      if (_MODE === "demo") {
        const studentsWithIds = newStudents.map((student, index) => ({
          ...student,
          id: students.length + 1 + index,
        }))
        setStudents((prev) => [...prev, ...studentsWithIds])
        setIsPending(false)
        return
      }
      try {
        const data = await createNewStudentSupabase(newStudents, user?.id || "")
        setStudents((prev) => [...prev, ...data])
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message)
        throw new Error("Unknown error in saveNewStudents function.")
      } finally {
        setIsPending(false)
      }
    },
    [user?.id, students.length],
  )

  const deactivateStudents = useCallback(
    async (studentIds: number[]) => {
      const newStudents = students.map((student) =>
        studentIds.includes(student.id)
          ? { ...student, archive: true }
          : student,
      )
      if (_MODE === "demo") {
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
    [students],
  )

  const reactivateStudents = useCallback(
    async (studentIds: number[]) => {
      const newStudents = students.map((student) =>
        studentIds.includes(student.id)
          ? { ...student, archive: false }
          : student,
      )
      if (_MODE === "demo") {
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
    [setLessons, students, setNotes, _MODE],
  )

  const deleteStudents = useCallback(
    async (studentIds: number[]) => {
      const newStudents = students.filter(
        (student) => !studentIds.includes(student.id),
      )
      if (_MODE === "demo") {
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
    [students, _MODE],
  )

  const updateStudents = useCallback(
    async (editStudents: Student[]) => {
      if (_MODE === "demo") {
        setStudents((prev) =>
          prev.map(
            (student) =>
              // student.id === editStudent.id ? editStudent : student,
              editStudents.find((stud) => stud.id === student.id) || student,
          ),
        )
        return
      }
      try {
        await updateStudentsSupabase(editStudents)
        setStudents((prev) =>
          prev.map(
            (student) =>
              // student.id === editStudent.id ? editStudent : student,
              editStudents.find((stud) => stud.id === student.id) || student,
          ),
        )
      } catch (error) {
        throw new Error(error.message)
      }
    },
    [_MODE],
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
      updateStudents,
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
      updateStudents,
    ],
  )

  return (
    <StudentsContext.Provider value={value}>
      {children}
    </StudentsContext.Provider>
  )
}

export const useStudents = () => useContext(StudentsContext)
