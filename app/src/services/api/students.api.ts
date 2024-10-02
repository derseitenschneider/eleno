import supabase from './supabase'
import type { Student, StudentPartial } from '../../types/types'
import { isDemoMode } from '../../config'
import mockStudents from './mock-db/mockStudents'
import type { GroupSchema } from '@/components/features/groups/CreateGroup.component'

export const fetchStudentsApi = async (userId: string) => {
  if (isDemoMode) return mockStudents
  const { data: students, error } = await supabase
    .from('students')
    .select('*')
    .eq('user_id', userId)
    .order('lastName', { ascending: true })
  if (error) throw new Error(error.message)
  return students
}

export const createStudentsApi = async (
  newStudents: StudentPartial[],
): Promise<Student[]> => {
  if (isDemoMode) {
    const students: Array<Student> = newStudents.map(
      (student) =>
        ({
          ...student,
          created_at: new Date().toString(),
          id: Math.random() * 1_000_000,
        }) as Student,
    )
    mockStudents.push(...students)
    return students
  }
  const { data, error } = await supabase
    .from('students')
    .insert(newStudents)
    .select()
  if (error) throw new Error(error.message)
  return data
}

export const deactivateStudentApi = async (studentIds: number[]) => {
  if (isDemoMode) {
    for (const studentId of studentIds) {
      const index = mockStudents.findIndex(
        (student) => student.id === studentId,
      )
      if (mockStudents[index]) {
        mockStudents[index] = {
          ...mockStudents[index],
          archive: true,
        }
      }
    }
    return
  }
  const { error } = await supabase
    .from('students')
    .update({ archive: true })
    .in('id', studentIds)

  if (error) throw new Error(error.message)
}

export const reactivateStudentsApi = async (studentIds: number[]) => {
  if (isDemoMode) {
    for (const studentId of studentIds) {
      const index = mockStudents.findIndex((s) => s.id === studentId)
      if (index !== -1 && mockStudents[index]) {
        mockStudents[index] = { ...mockStudents[index], archive: false }
      }
    }
    return
  }
  const { error } = await supabase
    .from('students')
    .update({ archive: false })
    .in('id', studentIds)

  if (error) throw new Error(error.message)
}

export const deletestudentsApi = async (studentIds: number[]) => {
  if (isDemoMode) {
    for (const studentId of studentIds) {
      const index = mockStudents.findIndex((st) => st.id === studentId)
      mockStudents.splice(index, 1)
    }

    return
  }
  const { error } = await supabase
    .from('students')
    .delete()
    .in('id', studentIds)

  if (error) throw new Error(error.message)
}

export const updateStudentsApi = async (students: Array<Student>) => {
  if (isDemoMode) {
    for (const student of students) {
      const index = mockStudents.findIndex((s) => s.id === student.id)
      if (index !== -1) {
        mockStudents[index] = student
      }
    }
    return students
  }
  const { data: updatedStudents, error } = await supabase
    .from('students')
    .upsert(students)
    .select()

  if (error) throw new Error(error.message)

  return updatedStudents
}

export const resetStudentsApi = async (studentIds: number[]) => {
  if (isDemoMode) {
    for (const studentId of studentIds) {
      const index = mockStudents.findIndex(
        (student) => student.id === studentId,
      )
      if (mockStudents[index]) {
        mockStudents[index] = {
          ...mockStudents[index],
          dayOfLesson: null,
          startOfLesson: null,
          endOfLesson: null,
          durationMinutes: null,
          location: null,
        }
      }
    }
    return
  }
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

export const convertStudentToGroupApi = async (
  student: Student,
  groupData: GroupSchema,
) => {
  if (isDemoMode) return
  // Start a Supabase transaction
  const { data, error } = await supabase.rpc('convert_student_to_group', {
    p_student_id: student.id,
    p_group_data: {
      ...groupData,
      students: groupData.students?.filter((s) => s.name) || null,
    },
  })

  if (error) throw new Error(error.message)
  return data
}
