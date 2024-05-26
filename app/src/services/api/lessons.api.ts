import type { Lesson } from "../../types/types"
import supabase from "./supabase"

export const fetchAllLessonsSupabase = async (
  studentId: number,
): Promise<Lesson[]> => {
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

export const fetchAllLessonsCSVSupabase = async (
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

export const fetchLessonsByDateRangeSupabase = async (
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

export const fetchLessonsCSVByDateRangeSupabase = async (
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

export const saveNewLessonSupabase = async (
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

export const deleteLessonSupabase = async (lessonId: number) => {
  const { error } = await supabase.from("lessons").delete().eq("id", lessonId)

  if (error) {
    throw new Error(error.message)
  }
}

export const updateLessonSupabase = async (lesson: Lesson): Promise<Lesson> => {
  const { data, error } = await supabase
    .from("lessons")
    .update({ ...lesson })
    .eq("id", lesson.id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const fetchLatestLessonsSupabase = async () => {
  const { data: lessons, error } = await supabase
    .from("last_3_lessons")
    .select()
  if (error) throw new Error(error.message)

  return lessons.map((lesson) => ({
    ...lesson,
    date: new Date(lesson.date || ""),
  }))
}

export const fetchLatestLessonsPerStudentSupabase = async (
  studentIds: number[],
) => {
  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("*")
    .in("studentId", [...studentIds])
    .order("date", { ascending: false })
    .limit(3)

  if (error) throw new Error(error.message)
  return lessons.reverse()
}

export const fetchLessonYearsSupabase = async () => {
  const { data: years, error } = await supabase
    .from("available_years")
    .select("*")
  if (error) console.log(error)
  console.log(years)
}
fetchLessonYearsSupabase()
