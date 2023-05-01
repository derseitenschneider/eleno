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

export const StudentsContext = createContext<ContextTypeStudents>({
  students: [],
  setStudents: () => {},
  isPending: false,
  setIsPending: () => {},
  activeStudents: [],
  archivedStudents: [],
  resetLessonData: () => {},
  saveNewStudents: () => {},
  archivateStudents: () => {},
  reactivateStudents: () => {},
  deleteStudents: () => {},
  updateStudent: () => {},
})

export const StudentsProvider = ({ children }) => {
  const { user } = useUser()
  const [students, setStudents] = useState([])

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
      console.log(error)
    }
  }

  const saveNewStudents = async (students: TStudent[]) => {
    setIsPending(true)
    const data = await createNewStudentSupabase(students, user.id)
    setStudents((prev) => [...prev, ...data])
    setIsPending(false)
    // handlerClose()
    toast('Schüler:in erstellt')
  }

  const archivateStudents = async (studentIds: number[]) => {
    const newStudents = students.map((student) =>
      studentIds.includes(student.id) ? { ...student, archive: true } : student
    )
    setStudents(newStudents)
    try {
      await archivateStudentSupabase(studentIds)
      toast(`Schüler:in${studentIds.length > 1 ? 'nen' : ''} archiviert`)
    } catch (err) {
      console.log(err)
    }
  }

  // [ ] fetch lessons and notes when student is reactivated
  const reactivateStudents = async (studentIds: number[]) => {
    const newStudents = students.map((student) =>
      studentIds.includes(student.id) ? { ...student, archive: false } : student
    )
    setStudents(newStudents)
    try {
      await reactivateStudentSupabase(studentIds)
      toast(`Schüler:in${studentIds.length > 1 ? 'nen' : ''} wiederhergestellt`)
    } catch (err) {
      console.log(err)
    }
  }

  const deleteStudents = async (studentIds: number[]) => {
    const newStudents = students.filter(
      (student) => !studentIds.includes(student.id)
    )
    console.log(studentIds)
    setStudents(newStudents)
    try {
      await deleteStudentSupabase(studentIds)
      toast(`Schüler:in${studentIds.length > 1 ? 'nen' : ''} gelöscht`)
    } catch (err) {
      console.log(err)
    }
  }

  const updateStudent = async (editStudent: TStudent) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === editStudent.id ? editStudent : student
      )
    )
    try {
      await updateStudentSupabase(editStudent)
      toast('Änderungen gespeichert')
    } catch (err) {
      console.log({ err })
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
