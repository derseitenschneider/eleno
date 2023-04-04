import { useContext, useState } from 'react'
import { ContextTypeStudents, TStudent } from '../types/types'
import { StudentsContext } from '../contexts/StudentContext'
import {
  archivateStudentSupabase,
  resetStudentSupabase,
  createNewStudentSupabase,
  reactivateStudentSupabase,
  deleteStudentSupabase,
  updateStudentSupabase,
} from '../supabase/students/students.supabase'
import { toast } from 'react-toastify'
import { useUser } from './useUser'

export function useStudents() {
  const { students, setStudents } =
    useContext<ContextTypeStudents>(StudentsContext)
  const { user } = useUser()
  const [isPending, setIsPending] = useState(false)

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

  const archivateStudents = async (...studentIds: number[]) => {
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

  const reactivateStudents = async (...studentIds: number[]) => {
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

  const deleteStudents = async (...studentIds: number[]) => {
    const newStudents = students.filter(
      (student) => !studentIds.includes(student.id)
    )
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

  return {
    students,
    setStudents,
    resetLessonData,
    saveNewStudents,
    archivateStudents,
    reactivateStudents,
    deleteStudents,
    updateStudent,
    isPending,
  }
}
