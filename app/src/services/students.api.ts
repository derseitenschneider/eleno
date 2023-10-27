import { TStudent } from '../types/types'
import supabase from './supabase'

export const fetchStudents = async (userId) => {
  const { data: students, error } = await supabase
    .from('students')
    .select('*')
    .eq('user_id', userId)
    .order('dayOfLesson', { ascending: false })
  if (error) throw new Error(error.message)
  return students
}

export const createNewStudentSupabase = async (
  students: TStudent[],
  userId: string,
): Promise<TStudent[]> => {
  const newStudents = students.map((student) => {
    return { ...student, user_id: userId }
  })

  const { data, error } = await supabase
    .from('students')
    .insert(newStudents)
    .select()
  if (error) throw new Error(error.message)
  return data
}

export const deactivateStudentsupabase = async (studentId: number[]) => {
  const { error } = await supabase
    .from('students')
    .update({ archive: true })
    .in('id', studentId)

  if (error) throw new Error(error.message)
}

export const reactivateStudentSupabase = async (studentIds: number[]) => {
  const { error } = await supabase
    .from('students')
    .update({ archive: false })
    .in('id', studentIds)

  if (error) throw new Error(error.message)
}

export const deleteStudentSupabase = async (studentIds: number[]) => {
  const { error } = await supabase
    .from('students')
    .delete()
    .in('id', studentIds)

  if (error) throw new Error(error.message)
}

export const updateStudentSupabase = async (student: TStudent) => {
  const { error } = await supabase
    .from('students')
    .update({ ...student })
    .eq('id', student.id)

  if (error) throw new Error(error.message)
}

export const resetStudentSupabase = async (studentIds: number[]) => {
  const { error } = await supabase
    .from('students')
    .update({
      dayOfLesson: '',
      startOfLesson: '',
      endOfLesson: '',
      durationMinutes: 0,
      location: '',
    })
    .in('id', studentIds)

  if (error) throw new Error(error.message)
}
