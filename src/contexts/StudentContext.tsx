import { ContextTypeStudents, TStudent } from '../types/types'
import { createContext, useContext, useState } from 'react'
import {
  resetStudentSupabase,
  createNewStudentSupabase,
  archivateStudentSupabase,
  reactivateStudentSupabase,
  deleteStudentSupabase,
  updateStudentSupabase,
} from '../supabase/students/students.supabase'

import { toast } from 'react-toastify'
import { useUser } from './UserContext'
import { useLessons } from './LessonsContext'
import { fetchLatestLessonsPerStudentSupabase } from '../supabase/lessons/lessons.supabase'
import { useNotes } from './NotesContext'
import { fetchNotesByStudent } from '../supabase/notes/notes.supabase'

export const StudentsContext = createContext<ContextTypeStudents>({
  students: [],
  setStudents: () => {},
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
  const { user } = useUser()
  const [students, setStudents] = useState([])
  const { setLessons } = useLessons()
  const { setNotes } = useNotes()

  const [isPending, setIsPending] = useState(false)

  const activeStudents = students.filter((student) => !student.archive)
  const archivedStudents = students.filter((student) => student.archive)

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
      toast('Unterrichtsdaten zurückgesetzt')
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

  const archivateStudents = async (studentIds: number[]) => {
    const newStudents = students.map((student) =>
      studentIds.includes(student.id) ? { ...student, archive: true } : student
    )
    try {
      await archivateStudentSupabase(studentIds)
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
