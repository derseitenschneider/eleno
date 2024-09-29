import { appConfig, isDemoMode } from '@/config'
import type {
  Lesson,
  LessonPartial,
  LessonWithGroupId,
  LessonWithStudentId,
} from '../../types/types'
import supabase from './supabase'
import mockLast3Lessons from './mock-db/mockLast3Lessons'

const isDemo = appConfig.isDemoMode

export const fetchLessonsByYearApi = async (
  holderId: number,
  lessonYear: number,
  holderType: 's' | 'g',
  userId: string,
): Promise<
  Array<LessonWithGroupId> | Array<LessonWithStudentId> | undefined
> => {
  if (isDemoMode) {
    if (holderType === 's') {
      const lessons = mockLast3Lessons.filter(
        (lesson) => lesson.studentId === holderId,
      ) as Array<LessonWithStudentId>

      return lessons.sort((a, b) =>
        b.date.toISOString().localeCompare(a.date.toISOString()),
      )
    }
    const lessons = mockLast3Lessons.filter(
      (lesson) => lesson.groupId === holderId,
    ) as Array<LessonWithGroupId>
    return lessons.sort((a, b) =>
      b.date.toISOString().localeCompare(a.date.toISOString()),
    )
  }
  const idField = holderType === 's' ? 'studentId' : 'groupId'
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq(idField, holderId)
    .eq('user_id', userId)
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
  if (isDemo) return mockLast3Lessons

  const idField = holderType === 's' ? 'studentId' : 'groupId'
  const uctStartDate = new Date(`${startDate?.toDateString()} UTC`)
  const uctEndDate = new Date(`${endDate?.toDateString()} UTC`)
  let query = supabase
    .from('lessons')
    .select('*')
    .in(idField, holderIds)
    .eq('user_id', userId)

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
  if (isDemo) return
  const idField = holderType === 's' ? 'studentId' : 'groupId'
  const uctStartDate = new Date(`${startDate?.toDateString()} UTC`)
  const uctEndDate = new Date(`${endDate?.toDateString()} UTC`)

  let query = supabase
    .from('lessons')
    .select('Datum:date, Lektionsinhalt:lessonContent, Hausaufgaben:homework')
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
  if (isDemo) {
    const newLesson: Lesson = {
      ...lesson,
      homeworkKey: '',
      id: Math.random() * 1_000_000,
      created_at: new Date().toISOString(),
    } as Lesson

    mockLast3Lessons.push(newLesson)
    return newLesson
  }
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
  if (isDemo) {
    const index = mockLast3Lessons.findIndex((l) => l.id === lessonId)
    mockLast3Lessons.splice(index, 1)
    return
  }
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
  if (isDemo) {
    const index = mockLast3Lessons.findIndex((l) => l.id === lesson.id)
    mockLast3Lessons[index] = lesson
    return lesson
  }
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

export const fetchLatestLessons = async (userId: string) => {
  if (isDemo) return mockLast3Lessons
  const { data: lessons, error } = await supabase
    .from('last_3_lessons')
    .select()
    .eq('user_id', userId)
    .returns<Array<Lesson>>()
  if (error) throw new Error(error.message)

  return lessons.map((lesson) => ({
    ...lesson,
    date: new Date(lesson.date || ''),
  }))
}

export const fetchLatestLessonsPerStudent = async (studentIds: number[]) => {
  if (isDemo) return mockLast3Lessons
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
  if (isDemo)
    return {
      entity_id: holderId,
      entity_type: 's',
      years: [new Date().getFullYear()],
    }
  const { data: years, error } = await supabase
    .from('lesson_years')
    .select('*')
    .eq('entity_id', holderId)
  if (error) throw new Error(error.message)
  return years
}
