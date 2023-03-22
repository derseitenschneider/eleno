import { supabase } from '../supabase'
import { TStudent } from '../../types/types'

export const fetchStudents = async function (userId) {
  let { data: students, error } = await supabase
    .from('students')
    .select('*')
    .eq('user_id', userId)
    .order('dayOfLesson', { ascending: false })
  return students
}

export const createNewStudentSupabase = async function (
  students: TStudent[],
  userId: string
): Promise<TStudent[]> {
  const newStudents = students.map((student) => {
    return { ...student, user_id: userId }
  })

  const { data, error } = await supabase
    .from('students')
    .insert(newStudents)
    .select()
  error && console.log(error)
  return data
}

export const archivateStudentSupabase = async function (studentId: number[]) {
  const { data, error } = await supabase
    .from('students')
    .update({ archive: true })
    .in('id', studentId)

  if (error) throw new Error(error.message)
}

export const reactivateStudentSupabase = async function (studentIds: number[]) {
  const { data, error } = await supabase
    .from('students')
    .update({ archive: false })
    .in('id', studentIds)
}

export const deleteStudentSupabase = async function (studentIds: number[]) {
  const { data: data1, error: error1 } = await supabase
    .from('lessons')
    .delete()
    .in('studentId', studentIds)

  const { data: data2, error: error2 } = await supabase
    .from('notes')
    .delete()
    .in('studentId', studentIds)

  const { data, error } = await supabase
    .from('students')
    .delete()
    .in('id', studentIds)

  if (error) throw new Error(error.message)
  if (error1) throw new Error(error1.message)
  if (error2) throw new Error(error2.message)
}

export const updateStudentSupabase = async function (student: TStudent) {
  const { data, error } = await supabase
    .from('students')
    .update({ ...student })
    .eq('id', student.id)

  if (error) throw new Error(error.message)
}

export const resetStudentSupabase = async (studentIds: number[]) => {
  const { data, error } = await supabase
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
