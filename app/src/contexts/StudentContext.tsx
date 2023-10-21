import { ContextTypeStudents, TStudent } from '../types/types'
import { createContext, useContext, useState } from 'react'
import {
  resetStudentSupabase,
  createNewStudentSupabase,
  deactivateStudentsupabase,
  reactivateStudentSupabase,
  deleteStudentSupabase,
  updateStudentSupabase,
} from '../supabase/students.supabase'

import { useUser } from './UserContext'
import { useLessons } from './LessonsContext'
import { fetchLatestLessonsPerStudentSupabase } from '../supabase/lessons.supabase'
import { useNotes } from './NotesContext'
import { fetchNotesByStudent } from '../supabase/notes.supabase'
import { sortStudentsDateTime } from '../utils/sortStudents'

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

export const StudentsProvider = ({ children }) => {
  const { user } = useUser()
  const [students, setStudents] = useState([])
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0)
  const { setLessons } = useLessons()
  const { setNotes } = useNotes()

  const [isPending, setIsPending] = useState(false)

  const activeStudents = students.filter((student) => !student.archive)
  const inactiveStudents = students.filter((student) => student.archive)

  const activeSortedStudentIds: number[] = sortStudentsDateTime(
    students.filter((student) => !student.archive)
  ).map((student) => student.id)

  const currentStudentId = activeSortedStudentIds[currentStudentIndex]

  const resetLessonData = async (studentIds: number[]) => {
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
    try {
      await resetStudentSupabase(studentIds)
      setStudents(newStudents)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const saveNewStudents = async (students: TStudent[]) => {
    setIsPending(true)
    try {
      const data = await createNewStudentSupabase(students, user.id)
      setStudents((prev) => [...prev, ...data])
    } catch (error) {
      throw new Error(error.message)
    } finally {
      setIsPending(false)
    }
  }

  const deactivateStudents = async (studentIds: number[]) => {
    const newStudents = students.map((student) =>
      studentIds.includes(student.id) ? { ...student, archive: true } : student
    )
    try {
      await deactivateStudentsupabase(studentIds)
      setStudents(newStudents)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const reactivateStudents = async (studentIds: number[]) => {
    const newStudents = students.map((student) =>
      studentIds.includes(student.id) ? { ...student, archive: false } : student
    )
    try {
      await reactivateStudentSupabase(studentIds)
      setStudents(newStudents)

      // Fetch latest lessons from reactivated student
      const reactivatedLessons = await fetchLatestLessonsPerStudentSupabase(
        studentIds
      )
      setLessons((prev) => [...prev, ...reactivatedLessons])

      // Fetch notes from reactivated student
      const reactivatedNotes = await fetchNotesByStudent(studentIds)
      setNotes((prev) => [...prev, ...reactivatedNotes])
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const deleteStudents = async (studentIds: number[]) => {
    const newStudents = students.filter(
      (student) => !studentIds.includes(student.id)
    )
    try {
      await deleteStudentSupabase(studentIds)
      setStudents(newStudents)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const updateStudent = async (editStudent: TStudent) => {
    try {
      await updateStudentSupabase(editStudent)
      setStudents((prev) =>
        prev.map((student) =>
          student.id === editStudent.id ? editStudent : student
        )
      )
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const value = {
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
  }

  return (
    <StudentsContext.Provider value={value}>
      {children}
    </StudentsContext.Provider>
  )
}

export const useStudents = () => useContext(StudentsContext)
