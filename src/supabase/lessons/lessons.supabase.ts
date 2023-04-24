import { supabase } from '../supabase'
import { TLesson } from '../../types/types'

// [ ] try fetch only lessons from active students
export const fetchAllLessonsSupabase = async function (
  studentId: number
): Promise<TLesson[]> {
  let { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('studentId', studentId)
    .order('date', { ascending: false })

  if (error) throw new Error(`${error}`)
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
  return data
}

export const deleteLessonSupabase = async (lessonId: number) => {
  const { data, error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', lessonId)

  error && console.log(error)
}

export const updateLessonSupabase = async (lesson: TLesson) => {
  const { error } = await supabase
    .from('lessons')
    .update({ ...lesson })
    .eq('id', lesson.id)
}

export const fetchLatestLessonsSupabase = async (userId: string) => {
  const { data: lessons, error } = await supabase
    .from('latest_3_lessons')
    .select()
  if (error) throw new Error(error.message)
  return lessons
}
