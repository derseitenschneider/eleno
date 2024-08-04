import type { Lesson, LessonPartial, Student } from '../../types/types'
import supabase from './supabase'

export const fetchLessonsByYearApi = async (
  holderId: number,
  lessonYear: number,
  holderType: 's' | 'g',
) => {
  const idField = holderType === 's' ? 'studentId' : 'groupId'
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq(idField, holderId)
    .gte('date', `${lessonYear}-01-01`)
    .lt('date', `${lessonYear + 1}-01-01`)
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  const lessons = data.map((lesson) => ({
    ...lesson,
    date: new Date(lesson.date || ''),
  }))
  return lessons
}

export type FetchAllLessonProps = {
  holderIds: Array<number>
  holderType: 's' | 'g'
  startDate?: Date
  endDate?: Date
}
export const fetchAllLessonsApi = async ({
  holderIds,
  holderType,
  startDate,
  endDate,
}: FetchAllLessonProps) => {
  const idField = holderType === 's' ? 'studentId' : 'groupId'
  const uctStartDate = new Date(`${startDate?.toDateString()} UTC`)
  const uctEndDate = new Date(`${endDate?.toDateString()} UTC`)
  let query = supabase.from('lessons').select('*').in(idField, holderIds)

  query = startDate
    ? query
        .gte('date', uctStartDate.toISOString())
        .lte('date', uctEndDate?.toISOString())
    : query

  query = query.order('date', { ascending: false })

  const { data: lessons, error } = await query

  if (error) throw new Error(error.message)
  return lessons.map((lesson) => ({ ...lesson, date: new Date(lesson.date) }))
}

export const fetchAllLessonsCSVApi = async ({
  holderIds,
  holderType,
  startDate,
  endDate,
}: FetchAllLessonProps) => {
  const idField = holderType === 's' ? 'studentId' : 'groupId'
  const uctStartDate = new Date(`${startDate?.toDateString()} UTC`)
  const uctEndDate = new Date(`${endDate?.toDateString()} UTC`)

  let query = supabase
    .from('lessons')
    .select(
      `Datum:date, Lektionsinhalt:lessonContent, Hausaufgaben:homework, Id: ${idField}`,
    )
    .in(idField, holderIds)

  query = startDate
    ? query
        .gte('date', uctStartDate?.toISOString())
        .lte('date', uctEndDate?.toISOString())
    : query

  const { data: lessonsCSV, error } = await query
    .order('date', { ascending: false })
    .csv()
  if (error) throw new Error(error.message)
  return lessonsCSV
}

export const createLessonAPI = async (lesson: LessonPartial) => {
  const { date } = lesson
  const utcDate = new Date(`${date.toDateString()} UTC`)

  const { data: newLesson, error } = await supabase
    .from('lessons')
    .insert([
      {
        ...lesson,
        date: utcDate.toISOString(),
      },
    ])
    .select()
    .single()

  if (error) throw new Error(error.message)
  if (newLesson) return { ...newLesson, date: new Date(newLesson.date || '') }
}

export const deleteLessonAPI = async (lessonId: number) => {
  const { data, error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', lessonId)
    .select('id')
    .single()

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const updateLessonAPI = async (lesson: Lesson): Promise<Lesson> => {
  const utcDate = new Date(`${lesson.date?.toDateString()} UTC`)
  const { data, error } = await supabase
    .from('lessons')
    .update({ ...lesson, date: utcDate.toISOString() })
    .eq('id', lesson.id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return { ...data, date: new Date(data.date || '') }
}

// TODO: fetchLatestLessonsPerStudent to invalidate query after deletion
export const fetchLatestLessons = async () => {
  const { data: lessons, error } = await supabase
    .from('last_3_lessons')
    .select()
    .returns<Array<Lesson>>()
  if (error) throw new Error(error.message)

  return lessons.map((lesson) => ({
    ...lesson,
    date: new Date(lesson.date || ''),
  }))
}

export const fetchLatestLessonsPerStudent = async (studentIds: number[]) => {
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')
    .in('studentId', [...studentIds])
    .order('date', { ascending: false })
    .limit(3)

  if (error) throw new Error(error.message)
  return lessons.reverse()
}

export const fetchLessonYears = async (holderId: number) => {
  const { data: years, error } = await supabase
    .from('lesson_years')
    .select('*')
    .eq('entity_id', holderId)
  if (error) throw new Error(error.message)
  return years
}
