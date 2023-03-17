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

export const postNewStudent = async function (
  student: TStudent,
  userId: string
): Promise<TStudent[]> {
  const {
    firstName,
    lastName,
    instrument,
    durationMinutes,
    startOfLesson,
    endOfLesson,
    dayOfLesson,
    archive,
    location,
  } = student

  const { data, error } = await supabase
    .from('students')
    .insert([
      {
        firstName,
        lastName,
        instrument,
        durationMinutes,
        startOfLesson,
        endOfLesson,
        dayOfLesson,
        archive,
        location,
        user_id: userId,
      },
    ])
    .select()
  error && console.log(error)
  return data
}

export const postArchiveStudent = async function (studentId: number) {
  const { data, error } = await supabase
    .from('students')
    .update({ archive: true })
    .eq('id', studentId)
}

export const postRestoreStudent = async function (studentId: number) {
  const { data, error } = await supabase
    .from('students')
    .update({ archive: false })
    .eq('id', studentId)
}

export const postDeleteStudents = async function (studentId: number) {
  const { data: data1, error: error1 } = await supabase
    .from('lessons')
    .delete()
    .eq('studentId', studentId)

  const { data: data2, error: error2 } = await supabase
    .from('notes')
    .delete()
    .eq('studentId', studentId)

  const { data, error } = await supabase
    .from('students')
    .delete()
    .eq('id', studentId)
  error && console.log(error)
}

export const postUpdateStudent = async function (
  studentId: number,
  row: string,
  newValue: string | number
) {
  const { data, error } = await supabase
    .from('students')
    .update({ [row]: newValue })
    .eq('id', studentId)
}
