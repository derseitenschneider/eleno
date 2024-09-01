import supabase from './supabase'
import type { Student, Group } from '@/types/types'

// Function to create a new group from a student
export const createGroupFromStudent = async (student: Student) => {
  const { data, error } = await supabase
    .from('groups')
    .insert({
      name: `${student.firstName} ${student.lastName}`,
      dayOfLesson: student.dayOfLesson,
      startOfLesson: student.startOfLesson,
      endOfLesson: student.endOfLesson,
      location: student.location,
      durationMinutes: student.durationMinutes,
      students: [
        {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
        },
      ],
      user_id: student.user_id,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// Function to update lessons
export const updateLessons = async (studentId: number, groupId: number) => {
  const { error } = await supabase
    .from('lessons')
    .update({ groupId: groupId, studentId: null })
    .eq('studentId', studentId)

  if (error) throw new Error(error.message)
}

// Function to update notes
export const updateNotes = async (studentId: number, groupId: number) => {
  const { error } = await supabase
    .from('notes')
    .update({ groupId: groupId, studentId: null })
    .eq('studentId', studentId)

  if (error) throw new Error(error.message)
}

// Function to update todos
export const updateTodos = async (studentId: number, groupId: number) => {
  const { error } = await supabase
    .from('todos')
    .update({ groupId: groupId, studentId: null })
    .eq('studentId', studentId)

  if (error) throw new Error(error.message)
}

// Function to update repertoire
export const updateRepertoire = async (studentId: number, groupId: number) => {
  const { error } = await supabase
    .from('repertoire')
    .update({ groupId: groupId, studentId: null })
    .eq('studentId', studentId)

  if (error) throw new Error(error.message)
}

// Function to delete the original student record
export const deleteStudent = async (studentId: number) => {
  const { error } = await supabase.from('students').delete().eq('id', studentId)

  if (error) throw new Error(error.message)
}
