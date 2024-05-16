import supabase from "./supabase"
import type { Student } from "../../types/types"

export const fetchStudents = async (userId: string) => {
  const { data: students, error } = await supabase
    .from("students")
    .select("*")
    .eq("user_id", userId)
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

export const deactivateStudentsupabase = async (studentId: number[]) => {
  const { error } = await supabase
    .from("students")
    .update({ archive: true })
    .in("id", studentId)

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

export const updateStudentsSupabase = async (students: Student[]) => {
  const { error } = await supabase.from("students").upsert(students)

  if (error) throw new Error(error.message)
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
