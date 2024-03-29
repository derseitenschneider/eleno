import { TLesson } from '../../types/types'
import supabase from './supabase'

export const fetchAllLessonsSupabase = async (
  studentId: number,
): Promise<TLesson[]> => {
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('studentId', studentId)
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return lessons
}

export const fetchAllLessonsCSVSupabase = async (
  studentId: number,
): Promise<string> => {
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('date, lessonContent, homework')
    .eq('studentId', studentId)
    .order('date', { ascending: false })
    .csv()

  if (error) throw new Error(error.message)
  return lessons
}

export const fetchLessonsByDateRangeSupabase = async (
  startDate: string,
  endDate: string,
  studentId: number,
) => {
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('studentId', studentId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return lessons
}

export const fetchLessonsCSVByDateRangeSupabase = async (
  startDate: string,
  endDate: string,
  studentId: number,
) => {
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('date, lessonContent, homework')
    .eq('studentId', studentId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false })
    .csv()

  if (error) throw new Error(error.message)
  return lessons
}

export const saveNewLessonSupabase = async (
  lesson: TLesson,
  userId: string,
): Promise<TLesson[]> => {
  const { date, homework, lessonContent, studentId } = lesson

  const { data, error } = await supabase
    .from('lessons')
    .insert([{ date, homework, lessonContent, studentId, user_id: userId }])
    .select()

  if (error) throw new Error(error.message)

  return data
}

export const deleteLessonSupabase = async (lessonId: number) => {
  const { error } = await supabase.from('lessons').delete().eq('id', lessonId)

  if (error) {
    throw new Error(error.message)
  }
}

export const updateLessonSupabase = async (
  lesson: TLesson,
): Promise<TLesson> => {
  const { data, error } = await supabase
    .from('lessons')
    .update({ ...lesson })
    .eq('id', lesson.id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const fetchLatestLessonsSupabase = async () => {
  const { data: lessons, error } = await supabase
    .from('last_3_lessons')
    .select()
  if (error) throw new Error(error.message)

  return lessons
}

export const fetchLatestLessonsPerStudentSupabase = async (
  studentIds: number[],
) => {
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')
    .in('studentId', [...studentIds])
    .order('date', { ascending: false })
    .limit(3)

  if (error) throw new Error(error.message)
  return lessons.reverse()
}
