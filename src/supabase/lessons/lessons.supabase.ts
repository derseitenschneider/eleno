import { supabase } from '../supabase'
import { TLesson } from '../../types/types'

// [ ] try fetch only lessons from active students
export const fetchLessons = async function () {
  let { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')
    .order('date')

  if (error) throw new Error(`${error}`)
  return lessons
}

export const postLesson = async function (lesson: TLesson): Promise<TLesson[]> {
  const { date, homework, lessonContent, studentId } = lesson
  const { data, error } = await supabase
    .from('lessons')
    .insert([{ date, homework, lessonContent, studentId }])
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

  console.log(error)
}
