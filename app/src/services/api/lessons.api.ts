import type { Lesson, LessonPartial } from "../../types/types"
import supabase from "./supabase"

export const fetchLessonsByYearApi = async (
  studentId: number,
  lessonYear: number,
) => {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("studentId", studentId)
    .gte("date", `${lessonYear}-01-01`)
    .lt("date", `${lessonYear + 1}-01-01`)
    .order("date", { ascending: false })

  if (error) throw new Error(error.message)
  const lessons = data.map((lesson) => ({
    ...lesson,
    date: new Date(lesson.date || ""),
  }))
  return lessons
}

export const fetchAllLessonsCSVApi = async (
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

export const fetchAllLessonsApi = async (studentId: number) => {
  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("date, lessonContent, homework, id")
    .eq("studentId", studentId)
    .order("date", { ascending: false })

  if (error) throw new Error(error.message)
  return lessons.map((lesson) => ({ ...lesson, date: new Date(lesson.date) }))
}

export const fetchLessonsByRangeApi = async (
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

export const fetchLessonsCSVByRangeApi = async (
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

export const createLessonAPI = async (
  lesson: LessonPartial,
): Promise<Lesson | undefined> => {
  const { date } = lesson
  const utcDate = new Date(`${date.toDateString()} UTC`)

  const { data, error } = await supabase
    .from("lessons")
    .insert([
      {
        ...lesson,
        date: utcDate.toISOString(),
      },
    ])
    .select()

  if (error) throw new Error(error.message)
  const newLesson = data[0]
  if (newLesson) return { ...newLesson, date: new Date(newLesson.date || "") }
  return undefined
}

export const deleteLessonAPI = async (lessonId: number) => {
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

export const updateLessonAPI = async (lesson: Lesson): Promise<Lesson> => {
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

// TODO: fetchLatestLessonsPerStudent to invalidate query after deletion
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

export const fetchLessonYears = async (studentId: number) => {
  const { data: years, error } = await supabase
    .from("lesson_years")
    .select("*")
    .eq("studentId", studentId)
    .single()
  if (error) throw new Error(error.message)
  return years
}
