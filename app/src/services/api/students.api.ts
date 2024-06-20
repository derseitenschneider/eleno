import supabase from "./supabase"
import type { Student } from "../../types/types"

export const fetchStudentsApi = async () => {
  const { data: students, error } = await supabase
    .from("students")
    .select("*")
    .order("lastName", { ascending: false })
  if (error) throw new Error(error.message)
  return students
}

export const createNewStudentSupabase = async (
  students: Student[],
  userId: string,
): Promise<Student[]> => {
  const newStudents = students.map((student) => {
    return { ...student, user_id: userId }
  })

  const { data, error } = await supabase
    .from("students")
    .insert(newStudents)
    .select()
  if (error) throw new Error(error.message)
  return data
}

export const deactivateStudentApi = async (studentIds: number[]) => {
  const { error } = await supabase
    .from("students")
    .update({ archive: true })
    .in("id", studentIds)

  if (error) throw new Error(error.message)
}

export const reactivateStudentSupabase = async (studentIds: number[]) => {
  const { error } = await supabase
    .from("students")
    .update({ archive: false })
    .in("id", studentIds)

  if (error) throw new Error(error.message)
}

export const deleteStudentSupabase = async (studentIds: number[]) => {
  const { error } = await supabase
    .from("students")
    .delete()
    .in("id", studentIds)

  if (error) throw new Error(error.message)
}

export const updateStudentsApi = async (students: Array<Student>) => {
  const { data: updatedStudents, error } = await supabase
    .from("students")
    .upsert(students)
    .select()

  if (error) throw new Error(error.message)

  return updatedStudents
}

export const resetStudentSupabase = async (studentIds: number[]) => {
  const { error } = await supabase
    .from("students")
    .update({
      dayOfLesson: null,
      startOfLesson: null,
      endOfLesson: null,
      durationMinutes: null,
      location: null,
    })
    .in("id", studentIds)

  if (error) throw new Error(error.message)
}
