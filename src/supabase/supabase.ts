import { createClient } from '@supabase/supabase-js'
import { TStudent } from '../types/Students.type'

const supabaseUrl = 'https://brhpqxeowknyhrimssxw.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyaHBxeGVvd2tueWhyaW1zc3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzY0MDgwMzUsImV4cCI6MTk5MTk4NDAzNX0.hIvCoJwGTLAZTXVhvYi8OCbbXT_EoUKFMF-j_ik-5Vk'
const supabase = createClient(supabaseUrl, supabaseKey)

export const fetchStudents = async function () {
  let { data: students, error } = await supabase.from('students').select('*')
  return students
}

export const postNewStudent = async function (student: TStudent) {
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

  const { data, error } = await supabase.from('students').insert([
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
