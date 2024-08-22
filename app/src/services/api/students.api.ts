import supabase from './supabase'
import type { Student, StudentPartial } from '../../types/types'
import { isDemoMode } from '../../../config'
import mockStudents from './mock-db/mockStudents'

export const fetchStudentsApi = async () => {
  if (isDemoMode) return mockStudents
  const { data: students, error } = await supabase
    .from('students')
    .select('*')
    .order('lastName', { ascending: true })
  if (error) throw new Error(error.message)
  return students
}

export const createStudentsApi = async (
  newStudents: StudentPartial[],
): Promise<Student[]> => {
  const { data, error } = await supabase
    .from('students')
    .insert(newStudents)
    .select()
  if (error) throw new Error(error.message)
  return data
}

export const deactivateStudentApi = async (studentIds: number[]) => {
  const { error } = await supabase
    .from('students')
    .update({ archive: true })
    .in('id', studentIds)

  if (error) throw new Error(error.message)
}

export const reactivateStudentsApi = async (studentIds: number[]) => {
  const { error } = await supabase
    .from('students')
    .update({ archive: false })
    .in('id', studentIds)

  if (error) throw new Error(error.message)
}

export const deletestudentsApi = async (studentIds: number[]) => {
  const { error } = await supabase
    .from('students')
    .delete()
    .in('id', studentIds)

  if (error) throw new Error(error.message)
}

export const updateStudentsApi = async (students: Array<Student>) => {
  const { data: updatedStudents, error } = await supabase
    .from('students')
    .upsert(students)
    .select()

  if (error) throw new Error(error.message)

  return updatedStudents
}

export const resetStudentsApi = async (studentIds: number[]) => {
  const { data, error } = await supabase
    .from('students')
    .update({
      dayOfLesson: null,
      startOfLesson: null,
      endOfLesson: null,
      durationMinutes: null,
      location: null,
    })
    .in('id', studentIds)
    .select('id')

  if (error) throw new Error(error.message)
  return data
}
