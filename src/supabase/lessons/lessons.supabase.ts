import { supabase } from '../supabase'
import { TLesson } from '../../types/types'

export const fetchAllLessonsSupabase = async function (
  studentId: number
): Promise<TLesson[]> {
  let { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('studentId', studentId)
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return lessons
}

export const saveNewLessonSupabase = async function (
  lesson: TLesson,
  userId: string
): Promise<TLesson[]> {
  const { date, homework, lessonContent, studentId } = lesson

  const { data, error } = await supabase
    .from('lessons')
    .insert([{ date, homework, lessonContent, studentId, user_id: userId }])
    .select()

  if (error) throw new Error(error.message)
  return data
}

export const deleteLessonSupabase = async (lessonId: number) => {
  const { data, error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', lessonId)

  if (error) {
    throw new Error(error.message)
  }
}

export const updateLessonSupabase = async (lesson: TLesson) => {
  const { error } = await supabase
    .from('lessons')
    .upsert({ ...lesson })
    .eq('id', lesson.id)

  if (error) throw new Error(error.message)
}

export const fetchLatestLessonsSupabase = async () => {
  const { data: lessons, error } = await supabase
    .from('last_3_lessons')
    .select()
  if (error) throw new Error(error.message)
  return lessons
}

export const fetchLatestLessonsPerStudentSupabase = async (
  studentIds: number[]
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
