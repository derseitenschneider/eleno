import type {
  Lesson,
  LessonPartial,
  LessonWithGroupId,
  LessonWithStudentId,
} from '../../types/types'
import supabase from './supabase'

export async function fetchPlannedLessons(userId: string) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'prepared')
    .order('date')

  if (error) throw new Error(error.message)
  const lessons = data.map((lesson) => ({
    ...lesson,
    date: new Date(lesson.date || ''),
  }))
  return lessons as Array<LessonWithStudentId> | Array<LessonWithGroupId>
}

export const fetchLessonsByYearApi = async (
  holderId: number,
  lessonYear: number,
  holderType: 's' | 'g',
  userId: string,
): Promise<
  Array<LessonWithGroupId> | Array<LessonWithStudentId> | undefined
> => {
  const idField = holderType === 's' ? 'studentId' : 'groupId'
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq(idField, holderId)
    .eq('user_id', userId)
    .eq('status', 'documented')
    .gte('date', `${lessonYear}-01-01`)
    .lt('date', `${lessonYear + 1}-01-01`)
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  const lessons = data.map((lesson) => ({
    ...lesson,
    date: new Date(lesson.date || ''),
  }))
  return lessons as Array<LessonWithStudentId> | Array<LessonWithStudentId>
}

export type FetchAllLessonProps = {
  holderIds: Array<number>
  holderType: 's' | 'g'
  startDate?: Date
  endDate?: Date
  userId: string
}
export const fetchAllLessonsApi = async ({
  holderIds,
  holderType,
  startDate,
  endDate,
  userId,
}: FetchAllLessonProps) => {
  const idField = holderType === 's' ? 'studentId' : 'groupId'
  const uctStartDate = new Date(`${startDate?.toDateString()} UTC`)
  const uctEndDate = new Date(`${endDate?.toDateString()} UTC`)
  let query = supabase
    .from('lessons')
    .select('*')
    .in(idField, holderIds)
    .eq('user_id', userId)
    .eq('status', 'documented')

  query = startDate
    ? query
        .gte('date', uctStartDate.toISOString())
        .lte('date', uctEndDate?.toISOString())
    : query

  query = query.order('date', { ascending: false })

  const { data: lessons, error } = await query

  if (error) throw new Error(error.message)
  return lessons.map((lesson) => ({
    ...lesson,
    date: new Date(lesson?.date || ''),
  }))
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
    .select('Datum:date, Lektionsinhalt:lessonContent, Hausaufgaben:homework')
    .in(idField, holderIds)
    .eq('status', 'documented')

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

  const { data: newLesson, error: errorLesson } = await supabase
    .from('lessons')
    .insert([
      {
        ...lesson,
        date: utcDate.toISOString(),
      },
    ])
    .select()
    .single()

  if (newLesson) {
    await supabase
      .from('profiles')
      .update({ last_lesson_creation: new Date().toUTCString() })
      .eq('id', newLesson?.user_id)
  }

  if (errorLesson) throw new Error(errorLesson.message)
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

export const updateLessonAPI = async (
  lesson: Lesson,
): Promise<LessonWithGroupId | LessonWithStudentId> => {
  const utcDate = new Date(`${lesson.date?.toDateString()} UTC`)
  const { data, error } = await supabase
    .from('lessons')
    .update({ ...lesson, date: utcDate.toISOString() })
    .eq('id', lesson.id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return { ...data, date: new Date(data.date || '') } as Lesson
}

export const reactivateHomeworkLinkApi = async (lesson: Lesson) => {
  const { error } = await supabase
    .from('lessons')
    .update({ expiration_base: new Date().toISOString() })
    .eq('id', lesson.id)

  if (error) throw new Error(error.message)
}

export const fetchLatestLessons = async (userId: string) => {
  const { data: lessons, error } = await supabase
    .from('last_3_lessons')
    .select()
    .eq('user_id', userId)
    .eq('status', 'documented')
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
    .eq('status', 'documented')
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
