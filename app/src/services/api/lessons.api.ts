import type { Lesson } from "../../types/types"
import supabase from "./supabase"

export const fetchAllLessonsPerStudent = async (studentId: number) => {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("studentId", studentId)
    .order("date", { ascending: false })

  if (error) throw new Error(error.message)
  const lessons = data.map((lesson) => ({
    ...lesson,
    date: new Date(lesson.date || ""),
  }))
  return lessons
}

export const fetchAllLessonsCSV = async (
  studentId: number,
): Promise<string> => {
  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("date, lessonContent, homework")
    .eq("studentId", studentId)
    .order("date", { ascending: false })
    .csv()

  if (error) throw new Error(error.message)
  return lessons
}

export const fetchLessonsByRange = async (
  startDate: Date,
  endDate: Date,
  studentId: number,
) => {
  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("studentId", studentId)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false })

  if (error) throw new Error(error.message)
  return lessons
}

export const fetchLessonsCSVByRange = async (
  startDate: Date,
  endDate: Date,
  studentId: number,
) => {
  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("date, lessonContent, homework")
    .eq("studentId", studentId)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false })
    .csv()

  if (error) throw new Error(error.message)
  return lessons
}

export const saveNewLesson = async (
  lesson: Lesson,
  userId: string,
): Promise<Lesson | undefined> => {
  const { date, homework, lessonContent, studentId } = lesson
  const utcDate = new Date(`${date.toDateString()} UTC`)

  const { data, error } = await supabase
    .from("lessons")
    .insert([
      {
        date: utcDate.toISOString(),
        homework,
        lessonContent,
        studentId,
        user_id: userId,
      },
    ])
    .select()

  if (error) throw new Error(error.message)
  const newLesson = data[0]
  if (newLesson) return { ...newLesson, date: new Date(newLesson.date || "") }
  return undefined
}

export const deleteLesson = async (lessonId: number) => {
  const { data, error } = await supabase
    .from("lessons")
    .delete()
    .eq("id", lessonId)
    .select("id")
    .single()

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const editLesson = async (lesson: Lesson): Promise<Lesson> => {
  const utcDate = new Date(`${lesson.date?.toDateString()} UTC`)
  const { data, error } = await supabase
    .from("lessons")
    .update({ ...lesson, date: utcDate.toISOString() })
    .eq("id", lesson.id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return { ...data, date: new Date(data.date || "") }
}

export const fetchLatestLessons = async () => {
  const { data: lessons, error } = await supabase
    .from("last_3_lessons")
    .select()
  if (error) throw new Error(error.message)

  return lessons.map((lesson) => ({
    ...lesson,
    date: new Date(lesson.date || ""),
  }))
}

export const fetchLatestLessonsPerStudent = async (studentIds: number[]) => {
  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("*")
    .in("studentId", [...studentIds])
    .order("date", { ascending: false })
    .limit(3)

  if (error) throw new Error(error.message)
  return lessons.reverse()
}

export const fetchLessonYears = async () => {
  const { data: years, error } = await supabase
    .from("available_years")
    .select("*")
  if (error) throw new Error(error.message)
  return years
}
