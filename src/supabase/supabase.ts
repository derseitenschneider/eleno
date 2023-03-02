import { createClient } from '@supabase/supabase-js'
import { TLesson, TStudent } from '../types/types'

const supabaseUrl = 'https://brhpqxeowknyhrimssxw.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyaHBxeGVvd2tueWhyaW1zc3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzY0MDgwMzUsImV4cCI6MTk5MTk4NDAzNX0.hIvCoJwGTLAZTXVhvYi8OCbbXT_EoUKFMF-j_ik-5Vk'
const supabase = createClient(supabaseUrl, supabaseKey)

// Students
export const fetchStudents = async function () {
  let { data: students, error } = await supabase
    .from('students')
    .select('*')
    .order('dayOfLesson', { ascending: false })
  return students
}

export const postNewStudent = async function (
  student: TStudent
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
      },
    ])
    .select()
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
  const { data, error } = await supabase
    .from('students')
    .delete()
    .eq('id', studentId)
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

// Lessons
export const fetchLessons = async function () {
  let { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')
    .order('date')
  return lessons
}

export const postLesson = async function (lesson: TLesson) {
  const { date, homework, lessonContent, studentId } = lesson
  let { data, error } = await supabase
    .from('lessons')
    .insert([{ date, homework, lessonContent, studentId }])
    .select()
  return data
}
